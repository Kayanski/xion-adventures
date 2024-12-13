import { AccountId, AccountPublicClient, AdapterAuthorizedAddressesResponse, AdapterQueryMsgBuilder } from "@abstract-money/core";
import { useAbstractModuleQueryClient, useAccountAddress, useConfig, useCosmWasmClient } from "@abstract-money/react";
import { GameHandlerAppQueryClient } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.client";
import { useCallback } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { gameHandlerQueryKeys, GameHandlerReactQuery } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.react-query";
import { CosmWasmClient } from "@abstract-money/cli/cosmjs";
import { useAdapterAddress } from "./useAdapterAddress";


export function authorizedAddressQueryKey(moduleId: string | undefined, moduleAddress: string | undefined, args?: Record<string, unknown>) {
    return ([{
        moduleId,
        method: "authorized_addresses",
        moduleAddress,
        args
    }] as const)
}

export interface AdapterAuthorizedAddressesQuery<TData> {

    client: AccountPublicClient | undefined,
    moduleId: string | undefined,
    accountId: AccountId | undefined,
    args: undefined | {
        accountAddress: string
    },
    options?: Omit<UseQueryOptions<TData, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
        initialData?: undefined;
    }
}
export function useAdapterAuthorizedAddressesQuery({
    client,
    accountId,
    moduleId,
    args,
    options,
}: AdapterAuthorizedAddressesQuery<AdapterAuthorizedAddressesResponse>) {

    const { data: moduleAddress } = useAdapterAddress({ accountId, moduleId });

    let { data: cosmWasmClient } = useCosmWasmClient({
        chainName: accountId?.chainName,
    });


    return useQuery<AdapterAuthorizedAddressesResponse, Error, AdapterAuthorizedAddressesResponse>(authorizedAddressQueryKey(moduleId, moduleAddress ?? undefined, args), async () => {
        if (!client || !args || !cosmWasmClient) {
            return Promise.reject(new Error("Invalid client"))
        }
        let queryMsg = AdapterQueryMsgBuilder.authorizedAddresses(args.accountAddress);

        let queryResult = await cosmWasmClient.queryContractSmart(moduleAddress!, queryMsg)

        return queryResult as unknown as AdapterAuthorizedAddressesResponse;
    }, {
        ...options,
        enabled: !!client && !!args && !!cosmWasmClient && !!moduleAddress && (options?.enabled != undefined ? options.enabled : true)
    });
}

export type UseAdapterAuthorizedAddressesParams = {
    accountId: AccountId | undefined
    moduleId: string
}

export function useAdapterAuthorizedAddresses({ accountId, moduleId }: UseAdapterAuthorizedAddressesParams) {

    let { data: accountAddress } = useAccountAddress({ accountId, chainName: accountId?.chainName });

    const { useAccountPublicClient } = useConfig()
    const accountPublicClient = useAccountPublicClient({
        accountId,
        chainName: accountId?.chainName,
    })

    return useAdapterAuthorizedAddressesQuery({
        args: accountAddress ? {
            accountAddress
        } : undefined,
        moduleId,
        accountId,
        client: accountPublicClient,
    })

}