use abstract_adapter::AdapterError;
use abstract_adapter::{objects::registry::RegistryError, std::AbstractError};
use abstract_sdk::AbstractSdkError;
use common::vec2::Vec2;
use cosmwasm_std::{Instantiate2AddressError, StdError};
use cw_asset::AssetError;
use cw_controllers::AdminError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum GameHandlerError {
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

    #[error("You have minted too muchtokens already. Limit: {0}")]
    TooMuchMinted(usize),

    #[error("Your player has moved too quickly, only 1 tile at a time ! ({0})")]
    PlayerCantMoveThatFast(Vec2),

    #[error("Your player has moved in a forbidden direction !")]
    PlayerCantMoveHere(),
}
