import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { isTextBoxVisibleAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { useActiveWalletType, useChainInfos, useSuggestChainAndConnect, WalletType } from "graz";
import { proxyChainEndpoints } from "@/utils/chains";
import { testnetChains } from "graz/chains";
import { APP_CHAIN } from "@/app/_lib/constants";
import { useActiveChains } from "graz";
import { useAccount } from "graz";
import { useSenderAddress } from "@abstract-money/react";


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

  const infos = useChainInfos({ chainId: ["xion-testnet-1"] });


  useEffect(() => {
    if (openModalCommand) {
      // setTextBoxContent("Authentication is loading")
      // setIsVisible(true);
      // setShowModal(true);
      // setOpenModalCommand(false);
      if (!walletType || !infos?.[0]) return

      connect({
        chainInfo: infos[0],
        walletType: walletType.walletType,
      })
    }

  }, [openModalCommand, setTextBoxContent, setOpenModalCommand, connect, walletType]);


  return <div>Nicoco {openModalCommand ? "non" : "oui"}</div>

}