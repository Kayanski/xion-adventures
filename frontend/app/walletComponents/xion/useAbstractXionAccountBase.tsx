import { useConfig } from "@abstract-money/react";
import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import type { AccountId } from "@abstract-money/core";
import { useMetaAccountState } from "./useMetaAccountState";
import { useXionAbstractAccountId } from "./useXionSender";
import { HOME_CHAIN_NAME, LAST_KNOWN_ACCOUNT_KEY } from ".";

export const useXionAbstractAccountExists = () => {
    const { data: accountId, status: xionAaIdStatus } =
        useXionAbstractAccountId();

    const config = useConfig();
    const publicClient = config.usePublicClient({
        chainName: HOME_CHAIN_NAME,
    });
    const [metaState] = useMetaAccountState();

    const query = useQuery({
        queryKey: ["xionAccountExists", accountId],
        queryFn: async () => {
            if (metaState?.xionAccountId && metaState?.managerAddress) {
                return {
                    accountId: metaState.xionAccountId,
                    managerAddress: metaState.managerAddress,
                    proxyAddress: "unknown, this is definitely a bug",
                };
            }
            if (!publicClient) {
                throw new Error("no public client");
            }
            if (!accountId) {
                throw new Error("no account id");
            }
            try {
                const base = await publicClient.getAccountsAddresses({
                    accountIds: [accountId],
                });
                return {
                    account: base.accounts[0],
                    accountId,
                };
            } catch (e) {
                console.warn("Account DNE!", e);
                return null;
            }
        },
        enabled: xionAaIdStatus === "success" && !!publicClient,
        refetchInterval: useCallback(
            (
                data:
                    | {
                        managerAddress: string;
                        proxyAddress: string;
                        accountId: AccountId;
                    }
                    | null
                    | undefined,
            ) => {
                if (data) return false;
                if (data === null) return 2000;
                if (metaState?.managerAddress) return 2000;
                return 10000;
            },
            [metaState?.managerAddress],
        ),
    });

    const [lastKnownManager, setLastKnownManager] = useLocalStorage<
        string | undefined
    >(LAST_KNOWN_ACCOUNT_KEY, undefined);

    useEffect(() => {
        if (query.data && lastKnownManager !== query.data.managerAddress) {
            setLastKnownManager(query.data.managerAddress);
        }
    }, [lastKnownManager, query.data, setLastKnownManager]);

    return query;
};