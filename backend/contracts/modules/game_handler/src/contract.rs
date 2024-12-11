use crate::msg::GameHandlerMigrateMsg;
use crate::{
    error::GameHandlerError,
    handlers,
    msg::{GameHandlerExecuteMsg, GameHandlerInstantiateMsg, GameHandlerQueryMsg},
};
use abstract_adapter::objects::dependency::StaticDependency;
use abstract_adapter::AdapterContract;
use cosmwasm_std::Response;
use xion_adventures_hub::contract::{HUB_ID, HUB_VERSION};

/// The version of your app
pub const GAME_HANDLER_VERSION: &str = env!("CARGO_PKG_VERSION");
/// The id of the app
pub const GAME_HANDLER_ID: &str = "xion-adventures:game-handler";

/// The type of the result returned by your app's entry points.
pub type GameHandlerResult<T = Response> = Result<T, GameHandlerError>;

/// The type of the app that is used to build your app and access the Abstract SDK features.
pub type GameHandler = AdapterContract<
    GameHandlerError,
    GameHandlerInstantiateMsg,
    GameHandlerExecuteMsg,
    GameHandlerQueryMsg,
    GameHandlerMigrateMsg,
>;

const GAME_HANDLER: GameHandler = GameHandler::new(GAME_HANDLER_ID, GAME_HANDLER_VERSION, None)
    .with_instantiate(handlers::instantiate_handler)
    .with_execute(handlers::execute_handler)
    .with_query(handlers::query_handler)
    .with_dependencies(&[StaticDependency::new(HUB_ID, &[HUB_VERSION])])
    .with_replies(&[]);

// Export handlers
#[cfg(feature = "export")]
abstract_adapter::export_endpoints!(GAME_HANDLER, GameHandler);

abstract_adapter::cw_orch_interface!(
    GAME_HANDLER,
    GameHandler,
    GameHandlerInstantiateMsg,
    GameHandlerInterface
);
