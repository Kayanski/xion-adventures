import { ExecuteResult, MsgExecuteContractEncodeObject, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { toHex, toUtf8 } from "@cosmjs/encoding";
import { CamelCasedProperties, CamelCasedPropertiesDeep } from 'type-fest'
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";


import { AccountId, accountIdToParameter, AdapterBaseExecuteMsg, AdapterExecuteMsgFactory, MergedModuleInstallConfig, ModuleExecuteMsgFactory, moduleInstallConfig, parseCreateAccountExecuteResult, WithCosmWasmSignOptions } from '@abstract-money/core'
import { useAbstractModuleClient, useAccountAddress, useSenderAddress, useSigningCosmWasmClient } from '@abstract-money/react'
import { useMemo } from 'react'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { Coin, StdFee } from '@keplr-wallet/types'
import { useXionAbstractAccountId } from './useXionSender'
import { AccountTrace } from '@/app/_generated/generated-abstract/cosmwasm-codegen/Hub.types'
import { randomBytes } from 'crypto'
import { ACCOUNT_FACTORY_ADDRESS, HOME_CHAIN_NAME } from '.'
import { FIXED_FEES, TREASURY } from '../constants';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { testnetChains } from 'graz/chains';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';


export type AuthorizeAddressArguments = {
    installModules: MergedModuleInstallConfig[]
}

export type AccountFactoryParameters = WithCosmWasmSignOptions<
    {
        signingCosmWasmClient: SigningCosmWasmClient
        sender: string, xionAaId: {
            seq: number;
            trace: AccountTrace;
        },
        accountFactoryAddress: string,
    } & AuthorizeAddressArguments
>

export async function accountFactory({
    signingCosmWasmClient,
    sender,
    accountFactoryAddress,
    fee,
    memo,
    funds, xionAaId,
    installModules
}: AccountFactoryParameters) {

    const chainId = await signingCosmWasmClient.getChainId()

    const account_factory_msg = {
        create_account: {
            account_id: accountIdToParameter(xionAaId),
            salt: randomBytes(32).toString("base64"),
            install_modules: installModules.map((m) => moduleInstallConfig(m)),
        }
    }
    // AdapterExecuteMsgFactory is faulty, using Module base instead
    // const adapterMsg = AdapterExecuteMsgFactory.updateAuthorizedAddresses({ ...updateAuthorizedAddresses })


    // We need fixed Fee for this because the account still doesn't exist on-chain and we can't use the simulate function
    const result = await signingCosmWasmClient.execute(
        sender,
        accountFactoryAddress,
        account_factory_msg,
        fee,
        memo,
        funds,
    )

    return parseCreateAccountExecuteResult(result, HOME_CHAIN_NAME)

}

export type UseAuthorizeAddressParams = {
    accountId: AccountId | undefined
    moduleId: string
}

export interface AuthorizeAddressMutation {
    msg: {
        installModules: MergedModuleInstallConfig[]
    };
    args?: {
        fee?: number | StdFee | "auto";
        memo?: string;
        funds?: Coin[];
    };
}

export function useAccountFactoryMutation(options?: Omit<UseMutationOptions<{ accountId: AccountId, accountAddress: string }, Error, AuthorizeAddressMutation>, "mutationFn">) {

    const { data: address } = useSenderAddress({})
    const { data: account } = useAbstraxionAccount();
    const { client: signingCosmWasmClient } = useAbstraxionSigningClient();



    const { data: xionAaId, isSuccess: xionAaSuccess } =
        useXionAbstractAccountId();

    return useMutation<{ accountId: AccountId, accountAddress: string }, Error, AuthorizeAddressMutation>(async ({
        msg,
        args: {
            fee,
            memo,
            funds,
        } = {}
    }) => {
        if (!signingCosmWasmClient) {
            throw 'Not ready to mutate, no client'
        }

        if (!address) {
            throw 'Not ready to mutate, no sender'
        }

        if (!xionAaId) {
            throw 'Not ready to mutate, no xion abstract account'
        }

        return accountFactory({
            signingCosmWasmClient,
            installModules: msg.installModules,
            sender: address,
            fee: fee ?? "auto",
            accountFactoryAddress: ACCOUNT_FACTORY_ADDRESS,
            xionAaId
        })
    })
}
