use abstract_adapter::std::objects::AccountId;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::Item;
use map_generation::MapOutput;

#[cosmwasm_schema::cw_serde]
pub struct Config {
    pub next_token_id: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const MAP: Item<MapOutput> = Item::new("map");
pub const NFT: Item<Addr> = Item::new("nft");

#[cw_serde]
pub struct Account {
    pub account_id: AccountId,
}
