use crate::contract::{Hub, HubResult};
use crate::msg::HubInstantiateMsg;
use crate::state::{Config, MapTile, CONFIG, MAP, MAP_OUTPUT, NFT};
use common::{hash_u32, MapOutput};
use cosmwasm_std::{
    instantiate2_address, to_json_binary, Binary, CodeInfoResponse, DepsMut, Empty, Env,
    MessageInfo, QueryRequest, Response, Storage, WasmMsg, WasmQuery,
};
use nft::msg::InstantiateMsg;

pub const WORLD_SIZE: u32 = 100u32;

pub fn instantiate_handler(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    _hub: Hub,
    msg: HubInstantiateMsg,
) -> HubResult {
    // We need to create the NFT contract that will host everything locally
    let salt = b"nft_contract".to_vec();
    let nft_instantiation_msg = WasmMsg::Instantiate2 {
        admin: Some(env.contract.address.to_string()),
        code_id: msg.nft_code_id,
        label: "Cosmos Adventures NFT".to_string(),
        msg: to_json_binary(&InstantiateMsg {
            name: "Cosmos Adventurers".to_string(),
            symbol: "IBC-CA".to_string(),
            minter: Some(env.contract.address.to_string()),
            collection_info_extension: Empty {},
            creator: None,
            withdraw_address: None,
        })?,
        funds: vec![],
        salt: Binary::new(salt.clone()),
    };
    let code_id_info: CodeInfoResponse =
        deps.querier
            .query(&QueryRequest::Wasm(WasmQuery::CodeInfo {
                code_id: msg.nft_code_id,
            }))?;
    let canon_nft = instantiate2_address(
        code_id_info.checksum.as_slice(),
        &deps.api.addr_canonicalize(env.contract.address.as_str())?,
        &salt,
    )?;
    NFT.save(deps.storage, &deps.api.addr_humanize(&canon_nft)?)?;

    // We create the map and save it in memory
    let map = map_generation::generate_map(hash_u32(&env.block.chain_id), WORLD_SIZE);
    store_map(deps.storage, &map)?;
    MAP_OUTPUT.save(deps.storage, &map)?;

    let config: Config = Config { next_token_id: 0 };
    CONFIG.save(deps.storage, &config)?;

    // Example instantiation that doesn't do anything
    Ok(Response::new().add_message(nft_instantiation_msg))
}

pub fn store_map(storage: &mut dyn Storage, map: &MapOutput) -> HubResult<()> {
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
        MAP.save(storage, (row_index.into(), line_index.into()), &map_tile)?;
    }

    Ok(())
}
