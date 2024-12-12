'use client'

import { ExecuteResult } from '@abstract-money/cli/cosmjs'
import { UseMutationOptions } from '@tanstack/react-query'
import { useMemo } from 'react'

import {
  useAbstractModuleClient,
  useAbstractModuleQueryClient,
  useModuleClient,
  useModuleQueryClient,
} from '@abstract-money/react'

import { AccountId } from '@abstract-money/core'

import {
  useCw721BaseUpdateOwnershipMutation,
  Cw721BaseUpdateOwnershipMutation,
  useCw721BaseWithdrawFundsMutation,
  Cw721BaseWithdrawFundsMutation,
  useCw721BaseRemoveWithdrawAddressMutation,
  Cw721BaseRemoveWithdrawAddressMutation,
  useCw721BaseSetWithdrawAddressMutation,
  Cw721BaseSetWithdrawAddressMutation,
  useCw721BaseExtensionMutation,
  Cw721BaseExtensionMutation,
  useCw721BaseBurnMutation,
  Cw721BaseBurnMutation,
  useCw721BaseMintMutation,
  Cw721BaseMintMutation,
  useCw721BaseRevokeAllMutation,
  Cw721BaseRevokeAllMutation,
  useCw721BaseApproveAllMutation,
  Cw721BaseApproveAllMutation,
  useCw721BaseRevokeMutation,
  Cw721BaseRevokeMutation,
  useCw721BaseApproveMutation,
  Cw721BaseApproveMutation,
  useCw721BaseSendNftMutation,
  Cw721BaseSendNftMutation,
  useCw721BaseTransferNftMutation,
  Cw721BaseTransferNftMutation,
  useCw721BaseOwnershipQuery,
  useCw721BaseGetWithdrawAddressQuery,
  useCw721BaseExtensionQuery,
  useCw721BaseMinterQuery,
  useCw721BaseAllTokensQuery,
  useCw721BaseTokensQuery,
  useCw721BaseAllNftInfoQuery,
  useCw721BaseNftInfoQuery,
  useCw721BaseContractInfoQuery,
  useCw721BaseNumTokensQuery,
  useCw721BaseAllOperatorsQuery,
  useCw721BaseOperatorQuery,
  useCw721BaseApprovalsQuery,
  useCw721BaseApprovalQuery,
  useCw721BaseOwnerOfQuery,
} from './cosmwasm-codegen/Cw721Base.react-query'

import {
  Cw721BaseQueryClient,
  Cw721BaseClient,
} from './cosmwasm-codegen/Cw721Base.client'

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
  useHubModifyMetadataMutation,
  HubModifyMetadataMutation,
  useHubMintMutation,
  HubMintMutation,
  useHubIbcTransferMutation,
  HubIbcTransferMutation,
  useHubPlayerMetadataQuery,
  useHubMapQuery,
  useHubNextTokenIdQuery,
  useHubConfigQuery,
} from './cosmwasm-codegen/Hub.react-query'

import * as HubTypes from './cosmwasm-codegen/Hub.types'

