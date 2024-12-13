import { useCallback, useMemo } from "react"
import { hub, gameHandler } from "../_generated/generated-abstract";
import { AccountId } from "@abstract-money/core";
import { useAccounts, useSenderAddress } from "@abstract-money/react";
import { useDevMode } from "../_providers/dev-mod";


// We use this to get the abstractAccount associated with the connected wallet
// Hardcoded for testing
const abstractAccountDevMode: AccountId = {
    // seq: 37,
    seq: 39,
    trace: "local",
    chainName: "xiontestnet",
}

export function useConnectedAccountId() {
    const { devMode } = useDevMode();

    const { data: account } = useSenderAddress({
        chainName: "xiontestnet",
    })
    // This will only work when creating XION accounts
    const { data: accountsQueryResult } = useAccounts({
        args: {
            chains: ['xion-testnet-1'],
            owner: account ?? "",
        }
    })
    const abstractAccount = useMemo(() => {
        return accountsQueryResult?.[0];
    }, [accountsQueryResult])

    return devMode ? abstractAccountDevMode : abstractAccount
}