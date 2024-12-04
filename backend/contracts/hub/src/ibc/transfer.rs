use abstract_sdk::{
    std::ibc::{Callback, IbcResult},
    AbstractResponse,
};
use cosmwasm_std::{from_json, wasm_execute, DepsMut, Env};

use crate::{
    contract::{Hub, HubResult},
    error::HubError,
    msg::HubIbcCallbackMsg,
    state::NFT,
};
use cw721_metadata_onchain::ExecuteMsg;

pub fn transfer_callback(
    deps: DepsMut,
    _env: Env,
    adapter: Hub,
    callback: Callback,
    result: IbcResult,
) -> HubResult {
    // We burn the token that was successfully transfered (if so)

    let msg = match result {
        IbcResult::Execute {
            initiator_msg: _,
            result,
        } => {
            result.map_err(HubError::Transfer)?;

            let msg: HubIbcCallbackMsg = from_json(callback.msg)?;

            let token_id = match msg {
                HubIbcCallbackMsg::BurnToken { token_id } => token_id,
            };

            let burn_msg = wasm_execute(
                NFT.load(deps.storage)?,
                &ExecuteMsg::Burn { token_id },
                vec![],
            )?;
            Ok(burn_msg)
        }
        IbcResult::FatalError(error) => Err(HubError::Transfer(error)),
        _ => unreachable!(),
    }?;

    Ok(adapter.response("burn-token").add_message(msg))
}
