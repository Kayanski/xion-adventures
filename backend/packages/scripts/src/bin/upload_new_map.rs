//! Publishes the module to the Abstract platform by uploading it and registering it on the app store.
//!
//! Info: The mnemonic used to register the module must be the same as the owner of the account that claimed the namespace.
//!
//! ## Example
//!
//! ```bash
//! $ just publish uni-6 osmo-test-5
//! ```

use abstract_client::{AbstractClient, Namespace};
use clap::Parser;
use cw_orch::{
    anyhow,
    daemon::Daemon,
    prelude::{networks::parse_network, ChainInfo},
};
use map_generation::generate_map;
use xion_adventures_hub::{
    contract::HUB_ID,
    msg::{ExecuteMsg, HubExecuteMsg},
    HubInterface, HubQueryMsgFns,
};

fn publish(networks: Vec<ChainInfo>) -> anyhow::Result<()> {
    // run for each requested network
    for network in networks {
        // Setup
        let chain = Daemon::builder(network).build()?;

        // Create an [`AbstractClient`]
        let abstract_client = AbstractClient::new(chain.clone())?;
        let namespace = Namespace::new(common::NAMESPACE)?;

        let account = abstract_client
            .fetch_or_build_account(namespace.clone(), |b| b.namespace(namespace))?;
        let adapter = account.application::<HubInterface<Daemon>>()?;
        let map = adapter.map()?;

        let map = generate_map(5u32, map.map.width);

        account.as_ref().execute_on_module(
            HUB_ID,
            ExecuteMsg::Module(abstract_adapter::std::adapter::AdapterRequestMsg {
                account_address: None,
                request: HubExecuteMsg::SetMap { map },
            }),
            vec![],
        )?;
    }
    Ok(())
}

#[derive(Parser, Default, Debug)]
#[command(author, version, about, long_about = None)]
struct Arguments {
    /// Network Id to publish on
    #[arg(short, long, value_delimiter = ' ', num_args = 1..)]
    network_ids: Vec<String>,
}

fn main() {
    dotenv::dotenv().ok();
    env_logger::init();
    let args = Arguments::parse();
    let networks = args
        .network_ids
        .iter()
        .map(|n| parse_network(n).unwrap())
        .collect();
    publish(networks).unwrap();
}
