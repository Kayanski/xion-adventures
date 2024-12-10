import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { isTextBoxVisibleAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";


interface XionWalletProps {
    children?: React.ReactNode;
}

export function XionWallet({ children }: XionWalletProps) {
    // Abstraxion hooks
    const { data: account } = useAbstraxionAccount();
    const { client, signArb, logout } = useAbstraxionSigningClient();
    const [isModalShown, setShowModal]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>,
    ] = useModal();

    const [openModalCommand, setOpenModalCommand] = useAtom(walletOpeningCommand);
    const [, setTextBoxContent] = useAtom(textBoxContentAtom);
    const [, setIsVisible] = useAtom(isTextBoxVisibleAtom);

    useEffect(() => {
        console.log("Updating ?")

        if (openModalCommand) {
            console.log("This should open the xion, modal, it's currently unavailable")
            return;
            setTextBoxContent("Authentication is loading")
            setIsVisible(true);
            setShowModal(true);
            setOpenModalCommand(false);
        }

    }, [openModalCommand, setTextBoxContent, setOpenModalCommand]);


    return <div>Nicoco {openModalCommand ? "non" : "oui"}</div>

}