import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { currentPositionAtom, isTextBoxVisibleAtom, movementsTrackerAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { maxMovementLength } from "../game/constants";
import { useAccounts } from "@abstract-money/react";


export default function MovementUpdateTracker(): JSX.Element {

    let [movement, setMovement] = useAtom(movementsTrackerAtom);

    let owner = "xion14cl2dthqamgucg9sfvv4relp3aa83e40hn7tj4";

    const accountsQuery = useAccounts({
        args: {
            chains: ['xion-testnet-1'],
            owner,
        }
    })


    useEffect(() => {
        if (movement.length >= maxMovementLength) {
            setTimeout(() => {
                // We send the movement update
                // TODO
                // We reset the movement update
                setMovement([])

            }, 10000)
        }
    }, [movement.length])

    return (<>
        {(accountsQuery.data ?? []).map((a) => <div>{JSON.stringify(a)}</div>)}
    </>)

}