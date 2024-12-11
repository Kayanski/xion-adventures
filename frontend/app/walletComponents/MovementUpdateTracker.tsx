import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { currentPositionAtom, isTextBoxVisibleAtom, movementsTrackerAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { maxMovementLength } from "../game/constants";
import { useAccounts, useAccountAddress, useCreateAccount, useCreateAccountMonarchy, useInstallModules } from "@abstract-money/react";
import { useAccount } from "graz";
import { cw721Base, GAME_HANDLER_MODULE_ID, gameHandler, HUB_MODULE_ID, hub } from "../_generated/generated-abstract";
import { AccountId, moduleIdToName, moduleIdToNamespace } from "@abstract-money/core";
import { IbcClientClient } from "@abstract-money/core/codegen/abstract";
import { abstractAccount, accountDetails, useGameAccountSetup } from "./useAccountSetup";



export default function MovementUpdateTracker(): JSX.Element {

    let [movement, setMovement] = useAtom(movementsTrackerAtom);
    const { data: account } = useAccount()

    // This will only work when creating XION accounts
    // const accountsQuery = useAccounts({
    //     args: {
    //         chains: ['xion-testnet-1'],
    //         owner: account?.bech32Address ?? "",
    //     }
    // })

    let { data: accountAddress, refetch: refectAccountAddress, queryKey } = useAccountAddress(accountDetails);
    let { data: config } = hub.queries.useConfig(accountDetails);
    let { mutateAsync: createAccount, data: accountCreationResult } = useCreateAccountMonarchy({ chainName: "xiontestnet" })
    let { createGameAccount } = useGameAccountSetup();
    let { data: nftOwned } = cw721Base.queries.useTokens({
        contractAddress: config?.nft, chainName: accountDetails.chainName, args: {
            owner: accountAddress!
        }, options: { enabled: !!accountAddress }
    });

    useEffect(() => {
        if (movement.length >= maxMovementLength) {
            if (!account) {
                return
            }

            // We verify the account exists
            if (!accountAddress) {
                // Else, we create the account, along with the necessary modules
                console.log("Create account and install modules")

                let createAccountAsync = async () => {

                    let accountCreationResult = await createAccount({
                        fee: 'auto',
                        args: {
                            name: 'Xion-adventures-test',
                            owner: account.bech32Address,
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
                    });
                    console.log(accountCreationResult)

                    refectAccountAddress();
                }
                createAccountAsync().then((r) => createGameAccount())
            } else {
                // If the account exist, let's see if the player has an NFT, they can play with
                if (nftOwned?.tokens.length != 0) {
                    console.log("Ok, we are able to send data on-chain from the players movements")
                } else {
                    console.log("We need to create the game account, to get at least 1 NFT")
                    createGameAccount();
                }

            }

            // We play with the NFT



            setTimeout(() => {
                // We send the movement update
                // TODO
                // We reset the movement update
                setMovement([])

            }, 10000)
        }
    }, [movement.length, accountAddress, createAccount, refectAccountAddress])

    return (<>
        <div>
            Here 's the config data{JSON.stringify(config)} --

            account creation result {JSON.stringify(accountCreationResult)} --

            account address {JSON.stringify(accountAddress)}</div>
    </>)

}