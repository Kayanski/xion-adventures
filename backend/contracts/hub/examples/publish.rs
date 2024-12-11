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
    prelude::{networks::parse_network, ChainInfo},
};
use xion_adventures_hub::{contract::HUB_ID, msg::HubInstantiateMsg, HubInterface};

fn publish(networks: Vec<ChainInfo>) -> anyhow::Result<()> {
    // run for each requested network
    for network in networks {
        // Setup
        let chain = Daemon::builder(network).build()?;

        let app_namespace = Namespace::from_id(HUB_ID)?;

        // Create an [`AbstractClient`]
        let abstract_client: AbstractClient<Daemon> = AbstractClient::new(chain.clone())?;

        // Get the [`Publisher`] that owns the namespace, otherwise create a new one and claim the namespace
        let publisher = abstract_client
            .fetch_or_build_account(app_namespace.clone(), |b| b.namespace(app_namespace))?
            .publisher()?;

        // Publish the App to the Abstract Platform
        publisher.publish_adapter::<HubInstantiateMsg, HubInterface<Daemon>>(
            HubInstantiateMsg {
                admin_account: publisher.account().id()?,
                nft_code_id: todo!(),
            },
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
