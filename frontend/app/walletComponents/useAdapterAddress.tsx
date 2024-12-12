import { AccountId, AdapterAuthorizedAddressesResponse, AdapterQueryMsgBuilder } from "@abstract-money/core";
import { useAbstractModuleQueryClient, useAccountAddress, useCosmWasmClient } from "@abstract-money/react";
import { GameHandlerAppQueryClient } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.client";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameHandlerQueryKeys, GameHandlerReactQuery } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.react-query";
import { CosmWasmClient } from "@abstract-money/cli/cosmjs";

export interface AdapterAddressQuery<TData> extends GameHandlerReactQuery<string, TData> {

}

export function useAdapterAddressQuery<TData = string>({
    client,
    options
}: AdapterAddressQuery<TData>) {


    return useQuery<string, Error, TData>(gameHandlerQueryKeys.address(client?._moduleAddress), () => {
        if (!client) {
            return Promise.reject(new Error("Invalid client"))
        }

        return client.getAddress();
    }, {
        ...options,
        enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
    });
}

export type UseAdapterAddressParams = {
    accountId: AccountId | undefined,
    moduleId: string | undefined
}
export function useAdapterAddress({ accountId, moduleId }: UseAdapterAddressParams) {

    const { data: adapterQueryClient } = useAbstractModuleQueryClient({
        moduleId: moduleId!,
        accountId,
        chainName: accountId?.chainName,
        Module: GameHandlerAppQueryClient, // Here we use the gameHandler Client, but we should get a default adapter client
        query: { enabled: !!moduleId },
    })

    return useAdapterAddressQuery({
        client: adapterQueryClient,
    })

}
