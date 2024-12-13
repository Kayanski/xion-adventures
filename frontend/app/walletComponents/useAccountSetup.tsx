import { useCallback } from "react"
import { hub, gameHandler } from "../_generated/generated-abstract";
import { AccountId } from "@abstract-money/core";


// We use this to get the abstractAccount associated with the connected wallet
// Hardcoded for testing
export const abstractAccount: AccountId = {
    // seq: 37,
    seq: 39,
    trace: "local",
    chainName: "xiontestnet",
}

export const accountDetails = {
    accountId: abstractAccount,
    chainName: abstractAccount.chainName
};