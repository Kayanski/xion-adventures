use abstract_sdk::std::account;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Empty, Env, MessageInfo, Response, WasmMsg,
};

use crate::{
    msg::{Config, ExecuteMsg, InstantiateMsg, CONFIG},
    AccountFactoryResult,
};

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> AccountFactoryResult<Response> {
    CONFIG.save(
        deps.storage,
        &Config {
            account_code_id: msg.account_code_id,
        },
    )?;
    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> AccountFactoryResult {
    let config = CONFIG.load(deps.storage)?;

    if let ExecuteMsg::CreateAccount {
        account_id,
        salt,
        install_modules,
    } = msg
    {
        let create_account_msg = account::InstantiateMsg::<cosmwasm_std::Empty> {
            code_id: config.account_code_id,
            owner: abstract_sdk::std::objects::gov_type::GovernanceDetails::Monarchy {
                monarch: info.sender.to_string(),
            },
            name: None,
            description: None,
            link: None,
            // provide the origin chain id
            account_id: account_id.clone(),
            install_modules,
            namespace: None,
            authenticator: None,
        };

        // create the message to instantiate the remote account
        let instantiate2_msg = WasmMsg::Instantiate2 {
            admin: Some(info.sender.to_string()),
            code_id: config.account_code_id,
            label: account_id
                .map(|a| a.to_string())
                .unwrap_or("no-label".to_string()),
            msg: to_json_binary(&create_account_msg)?,
            funds: vec![],
            salt,
        };

        Ok(Response::new().add_message(instantiate2_msg))
    } else {
        unreachable!()
    }
}

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: Empty) -> AccountFactoryResult<Binary> {
    unreachable!()
}
