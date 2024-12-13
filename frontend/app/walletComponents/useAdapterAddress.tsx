import { AccountId, AccountPublicClient } from "@abstract-money/core";
import { useConfig } from "@abstract-money/react";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface AdapterAddressQuery<TData> {
    client: AccountPublicClient | undefined,
    moduleId: string | undefined,
    accountId: AccountId | undefined,
    options?: Omit<UseQueryOptions<TData, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
        initialData?: undefined;
    };
}

export function useAdapterAddressQuery({
    client,
    moduleId,
    accountId,
    options
}: AdapterAddressQuery<string | null>) {

    return useQuery<string | null, Error, string | null>(([{
        moduleId,
        accountId,
    }] as const), () => {
        if (!client) {
            return Promise.reject(new Error("Invalid client"))
        }

        return client.getModuleAddress({ id: moduleId! })
    }, {
        ...options,
        enabled: !!client && !!moduleId && (options?.enabled != undefined ? options.enabled : true)
    });
}

export type UseAdapterAddressParams = {
    accountId: AccountId | undefined,
    moduleId: string | undefined
}
export function useAdapterAddress({ accountId, moduleId }: UseAdapterAddressParams) {

    const { useAccountPublicClient } = useConfig()
    const accountPublicClient = useAccountPublicClient({
        accountId,
        chainName: accountId?.chainName,
    })

    return useAdapterAddressQuery({
        client: accountPublicClient,
        moduleId,
        accountId
    })

}
