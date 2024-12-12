import { AccountId } from "@abstract-money/core";
import { cw721Base, hub } from "../_generated/generated-abstract";
import { abstractAccount, accountDetails } from "../walletComponents/useAccountSetup";
import { useEffect } from "react";
import { useAccountAddress } from "@abstract-money/react";
import { useAtom } from "jotai";
import { gameMapAtom, initalPositionAtom } from "./store";


export type UseGameMapParams = {
    accountId: AccountId | undefined
}

export function useGameMap({ accountId }: UseGameMapParams) {

    // If accountId is not defined, we use the default ID where the app is installed, to make sure we always get the map
    if (!accountId) {
        accountId = {
            chainName: "xiontestnet",
            seq: 36,
            trace: "local"
        }
    }

    let { data: map } = hub.queries.useMap({ accountId, chainName: accountId?.chainName });

    return map

}

export function useConnectedTokenId({ accountId }: UseGameMapParams) {

    let { data: config } = hub.queries.useConfig(accountDetails);
    let { data: accountAddress } = useAccountAddress(accountDetails);

    let { data: nftOwned, remove: refetchTokens } = cw721Base.queries.useTokens({
        contractAddress: config?.nft, chainName: accountDetails.chainName, args: {
            owner: accountAddress!
        }, options: { enabled: !!accountAddress && !!config?.nft }
    });
    return {
        tokenId: nftOwned?.tokens[0],
        refetchTokens
    }
}


export function usePlayerPosition({ accountId }: UseGameMapParams) {

    let { tokenId } = useConnectedTokenId({ accountId });

    console.log('usePlayerPosition', {tokenId})

    let { data: playerMetadata } = hub.queries.usePlayerMetadata({
        accountId, chainName: accountId?.chainName, args: {
            tokenId: tokenId || ''
        }, options: {
            enabled: !!tokenId
        }
    },);
    return playerMetadata?.location
}



export function GameDataLoader() {

    // We start by loading the game map
    const map = useGameMap({ accountId: abstractAccount });
    const onChainPlayerPosition = usePlayerPosition({ accountId: abstractAccount })

    console.log('GameDataLoader usePlayerPosition', {map, onChainPlayerPosition})

    const [, setMapStore] = useAtom(gameMapAtom)
    const [, setInitialPosition] = useAtom(initalPositionAtom)

    useEffect(() => {

        if (map) {
            // Once the map is loaded, we can save it in state for the game engine to play it
            console.log('GameDataLoader', {map})
            setMapStore(map.map)
        }

        if (onChainPlayerPosition) {
            // Once the onChainPlayer position is loaded, we can save it in state for the game engine to set the character to
            console.log({onChainPlayerPosition})
            setInitialPosition(onChainPlayerPosition)
        }



    }, [map, onChainPlayerPosition])


    return (<></>)
}
