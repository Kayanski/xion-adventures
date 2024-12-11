use abstract_adapter::objects::TruncatedChainId;
use abstract_adapter::std::adapter::{AdapterBaseMsg, AdapterRequestMsg};
use abstract_adapter::std::{account, adapter};
use abstract_client::{
    AbstractClient, AbstractInterchainClient, Account, Application, Environment, Namespace,
};
use cosmwasm_std::{coin, to_json_binary};
use cw721::msg::TokensResponse;
use cw_orch::prelude::*;
use cw_orch_interchain::prelude::InterchainEnv;
use cw_orch_interchain::{core::IbcQueryHandler, mock::MockBech32InterchainEnv};
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

pub const CHAIN_1: &str = "atom-1";
pub const CHAIN_2: &str = "osmo-1";

pub struct Test<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>> {
    local_account: LocalGameAccount<Chain>,
    interchain: IBC,
}

fn setup_app_one_chain<Chain: CwEnv>(abs: &AbstractClient<Chain>) -> anyhow::Result<()> {
    let chain = abs.environment();
    let namespace = Namespace::new(common::NAMESPACE)?;
    let account = abs.account_builder().namespace(namespace).build()?;
    let publisher = account.publisher()?;

    // We upload the nft
    let nft = nft::NftInterface::new(chain.clone());
    // We publish the Hub
    nft.upload()?;
    publisher.publish_adapter::<HubInstantiateMsg, HubInterface<Chain>>(HubInstantiateMsg {
        admin_account: publisher.account().id()?,
        nft_code_id: nft.code_id()?,
    })?;

    // We publish the GameHandler
    publisher.publish_adapter::<GameHandlerInstantiateMsg, GameHandlerInterface<Chain>>(
        GameHandlerInstantiateMsg {
            admin_account: publisher.account().id()?,
            metadata_base: FixedMetadata {},
            token_uri_base: "https://nicoco.com".to_string(),
            mint_limit: 5,
            mint_cost: coin(0, "ujuno"),
        },
    )?;
    Ok(())
}

pub struct LocalGameAccount<Chain: CwEnv> {
    pub account: Account<Chain>,
    pub hub: Application<Chain, HubInterface<Chain>>,
    pub game_handler: Application<Chain, GameHandlerInterface<Chain>>,
}

fn create_account_for_game<Chain: CwEnv>(
    abs: &AbstractClient<Chain>,
) -> anyhow::Result<LocalGameAccount<Chain>> {
    let account = abs.account_builder().build()?;
    account.set_ibc_status(true)?;

    let hub = account.install_adapter::<HubInterface<Chain>>(&[])?;
    let game_handler = account.install_adapter::<GameHandlerInterface<Chain>>(&[])?;
    game_handler.authorize_on_adapters(&[HUB_ID])?;

    Ok(LocalGameAccount {
        account,
        hub,
        game_handler,
    })
}

pub struct RemoteGameAccount {}

fn create_remote_account_for_game<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>>(
    account: &Account<Chain>,
    host_abs: &AbstractClient<Chain>,
    interchain: IBC,
) -> anyhow::Result<()> {
    let remote_account = account
        .remote_account_builder(interchain, &host_abs)
        .install_adapter::<HubInterface<Chain>>()?
        .install_adapter::<GameHandlerInterface<Chain>>()?
        .build()?;

    let game_handler_address =
        remote_account.module_addresses(vec![GAME_HANDLER_ID.to_string()])?;

    remote_account.execute_on_account(vec![account::ExecuteMsg::AdminExecuteOnModule {
        module_id: HUB_ID.to_string(),
        msg: to_json_binary(&adapter::ExecuteMsg::<Empty>::Base(
            adapter::BaseExecuteMsg {
                msg: AdapterBaseMsg::UpdateAuthorizedAddresses {
                    to_add: game_handler_address
                        .modules
                        .iter()
                        .map(|(_, addr)| addr.to_string())
                        .collect(),
                    to_remove: vec![],
                },
                account_address: None,
            },
        ))?,
    }])?;

    Ok(())
}

fn setup() -> anyhow::Result<Test<MockBech32, MockBech32InterchainEnv>> {
    let interchain = MockBech32InterchainEnv::new(vec![(CHAIN_1, "atom"), (CHAIN_2, "osmo")]);

    let interchain_abstract = AbstractInterchainClient::deploy_on(&interchain)?;
    let abs_1 = interchain_abstract.client(CHAIN_1)?;
    let abs_2 = interchain_abstract.client(CHAIN_2)?;
    setup_app_one_chain(&abs_1)?;
    setup_app_one_chain(&abs_2)?;

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
