import { ExecuteResult, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { CamelCasedProperties, CamelCasedPropertiesDeep } from 'type-fest'


import { AccountId, AdapterBaseExecuteMsg, AdapterExecuteMsgFactory, ModuleExecuteMsgFactory, WithCosmWasmSignOptions } from '@abstract-money/core'
import { useAbstractModuleClient, useAccountAddress, useSigningCosmWasmClient } from '@abstract-money/react'
import { GAME_HANDLER_MODULE_ID } from '../_generated/generated-abstract'
import { GameHandlerAppClient } from '../_generated/generated-abstract/cosmwasm-codegen/GameHandler.client'
import { useMemo } from 'react'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { Coin, StdFee } from '@keplr-wallet/types'

export type AuthorizeAddressArguments = CamelCasedPropertiesDeep<
    Pick<
        AdapterBaseExecuteMsg,
        'update_authorized_addresses'
    >
>

export type AuthorizeAddressParameters = WithCosmWasmSignOptions<
    {
        signingCosmWasmClient: SigningCosmWasmClient
        sender: string,
        adapterAddress: string,
        accountAddress: string,
    } & AuthorizeAddressArguments
>

export async function authorizeAddress({
    signingCosmWasmClient,
    sender,
    adapterAddress,
    accountAddress,
    fee,
    memo,
    funds,
    updateAuthorizedAddresses
}: AuthorizeAddressParameters) {
    const chainId = await signingCosmWasmClient.getChainId()


    const adapterMsg = {
        base: {
            account_address: accountAddress,
            msg: {
                update_authorized_addresses: {
                    to_add: updateAuthorizedAddresses.toAdd,
                    to_remove: updateAuthorizedAddresses.toRemove || []
                }
            }
        }
    }
    // AdapterExecuteMsgFactory is faulty, using Module base instead
    // const adapterMsg = AdapterExecuteMsgFactory.updateAuthorizedAddresses({ ...updateAuthorizedAddresses })

    const result = await signingCosmWasmClient.execute(
        sender,
        adapterAddress,
        adapterMsg,
        fee,
        memo,
        funds,
    )

    return result
}

export type UseAuthorizeAddressParams = {
    accountId: AccountId | undefined
    moduleId: string
}

export interface AuthorizeAddressMutation {
    client: GameHandlerAppClient;
    msg: {
        toAdd: string[] | null,
        toRemove: string[] | null
    };
    args?: {
        fee?: number | StdFee | "auto";
        memo?: string;
        funds?: Coin[];
    };
}

export function useAuthorizeAddressMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AuthorizeAddressMutation>, "mutationFn">) {

    return useMutation<ExecuteResult, Error, AuthorizeAddressMutation>(async ({
        client,
        msg,
        args: {
            fee,
            memo,
            funds
        } = {}
    }) => {
        const signingCosmWasmClient = client.accountWalletClient.getSigningCosmWasmClient();
        const accountAddress = await client.accountPublicClient.getAccountAddress();
        return authorizeAddress({
            signingCosmWasmClient,
            updateAuthorizedAddresses: msg,
            sender: client.accountWalletClient.getSenderAddress(),
            fee: fee ?? "auto", accountAddress,
            adapterAddress: await client.getAddress()
        })
    })
}


export function useAuthorizeAddress({ moduleId, accountId }: UseAuthorizeAddressParams,
    options?: Omit<
        UseMutationOptions<
            ExecuteResult,
            Error,
            Omit<AuthorizeAddressMutation, 'client'>
        >,
        'mutationFn'
    >,) {


    const {
        data: gameHandlerAppClient,
    } = useAbstractModuleClient({
        moduleId,
        accountId,
        chainName: accountId?.chainName,

        Module: GameHandlerAppClient, // This is generic over adapters, works for all of the. TODO replace this client by a default adapter client
    })


    const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
    } = useAuthorizeAddressMutation(options)

    const mutate = useMemo(() => {
        if (!gameHandlerAppClient) return undefined

        return (
            variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
            options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: gameHandlerAppClient, ...variables }, options)
    }, [mutate_, gameHandlerAppClient])

    const mutateAsync = useMemo(() => {
        if (!gameHandlerAppClient) return undefined

        return (
            variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
            options?: Parameters<typeof mutateAsync_>[1],
        ) =>
            mutateAsync_({ client: gameHandlerAppClient, ...variables }, options)
    }, [mutateAsync_, gameHandlerAppClient])

    return { mutate, mutateAsync, ...rest } as const
}