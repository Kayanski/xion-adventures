use crate::contract::{Hub, HubResult};
use crate::error::HubError;
use crate::helpers::next_token_id_mut;
use crate::msg::{HubExecuteMsg, HubIbcCallbackMsg, HubIbcMsg};
use crate::state::NFT;
use abstract_adapter::objects::{AccountId, TruncatedChainId};
use abstract_adapter::std::ibc::Callback;
use abstract_adapter::std::objects::module::ModuleInfo;
use abstract_adapter::std::{ibc_client, IBC_CLIENT};
use abstract_sdk::features::{AccountIdentification, ModuleIdentification};
use abstract_sdk::{
    AbstractResponse, AccountAction, AccountVerification, Execution, ModuleInterface,
};
use common::NAMESPACE;
use cosmwasm_std::{ensure_eq, to_json_binary, wasm_execute, DepsMut, Env, MessageInfo};
use cw721::msg::{NftInfoResponse, OwnerOfResponse};
use nft::msg::{ExecuteMsg, QueryMsg};
use nft::{XionAdventuresExtension, XionAdventuresExtensionMsg};

pub fn execute_handler(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    adapter: Hub,
    msg: HubExecuteMsg,
) -> HubResult {
    match msg {
        HubExecuteMsg::IbcTransfer {
            recipient_chain,
            token_id,
        } => ibc_transfer(deps, info, env, adapter, token_id, recipient_chain),
        HubExecuteMsg::Mint {
            module_id,
            token_uri,
            metadata,
            recipient,
        } => mint(
            deps, env, info, module_id, token_uri, metadata, adapter, recipient,
        ),
        HubExecuteMsg::ModifyMetadata {
            module_id,
            token_id,
            metadata,
        } => modify_metadata(deps, env, info, adapter, module_id, token_id, metadata),
    }
}

fn ibc_transfer(
    deps: DepsMut,
    _info: MessageInfo,
    env: Env,
    hub: Hub,
    token_id: String,
    recipient_chain: TruncatedChainId,
) -> HubResult {
    let nft = NFT.load(deps.storage)?;

    // We authenticate the account that is calling the contract
    let target_account = hub.account(deps.as_ref())?;

    // We verify the NFT is owned by the addr
    let owner: OwnerOfResponse = deps.querier.query_wasm_smart(
        &nft,
        &QueryMsg::OwnerOf {
            token_id: token_id.clone(),
            include_expired: None,
        },
    )?;
    if owner.owner != target_account.addr().as_str() {
        return Err(HubError::Unauthorized {});
    }

    // We transfer the NFT from the top level owner to this contract to lock it
    let nft_msg = hub
        .executor(deps.as_ref())
        .execute(vec![AccountAction::from_vec(vec![wasm_execute(
            &nft,
            &ExecuteMsg::TransferNft {
                recipient: env.contract.address.to_string(),
                token_id: token_id.clone(),
            },
            vec![],
        )?])])?;

    // We send an IBC mint message from to the distant chain
    // We query the NFT metadata
    let nft: NftInfoResponse<XionAdventuresExtension> = deps.querier.query_wasm_smart(
        NFT.load(deps.storage)?,
        &QueryMsg::NftInfo {
            token_id: token_id.clone(),
        },
    )?;

    let current_module_info = ModuleInfo::from_id(hub.module_id(), hub.version().into())?;
    let ibc_msg = ibc_client::ExecuteMsg::ModuleIbcAction {
        host_chain: recipient_chain,
        target_module: current_module_info,
        msg: to_json_binary(&HubIbcMsg::IbcMint {
            token_id: token_id.clone(),
            token_uri: nft.token_uri,
            extension: nft.extension.into(),
            local_account_id: target_account.account_id(deps.as_ref())?,
        })?,
        callback: Some(Callback::new(&HubIbcCallbackMsg::BurnToken { token_id })?),
    };

    let ibc_client_addr = hub.modules(deps.as_ref()).module_address(IBC_CLIENT)?;

    // We will burn the token once the transfer has been confirmed and the callback has been received
    let ibc_msg = wasm_execute(ibc_client_addr, &ibc_msg, vec![])?;

    Ok(hub
        .response("ibc-transfer")
        .add_message(nft_msg)
        .add_message(ibc_msg))
}

#[allow(clippy::too_many_arguments)]
fn mint(
    mut deps: DepsMut,
    env: Env,
    info: MessageInfo,
    module_id: String,
    token_uri: String,
    metadata: XionAdventuresExtensionMsg,
    adapter: Hub,
    recipient: Option<AccountId>,
) -> HubResult {
    // This endpoint is permissionned because we're the hub, only authorized installed modules can call this
    let module_addr = adapter.modules(deps.as_ref()).module_address(&module_id)?;
    ensure_eq!(module_addr, info.sender, HubError::Unauthorized {});
    let namespace = ModuleInfo::from_id_latest(&module_id)?.namespace;
    ensure_eq!(namespace.as_str(), NAMESPACE, HubError::WrongNamespace {});

    let account = if let Some(recipient) = recipient {
        adapter
            .account_registry(deps.as_ref(),)?
            .account(&recipient)?
    } else {
        adapter.account(deps.as_ref())?
    };

    // We mint the token to the recipient
    let token_id = next_token_id_mut(deps.branch(), env)?;
    let mint_msg = wasm_execute(
        NFT.load(deps.storage)?,
        &ExecuteMsg::Mint {
            token_id,
            owner: account.addr().to_string(),
            token_uri: Some(token_uri),
            extension: metadata,
        },
        vec![],
    )?;

    Ok(adapter.response("mint-lost-nft").add_message(mint_msg))
}

#[allow(clippy::too_many_arguments)]
fn modify_metadata(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    adapter: Hub,
    module_id: String,
    token_id: String,
    metadata: XionAdventuresExtensionMsg,
) -> HubResult {
    // This endpoint is permissionned because we're the hub, only authorized installed modules can call this
    let module_addr = adapter.modules(deps.as_ref()).module_address(&module_id)?;
    ensure_eq!(module_addr, info.sender, HubError::Unauthorized {});
    let namespace = ModuleInfo::from_id_latest(&module_id)?.namespace;
    ensure_eq!(namespace.as_str(), NAMESPACE, HubError::WrongNamespace {});

    // We modify the metadata on the token
    let modify_msg = wasm_execute(
        NFT.load(deps.storage)?,
        &ExecuteMsg::UpdateNftInfo {
            token_id,
            token_uri: None,
            extension: metadata,
        },
        vec![],
    )?;

    Ok(adapter.response("modify-metadata").add_message(modify_msg))
}
