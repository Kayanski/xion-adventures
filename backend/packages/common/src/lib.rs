use std::hash::{DefaultHasher, Hash, Hasher};

pub const NAMESPACE: &str = "cosmos-adventures";

pub fn u64_to_u32(s: u64) -> u32 {
    (s % (u32::MAX as u64)).try_into().unwrap()
}

pub fn hash_u32(t: &str) -> u32 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    u64_to_u32(s.finish())
}

#[cfg(test)]
pub mod tests {
    use crate::u64_to_u32;

    #[test]
    fn saturating_hash() {
        u64_to_u32(u64::MAX);
    }
}
