import { useEffect } from "react";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useAbstraxionProviderConfig } from "./useAbstractxionProviderConfig";
import { useXionAbstractAccountExists } from "./useAbstractXionAccountBase";

export function useAutoSelectAccount() {
    useAbstraxionSigningClient();
    const xionAaBaseQuery = useXionAbstractAccountExists();

    const { contracts, setContracts } = useAbstraxionProviderConfig();

    useEffect(() => {
        if (!xionAaBaseQuery.isSuccess) return;
        if (!xionAaBaseQuery.data) return;
        const accountAddress = xionAaBaseQuery.data.managerAddress;

        const contractsToAdd = [
            {
                address: accountAddress, amounts: [{ denom: "uxion", amount: "1000000" }],

            },
        ];

        if (
            contracts.length !== 0 &&
            contractsToAdd.every(({ address }) =>
                contracts.some((contract) =>
                    typeof contract === "string"
                        ? contract === address
                        : contract.address === address,
                ),
            )
        )
            return;

        setContracts(contractsToAdd);
    }, [
        contracts,
        xionAaBaseQuery.data,
        setContracts,
        xionAaBaseQuery.isSuccess,
    ]);
}