import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { isTextBoxVisibleAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { useActiveWalletType, useSuggestChainAndConnect, WalletType } from "graz";
import { proxyChainEndpoints } from "@/utils/chains";
import { testnetChains } from "graz/chains";
import { APP_CHAIN } from "@/app/_lib/constants";


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
  const walletType = useActiveWalletType()

  const { suggestAndConnect: connect, isLoading } = useSuggestChainAndConnect()

  useEffect(() => {
    console.log("Updating ?")

    if (openModalCommand) {
      console.log("This should open the xion, modal, it's currently unavailable")
      // setTextBoxContent("Authentication is loading")
      // setIsVisible(true);
      // setShowModal(true);
      // setOpenModalCommand(false);
      if (!walletType) return

      connect({
        chainInfo: APP_CHAIN,
        walletType: walletType.walletType,
      })
    }

  }, [openModalCommand, setTextBoxContent, setOpenModalCommand, connect, walletType]);


  return <div>Nicoco {openModalCommand ? "non" : "oui"}</div>

}