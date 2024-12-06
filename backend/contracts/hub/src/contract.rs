use crate::ibc::{self};
use crate::msg::HubMigrateMsg;
use crate::{
    error::HubError,
    handlers,
    msg::{HubExecuteMsg, HubInstantiateMsg, HubQueryMsg},
};
use abstract_adapter::AdapterContract;
use cosmwasm_std::Response;

/// The version of your app
pub const HUB_VERSION: &str = env!("CARGO_PKG_VERSION");
/// The id of the app
pub const HUB_ID: &str = "cosmos-adventures:hub";

/// The type of the result returned by your app's entry points.
pub type HubResult<T = Response> = Result<T, HubError>;

/// The type of the app that is used to build your app and access the Abstract SDK features.
pub type Hub =
    AdapterContract<HubError, HubInstantiateMsg, HubExecuteMsg, HubQueryMsg, HubMigrateMsg>;

const HUB: Hub = Hub::new(HUB_ID, HUB_VERSION, None)
    .with_instantiate(handlers::instantiate_handler)
    .with_execute(handlers::execute_handler)
    .with_query(handlers::query_handler)
    .with_replies(&[])
    .with_ibc_callback(ibc::transfer::transfer_callback)
    .with_module_ibc(ibc::module_ibc::receive_module_ibc);

// Export handlers
#[cfg(feature = "export")]
abstract_adapter::export_endpoints!(HUB, Hub);

abstract_adapter::cw_orch_interface!(HUB, Hub, HubInstantiateMsg, HubInterface);
