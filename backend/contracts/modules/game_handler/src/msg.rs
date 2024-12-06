use crate::{contract::GameHandler, state::FixedMetadata};
use abstract_adapter::std::objects::AccountId;
use common::vec2::Vec2;
use cosmwasm_schema::QueryResponses;
use cosmwasm_std::Coin;

// This is used for type safety and re-exporting the contract endpoint structs.
abstract_adapter::adapter_msg_types!(GameHandler, GameHandlerExecuteMsg, GameHandlerQueryMsg);

/// App instantiate message
#[cosmwasm_schema::cw_serde]
pub struct GameHandlerInstantiateMsg {
    pub admin_account: AccountId,
    pub metadata_base: FixedMetadata,
    pub token_uri_base: String,
    pub mint_limit: usize,
    pub mint_cost: Coin,
}

/// App execute messages
#[cosmwasm_schema::cw_serde]
#[derive(cw_orch::ExecuteFns)]
pub enum GameHandlerExecuteMsg {
    /// Create a new account on this chain.   
    /// This actually mints a new NFT that you can play with.
    /// It's minted to the receiver (or the sender of the message)
    CreateAccount {
        city_map_index: Option<u8>,
        receiver: Option<AccountId>,
    },

    /// This is used to move a player around
    /// This endpoint accepts the trajectory of a player and verifies it's a possible trajectory according to the map stored in the Hub contract
    MovePlayer {
        token_id: String,
        positions: Vec<Vec2>,
    },
}

/// App query messages
#[cosmwasm_schema::cw_serde]
#[derive(cw_orch::QueryFns, QueryResponses)]
pub enum GameHandlerQueryMsg {
    #[returns(ConfigResponse)]
    Config {},
}

#[cosmwasm_schema::cw_serde]
pub enum GameHandlerMigrateMsg {}

#[cosmwasm_schema::cw_serde]
pub struct ConfigResponse {
    pub admin_account: AccountId,
    pub metadata_base: FixedMetadata,
    pub token_uri_base: String,
    pub mint_limit: usize,
    pub mint_cost: Coin,
}

#[cosmwasm_schema::cw_serde]
pub enum GameHandlerIbcMsg {
    IbcMint {
        local_account_id: AccountId,
        send_back: bool,
    },
}
