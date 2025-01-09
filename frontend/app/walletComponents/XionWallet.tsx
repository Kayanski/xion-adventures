import { useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { isWalletConnectedAtom, walletOpeningCommand } from "../game/store";
import { useActiveWalletType, useChainInfos, useSuggestChainAndConnect } from "graz";
import { useSenderAddress } from "@abstract-money/react";
import { useDisconnect } from "graz";
import { useDevMode } from "../_providers/dev-mod";


interface XionWalletProps {
  children?: React.ReactNode;
}

export function XionWallet({ children }: XionWalletProps) {
  const { devMode } = useDevMode();
  const [modalShown, setShowModal] = useModal()

  const [openModalCommand, setOpenModalCommand] = useAtom(walletOpeningCommand);
  const walletType = useActiveWalletType()

  const { suggestAndConnect: connect, isLoading } = useSuggestChainAndConnect()
  const { disconnect: grazDisconnect } = useDisconnect()
  const { logout: xionDisconnect } = useAbstraxionSigningClient()

  const infos = useChainInfos({ chainId: ["xion-testnet-1"] });
  const { data: account } = useSenderAddress({})

  const [connectedWallet, setConnectedWallet] = useAtom(isWalletConnectedAtom);

  const disconnect = () => {
    grazDisconnect()
    xionDisconnect?.()
  }

  useEffect(() => {
    if (openModalCommand) {
      // For xion (no dev mode)

      if (!account) {
        if (!devMode) {

          setShowModal(true)
        } else {
          // For graz (dev mode)
          if (!walletType || !infos?.[0]) return

          // For connection
          connect({
            chainInfo: infos[0],
            walletType: walletType.walletType,
          })
        }
      } else {
        disconnect()
      }
      setOpenModalCommand(false)
    }

    if (account) {
      setConnectedWallet(true)
    } else {
      setConnectedWallet(false)
    }

  }, [openModalCommand, setOpenModalCommand, connect, grazDisconnect, walletType, setConnectedWallet, account, devMode, setShowModal]);

  return <></>

}