use abstract_adapter::AdapterError;
use abstract_adapter::{objects::registry::RegistryError, std::AbstractError};
use abstract_sdk::AbstractSdkError;
use common::player_location::PlayerLocation;
use cosmwasm_std::{Instantiate2AddressError, StdError};
use cw_asset::AssetError;
use cw_controllers::AdminError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum HubError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Abstract(#[from] AbstractError),

    #[error("{0}")]
    AbstractSdk(#[from] AbstractSdkError),

    #[error("{0}")]
    Asset(#[from] AssetError),

    #[error("{0}")]
    Admin(#[from] AdminError),

    #[error("{0}")]
    AdapterError(#[from] AdapterError),

    #[error("{0}")]
    Registry(#[from] RegistryError),

    #[error("{0}")]
    Instantiate2Address(#[from] Instantiate2AddressError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Unauthorized, Wrong Namespace")]
    WrongNamespace {},

    #[error("Ibc Transfer failed {0}")]
    Transfer(String),

    #[error("Tile not available {tile}")]
    TileUnavailable { tile: PlayerLocation },

    #[error("Nft metadata not available {token_id}")]
    NftMetadataUnavailable { token_id: String },

    #[error("Can't update the map, because players have started to play")]
    MapNotEmpty {},
}

impl From<HubError> for AbstractSdkError {
    fn from(value: HubError) -> Self {
        Self::generic_err(format!("Hub error : {}", value))
    }
}
