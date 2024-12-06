use crate::contract::{GameHandler, GameHandlerResult};
use crate::msg::GameHandlerInstantiateMsg;
use crate::state::{
    Config, CITY_MAPS, CITY_MAPS_TILES, CITY_MAP_SEED_OFFSET, CITY_MAP_SIZE, CONFIG, MAX_MAP_NUMBER,
};
use common::{hash_u32, MapOutput};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, Storage};
use map_generation::generate_map;
use xion_adventures_hub::state::MapTile;

pub fn instantiate_handler(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    _hub: GameHandler,
    msg: GameHandlerInstantiateMsg,
) -> GameHandlerResult {
    let config = Config {
        admin_account: msg.admin_account,
        metadata_base: msg.metadata_base,
        token_uri_base: msg.token_uri_base,
        mint_limit: msg.mint_limit,
        mint_cost: msg.mint_cost,
    };

    CONFIG.save(deps.storage, &config)?;

    // We need to create CITY MAPS for players
    for index in 0..MAX_MAP_NUMBER {
        let map = generate_map(
            hash_u32(&env.block.chain_id) + CITY_MAP_SEED_OFFSET + index as u32,
            CITY_MAP_SIZE,
        );
        store_map(deps.storage, index, &map)?;
        CITY_MAPS.save(deps.storage, index, &map)?;
    }

    // Example instantiation that doesn't do anything
    Ok(Response::new().add_attribute("instantiate", "minter-adapter"))
}

pub fn store_map(storage: &mut dyn Storage, map_id: u8, map: &MapOutput) -> GameHandlerResult<()> {
    for (index, el) in map.data.iter().enumerate() {
        let index = index as u32;
        let row_index = index % map.width;
        let line_index = index / map.height;

        // Each element is compared to an enum and stored separately
        let map_tile = if *el < 50 {
            MapTile::Sea
        } else if *el < 150 {
            MapTile::Terrain
        } else {
            MapTile::Tree
        };
        CITY_MAPS_TILES.save(
            storage,
            (map_id, row_index.into(), line_index.into()),
            &map_tile,
        )?;
    }

    Ok(())
}
