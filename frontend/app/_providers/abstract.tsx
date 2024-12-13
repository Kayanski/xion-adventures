'use client'

import { grazProvider } from '@abstract-money/provider-graz'
import { xionProvider } from '@abstract-money/provider-xion'
import {
    AbstractProvider as Lib_AbstractProvider,
    createConfig,
} from '@abstract-money/react'
import {
    useAbstraxionAccount,
    useAbstraxionSigningClient,
} from '@burnt-labs/abstraxion'
import { FC, PropsWithChildren, useEffect, useMemo } from 'react'
import { ABSTRACT_API_URL } from '../_lib/constants'
import { useDevMode } from './dev-mod'
import { useAbstraxionProviderConfig } from '../walletComponents/xion/useAbstractxionProviderConfig'
import { useReauthenticate } from '../walletComponents/xion/useReauthenticate'
import { deepEqual } from '../_lib/deepEqual'


function Reauthenticator() {
    const { contracts, prevContracts } = useAbstraxionProviderConfig();
    const reauthenticate = useReauthenticate();
    useEffect(() => {
        if (contracts.length !== 0 && !deepEqual(contracts, prevContracts))
            reauthenticate?.();
    }, [contracts, reauthenticate, prevContracts]);
    return null;
}

/**
 * Provides the Abstract context to the application.
 * @param children
 * @constructor
 */
export const AbstractProvider: FC<PropsWithChildren> = ({ children }) => {
    const { devMode } = useDevMode();

    const grazXionProvider = {
        useCosmWasmClient: (args) => {
            return grazProvider.useCosmWasmClient(args)
        },
        useSigningCosmWasmClient: (args) => {
            //const grazSigningClient = grazProvider.useSigningCosmWasmClient(args)
            // TODO: why does this not work?
            // const xionSigningClient = xionProvider.useSigningCosmWasmClient(args)
            const { client: xionSigningClient } = useAbstraxionSigningClient()

            // return devMode ? grazSigningClient : xionSigningClient
            return xionSigningClient
        },
        useSenderAddress: (args) => {
            const grazSenderAddress = grazProvider.useSenderAddress(args)
            // TODO: why does this not work?
            // const xionSenderAddress = xionProvider.useSenderAddress(args)
            const xionSenderAddress = useAbstraxionAccount().data?.bech32Address

            return devMode ? grazSenderAddress : xionSenderAddress
        },
    } satisfies typeof xionProvider

    // Use the graz provider for the normal cosmwasm client retrievals

    const abstractConfig = createConfig({
        provider: grazXionProvider,
        apiUrl: process.env.NEXT_PUBLIC_ABSTRACT_API_URL || ABSTRACT_API_URL
    })

    return (
        <Lib_AbstractProvider config={abstractConfig}>
            <Reauthenticator />
            {children}
        </Lib_AbstractProvider>
    )
}