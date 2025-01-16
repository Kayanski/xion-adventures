import { useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { isTextBoxVisibleAtom, isWalletConnectedAtom, textBoxContentAtom, walletOpeningCommand } from "../game/store";
import { useActiveWalletType, useChainInfos, useSuggestChainAndConnect } from "graz";
import { useSenderAddress } from "@abstract-money/react";
import { useDisconnect } from "graz";
import { useDevMode } from "../_providers/dev-mod";
import { useTextBox } from "./TextBox";
import { Button } from "@/components/button";
import { LogOut } from "lucide-react";
import { eraseAllMovements, saveBackupMovements } from "../game/localStorage";


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

  const { textBox, showTextBox, closeTextBox } = useTextBox();


  useEffect(() => {
    if (openModalCommand) {
      // For xion (no dev mode)

      const openModal = async () => {
        if (!account) {
          const isLogin = await showTextBox(<div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "center", alignItems: "center", margin: "30px 30px " }}>
            <div>
              Do you want to proceed with login ?</div>
            <div style={{ display: "flex", flexDirection: "row", gap: "4px", textAlign: "center" }}>
              <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(true)}>Login</Button>
              <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(false)}>Cancel</Button>
            </div>
            <div style={{ fontSize: "14px" }}>Your game is saved !</div>
          </div>)

          if (!isLogin) {
            return
          }
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

          const isLogout = await showTextBox(<div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "center", alignItems: "center", margin: "30px 30px " }}>
            <div>
              Do you want to proceed with logout ? <br />
              Your progress will be lost.</div>
            <div style={{ display: "flex", flexDirection: "row", gap: "4px", textAlign: "center" }}>
              <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(true)}>Logout</Button>
              <Button style={{ fontSize: "25px" }} onClick={() => closeTextBox(false)}>Cancel</Button>
            </div>
          </div>)

          if (!isLogout) {
            return;
          }
          eraseAllMovements();
          disconnect()
        }
      }
      openModal()
      setOpenModalCommand(false)
    }

    if (account) {
      setConnectedWallet(true)
    } else {
      setConnectedWallet(false)
    }

  }, [openModalCommand, setOpenModalCommand, connect, grazDisconnect, walletType, setConnectedWallet, account, devMode, setShowModal]);

  return <>{textBox}</>

}