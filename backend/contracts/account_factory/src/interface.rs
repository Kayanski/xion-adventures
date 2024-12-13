use cw_orch::{interface, prelude::*};

use crate::msg::{ExecuteMsg, InstantiateMsg};

pub const CONTRACT_ID: &str = "account_factory";

#[interface(InstantiateMsg, ExecuteMsg, Empty, Empty, id = CONTRACT_ID)]
pub struct AccountFactory;

impl<Chain> Uploadable for AccountFactory<Chain> {
    /// Return the path to the wasm file corresponding to the contract
    fn wasm(_chain: &ChainInfoOwned) -> WasmPath {
        artifacts_dir_from_workspace!()
            .find_wasm_path("account_factory")
            .unwrap()
    }
    /// Returns a CosmWasm contract wrapper
    fn wrapper() -> Box<dyn MockContract<Empty>> {
        Box::new(ContractWrapper::new_with_empty(
            crate::contract::execute,
            crate::contract::instantiate,
            crate::contract::query,
        ))
    }
}
