import { ExecuteResult, MsgExecuteContractEncodeObject, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { CamelCasedProperties, CamelCasedPropertiesDeep } from 'type-fest'


import { AccountId, AdapterBaseExecuteMsg, AdapterExecuteMsg, AdapterExecuteMsgFactory, jsonToUtf8, ModuleExecuteMsgFactory, WithCosmWasmSignOptions } from '@abstract-money/core'
import { useAbstractModuleClient, useAccountAddress, useSigningCosmWasmClient } from '@abstract-money/react'
import { GAME_HANDLER_MODULE_ID } from '../_generated/generated-abstract'
import { GameHandlerAppClient } from '../_generated/generated-abstract/cosmwasm-codegen/GameHandler.client'
import { useMemo } from 'react'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { Coin, StdFee } from '@keplr-wallet/types'
import { ExecuteMsg } from '../_generated/generated-abstract/cosmwasm-codegen/GameHandler.types'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { GameHandlerMovePlayerMutation } from '../_generated/generated-abstract/cosmwasm-codegen/GameHandler.react-query'
import { useAbstraxionSigningClient } from '@burnt-labs/abstraxion'
import { GranteeSignerClient } from '@burnt-labs/abstraxion-core'
import { TREASURY } from './constants'

export type MovePlayerSimulateParameters = WithCosmWasmSignOptions<
    {
        signingCosmWasmClient: GranteeSignerClient,
        sender: string,
        gameHandlerAddress: string,
        accountAddress: string,
    } & GameHandlerMovePlayerMutation["msg"]
>

export async function movePlayerSimulation({
    signingCosmWasmClient,
    sender,
    gameHandlerAddress,
    accountAddress,
    memo,
    funds,
    positions,
    tokenId
}: MovePlayerSimulateParameters) {
    const chainId = await signingCosmWasmClient.getChainId()

    const moduleMsg: AdapterExecuteMsg<ExecuteMsg> = AdapterExecuteMsgFactory.executeAdapter({
        request: {
            move_player: {
                positions,
                token_id: tokenId
            }
        },
        accountAddress
    });
    const message: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender: sender,
            contract: gameHandlerAddress,
            msg: jsonToUtf8(moduleMsg),
            funds,
        })
    }
    return await signingCosmWasmClient.simulate(sender, [message], memo, TREASURY)
}

export type MovePlayerSimulationParams = {
    accountId: AccountId | undefined
}


export function useAuthorizeAddressMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, GameHandlerMovePlayerMutation>, "mutationFn">) {

    const { client: xionSigningClient } = useAbstraxionSigningClient();

    return useMutation<number, Error, GameHandlerMovePlayerMutation>(async ({
        client,
        msg,
        args: {
            fee,
            memo,
            funds
        } = {}
    }) => {
        const accountAddress = await client.accountPublicClient.getAccountAddress();
        if (!xionSigningClient) {
            console.error("No xion client available")
            throw "No xion client available"
        }
        return movePlayerSimulation({
            signingCosmWasmClient: xionSigningClient,
            positions: msg.positions,
            tokenId: msg.tokenId,
            sender: client.accountWalletClient.getSenderAddress(),
            fee: fee ?? "auto", accountAddress,
            gameHandlerAddress: await client.getAddress()
        })
    })
}


export function useSimulateMovePlayer({ accountId }: MovePlayerSimulationParams,
    options?: Omit<
        UseMutationOptions<
            ExecuteResult,
            Error,
            Omit<GameHandlerMovePlayerMutation, 'client'>
        >,
        'mutationFn'
    >,) {


    const {
        data: gameHandlerAppClient,
    } = useAbstractModuleClient({
        moduleId: GAME_HANDLER_MODULE_ID,
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