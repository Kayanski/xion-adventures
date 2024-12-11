use crate::api::GameHandlerApi;
use crate::contract::{GameHandler, GameHandlerResult};
use crate::error::GameHandlerError;
use crate::msg::GameHandlerExecuteMsg;
use crate::state::{MovingMetadata, CONFIG, CURRENT_MINTED_AMOUNT};
use abstract_adapter::objects::AccountId;
use abstract_adapter::traits::AccountIdentification;
use abstract_sdk::{
    AbstractResponse, AccountVerification, Execution, ExecutorMsg, TransferInterface,
};
use common::player_location::PlayerLocation;
use common::vec2::Vec2;
use cosmwasm_std::{Deps, DepsMut, Env, MessageInfo};
use nft::{XionAdventuresExtension, XionAdventuresExtensionMsg};
use xion_adventures_hub::api::HubApi;

pub fn execute_handler(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    adapter: GameHandler,
    msg: GameHandlerExecuteMsg,
) -> GameHandlerResult {
    match msg {
        GameHandlerExecuteMsg::CreateAccount {
            city_map_index,
            receiver,
        } => create_account(deps, info, env, adapter, city_map_index, receiver),
        GameHandlerExecuteMsg::MovePlayer {
            positions,
            token_id,
        } => move_player(deps, env, info, adapter, token_id, positions),
    }
}

fn create_account(
    mut deps: DepsMut,
    _info: MessageInfo,
    env: Env,
    adapter: GameHandler,
    city_map_index: Option<u8>,
    recipient: Option<AccountId>,
) -> GameHandlerResult {
    // We make sure the account can still mint new tokens on this target chain
    assert_mint_limit(deps.branch(), &adapter)?;

    // We make the user pay some tokens to mint
    let payment_msg = payment(deps.as_ref(), &env, &adapter)?;

    // We make the hub mint an NFT
    let config = CONFIG.load(deps.storage)?;

    let mint_msg = adapter.adventures_hub(deps.as_ref()).mint(
        config.token_uri_base,
        config.metadata_base.build_metadata(MovingMetadata {
            city_map: city_map_index.unwrap_or_default(),
        }),
        recipient,
    )?;

    Ok(adapter
        .response("create-games-account")
        .add_message(mint_msg)
        .add_messages(payment_msg))
}

fn payment(
    deps: Deps,
    _env: &Env,
    adapter: &GameHandler,
) -> GameHandlerResult<Option<ExecutorMsg>> {
    let config = CONFIG.load(deps.storage)?;
    let admin_account_base = adapter
        .account_registry(deps)?
        .account(&config.admin_account)?;

    if config.mint_cost.amount.is_zero() {
        return Ok(None);
    }

    let payment_msg = adapter
        .bank(deps)
        .transfer(vec![config.mint_cost], admin_account_base.addr())?;
    Ok(Some(adapter.executor(deps).execute(vec![payment_msg])?))
}

fn assert_mint_limit(deps: DepsMut, adapter: &GameHandler) -> GameHandlerResult<()> {
    let config = CONFIG.load(deps.storage)?;
    // We make sure the account can still mint new tokens
    let account_id = adapter.account_id(deps.as_ref())?;
    let current_minted_amount = CURRENT_MINTED_AMOUNT
        .may_load(deps.storage, &account_id)?
        .unwrap_or(0);

    if current_minted_amount >= config.mint_limit {
        return Err(GameHandlerError::TooMuchMinted(config.mint_limit));
    }

    CURRENT_MINTED_AMOUNT.save(deps.storage, &account_id, &(current_minted_amount + 1))?;

    Ok(())
}

fn move_player(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    adapter: GameHandler,
    token_id: String,
    movements: Vec<Vec2>,
) -> GameHandlerResult {
    adapter
        .adventures_hub(deps.as_ref())
        .assert_nft_owner(&token_id)?;
    // Assert the token id owner calls

    let player_location = can_move_player(deps.as_ref(), &adapter, &token_id, movements)?;
    let metadata = XionAdventuresExtensionMsg {
        location: Some(player_location),
        ..Default::default()
    };

    let move_player_msg = adapter
        .adventures_hub(deps.as_ref())
        .modify_metadata(token_id, metadata)?;
    Ok(adapter.response("move-player").add_message(move_player_msg))
}

fn can_move_player(
    deps: Deps,
    adapter: &GameHandler,
    token_id: &str,
    movements: Vec<Vec2>,
) -> GameHandlerResult<PlayerLocation> {
    let nft_metadata = adapter.adventures_hub(deps).query_nft_metadata(token_id)?;

    let mut position = nft_metadata.location.clone();

    for movement in movements {
        // We check that the movement is limited
        if !movement.is_unit_movement() {
            return Err(GameHandlerError::PlayerCantMoveThatFast(movement));
        }

        // We verify we don't cross elements
        let can_walk = {
            if can_walk_x(deps, adapter, &position, &movement, &nft_metadata)? {
                can_walk_y(
                    deps,
                    adapter,
                    &position.move_x(&movement),
                    &movement,
                    &nft_metadata,
                )?
            } else if can_walk_y(deps, adapter, &position, &movement, &nft_metadata)? {
                can_walk_x(
                    deps,
                    adapter,
                    &position.move_y(&movement),
                    &movement,
                    &nft_metadata,
                )?
            } else {
                false
            }
        };
        if !can_walk {
            return Err(GameHandlerError::PlayerCantMoveHere());
        }
        // We increment the position
        position += movement;

        // We take into account doors
        let door = adapter
            .game_handler(deps)
            .query_door(&position, &nft_metadata)?;

        if let Some(door) = door {
            door.cross(&mut position);
        }
    }

    Ok(position)
}

pub fn can_walk_x(
    deps: Deps,
    adapter: &GameHandler,
    position: &PlayerLocation,
    movement: &Vec2,
    nft_metadata: &XionAdventuresExtension,
) -> GameHandlerResult<bool> {
    let new_tile = position.move_x(movement);
    can_walk_on(deps, adapter, &new_tile, nft_metadata)
}
pub fn can_walk_y(
    deps: Deps,
    adapter: &GameHandler,
    position: &PlayerLocation,
    movement: &Vec2,
    nft_metadata: &XionAdventuresExtension,
) -> GameHandlerResult<bool> {
    let new_tile = position.move_y(movement);
    can_walk_on(deps, adapter, &new_tile, nft_metadata)
}

pub fn can_walk_on(
    deps: Deps,
    adapter: &GameHandler,
    tile: &PlayerLocation,
    nft_metadata: &XionAdventuresExtension,
) -> GameHandlerResult<bool> {
    let tile_type = adapter.game_handler(deps).query_tile(tile, nft_metadata)?;

    Ok(tile_type.walkable())
}