import { HubAppQueryClient, HubAppClient } from './cosmwasm-codegen/Hub.client'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cw721Base
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameHandler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hub
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cw721Base = {
  queries: {
    useOwnership: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseOwnershipQuery<Cw721BaseTypes.OwnershipForString>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseOwnershipQuery({
        client: cw721BaseQueryClient,
        options,
      })
    },
    useGetWithdrawAddress: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseGetWithdrawAddressQuery<Cw721BaseTypes.NullableString>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseGetWithdrawAddressQuery({
        client: cw721BaseQueryClient,
        options,
      })
    },
    useExtension: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<typeof useCw721BaseExtensionQuery<Cw721BaseTypes.Null>>[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseExtensionQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useMinter: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseMinterQuery<Cw721BaseTypes.MinterResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseMinterQuery({
        client: cw721BaseQueryClient,
        options,
      })
    },
    useAllTokens: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseAllTokensQuery<Cw721BaseTypes.TokensResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseAllTokensQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useTokens: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseTokensQuery<Cw721BaseTypes.TokensResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseTokensQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useAllNftInfo: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseAllNftInfoQuery<Cw721BaseTypes.AllNftInfoResponseForEmpty>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseAllNftInfoQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useNftInfo: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseNftInfoQuery<Cw721BaseTypes.NftInfoResponseForEmpty>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseNftInfoQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useContractInfo: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseContractInfoQuery<Cw721BaseTypes.ContractInfoResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseContractInfoQuery({
        client: cw721BaseQueryClient,
        options,
      })
    },
    useNumTokens: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseNumTokensQuery<Cw721BaseTypes.NumTokensResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseNumTokensQuery({
        client: cw721BaseQueryClient,
        options,
      })
    },
    useAllOperators: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseAllOperatorsQuery<Cw721BaseTypes.OperatorsResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseAllOperatorsQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useOperator: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseOperatorQuery<Cw721BaseTypes.OperatorResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseOperatorQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useApprovals: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseApprovalsQuery<Cw721BaseTypes.ApprovalsResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseApprovalsQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useApproval: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseApprovalQuery<Cw721BaseTypes.ApprovalResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseApprovalQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
    useOwnerOf: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useCw721BaseOwnerOfQuery<Cw721BaseTypes.OwnerOfResponse>
      >[0],
      'client'
    > & {
      contractAddress: string | undefined
      chainName: string | undefined
    }) => {
      const { data: cw721BaseQueryClient } = useModuleQueryClient({
        ...rest,
        Module: Cw721BaseQueryClient,
      })

      return useCw721BaseOwnerOfQuery({
        client: cw721BaseQueryClient,
        options,
        args,
      })
    },
  },
  mutations: {
    useUpdateOwnership: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseUpdateOwnershipMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseUpdateOwnershipMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useWithdrawFunds: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseWithdrawFundsMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseWithdrawFundsMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useRemoveWithdrawAddress: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseRemoveWithdrawAddressMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseRemoveWithdrawAddressMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useSetWithdrawAddress: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseSetWithdrawAddressMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseSetWithdrawAddressMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useExtension: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseExtensionMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseExtensionMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useBurn: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseBurnMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseBurnMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useMint: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseMintMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseMintMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useRevokeAll: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseRevokeAllMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseRevokeAllMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useApproveAll: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseApproveAllMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseApproveAllMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useRevoke: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseRevokeMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseRevokeMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useApprove: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseApproveMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseApproveMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useSendNft: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseSendNftMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseSendNftMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
    useTransferNft: (
      {
        contractAddress,
        chainName,
        sender,
      }: {
        contractAddress: string | undefined
        chainName: string | undefined
        sender?: string | undefined
      },
      options?: Omit<
        UseMutationOptions<
          ExecuteResult,
          Error,
          Omit<Cw721BaseTransferNftMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: cw721BaseClient,
        // TODO: figure out what to do with those
        // isLoading: isCw721BaseClientLoading,
        // isError: isCw721BaseClientError,
        // error: cw721BaseClientError,
      } = useModuleClient({
        contractAddress,
        chainName,
        Module: Cw721BaseClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useCw721BaseTransferNftMutation(options)

      const mutate = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: cw721BaseClient, ...variables }, options)
      }, [mutate_, cw721BaseClient])

      const mutateAsync = useMemo(() => {
        if (!cw721BaseClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: cw721BaseClient, ...variables }, options)
      }, [mutateAsync_, cw721BaseClient])

      return { mutate, mutateAsync, ...rest } as const
    },
  },
}

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

export const HUB_MODULE_ID = 'xion-adventures:hub'

