'use client'

import { ExecuteResult } from '@abstract-money/cli/cosmjs'
import { UseMutationOptions } from '@tanstack/react-query'
import { useMemo } from 'react'

import {
  useAbstractModuleClient,
  useAbstractModuleQueryClient,
} from '@abstract-money/react'

import { AccountId } from '@abstract-money/core'

import {
  useGameHandlerMovePlayerMutation,
  GameHandlerMovePlayerMutation,
  useGameHandlerCreateAccountMutation,
  GameHandlerCreateAccountMutation,
  useGameHandlerConfigQuery,
} from './cosmwasm-codegen/GameHandler.react-query'

import * as GameHandlerTypes from './cosmwasm-codegen/GameHandler.types'

import {
  GameHandlerAppQueryClient,
  GameHandlerAppClient,
} from './cosmwasm-codegen/GameHandler.client'

import {
  useXionAdventuresHubModifyMetadataMutation,
  XionAdventuresHubModifyMetadataMutation,
  useXionAdventuresHubMintMutation,
  XionAdventuresHubMintMutation,
  useXionAdventuresHubIbcTransferMutation,
  XionAdventuresHubIbcTransferMutation,
  useXionAdventuresHubNextTokenIdQuery,
  useXionAdventuresHubConfigQuery,
} from './cosmwasm-codegen/XionAdventuresHub.react-query'

import * as XionAdventuresHubTypes from './cosmwasm-codegen/XionAdventuresHub.types'

import {
  XionAdventuresHubAppQueryClient,
  XionAdventuresHubAppClient,
} from './cosmwasm-codegen/XionAdventuresHub.client'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameHandler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// XionAdventuresHub
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const GAME_HANDLER_MODULE_ID = 'xion-adventures:game-handler'

export const gameHandler = {
  queries: {
    useConfig: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useGameHandlerConfigQuery<GameHandlerTypes.ConfigResponse>
      >[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: gameHandlerAppQueryClient } = useAbstractModuleQueryClient({
        moduleId: GAME_HANDLER_MODULE_ID,
        ...rest,
        Module: GameHandlerAppQueryClient,
        query: { enabled: options?.enabled },
      })

      return useGameHandlerConfigQuery({
        client: gameHandlerAppQueryClient,
        options,
      })
    },
  },
  mutations: {
    useMovePlayer: (
      {
        accountId,
        chainName,
        sender,
      }: {
        accountId: AccountId | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<GameHandlerMovePlayerMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: gameHandlerAppClient,
        // TODO: figure out what to do with those
        // isLoading: isGameHandlerAppClientLoading,
        // isError: isGameHandlerAppClientError,
        // error: gameHandlerAppClientError,
      } = useAbstractModuleClient({
        moduleId: GAME_HANDLER_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: GameHandlerAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useGameHandlerMovePlayerMutation(options)

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
    },
    useCreateAccount: (
      {
        accountId,
        chainName,
        sender,
      }: {
        accountId: AccountId | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<GameHandlerCreateAccountMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: gameHandlerAppClient,
        // TODO: figure out what to do with those
        // isLoading: isGameHandlerAppClientLoading,
        // isError: isGameHandlerAppClientError,
        // error: gameHandlerAppClientError,
      } = useAbstractModuleClient({
        moduleId: GAME_HANDLER_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: GameHandlerAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useGameHandlerCreateAccountMutation(options)

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
    },
  },
}

export const XION_ADVENTURES_HUB_MODULE_ID =
  'xion-adventures:xion-adventures-hub'

export const xionAdventuresHub = {
  queries: {
    useNextTokenId: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useXionAdventuresHubNextTokenIdQuery<XionAdventuresHubTypes.NextTokenIdResponse>
      >[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: xionAdventuresHubAppQueryClient } =
        useAbstractModuleQueryClient({
          moduleId: XION_ADVENTURES_HUB_MODULE_ID,
          ...rest,
          Module: XionAdventuresHubAppQueryClient,
          query: { enabled: options?.enabled },
        })

      return useXionAdventuresHubNextTokenIdQuery({
        client: xionAdventuresHubAppQueryClient,
        options,
      })
    },
    useConfig: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useXionAdventuresHubConfigQuery<XionAdventuresHubTypes.ConfigResponse>
      >[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: xionAdventuresHubAppQueryClient } =
        useAbstractModuleQueryClient({
          moduleId: XION_ADVENTURES_HUB_MODULE_ID,
          ...rest,
          Module: XionAdventuresHubAppQueryClient,
          query: { enabled: options?.enabled },
        })

      return useXionAdventuresHubConfigQuery({
        client: xionAdventuresHubAppQueryClient,
        options,
      })
    },
  },
  mutations: {
    useModifyMetadata: (
      {
        accountId,
        chainName,
        sender,
      }: {
        accountId: AccountId | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<XionAdventuresHubModifyMetadataMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: xionAdventuresHubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isXionAdventuresHubAppClientLoading,
        // isError: isXionAdventuresHubAppClientError,
        // error: xionAdventuresHubAppClientError,
      } = useAbstractModuleClient({
        moduleId: XION_ADVENTURES_HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: XionAdventuresHubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useXionAdventuresHubModifyMetadataMutation(options)

      const mutate = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) =>
          mutate_({ client: xionAdventuresHubAppClient, ...variables }, options)
      }, [mutate_, xionAdventuresHubAppClient])

      const mutateAsync = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) =>
          mutateAsync_(
            { client: xionAdventuresHubAppClient, ...variables },
            options,
          )
      }, [mutateAsync_, xionAdventuresHubAppClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useMint: (
      {
        accountId,
        chainName,
        sender,
      }: {
        accountId: AccountId | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<XionAdventuresHubMintMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: xionAdventuresHubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isXionAdventuresHubAppClientLoading,
        // isError: isXionAdventuresHubAppClientError,
        // error: xionAdventuresHubAppClientError,
      } = useAbstractModuleClient({
        moduleId: XION_ADVENTURES_HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: XionAdventuresHubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useXionAdventuresHubMintMutation(options)

      const mutate = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) =>
          mutate_({ client: xionAdventuresHubAppClient, ...variables }, options)
      }, [mutate_, xionAdventuresHubAppClient])

      const mutateAsync = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) =>
          mutateAsync_(
            { client: xionAdventuresHubAppClient, ...variables },
            options,
          )
      }, [mutateAsync_, xionAdventuresHubAppClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useIbcTransfer: (
      {
        accountId,
        chainName,
        sender,
      }: {
        accountId: AccountId | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<XionAdventuresHubIbcTransferMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: xionAdventuresHubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isXionAdventuresHubAppClientLoading,
        // isError: isXionAdventuresHubAppClientError,
        // error: xionAdventuresHubAppClientError,
      } = useAbstractModuleClient({
        moduleId: XION_ADVENTURES_HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: XionAdventuresHubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useXionAdventuresHubIbcTransferMutation(options)

      const mutate = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) =>
          mutate_({ client: xionAdventuresHubAppClient, ...variables }, options)
      }, [mutate_, xionAdventuresHubAppClient])

      const mutateAsync = useMemo(() => {
        if (!xionAdventuresHubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) =>
          mutateAsync_(
            { client: xionAdventuresHubAppClient, ...variables },
            options,
          )
      }, [mutateAsync_, xionAdventuresHubAppClient])

      return { mutate, mutateAsync, ...rest } as const
    },
  },
}
