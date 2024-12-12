'use client'

import { CreateAbstractAccount } from "./_components/create-abstract-account"
import { QueryAbstractSubgraph } from "./_components/query-abstract-subgraph"
import { CodegenContract } from "./_components/codegen-contract"
import { Header } from "./_components/header"
import { XionWallet } from "./walletComponents/XionWallet"
import TextBox from "./walletComponents/TextBox"
import MovementUpdateTracker from "./walletComponents/MovementUpdateTracker"
import { GameDataLoader } from "./game/useGameData"

export default function Home() {
  return (
    <div className="h-full w-full p-4 text-black space-y-4">

      <div className="flex flex-col gap-6">
        <XionWallet />
        <GameDataLoader />
        <TextBox />
        <MovementUpdateTracker />
      </div>
    </div>
  )
}