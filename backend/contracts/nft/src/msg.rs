use cosmwasm_std::Empty;

use cw721::msg::Cw721MigrateMsg;

use crate::{XionAdventuresExtension, XionAdventuresExtensionMsg};

pub type InstantiateMsg = cw721::msg::Cw721InstantiateMsg<Empty>;
pub type ExecuteMsg = cw721::msg::Cw721ExecuteMsg<XionAdventuresExtensionMsg, Empty, Empty>;
pub type QueryMsg = cw721::msg::Cw721QueryMsg<XionAdventuresExtension, Empty, Empty>;
pub type MigrateMsg = Cw721MigrateMsg;
