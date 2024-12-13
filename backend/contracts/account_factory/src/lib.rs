pub mod msg;
use cosmwasm_std::{Response, StdError};
pub mod contract;

#[cfg(not(target_arch = "wasm32"))]
pub mod interface;

#[derive(thiserror::Error, Debug, PartialEq)]
pub enum AccountFactoryError {
    #[error(transparent)]
    Std(#[from] StdError),
}

pub type AccountFactoryResult<T = Response> = Result<T, AccountFactoryError>;
