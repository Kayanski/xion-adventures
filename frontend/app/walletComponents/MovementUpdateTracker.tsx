import { } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { movementsTrackerAtom } from "../game/store";
import { maxMovementLength } from "../game/constants";
import { useAccountAddress, useSenderAddress } from "@abstract-money/react";
import { useChainInfo } from "graz";
import { GAME_HANDLER_MODULE_ID, gameHandler, HUB_MODULE_ID, hub } from "../_generated/generated-abstract";
import { moduleIdToName, moduleIdToNamespace } from "@abstract-money/core";
import { useAdapterAuthorizedAddresses } from "./useAdapterAuthorizedAddresses";
import { useAdapterAddress } from "./useAdapterAddress";
import { useAuthorizeAddress } from "./useAuthorizeAddress";
import { useConnectedTokenId } from "../game/useGameData";
import { useConnectedAccountId } from "./useAccountSetup";
import { useXionAbstractAccountId } from "./xion/useXionSender";
import { useXionAbstractAccountExists } from "./xion/useAbstractXionAccountBase";
import { useAccountFactoryMutation } from "./xion/accountFactory";
import { QueryObserverResult, useQueryClient } from "@tanstack/react-query";
import { FIXED_FEES, TREASURY } from "./constants";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useSimulateMovePlayer } from "./useSimulatePlayerMovement";
import { toast } from "react-toastify";
import { eraseAllMovements, getBackupMovements, getMovements } from "../game/localStorage";
import { useTextBox } from "./TextBox";
import { Button } from "@/components/button";

export default function MovementUpdateTracker(): JSX.Element {

    const [movement, setMovement] = useAtom(movementsTrackerAtom);

    const { data: account, } = useSenderAddress({
        chainName: "xiontestnet",
    })

    const { data: abstractAccount, refetch: refetchConnectedAccountId } = useConnectedAccountId();

    // For xion Double authentication (this is a mess)
    const { data: xionAccountIdQuery } = useXionAbstractAccountId();
    const { refetch: refetchExistingAccount, data: xionAA, isFetched: isXionAAFecthed } = useXionAbstractAccountExists();
    const queryClient = useQueryClient();

    const chainInfo = useChainInfo({
        chainId: "xion-testnet-1"
    });

    const { mutateAsync: createAccount } = useAccountFactoryMutation({
        onSuccess({ accountAddress }) {
            console.log("new account address")
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
    const { mutateAsync: movePlayerSimulation } = useSimulateMovePlayer({
        accountId: abstractAccount
    })

    const isBroadcastingTransaction = useRef(false);

    useEffect(() => {
        if (movement.length >= maxMovementLength) {
            if (!account) {
                showTextBox(<div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "center", alignItems: "center", margin: "30px 30px " }}>
                    <div>
                        There is not much to do right ?</div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "4px", textAlign: "center" }}>
                        <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(true)}>Right</Button>
                        <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(false)}>Left</Button>
                    </div>
                    <div style={{ fontSize: "14px" }}>Try clicking the wallet button to save your game !</div>
                </div>)
                return
            }

            // We verify the account exists
            if (!xionAA && isXionAAFecthed) {
                // Else, we create the account, along with the necessary modules
                if (isBroadcastingTransaction.current) {
                    return;
                }
                isBroadcastingTransaction.current = true
                toast("Creating an Abstract account")
                isBroadcastingTransaction.current = true
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
                    },
                    args: {
                        fee: FIXED_FEES.accountCreation,
                    }
                }).then((_) => {
                    isBroadcastingTransaction.current = false
                    setTimeout(() => {
                        // We refetch the connected Account id every 2 seconds until we have a result, the API is a little behind the chain
                        const refetchAccountIdUntilOne = async () => {
                            const result = await refetchConnectedAccountId();
                            if (result.data?.length == 0) {
                                setTimeout(refetchAccountIdUntilOne, 1000)
                            }
                            refectAccountAddress()
                            refectGameHandlerAddress()
                            refetchAuthorizedAddresses()
                        };
                        refetchAccountIdUntilOne()
                    }, 1000)
                });

            } else if (!gameHandlerAddress) {
                console.log("No game handler Address, returning")
                // Query not available yet
                return
            } else if (!authorizedAddress) {
                // Query not available yet
                return
            } else if (!authorizedAddress.addresses.includes(gameHandlerAddress)) {
                if (!authorizeOnHub) {
                    return
                } if (isBroadcastingTransaction.current) {
                    return;
                }
                isBroadcastingTransaction.current = true
                // If the account exists and the game handler IS NOT authorized on the HUB
                authorizeOnHub({
                    msg: {
                        toAdd: [gameHandlerAddress],
                        toRemove: null
                    }, args: {
                        fee: FIXED_FEES.authorizeOnHub,
                    }
                }).then((_) => {
                    refetchAuthorizedAddresses()
                    isBroadcastingTransaction.current = false
                })

            } else if (!createGameAccountMutation) {
                // Query not available yet
                return
            } else if (tokenId == undefined) {
                if (isBroadcastingTransaction.current) {
                    return;
                }
                isBroadcastingTransaction.current = true
                createGameAccountMutation({
                    msg: {
                    }, args: {
                        fee: FIXED_FEES.createGameAccount,
                    }
                }).then(() => {
                    refetchTokens()
                    isBroadcastingTransaction.current = false
                });
                toast("Game Account created !")
            } else if (!movePlayer || !movePlayerSimulation || !chainInfo) {
                // Mutation not available yet
                return;
            } else {
                // Now that everything is created, we are able to send the last movements to the on-chain contracts

                if (isBroadcastingTransaction.current) {
                    return;
                }
                isBroadcastingTransaction.current = true
                movePlayerSimulation({
                    msg: {
                        positions: movement,
                        tokenId,
                    },
                }).then((gasCost) => {
                    const totalGasCost = Math.round(gasCost * 1.4);
                    const feeCurrencies = chainInfo.feeCurrencies[0];
                    const computedFee = calculateFee(totalGasCost, GasPrice.fromString(`${feeCurrencies.gasPriceStep?.average.toString()}${feeCurrencies.coinMinimalDenom}`))
                    return movePlayer({
                        msg: {
                            positions: movement,
                            tokenId,
                        },
                        args: {
                            fee: {
                                amount: computedFee.amount,
                                gas: computedFee.gas,
                                granter: TREASURY
                            }
                        }
                    })
                }).then(() => {
                    isBroadcastingTransaction.current = false
                    setMovement([])
                    eraseAllMovements()
                    toast("Movements saved on-chain !")
                })
            }

        }
    }, [movement.length, accountAddress, createAccount, refectAccountAddress, gameHandlerAddress, authorizedAddress?.addresses, createGameAccountMutation, tokenId, movePlayer, movePlayerSimulation, account, authorizeOnHub, movement, xionAA, isXionAAFecthed, authorizedAddress, chainInfo, refectGameHandlerAddress, refetchAuthorizedAddresses, refetchTokens, setMovement])

    const { textBox, showTextBox, closeTextBox } = useTextBox<boolean>();


    return (<>{textBox}</>)

}