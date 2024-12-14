import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { currentPositionAtom, isTextBoxVisibleAtom, movementsTrackerAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { maxMovementLength } from "../game/constants";
import { useAccounts, useAccountAddress, useCreateAccount, useCreateAccountMonarchy, useInstallModules, useModules, useSenderAddress } from "@abstract-money/react";
import { useAccount } from "graz";
import { cw721Base, GAME_HANDLER_MODULE_ID, gameHandler, HUB_MODULE_ID, hub } from "../_generated/generated-abstract";
import { AccountId, AdapterExecuteMsgFactory, AdapterQueryMsgBuilder, moduleIdToName, moduleIdToNamespace } from "@abstract-money/core";
import { IbcClientClient } from "@abstract-money/core/codegen/abstract";
import { gameHandlerQueryKeys, useGameHandlerConfigQuery } from "../_generated/generated-abstract/cosmwasm-codegen/GameHandler.react-query";
import { useAdapterAuthorizedAddresses } from "./useAdapterAuthorizedAddresses";
import { useAdapterAddress } from "./useAdapterAddress";
import { useAuthorizeAddress } from "./useAuthorizeAddress";
import { cn } from "@/utils";
import { useConnectedTokenId } from "../game/useGameData";
import { useConnectedAccountId } from "./useAccountSetup";
import { useXionAbstractAccountId } from "./xion/useXionSender";
import { useXionAbstractAccountExists } from "./xion/useAbstractXionAccountBase";
import { HOME_CHAIN_NAME } from "./xion";
import { useAccountFactoryMutation } from "./xion/accountFactory";
import { useAbstraxionProviderConfig } from "./xion/useAbstractxionProviderConfig";
import { useQueryClient } from "@tanstack/react-query";

export default function MovementUpdateTracker(): JSX.Element {

    const [movement, setMovement] = useAtom(movementsTrackerAtom);
    const { data: account } = useSenderAddress({
        chainName: "xiontestnet",
    })

    const abstractAccount = useConnectedAccountId();

    // For xion Double authentication (this is a mess)
    const { data: xionAccountIdQuery } = useXionAbstractAccountId();
    const { refetch: refetchExistingAccount, data: xionAA } = useXionAbstractAccountExists();
    const { setContracts } = useAbstraxionProviderConfig();
    const queryClient = useQueryClient();
    console.log(xionAA, xionAccountIdQuery)


    const { mutateAsync: createAccount } = useAccountFactoryMutation({
        onSuccess({ accountAddress }) {
            setContracts([
                {
                    address: accountAddress,
                    amounts: [{ denom: HOME_CHAIN_NAME, amount: "1000000" }],
                },
            ]);
            // setMetaState({ managerAddress });
        },
        onError: (e) => {
            if (
                "message" in e &&
                (e.message as string).includes("already exists")
            ) {
                refetchExistingAccount();
            }
        },
        onSettled: (a, b, c, d) => {
            refetchExistingAccount();
            queryClient.defaultMutationOptions().onSettled?.(a, b, c, d);
        },
    });
    // For abstract account address


    const { data: accountAddress, remove: refectAccountAddress, queryKey } = useAccountAddress({
        accountId: abstractAccount, chainName: abstractAccount?.chainName
    });
    // let { mutateAsync: createAccount, data: accountCreationResult } = useCreateAccountMonarchy({ chainName: "xiontestnet" })
    const { mutateAsync: createGameAccountMutation } = gameHandler.mutations.useCreateAccount({ accountId: abstractAccount, chainName: abstractAccount?.chainName });

    // Nft query
    const { tokenId, refetchTokens } = useConnectedTokenId({ accountId: abstractAccount });

    // FOr Adapter authorized addresses
    const { data: authorizedAddress, remove: refetchAuthorizedAddresses } = useAdapterAuthorizedAddresses({ accountId: abstractAccount, moduleId: HUB_MODULE_ID });
    const { data: gameHandlerAddress, remove: refectGameHandlerAddress } = useAdapterAddress({ accountId: abstractAccount, moduleId: GAME_HANDLER_MODULE_ID });
    const { mutateAsync: authorizeOnHub } = useAuthorizeAddress({ accountId: abstractAccount, moduleId: HUB_MODULE_ID })

    // For game logic

    const { mutateAsync: movePlayer } = gameHandler.mutations.useMovePlayer({ accountId: abstractAccount, chainName: abstractAccount?.chainName });



    useEffect(() => {
        if (movement.length >= maxMovementLength) {
            if (!account) {
                return
            }

            // We verify the account exists
            if (!xionAA) {
                // Else, we create the account, along with the necessary modules

                createAccount({
                    msg: {
                        installModules: [{
                            name: "ibc-client",
                            namespace: "abstract",
                            version: 'latest',
                        }, {
                            name: moduleIdToName(GAME_HANDLER_MODULE_ID),
                            namespace: moduleIdToNamespace(GAME_HANDLER_MODULE_ID),
                            version: 'latest',
                        }, {
                            name: moduleIdToName(HUB_MODULE_ID),
                            namespace: moduleIdToNamespace(HUB_MODULE_ID),
                            version: 'latest',
                        }
                        ]
                    }
                }).then((_) => {
                    refectAccountAddress()
                    refectGameHandlerAddress()
                    refetchAuthorizedAddresses()
                });

            } else if (!gameHandlerAddress) {
                // Query not available yet
                return
            } else if (!authorizedAddress) {
                // Query not available yet
                return
            } else if (!authorizedAddress.addresses.includes(gameHandlerAddress)) {
                if (!authorizeOnHub) {
                    return
                }
                // If the account exists and the game handler IS NOT authorized on the HUB
                authorizeOnHub({
                    msg: {
                        toAdd: [gameHandlerAddress],
                        toRemove: null
                    }
                }).then((_) => {
                    refetchAuthorizedAddresses()
                })

            } else if (!createGameAccountMutation) {
                // Query not available yet
                return
            } else if (tokenId == undefined) {
                createGameAccountMutation({
                    msg: {
                    }, args: {
                        fee: "auto"
                    }
                }).then(() => {
                    refetchTokens()
                });
            } else if (!movePlayer) {
                // Mutation not available yet
                return;
            } else {
                // Now that everything is created, we are able to send the last movements to the on-chain contracts

                movePlayer({
                    msg: {
                        positions: movement,
                        tokenId,
                    }
                }).then(() => {
                    setMovement([])
                })
            }

        }
    }, [movement.length, accountAddress, createAccount, refectAccountAddress, gameHandlerAddress, authorizedAddress?.addresses, createGameAccountMutation, tokenId, movePlayer])

    return (<>
        <div>
            account address {JSON.stringify(accountAddress)}--

            authorized addresses {JSON.stringify(authorizedAddress)}
        </div>
    </>)

}