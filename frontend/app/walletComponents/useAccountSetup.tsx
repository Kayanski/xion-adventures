import { useCallback } from "react"
import { hub, gameHandler } from "../_generated/generated-abstract";
import { AccountId } from "@abstract-money/core";


// We use this to get the abstractAccount associated with the connected wallet
// Hardcoded for testing
export const abstractAccount: AccountId = {
    seq: 25,
    trace: "local",
    chainName: "xiontestnet",
}

export const accountDetails = {
    accountId: abstractAccount,
    chainName: abstractAccount.chainName
};

export function useGameAccountSetup() {

    let { mutateAsync: createGameAccountMutation } = gameHandler.mutations.useCreateAccount({ ...accountDetails });

    let createGameAccount = useCallback(async () => {
        if (!createGameAccountMutation) {
            return
        }
        let game_account = await createGameAccountMutation({
            msg: {
            }, args: {
                fee: "auto"
            }
        })
        return game_account

    }, [createGameAccountMutation])

    return {
        createGameAccount
    }
}