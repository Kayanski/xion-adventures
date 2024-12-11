use abstract_adapter::objects::TruncatedChainId;
use abstract_adapter::std::adapter::AdapterRequestMsg;
use abstract_client::AbstractInterchainClient;
use cw721::msg::TokensResponse;
use cw_orch::prelude::*;
use cw_orch_interchain::prelude::InterchainEnv;
use cw_orch_interchain::{core::IbcQueryHandler, mock::MockBech32InterchainEnv};
use game_handler::{contract::GAME_HANDLER_ID, msg::GameHandlerExecuteMsg};
use nft::msg::QueryMsg;
use scripts::{
    create_account_for_game, create_remote_account_for_game, publish_bundle, LocalGameAccount,
};
use xion_adventures_hub::{contract::HUB_ID, msg::HubExecuteMsg, HubInterface};

pub const CHAIN_1: &str = "atom-1";
pub const CHAIN_2: &str = "osmo-1";

pub struct Test<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>> {
    local_account: LocalGameAccount<Chain>,
    interchain: IBC,
}

fn setup() -> anyhow::Result<Test<MockBech32, MockBech32InterchainEnv>> {
    let interchain = MockBech32InterchainEnv::new(vec![(CHAIN_1, "atom"), (CHAIN_2, "osmo")]);

    let interchain_abstract = AbstractInterchainClient::deploy_on(&interchain)?;
    let abs_1 = interchain_abstract.client(CHAIN_1)?;
    let abs_2 = interchain_abstract.client(CHAIN_2)?;
    publish_bundle(&abs_1)?;
    publish_bundle(&abs_2)?;

    let local_game_account = create_account_for_game(&abs_1)?;

    create_remote_account_for_game(&local_game_account.account, &abs_2, interchain.clone())?;
    Ok(Test {
        interchain,
        local_account: local_game_account,
    })
}

fn nft_account<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>>(
    test: &Test<Chain, IBC>,
) -> anyhow::Result<()> {
    let msg = game_handler::msg::ExecuteMsg::Module(AdapterRequestMsg {
        account_address: Some(test.local_account.account.address()?.to_string()),
        request: GameHandlerExecuteMsg::CreateAccount {
            city_map_index: None,
            receiver: None,
        },
    });
    test.local_account
        .account
        .as_ref()
        .execute_on_module(GAME_HANDLER_ID, &msg, vec![])?;
    Ok(())
}

fn tokens<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>>(
    test: &Test<Chain, IBC>,
) -> anyhow::Result<TokensResponse> {
    let local_account = &test.local_account;

    local_account
        .hub
        .module::<HubInterface<Chain>>()?
        .nft()?
        .query(&QueryMsg::Tokens {
            owner: local_account.account.address()?.to_string(),
            start_after: None,
            limit: None,
        })
        .map_err(Into::into)
}

#[test]
fn simple_account() -> anyhow::Result<()> {
    let test = setup()?;
    nft_account(&test)?;

    let tokens = tokens(&test)?;
    assert_eq!(tokens.tokens.len(), 1);

    Ok(())
}

#[test]
fn simple_interchain_account() -> anyhow::Result<()> {
    let test = setup()?;
    nft_account(&test)?;
    let token = tokens(&test)?.tokens[0].clone();

    let msg = xion_adventures_hub::msg::ExecuteMsg::Module(AdapterRequestMsg {
        account_address: Some(test.local_account.account.address()?.to_string()),
        request: HubExecuteMsg::IbcTransfer {
            token_id: token,
            recipient_chain: TruncatedChainId::from_chain_id(CHAIN_2),
        },
    });
    let ibc_response =
        test.local_account
            .account
            .as_ref()
            .execute_on_module(HUB_ID, &msg, vec![])?;

    test.interchain
        .await_and_check_packets(CHAIN_1, ibc_response)?;

    Ok(())
}
