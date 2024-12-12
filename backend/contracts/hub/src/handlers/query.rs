use crate::contract::{Hub, HubResult};
use crate::error::HubError;
use crate::helpers::next_token_id;
use crate::msg::{ConfigResponse, HubQueryMsg, MapResponse, NextTokenIdResponse};
use crate::state::{CONFIG, MAP_OUTPUT, NFT};
use cosmwasm_std::{to_json_binary, Binary, Deps, Env};
use cw721::msg::NftInfoResponse;
use nft::msg::QueryMsg;
use nft::XionAdventuresExtension;

pub fn query_handler(deps: Deps, env: Env, _app: &Hub, msg: HubQueryMsg) -> HubResult<Binary> {
    match msg {
        HubQueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        HubQueryMsg::NextTokenId {} => to_json_binary(&query_next_token_id(deps, env)?),
        HubQueryMsg::Map {} => to_json_binary(&query_map(deps)?),
        HubQueryMsg::PlayerMetadata { token_id } => {
            to_json_binary(&query_player_metadata(deps, token_id)?)
        }
    }
    .map_err(Into::into)
}

fn query_config(deps: Deps) -> HubResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        nft: NFT.load(deps.storage)?.to_string(),
        next_token_id: config.next_token_id,
    })
}

fn query_next_token_id(deps: Deps, env: Env) -> HubResult<NextTokenIdResponse> {
    Ok(NextTokenIdResponse {
        next_token_id: next_token_id(deps, env)?,
    })
}

fn query_map(deps: Deps) -> HubResult<MapResponse> {
    Ok(MapResponse {
        map: MAP_OUTPUT.load(deps.storage)?,
    })
}

fn query_player_metadata(deps: Deps, token_id: String) -> HubResult<XionAdventuresExtension> {
    let nft = NFT.load(deps.storage)?;

    let nft_info: Option<NftInfoResponse<XionAdventuresExtension>> =
        deps.querier.query_wasm_smart(
            nft,
            &QueryMsg::NftInfo {
                token_id: token_id.clone(),
            },
        )?;

    Ok(nft_info
        .ok_or(HubError::NftMetadataUnavailable { token_id })?
        .extension)
}
