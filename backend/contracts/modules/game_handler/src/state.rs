use abstract_adapter::std::objects::AccountId;
use common::MapOutput;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::Coin;
use cw_storage_plus::{Item, Map};
use nft::XionAdventuresExtensionMsg;
use xion_adventures_hub::state::{Door, MapTile};

#[cw_serde]
pub struct FixedMetadata {}

#[cw_serde]
pub struct MovingMetadata {
    pub city_map: u8,
}

impl FixedMetadata {
    pub fn build_metadata(self, moving: MovingMetadata) -> XionAdventuresExtensionMsg {
        XionAdventuresExtensionMsg {
            city_map: Some(moving.city_map),
            location: None,
        }
    }
}

#[cw_serde]
pub struct Config {
    pub admin_account: AccountId,
    pub metadata_base: FixedMetadata,
    pub token_uri_base: String,
    pub mint_limit: usize,
    pub mint_cost: Coin,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const CURRENT_MINTED_AMOUNT: Map<&AccountId, usize> = Map::new("minted_amount");

// All the city maps for players
pub const MAX_MAP_NUMBER: u8 = 3;
pub const CITY_MAP_SEED_OFFSET: u32 = 6;
pub const CITY_MAP_SIZE: u32 = 30;
pub const CITY_MAPS: Map<u8, MapOutput> = Map::new("city_maps");
pub const CITY_MAPS_TILES: Map<(u8, i64, i64), MapTile> = Map::new("city_maps_tiles");

/// This is needed to fetch wether there is a door at the location in the city map
pub const CITY_DOORS: Map<(u8, i64, i64), Door> = Map::new("map_doors");
