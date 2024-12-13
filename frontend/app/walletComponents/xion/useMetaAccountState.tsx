import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useLocalStorage } from "usehooks-ts";
import { useCallback } from "react";
import { AccountId } from "@abstract-money/core";

interface MetaAccountState {
    xionAccountId?: AccountId;
    managerAddress?: string;
    icaaAddress?: string;
    hasProgressedBeyondIcaa?: boolean;
    localNftTxHash?: string | undefined;
}

export function useMetaAccountState() {
    const { data } = useAbstraxionAccount();
    const [metaAccountState, setMetaAccountState] =
        useLocalStorage<MetaAccountState | null>(
            `meta-${data?.bech32Address}`,
            null,
        );

    const updateMetaAccountState = useCallback(
        (updatedFields: Partial<MetaAccountState>) => {
            console.log(`Setting meta account address for ${data.bech32Address}`);
            if (!data.bech32Address) return;
            setMetaAccountState((prev) => {
                if (prev) {
                    return { ...prev, ...updatedFields };
                }
                return updatedFields;
            });
        },
        [data.bech32Address, setMetaAccountState],
    );

    return [metaAccountState, updateMetaAccountState] as const;
}