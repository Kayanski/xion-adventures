use abstract_sdk::std::objects::AccountId;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Binary;
use cw_storage_plus::Item;

#[cw_serde]
pub struct InstantiateMsg {
    pub account_code_id: u64,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateAccount {
        account_id: Option<AccountId>,
        salt: Binary,
    },
    NoMsg {},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {}

#[cw_serde]
pub struct Config {
    pub account_code_id: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
