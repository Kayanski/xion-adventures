import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { RpcClient } from "cosmes/client";
import {
    CosmosAuthzV1beta1QueryGranterGrantsResponse,
    CosmosAuthzV1beta1QueryGranterGrantsService,
} from "cosmes/protobufs";
import { type AccountId } from "@abstract-money/core";
import { Account, QueryClient, setupAuthExtension } from "@cosmjs/stargate";
import { customAccountFromAny } from "@burnt-labs/signers";
import { Comet38Client } from "@cosmjs/tendermint-rpc";
import { useCallback, useEffect } from "react";
import { useMetaAccountState } from "./useMetaAccountState";
import { HOME_CHAIN_NAME, HOME_CHAIN_RPC } from ".";

export const useXionGrants = <
    TData = CosmosAuthzV1beta1QueryGranterGrantsResponse,
>(
    options: Omit<
        UseQueryOptions<
            CosmosAuthzV1beta1QueryGranterGrantsResponse,
            Error,
            TData,
            [string, string]
        >,
        "queryFn" | "queryKey"
    >,
) => {
    const { data: abs } = useAbstraxionAccount();

    return useQuery({
        queryKey: ["xionGrants", abs.bech32Address],
        queryFn: async () => {
            return await RpcClient.query(
                HOME_CHAIN_RPC,
                CosmosAuthzV1beta1QueryGranterGrantsService,
                {
                    granter: abs.bech32Address,
                },
            );
        },
        enabled: !!abs.bech32Address.length,
        ...options,
    });
};

export const useXionSender = () => {
    return useXionGrants({
        select: ({ grants }) => (grants.length ? grants[0].grantee : null),
        onSuccess: (data) => {
            console.log("xion temp sender", data);
        },
    });
};

const ABSTR_ACC_MIN = 2147483648;

export const xionToAbstractAccountSeq = (accNumber: number) => {
    return ABSTR_ACC_MIN + accNumber;
};

/**
 * Retrieve the xion abstract account id to use. Does not guarantee its existence.
 */
export const useXionAbstractAccountId = () => {
    const { data: xionAcc } = useAbstraxionAccount();

    const [metaState, setMetaState] = useMetaAccountState();

    const query = useQuery({
        queryKey: ["xionAccountNumber", xionAcc.bech32Address],
        queryFn: async ({ queryKey: [_, address] }: { queryKey: string[] }) => {
            if (metaState?.xionAccountId) return metaState.xionAccountId;

            if (!address.length) {
                throw new Error("No address!");
            }

            // Only works for signing client :(
            // const client = await AAClient.connect(HOME_CHAIN_RPC)
            const comet = await Comet38Client.connect(HOME_CHAIN_RPC);
            const qc = QueryClient.withExtensions(comet, setupAuthExtension);
            const accAny = await qc.auth.account(address);
            if (!accAny) {
                throw new Error("No Account!");
            }
            const account = customAccountFromAny(accAny);

            return {
                seq: xionToAbstractAccountSeq(account.accountNumber),
                trace: "local",
                chainName: HOME_CHAIN_NAME,
            } satisfies AccountId;
        },
        enabled: !!xionAcc.bech32Address.length,
    });

    useEffect(() => {
        if (query.isSuccess && !metaState?.xionAccountId) {
            console.debug("useXionAbstractAccountId, Setting xion account id");
            setMetaState({
                xionAccountId: query.data,
            });
        }
    }, [query.isSuccess, query.data, setMetaState, metaState?.xionAccountId]);

    return query;
};