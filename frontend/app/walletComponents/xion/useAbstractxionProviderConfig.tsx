import type { ContractGrantDescription } from "@burnt-labs/abstraxion";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAbstraxionProviderConfig = create(
    persist<{
        contracts: ContractGrantDescription[];
        prevContracts: ContractGrantDescription[];
        setContracts: (contracts: ContractGrantDescription[]) => void;
    }>(
        (set, get) => ({
            prevContracts: [],
            contracts: [],
            setContracts: (contracts) =>
                set({ contracts, prevContracts: get().contracts }),
        }),
        { name: "contracts" },
    ),
);