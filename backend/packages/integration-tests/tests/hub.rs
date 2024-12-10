use abstract_adapter::std::adapter::AdapterRequestMsg;
use abstract_client::{AbstractClient, Account, Application, Namespace};
use cosmwasm_std::coin;
use cw721::msg::TokensResponse;
use cw_orch::prelude::*;
use cw_orch_interchain::mock::MockBech32InterchainEnv;
use game_handler::{
    contract::{interface::GameHandlerInterface, GAME_HANDLER_ID},
    msg::{GameHandlerExecuteMsg, GameHandlerInstantiateMsg},
    state::FixedMetadata,
};
use nft::msg::QueryMsg;
use xion_adventures_hub::{
    contract::HUB_ID,
    msg::{HubExecuteMsg, HubInstantiateMsg},
    HubInterface,
};
use cw_orch_interchain::prelude::InterchainEnv;

pub struct Test<Chain: CwEnv> {
    account: Account<Chain>,
    hub: Application<Chain, HubInterface<Chain>>,
}

fn setup() -> anyhow::Result<Test<MockBech32>> {
    let interchain = MockBech32InterchainEnv::new(vec![("atom-1", "atom"), ("osmo-1", "osmo")]);
    let chain = interchain.get_chain("atom-1")?;
    let abs = AbstractClient::builder(chain.clone()).build()?;

    let namespace = Namespace::new(common::NAMESPACE)?;
    let account = abs.account_builder().namespace(namespace).build()?;
    let publisher = account.publisher()?;

    // We upload the nft
    let nft = nft::NftInterface::new(chain.clone());
    // We publish the Hub
    nft.upload()?;
    publisher.publish_adapter::<HubInstantiateMsg, HubInterface<MockBech32>>(
        HubInstantiateMsg {
            admin_account: publisher.account().id()?,
            nft_code_id: nft.code_id()?,
        },
    )?;
    // We publish the GameHandler
    publisher.publish_adapter::<GameHandlerInstantiateMsg, GameHandlerInterface<MockBech32>>(
        GameHandlerInstantiateMsg {
            admin_account: publisher.account().id()?,
            metadata_base: FixedMetadata {},
            token_uri_base: "https://nicoco.com".to_string(),
            mint_limit: 5,
            mint_cost: coin(0, "ujuno"),
        },
    )?;

    let new_account = abs.account_builder().build()?;

    let hub = new_account.install_adapter::<HubInterface<MockBech32>>(&[])?;
    let game_handler = new_account.install_adapter::<GameHandlerInterface<MockBech32>>(&[])?;
    game_handler.authorize_on_adapters(&[HUB_ID])?;

    Ok(Test {
        hub,
        account: new_account,
    })
}

fn nft_account<Chain: CwEnv>(test: &Test<Chain>) -> anyhow::Result<()> {
    let msg = game_handler::msg::ExecuteMsg::Module(AdapterRequestMsg {
        account_address: Some(test.account.address()?.to_string()),
        request: GameHandlerExecuteMsg::CreateAccount {
            city_map_index: None,
            receiver: None,
        },
    });
    test.account
        .as_ref()
        .execute_on_module(GAME_HANDLER_ID, &msg, vec![])?;
    Ok(())
}

fn tokens<Chain: CwEnv>(test: &Test<Chain>) -> anyhow::Result<TokensResponse> {
    test.hub
        .module::<HubInterface<Chain>>()?
        .nft()?
        .query(&QueryMsg::Tokens {
            owner: test.account.address()?.to_string(),
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
    let token = tokens(&test)?.tokens[0];

    let remote_chain = remote

    let msg = xion_adventures_hub::msg::ExecuteMsg::Module(AdapterRequestMsg {
        account_address: Some(test.account.address()?.to_string()),
        request: HubExecuteMsg::IbcTransfer {
            token_id: token,
            recipient_chain: (),
        },
    });
    test.account
        .as_ref()
        .execute_on_module(GAME_HANDLER_ID, &msg, vec![])?;

    Ok(())
}
