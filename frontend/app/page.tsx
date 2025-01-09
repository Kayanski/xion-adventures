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
      <div className="h-full w-full text-black space-y-4" >
        <div className="h-full w-full flex flex-col gap-6">
          <TextBox />
          <canvas id="game" className="absolute"></canvas>
          <Abstraxion onClose={() => { setShowModal(false) }} />
          <XionWallet />
          <GameDataLoader />
          <MovementUpdateTracker />
        </div>
      </div>
    </>
  )
}
initGame()