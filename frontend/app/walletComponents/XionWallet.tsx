import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { isTextBoxVisibleAtom, isWalletConnectedAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { useActiveWalletType, useChainInfos, useSuggestChainAndConnect, WalletType } from "graz";
import { proxyChainEndpoints } from "@/utils/chains";
import { testnetChains } from "graz/chains";
import { APP_CHAIN } from "@/app/_lib/constants";
import { useActiveChains } from "graz";
import { useAccount } from "graz";
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
  const { data: account } = useAccount()

  const [connectedWallet, setConnectedWallet] = useAtom(isWalletConnectedAtom);

  const disconnect = () => {
    grazDisconnect()
    xionDisconnect?.()
  }


  useEffect(() => {
    console.log(openModalCommand, devMode, account)
    if (openModalCommand) {
      // For xion (no dev mode)

      if (!account?.bech32Address) {
        if (!devMode) {
          console.log("show modal")
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

    if (account?.bech32Address) {
      setConnectedWallet(true)
    } else {
      setConnectedWallet(false)
    }

  }, [openModalCommand, setOpenModalCommand, connect, grazDisconnect, walletType, setConnectedWallet, account?.bech32Address, devMode, setShowModal]);


  return <div>Nicoco's address {account?.bech32Address}</div>

}