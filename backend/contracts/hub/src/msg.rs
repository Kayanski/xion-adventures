use abstract_adapter::{objects::TruncatedChainId, std::objects::AccountId};
use cosmwasm_schema::QueryResponses;
use nft::XionAdventuresExtensionMsg;

use crate::contract::Hub;

// This is used for type safety and re-exporting the contract endpoint structs.
abstract_adapter::adapter_msg_types!(Hub, HubExecuteMsg, HubQueryMsg);

/// App instantiate message
#[cosmwasm_schema::cw_serde]
pub struct HubInstantiateMsg {
    pub admin_account: AccountId,
    pub nft_code_id: u64,
}

/// App execute messages
#[cosmwasm_schema::cw_serde]
#[derive(cw_orch::ExecuteFns)]
#[allow(clippy::large_enum_variant)]
pub enum HubExecuteMsg {
    /// Transfer the NFT cross-chain
    IbcTransfer {
        token_id: String,
        recipient_chain: TruncatedChainId,
    },

    /// Mint a new lost token on this contract   
    /// This is an authorized endpoint that is only callable by another app in the same namespace
    Mint {
        module_id: String,
        token_uri: String,
        metadata: XionAdventuresExtensionMsg,
        recipient: Option<AccountId>,
    },

    /// Change the metadata of an NFT
    /// This is an authorized endpoint that is only callable by another app in the same namespace
    ModifyMetadata {
        module_id: String,
        token_id: String,
        metadata: XionAdventuresExtensionMsg,
    },
}

#[cosmwasm_schema::cw_serde]
pub enum HubIbcMsg {
    /// Mint a new NFT on the chain from an IBC transfer
    IbcMint {
        local_account_id: AccountId,
        token_id: String,
        token_uri: Option<String>,
        extension: XionAdventuresExtensionMsg,
    },
}

#[cosmwasm_schema::cw_serde]
pub enum HubIbcCallbackMsg {
    BurnToken { token_id: String },
}

/// App query messages
#[cosmwasm_schema::cw_serde]
#[derive(cw_orch::QueryFns, QueryResponses)]
pub enum HubQueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(NextTokenIdResponse)]
    NextTokenId {},
}

#[cosmwasm_schema::cw_serde]
pub enum HubMigrateMsg {}

#[cosmwasm_schema::cw_serde]
pub struct ConfigResponse {
    pub nft: String,
    pub next_token_id: u64,
}

#[cosmwasm_schema::cw_serde]
pub struct NextTokenIdResponse {
    pub next_token_id: String,
}
