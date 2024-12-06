// match player_location {
//     PlayerLocation::City(vec2) => {
//         // Then we need to get the tile from the loaded map

//         // Maybe the player map could also be queried piece by piece
//         todo!()
//     }

use crate::{
    contract::GAME_HANDLER_ID,
    msg::{GameHandlerExecuteMsg, GameHandlerQueryMsg},
    state::{CITY_DOORS, CITY_MAPS_TILES},
};
use abstract_adapter::sdk::{
    features::{AccountIdentification, Dependencies, ModuleIdentification},
    AbstractSdkResult, AdapterInterface,
};
use abstract_adapter::std::objects::module::ModuleId;
use abstract_sdk::ModuleInterface;
use common::player_location::PlayerLocation;
use cosmwasm_schema::serde::de::DeserializeOwned;
use cosmwasm_std::{CosmosMsg, Deps, Uint128};
use nft::XionAdventuresExtension;
use xion_adventures_hub::{api::HubApi, state::Door};
use xion_adventures_hub::{error::HubError, state::MapTile};

// API for Abstract SDK users
/// Interact with your adapter in other modules.
pub trait GameHandlerApi: AccountIdentification + Dependencies + ModuleIdentification {
    /// Construct a new adapter interface.
    fn game_handler<'a>(&'a self, deps: Deps<'a>) -> GameHandler<'a, Self> {
        GameHandler {
            base: self,
            deps,
            module_id: GAME_HANDLER_ID,
        }
    }
}

impl<T: AccountIdentification + Dependencies + ModuleIdentification> GameHandlerApi for T {}

#[derive(Clone)]
pub struct GameHandler<'a, T: GameHandlerApi> {
    pub base: &'a T,
    pub module_id: ModuleId<'a>,
    pub deps: Deps<'a>,
}

impl<'a, T: GameHandlerApi> GameHandler<'a, T> {
    /// Set the module id
    pub fn with_module_id(self, module_id: ModuleId<'a>) -> Self {
        Self { module_id, ..self }
    }

    /// returns the HUB module id
    fn module_id(&self) -> ModuleId {
        self.module_id
    }

    /// Executes a [GameHandlerExecuteMsg] in the adapter
    fn request(&self, msg: GameHandlerExecuteMsg) -> AbstractSdkResult<CosmosMsg> {
        let adapters = self.base.adapters(self.deps);

        adapters.execute(self.module_id(), msg)
    }
}

/// Queries
impl<T: GameHandlerApi> GameHandler<'_, T> {
    /// Query your adapter via message type
    pub fn query<R: DeserializeOwned>(
        &self,
        query_msg: GameHandlerQueryMsg,
    ) -> AbstractSdkResult<R> {
        let adapters = self.base.adapters(self.deps);
        adapters.query(self.module_id(), query_msg)
    }

    /// Query config
    pub fn config(&self) -> AbstractSdkResult<Uint128> {
        self.query(GameHandlerQueryMsg::Config {})
    }

    /// The [`nft_metadata`] argument can be queried using [`Self::query_nft_metadata`]
    pub fn query_tile(
        &self,
        player_location: &PlayerLocation,
        nft_metadata: &XionAdventuresExtension,
    ) -> AbstractSdkResult<MapTile> {
        match player_location {
            PlayerLocation::City(vec2) => {
                let map_key = (nft_metadata.city_map, vec2.x, vec2.y);
                if self.base.module_id() == self.module_id() {
                    // We in the contract itself
                    CITY_MAPS_TILES
                        .may_load(self.deps.storage, map_key)?
                        .ok_or(HubError::TileUnavailable {
                            tile: player_location.clone(),
                        })
                        .map_err(Into::into)
                } else {
                    // We are in an external contract
                    let modules = self.base.modules(self.deps);
                    let game_handler_address = modules.module_address(self.module_id())?;
                    CITY_MAPS_TILES
                        .query(&self.deps.querier, game_handler_address, map_key)?
                        .ok_or(HubError::TileUnavailable {
                            tile: player_location.clone(),
                        })
                        .map_err(Into::into)
                }
            }
            PlayerLocation::GeneralMap(vec2) => self
                .base
                .adventures_hub(self.deps)
                .query_tile(vec2, nft_metadata),
        }
    }

    /// The [`nft_metadata`] argument can be queried using [`Self::query_nft_metadata`]
    pub fn query_door(
        &self,
        player_location: &PlayerLocation,
        nft_metadata: &XionAdventuresExtension,
    ) -> AbstractSdkResult<Option<Door>> {
        match player_location {
            PlayerLocation::City(vec2) => {
                let map_key = (nft_metadata.city_map, vec2.x, vec2.y);
                if self.base.module_id() == self.module_id() {
                    // We in the contract itself
                    CITY_DOORS
                        .may_load(self.deps.storage, map_key)
                        .map_err(Into::into)
                } else {
                    // We are in an external contract
                    let modules = self.base.modules(self.deps);
                    let game_handler_address = modules.module_address(self.module_id())?;
                    CITY_DOORS
                        .query(&self.deps.querier, game_handler_address, map_key)
                        .map_err(Into::into)
                }
            }
            PlayerLocation::GeneralMap(vec2) => {
                // The general map door information is located on the hub contract
                self.base
                    .adventures_hub(self.deps)
                    .query_door(vec2, nft_metadata)
            }
        }
    }
}
