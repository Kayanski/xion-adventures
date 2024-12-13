//! Publishes the module to the Abstract platform by uploading it and registering it on the app store.
//!
//! Info: The mnemonic used to register the module must be the same as the owner of the account that claimed the namespace.
//!
//! ## Example
//!
//! ```bash
//! $ just publish uni-6 osmo-test-5
//! ```
use std::{fs::File, io::BufReader};

use abstract_client::{AbstractClient, Namespace};
use clap::Parser;
use common::MapOutput;
use cw_orch::{
    anyhow,
    core::serde_json,
    daemon::Daemon,
    prelude::{networks::parse_network, ChainInfo},
};
use xion_adventures_hub::{HubExecuteMsgFns, HubInterface};

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
        let file = File::create("../../mapTest.json")?;
        let reader = BufReader::new(file);
        let map_output: MapOutput = serde_json::from_reader(reader)?;
        adapter.set_map(map_output)?;
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
