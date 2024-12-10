'use client'

import { CreateAbstractAccount } from "./_components/create-abstract-account"
import { QueryAbstractSubgraph } from "./_components/query-abstract-subgraph"
import { CodegenContract } from "./_components/codegen-contract"
import { Header } from "./_components/header"
import { XionWallet } from "./walletComponents/XionWallet"
import TextBox from "./walletComponents/TextBox"
import MovementUpdateTracker from "./walletComponents/MovementUpdateTracker"

export default function Home() {
  return (
    <div className="h-full w-full p-4 text-black space-y-4">
      <Header />
      <div className="flex flex-col gap-6">
        <XionWallet />
        <TextBox />
        <MovementUpdateTracker />
      </div>
    </div>
  )
}