export const hub = {
  queries: {
    usePlayerMetadata: ({
      options,
      args,
      ...rest
    }: Omit<
      Parameters<
        typeof useHubPlayerMetadataQuery<HubTypes.XionAdventuresExtension>
      >[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: hubAppQueryClient } = useAbstractModuleQueryClient({
        moduleId: HUB_MODULE_ID,
        ...rest,
        Module: HubAppQueryClient,
        query: { enabled: options?.enabled },
      })

      return useHubPlayerMetadataQuery({
        client: hubAppQueryClient,
        options,
        args,
      })
    },
    useMap: ({
      options,
      ...rest
    }: Omit<
      Parameters<typeof useHubMapQuery<HubTypes.MapResponse>>[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: hubAppQueryClient } = useAbstractModuleQueryClient({
        moduleId: HUB_MODULE_ID,
        ...rest,
        Module: HubAppQueryClient,
        query: { enabled: options?.enabled },
      })

      return useHubMapQuery({
        client: hubAppQueryClient,
        options,
      })
    },
    useNextTokenId: ({
      options,
      ...rest
    }: Omit<
      Parameters<
        typeof useHubNextTokenIdQuery<HubTypes.NextTokenIdResponse>
      >[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: hubAppQueryClient } = useAbstractModuleQueryClient({
        moduleId: HUB_MODULE_ID,
        ...rest,
        Module: HubAppQueryClient,
        query: { enabled: options?.enabled },
      })

      return useHubNextTokenIdQuery({
        client: hubAppQueryClient,
        options,
      })
    },
    useConfig: ({
      options,
      ...rest
    }: Omit<
      Parameters<typeof useHubConfigQuery<HubTypes.ConfigResponse>>[0],
      'client'
    > & {
      accountId: AccountId | undefined
      chainName: string | undefined
    }) => {
      const { data: hubAppQueryClient } = useAbstractModuleQueryClient({
        moduleId: HUB_MODULE_ID,
        ...rest,
        Module: HubAppQueryClient,
        query: { enabled: options?.enabled },
      })

      return useHubConfigQuery({
        client: hubAppQueryClient,
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
          Omit<HubModifyMetadataMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: hubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isHubAppClientLoading,
        // isError: isHubAppClientError,
        // error: hubAppClientError,
      } = useAbstractModuleClient({
        moduleId: HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: HubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useHubModifyMetadataMutation(options)

      const mutate = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: hubAppClient, ...variables }, options)
      }, [mutate_, hubAppClient])

      const mutateAsync = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: hubAppClient, ...variables }, options)
      }, [mutateAsync_, hubAppClient])

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
          Omit<HubMintMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: hubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isHubAppClientLoading,
        // isError: isHubAppClientError,
        // error: hubAppClientError,
      } = useAbstractModuleClient({
        moduleId: HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: HubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useHubMintMutation(options)

      const mutate = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: hubAppClient, ...variables }, options)
      }, [mutate_, hubAppClient])

      const mutateAsync = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: hubAppClient, ...variables }, options)
      }, [mutateAsync_, hubAppClient])

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
          Omit<HubIbcTransferMutation, 'client'>
        >,
        'mutationFn'
      >,
    ) => {
      const {
        data: hubAppClient,
        // TODO: figure out what to do with those
        // isLoading: isHubAppClientLoading,
        // isError: isHubAppClientError,
        // error: hubAppClientError,
      } = useAbstractModuleClient({
        moduleId: HUB_MODULE_ID,
        accountId,
        chainName,
        sender,

        Module: HubAppClient,
      })

      const {
        mutate: mutate_,
        mutateAsync: mutateAsync_,
        ...rest
      } = useHubIbcTransferMutation(options)

      const mutate = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutate_>[0], 'client'>,
          options?: Parameters<typeof mutate_>[1],
        ) => mutate_({ client: hubAppClient, ...variables }, options)
      }, [mutate_, hubAppClient])

      const mutateAsync = useMemo(() => {
        if (!hubAppClient) return undefined

        return (
          variables: Omit<Parameters<typeof mutateAsync_>[0], 'client'>,
          options?: Parameters<typeof mutateAsync_>[1],
        ) => mutateAsync_({ client: hubAppClient, ...variables }, options)
      }, [mutateAsync_, hubAppClient])

      return { mutate, mutateAsync, ...rest } as const
    },
  },
}
