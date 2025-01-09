//! Publishes the module to the Abstract platform by uploading it and registering it on the app store.
//!
//! Info: The mnemonic used to register the module must be the same as the owner of the account that claimed the namespace.
//!
//! ## Example
//!
//! ```bash
//! $ just publish uni-6 osmo-test-5
//! ```
use abstract_adapter::objects::namespace::Namespace;
use abstract_client::AbstractClient;
use clap::Parser;
use cw_orch::{
    anyhow,
    daemon::Daemon,
    prelude::{networks::parse_network, *},
};
use networks::XION_TESTNET_1;
use xion_adventures_hub::{contract::HUB_ID, msg::HubInstantiateMsg, state::MAP, HubInterface};

fn query_map_tile() -> anyhow::Result<()> {
    // run for each requested network
    let network = XION_TESTNET_1;
    // Setup
    let chain = Daemon::builder(network).build()?;

    let app_namespace = Namespace::from_id(HUB_ID)?;

    // Create an [`AbstractClient`]
    let abstract_client: AbstractClient<Daemon> = AbstractClient::new(chain.clone())?;

    // Get the [`Publisher`] that owns the namespace, otherwise create a new one and claim the namespace
    let account = abstract_client
        .fetch_or_build_account(app_namespace.clone(), |b| b.namespace(app_namespace))?;

    let hub = account.application::<HubInterface<Daemon>>()?;

    for i in 17..23 {
        let map_result = chain
            .wasm_querier()
            .map_query(&hub.address()?, MAP, (6, 17))?;
        println!("{:?}", map_result);
    }

    Ok(())
}

fn main() {
    dotenv::dotenv().ok();
    env_logger::init();
    query_map_tile().unwrap();
}
