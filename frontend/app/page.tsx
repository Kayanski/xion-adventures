'use client'

import { XionWallet } from "./walletComponents/XionWallet"
import TextBox from "./walletComponents/TextBox"
import MovementUpdateTracker from "./walletComponents/MovementUpdateTracker"
import { GameDataLoader } from "./game/useGameData"
import { Abstraxion, useModal } from "@burnt-labs/abstraxion"
import initGame from "./game"


export default function Home() {
  const [, setShowModal] = useModal()

  return (
    <>
      <Abstraxion onClose={() => { setShowModal(false) }} />
      <XionWallet />
      <GameDataLoader />
      <MovementUpdateTracker />
    </>
  )
}
initGame()