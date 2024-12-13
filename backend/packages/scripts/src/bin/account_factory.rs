//! Publishes the module to the Abstract platform by uploading it and registering it on the app store.
//!
//! Info: The mnemonic used to register the module must be the same as the owner of the account that claimed the namespace.
//!
//! ## Example
//!
//! ```bash
//! $ just publish uni-6 osmo-test-5
//! ```
use abstract_interface::Abstract;
use account_factory::interface::AccountFactory;
use clap::Parser;
use cw_orch::{
    anyhow,
    daemon::Daemon,
    prelude::{networks::parse_network, ChainInfo, CwOrchInstantiate, CwOrchUpload, Deploy},
};

fn publish(networks: Vec<ChainInfo>) -> anyhow::Result<()> {
    // run for each requested network
    for network in networks {
        // Setup
        let chain = Daemon::builder(network).build()?;

        // Create an [`AbstractClient`]
        let abstr = Abstract::load_from(chain.clone())?;
        let account_factory = AccountFactory::new(chain.clone());

        account_factory.upload()?;
        account_factory.instantiate(
            &account_factory::msg::InstantiateMsg {
                account_code_id: abstr.account_code_id()?,
            },
            None,
            &[],
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
