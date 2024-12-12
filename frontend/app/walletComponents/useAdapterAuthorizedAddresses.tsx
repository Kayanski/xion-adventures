import { AccountId, AdapterAuthorizedAddressesResponse, AdapterQueryMsgBuilder } from "@abstract-money/core";
import { useAbstractModuleQueryClient, useAccountAddress, useCosmWasmClient } from "@abstract-money/react";
import { GameHandlerAppQueryClient } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.client";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameHandlerQueryKeys, GameHandlerReactQuery } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.react-query";
import { CosmWasmClient } from "@abstract-money/cli/cosmjs";


export function authorizedAddressQueryKey(moduleId: string | undefined, moduleAddress: string | undefined, args?: Record<string, unknown>) {
    return ([{
        moduleId,
        method: "authorized_addresses",
        moduleAddress,
        args
    }] as const)
}

export interface AdapterAuthorizedAddressesQuery<TData> extends GameHandlerReactQuery<AdapterAuthorizedAddressesResponse, TData> {
    args: undefined | {
        accountAddress: string
    },
    cosmWasmClient: undefined | CosmWasmClient
}
export function useAdapterAuthorizedAddressesQuery<TData = AdapterAuthorizedAddressesResponse>({
    client,
    args,
    options,
    cosmWasmClient
}: AdapterAuthorizedAddressesQuery<TData>) {


    return useQuery<AdapterAuthorizedAddressesResponse, Error, TData>(authorizedAddressQueryKey(client?.moduleId, client?._moduleAddress, args), async () => {
        if (!client || !args || !cosmWasmClient) {
            return Promise.reject(new Error("Invalid client"))
        }
        let queryMsg = AdapterQueryMsgBuilder.authorizedAddresses(args.accountAddress);

        let moduleAddress = await client.getAddress();
        let queryResult = await cosmWasmClient.queryContractSmart(moduleAddress, queryMsg)

        return queryResult as unknown as AdapterAuthorizedAddressesResponse;
    }, {
        ...options,
        enabled: !!client && !!args && !!cosmWasmClient && (options?.enabled != undefined ? options.enabled : true)
    });
}

export type UseAdapterAuthorizedAddressesParams = {
    accountId: AccountId | undefined
    moduleId: string
}

export function useAdapterAuthorizedAddresses({ accountId, moduleId }: UseAdapterAuthorizedAddressesParams) {

    let { data: accountAddress } = useAccountAddress({ accountId, chainName: accountId?.chainName });
    const { data: adapterQueryClient } = useAbstractModuleQueryClient({
        moduleId: moduleId,
        accountId,
        chainName: accountId?.chainName,
        Module: GameHandlerAppQueryClient, // Here we use the gameHandler Client, but we should get a default adapter client
        query: { enabled: !!accountAddress },
    })

    let { data: cosmWasmClient } = useCosmWasmClient({
        chainName: accountId?.chainName,
    });

    return useAdapterAuthorizedAddressesQuery({
        args: accountAddress ? {
            accountAddress
        } : undefined,
        client: adapterQueryClient,
        cosmWasmClient
    })

}