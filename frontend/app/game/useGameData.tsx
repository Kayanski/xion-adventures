import { AccountId } from "@abstract-money/core";
import { cw721Base, hub } from "../_generated/generated-abstract";
import { useEffect } from "react";
import { useAccountAddress } from "@abstract-money/react";
import { useAtom } from "jotai";
import { gameMapAtom, initialPositionAtom } from "./store";
import { useConnectedAccountId } from "../walletComponents/useAccountSetup";


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

    return hub.queries.useMap({ accountId, chainName: accountId?.chainName })

}

export function useConnectedTokenId({ accountId }: UseGameMapParams) {


    let { data: config } = hub.queries.useConfig({ accountId, chainName: accountId?.chainName });
    let { data: accountAddress } = useAccountAddress({ accountId, chainName: accountId?.chainName });

    let { data: nftOwned, remove: refetchTokens } = cw721Base.queries.useTokens({
        contractAddress: config?.nft, chainName: accountId?.chainName, args: {
            owner: accountAddress!
        }, options: { enabled: !!accountId && !!accountId.chainName && !!accountAddress && !!config?.nft }
    });
    return {
        tokenId: nftOwned?.tokens[0],
        refetchTokens
    }
}


export function usePlayerMetadata({ accountId }: UseGameMapParams) {

    let { tokenId } = useConnectedTokenId({ accountId });

    return hub.queries.usePlayerMetadata({
        accountId, chainName: accountId?.chainName, args: {
            tokenId: tokenId!
        }, options: {
            enabled: !!tokenId && !!accountId
        }
    },);
}



export function GameDataLoader() {

    const abstractAccount = useConnectedAccountId();
    // We start by loading the game map
    let { data: map, isFetched } = useGameMap({ accountId: abstractAccount });
    let { data: onChainPlayerMetadata, isFetched: isMetadataFetched } = usePlayerMetadata({ accountId: abstractAccount })

    let [, setMapStore] = useAtom(gameMapAtom)
    let [, setInitialPosition] = useAtom(initialPositionAtom)

    useEffect(() => {
        console.log("query is fetched", isFetched, isMetadataFetched)

        if (map) {
            // Once the map is loaded, we can save it in state for the game engine to play it
            setMapStore(map.map)
        }

        if (onChainPlayerMetadata) {
            // Once the onChainPlayer position is loaded, we can save it in state for the game engine to set the character to
            setInitialPosition(onChainPlayerMetadata)
        }
    }, [map, onChainPlayerMetadata])


    return (<></>)
}
