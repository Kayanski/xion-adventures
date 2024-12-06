import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { currentPositionAtom, isTextBoxVisibleAtom, movementsTrackerAtom, movementsTrackerLenAtom, textBoxContentAtom, walletOpeningCommand } from "../store";
import { maxMovementLength } from "../constants";
import { useAccounts } from "@abstract-money/react";


export default function MovementUpdateTracker(): JSX.Element {

    let movementLen = useAtomValue(movementsTrackerLenAtom);

    let owner = "xion14cl2dthqamgucg9sfvv4relp3aa83e40hn7tj4";

    const accountsQuery = useAccounts({
        args: {
            chains: ['xion-testnet-1'],
            owner,
        }
    })


    useEffect(() => {
        if (movementLen >= maxMovementLength) {
            console.log("Ok, let's send a blockchain update now", movementLen)
        }
    }, [movementLen])

    return (<>
        {(accountsQuery.data ?? []).map((a) => <div>{JSON.stringify(a)}</div>)}
    </>)

}