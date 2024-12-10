pub mod api;
pub mod contract;
pub mod error;
mod handlers;
pub mod helpers;
pub mod ibc;
pub mod msg;
mod replies;
pub mod state;
#[cfg(not(target_arch = "wasm32"))]
pub use contract::interface::HubInterface;

pub use msg::{HubExecuteMsgFns, HubQueryMsgFns};

#[cfg(not(target_arch = "wasm32"))]
pub mod interface {
    use cw_orch::core::CwEnvError;
    use cw_orch::prelude::*;
    use nft::NftInterface;

    use crate::{HubInterface, HubQueryMsgFns};

    impl<Chain: CwEnv> HubInterface<Chain> {
        pub fn nft(&self) -> Result<NftInterface<Chain>, CwEnvError> {
            let config = self.config()?;
            let nft = NftInterface::new(self.environment().clone());
            nft.set_address(&Addr::unchecked(&config.nft));
            Ok(nft)
        }
    }
}
