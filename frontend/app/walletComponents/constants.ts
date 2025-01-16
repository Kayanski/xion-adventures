import { coins } from "@cosmjs/stargate";

export const ACCOUNT_FACTORY = "xion1v5hlsyk38ejztyezcw993nmwnsvagl04pexck9f56my7tnly4zqqx24lfz";

// Don't export those, they should be fetched from abstract.js
// These are only used to remember the treasury contract
const GAME_HANDLER = "xion158cngpeqsxrn4fzmk50q0s7pymxs4762e803gc9pdd0p3ax6fj8q4ngjcl";
const HUB = "xion1uwwrkqq0whn6c466gq7gnks5m6hn2cexrpevn2w8xluzzqhwrl8q7kl8fc"

export const TREASURY = "xion1kmmku7v6dasxc6wxnc39rftajltcsg9zrm90uhe2esf30xv09mrq4305wf"


export const FIXED_FEES = {
    accountCreation: {
        amount: coins(1162, "uxion"),
        gas: "1162000",
        granter: TREASURY,
    },
    authorizeOnHub: {
        amount: coins(206, "uxion"),
        gas: "206000",
        granter: TREASURY,
    },
    createGameAccount: {
        amount: coins(448, "uxion"),
        gas: "448000",
        granter: TREASURY,
    }
}