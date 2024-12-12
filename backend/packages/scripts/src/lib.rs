use abstract_adapter::std::adapter::AdapterBaseMsg;
use abstract_adapter::std::{account, adapter};
use abstract_client::{AbstractClient, Account, Application, Environment, Namespace};
use cosmwasm_std::{coin, to_json_binary};
use cw_orch::prelude::*;
use cw_orch_interchain::core::IbcQueryHandler;
use cw_orch_interchain::prelude::InterchainEnv;
use game_handler::{
    contract::{interface::GameHandlerInterface, GAME_HANDLER_ID},
    msg::GameHandlerInstantiateMsg,
    state::FixedMetadata,
};
use xion_adventures_hub::{contract::HUB_ID, msg::HubInstantiateMsg, HubInterface};

pub fn create_account_for_game<Chain: CwEnv>(
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

pub fn create_remote_account_for_game<Chain: IbcQueryHandler, IBC: InterchainEnv<Chain>>(
    account: &Account<Chain>,
    host_abs: &AbstractClient<Chain>,
    interchain: IBC,
) -> anyhow::Result<()> {
    let remote_account = account
        .remote_account_builder(interchain, host_abs)
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

pub struct LocalGameAccount<Chain: CwEnv> {
    pub account: Account<Chain>,
    pub hub: Application<Chain, HubInterface<Chain>>,
    pub game_handler: Application<Chain, GameHandlerInterface<Chain>>,
}

pub fn publish_bundle<Chain: CwEnv>(abs: &AbstractClient<Chain>) -> anyhow::Result<()> {
    let chain = abs.environment();
    let namespace = Namespace::new(common::NAMESPACE)?;
    let account = abs.fetch_or_build_account(namespace.clone(), |b| b.namespace(namespace))?;
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
            mint_cost: coin(0, "uxion"),
        },
    )?;
    Ok(())
}
