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


interface XionWalletProps {
  children?: React.ReactNode;
}

export function XionWallet({ children }: XionWalletProps) {


  const [openModalCommand, setOpenModalCommand] = useAtom(walletOpeningCommand);
  const walletType = useActiveWalletType()

  const { suggestAndConnect: connect, isLoading } = useSuggestChainAndConnect()
  const { disconnect } = useDisconnect()

  const infos = useChainInfos({ chainId: ["xion-testnet-1"] });
  const { data: account } = useAccount()

  const [connectedWallet, setConnectedWallet] = useAtom(isWalletConnectedAtom);

  useEffect(() => {
    if (openModalCommand) {
      if (!walletType || !infos?.[0]) return

      if (!account?.bech32Address) {
        // For connection
        connect({
          chainInfo: infos[0],
          walletType: walletType.walletType,
        })
      } else {
        // For dis-connection
        disconnect()
      }
      setOpenModalCommand(false)
    }

    if (account?.bech32Address) {
      setConnectedWallet(true)
    } else {
      setConnectedWallet(false)
    }

  }, [openModalCommand, setOpenModalCommand, connect, disconnect, walletType, setConnectedWallet, account?.bech32Address]);


  return <div>Nicoco's address {account?.bech32Address}</div>

}