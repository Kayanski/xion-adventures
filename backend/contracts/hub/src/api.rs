use crate::{
    contract::HUB_ID,
    error::HubError,
    msg::{HubExecuteMsg, HubQueryMsg},
    state::{Door, MapTile, DOORS, MAP, NFT},
};

use abstract_adapter::std::objects::module::ModuleId;
use abstract_adapter::{
    objects::AccountId,
    sdk::{
        features::{AccountIdentification, Dependencies, ModuleIdentification},
        AbstractSdkResult, AdapterInterface,
    },
};
use abstract_sdk::{AbstractSdkError, ModuleInterface};
use common::{player_location::PlayerLocation, vec2::Vec2};
use cosmwasm_schema::serde::de::DeserializeOwned;
use cosmwasm_std::{ensure_eq, CosmosMsg, Deps, Uint128};
use cw721::msg::{NftInfoResponse, OwnerOfResponse};
use nft::{XionAdventuresExtension, XionAdventuresExtensionMsg};

// API for Abstract SDK users
/// Interact with your adapter in other modules.
pub trait HubApi: AccountIdentification + Dependencies + ModuleIdentification {
    /// Construct a new adapter interface.
    fn adventures_hub<'a>(&'a self, deps: Deps<'a>) -> Hub<'a, Self> {
        Hub {
            base: self,
            deps,
            module_id: HUB_ID,
        }
    }
}

impl<T: AccountIdentification + Dependencies + ModuleIdentification> HubApi for T {}

#[derive(Clone)]
pub struct Hub<'a, T: HubApi> {
    pub base: &'a T,
    pub module_id: ModuleId<'a>,
    pub deps: Deps<'a>,
}

impl<'a, T: HubApi> Hub<'a, T> {
    /// Set the module id
    pub fn with_module_id(self, module_id: ModuleId<'a>) -> Self {
        Self { module_id, ..self }
    }

    /// returns the HUB module id
    fn module_id(&self) -> ModuleId {
        self.module_id
    }

    /// Executes a [HubExecuteMsg] in the adapter
    fn request(&self, msg: HubExecuteMsg) -> AbstractSdkResult<CosmosMsg> {
        let adapters = self.base.adapters(self.deps);

        adapters.execute(self.module_id(), msg)
    }

    pub fn mint(
        &self,
        token_uri: String,
        metadata: XionAdventuresExtensionMsg,
        recipient: Option<AccountId>,
    ) -> AbstractSdkResult<CosmosMsg> {
        let msg = HubExecuteMsg::Mint {
            module_id: self.base.module_id().to_string(),
            token_uri,
            metadata,
            recipient,
        };
        self.request(msg)
    }

    pub fn modify_metadata(
        &self,
        token_id: String,
        metadata: XionAdventuresExtensionMsg,
    ) -> AbstractSdkResult<CosmosMsg> {
        let msg = HubExecuteMsg::ModifyMetadata {
            module_id: self.base.module_id().to_string(),
            token_id,
            metadata,
        };
        self.request(msg)
    }
}

/// Queries
impl<T: HubApi> Hub<'_, T> {
    /// Query your adapter via message type
    pub fn query<R: DeserializeOwned>(&self, query_msg: HubQueryMsg) -> AbstractSdkResult<R> {
        let adapters = self.base.adapters(self.deps);
        adapters.query(self.module_id(), query_msg)
    }

    /// Query config
    pub fn config(&self) -> AbstractSdkResult<Uint128> {
        self.query(HubQueryMsg::Config {})
    }

    pub fn query_nft_metadata(&self, token_id: &str) -> AbstractSdkResult<XionAdventuresExtension> {
        let modules = self.base.modules(self.deps);
        let hub_address = modules.module_address(self.module_id())?;

        // We query the nft address
        let nft_address = NFT.query(&self.deps.querier, hub_address)?;

        let nft_info: NftInfoResponse<XionAdventuresExtension> =
            self.deps.querier.query_wasm_smart(
                nft_address,
                &nft::msg::QueryMsg::NftInfo {
                    token_id: token_id.to_string(),
                },
            )?;

        Ok(nft_info.extension)
    }

    pub fn assert_nft_owner(&self, token_id: &str) -> AbstractSdkResult<()> {
        let account = self.base.account(self.deps)?;

        let modules = self.base.modules(self.deps);
        let hub_address = modules.module_address(self.module_id())?;

        // We query the nft address
        let nft_address = NFT.query(&self.deps.querier, hub_address)?;

        let nft_info: OwnerOfResponse = self.deps.querier.query_wasm_smart(
            nft_address,
            &nft::msg::QueryMsg::OwnerOf {
                token_id: token_id.to_string(),
                include_expired: None,
            },
        )?;

        ensure_eq!(
            nft_info.owner,
            account.addr().as_str(),
            AbstractSdkError::OnlyAdmin {}
        );

        Ok(())
    }

    /// The [`nft_metadata`] argument can be queried using [`Self::query_nft_metadata`]
    pub fn query_tile(
        &self,
        player_location: &Vec2,
        _nft_metadata: &XionAdventuresExtension,
    ) -> AbstractSdkResult<MapTile> {
        let modules = self.base.modules(self.deps);
        let hub_address = modules.module_address(self.module_id())?;

        // The general map location is located on the hub contract
        let map_tile = MAP
            .query(
                &self.deps.querier,
                hub_address,
                (player_location.x, player_location.y),
            )?
            .ok_or(HubError::TileUnavailable {
                tile: PlayerLocation::GeneralMap(player_location.clone()),
            })?;

        Ok(map_tile)
    }
    /// The [`nft_metadata`] argument can be queried using [`Self::query_nft_metadata`]
    pub fn query_door(
        &self,
        player_location: &Vec2,
        _nft_metadata: &XionAdventuresExtension,
    ) -> AbstractSdkResult<Option<Door>> {
        let modules = self.base.modules(self.deps);
        let hub_address = modules.module_address(self.module_id())?;

        Ok(DOORS.query(
            &self.deps.querier,
            hub_address,
            (player_location.x, player_location.y),
        )?)
    }
}
