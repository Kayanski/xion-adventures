use abstract_adapter::objects::AccountId;
use common::MapOutput;

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[cosmwasm_schema::cw_serde]
pub struct Config {
    pub next_token_id: u64,
    pub admin_account: AccountId,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const NFT: Item<Addr> = Item::new("nft");

////// ******* Game Data ********* ///////
// This is needed for querying tile maps individually to avoid deserializing the whole map at every query
pub const MAP: Map<(i64, i64), MapTile> = Map::new("map");
/// This is neeed for querying the map from the game client off-chain
pub const MAP_OUTPUT: Item<MapOutput> = Item::new("map_output");
/// This is needed to fetch wether there is a door at the location in the general map
pub const DOORS: Map<(i64, i64), Door> = Map::new("map_doors");

pub use doors::Door;
pub use map_tile::MapTile;

pub mod map_tile {
    use cosmwasm_schema::serde::{self, Deserialize, Serialize};
    use schemars::JsonSchema;

    #[derive(Clone, Debug, PartialEq, JsonSchema)]
    pub enum MapTile {
        Terrain,
        Tree,
        Sea,
    }
    impl<'de> Deserialize<'de> for MapTile {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: serde::Deserializer<'de>,
        {
            match i8::deserialize(deserializer)? {
                0 => Ok(MapTile::Terrain),
                1 => Ok(MapTile::Tree),
                2 => Ok(MapTile::Sea),
                _ => Err(serde::de::Error::custom("Expected [0,2] for MapTile")),
            }
        }
    }
    impl Serialize for MapTile {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::Serializer,
        {
            serializer.serialize_i8(match self {
                MapTile::Terrain => 0,
                MapTile::Tree => 1,
                MapTile::Sea => 2,
            })
        }
    }

    impl MapTile {
        pub fn walkable(&self) -> bool {
            match self {
                MapTile::Terrain => true,
                MapTile::Tree => false,
                MapTile::Sea => false,
            }
        }
    }
}

pub mod doors {
    use common::player_location::PlayerLocation;
    use cosmwasm_schema::cw_serde;

    #[cw_serde]
    pub struct Door {
        destination: PlayerLocation,
    }

    impl Door {
        pub fn cross(self, player_location: &mut PlayerLocation) {
            *player_location = self.destination;
        }
    }
}
