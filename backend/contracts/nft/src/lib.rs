pub mod msg;
use cosmwasm_std::Empty;
pub use cw721::error::Cw721ContractError as ContractError;

use common::player_location::PlayerLocation;
use cosmwasm_schema::cw_serde;
use cw721::{
    extension::Cw721Extensions,
    traits::{Contains, Cw721CustomMsg, Cw721Execute, Cw721Query, Cw721State, StateFactory},
};

#[cfg(not(target_arch = "wasm32"))]
pub mod interface;
#[cfg(not(target_arch = "wasm32"))]
pub use interface::NftInterface;

// Version info for migration
const CONTRACT_NAME: &str = "crates.io:cw721-metadata-onchain";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cw_serde]
pub struct XionAdventuresExtension {
    pub city_map: u8,
    pub location: PlayerLocation,
}

#[cw_serde]
#[derive(Default)]
pub struct XionAdventuresExtensionMsg {
    pub city_map: Option<u8>,
    pub location: Option<PlayerLocation>,
}

impl From<XionAdventuresExtension> for XionAdventuresExtensionMsg {
    fn from(value: XionAdventuresExtension) -> Self {
        Self {
            city_map: Some(value.city_map),
            location: Some(value.location.clone()),
        }
    }
}

impl Cw721State for XionAdventuresExtension {}
impl Cw721CustomMsg for XionAdventuresExtensionMsg {}
impl StateFactory<XionAdventuresExtension> for XionAdventuresExtensionMsg {
    fn create(
        &self,
        _deps: Option<cosmwasm_std::Deps>,
        _env: Option<&cosmwasm_std::Env>,
        _info: Option<&cosmwasm_std::MessageInfo>,
        current: Option<&XionAdventuresExtension>,
    ) -> Result<XionAdventuresExtension, ContractError> {
        match current {
            Some(current) => {
                let mut updated = current.clone();
                if let Some(city_map) = &self.city_map {
                    updated.city_map = *city_map;
                }
                if let Some(location) = &self.location {
                    updated.location = location.clone();
                }

                Ok(updated)
            }
            None => Ok(XionAdventuresExtension {
                city_map: self
                    .city_map
                    .expect("You need a map to create an Adventures account"),
                location: self.location.clone().unwrap_or_default(),
            }),
        }
    }

    fn validate(
        &self,
        _deps: Option<cosmwasm_std::Deps>,
        _env: Option<&cosmwasm_std::Env>,
        _info: Option<&cosmwasm_std::MessageInfo>,
        _current: Option<&XionAdventuresExtension>,
    ) -> Result<(), ContractError> {
        Ok(())
    }
}

impl Contains for XionAdventuresExtension {
    fn contains(&self, _other: &Self) -> bool {
        fn _is_equal(a: &Option<String>, b: &Option<String>) -> bool {
            match (a, b) {
                (Some(a), Some(b)) => a.contains(b),
                (Some(_), None) => true,
                (None, None) => true,
                _ => false,
            }
        }
        // if !is_equal(&self.image_data, &other.image_data) {
        //     return false;
        // }
        // if !is_equal(&self.external_url, &other.external_url) {
        //     return false;
        // }
        // if !is_equal(&self.description, &other.description) {
        //     return false;
        // }
        // if !is_equal(&self.name, &other.name) {
        //     return false;
        // }
        // if !is_equal(&self.background_color, &other.background_color) {
        //     return false;
        // }
        // if !is_equal(&self.animation_url, &other.animation_url) {
        //     return false;
        // }
        // if !is_equal(&self.youtube_url, &other.youtube_url) {
        //     return false;
        // }
        // if let (Some(a), Some(b)) = (&self.attributes, &other.attributes) {
        //     for (i, b) in b.iter().enumerate() {
        //         if !a[i].eq(b) {
        //             return false;
        //         }
        //     }
        // }
        true
    }
}

pub type XionAdventuresCw721<'a> = Cw721Extensions<
    'a,
    XionAdventuresExtension,
    XionAdventuresExtensionMsg,
    Empty,
    Empty,
    Empty,
    Empty,
    Empty,
>;

pub mod entry {
    use super::*;

    #[cfg(not(feature = "library"))]
    use cosmwasm_std::entry_point;
    use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response};
    use cw721::msg::Cw721MigrateMsg;
    use msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn instantiate(
        mut deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result<Response, ContractError> {
        XionAdventuresCw721::default().instantiate_with_version(
            deps.branch(),
            &env,
            &info,
            msg,
            CONTRACT_NAME,
            CONTRACT_VERSION,
        )
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn execute(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        XionAdventuresCw721::default().execute(deps, &env, &info, msg)
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
        XionAdventuresCw721::default().query(deps, &env, msg)
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn migrate(
        deps: DepsMut,
        env: Env,
        msg: Cw721MigrateMsg,
    ) -> Result<Response, ContractError> {
        let contract = XionAdventuresCw721::default();
        contract.migrate(deps, env, msg, CONTRACT_NAME, CONTRACT_VERSION)
    }
}
