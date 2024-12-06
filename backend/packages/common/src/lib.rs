pub mod player_location;
pub mod vec2;
use std::hash::{DefaultHasher, Hash, Hasher};

use cosmwasm_schema::cw_serde;
use cosmwasm_std::Binary;

pub const NAMESPACE: &str = "xion-adventures";

pub fn u64_to_u32(s: u64) -> u32 {
    (s % (u32::MAX as u64)).try_into().unwrap()
}

pub fn hash_u32(t: &str) -> u32 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    u64_to_u32(s.finish())
}

#[cw_serde]
pub struct MapOutput {
    pub width: u32,
    pub height: u32,
    pub data: Binary,
}

#[cfg(test)]
pub mod tests {
    use crate::u64_to_u32;

    #[test]
    fn saturating_hash() {
        u64_to_u32(u64::MAX);
    }
}
