import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { isTextBoxVisibleAtom, textBoxContentAtom, walletOpeningCommand } from "../store";
export default function XionWallet(): JSX.Element {
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

        if (openModalCommand) {
            setTextBoxContent("Authentication is loading")
            setIsVisible(true)
            setShowModal(true);
            setOpenModalCommand(false);
        }

    }, [openModalCommand, setTextBoxContent, setOpenModalCommand]);


    return (<><Abstraxion
        onClose={() => {
            setShowModal(false);
        }}
    /></>)

}