import TextBox from "./ReactComponents/TextBox";
import XionWallet from "./ReactComponents/XionWallet";
import MovementUpdateTracker from "./ReactComponents/MovementUpdateTracker"


import { GrazProvider } from 'graz'
import { AbstractProvider, createConfig } from "@abstract-money/react";
import { grazProvider } from '@abstract-money/provider-graz'
import { mainnetChains } from "graz/chains";

const config = createConfig({
  apiUrl: 'https://testnet.api.abstract.money/graphql',
  provider: grazProvider
})
export default function ReactUI() {
  console.log(mainnetChains)
  return (
    <>
      <GrazProvider grazOptions={{
        chains: [mainnetChains.osmosis],
        chainsConfig: {
          [mainnetChains.osmosis.chainId]: {
            gas: {
              price: '0.25',
              denom: 'uosmo',
            },
          },
        },
      }}>
        <AbstractProvider config={config}>
          <>
            <XionWallet />
            <TextBox />
            <MovementUpdateTracker />
          </>
        </AbstractProvider>
      </GrazProvider>
    </>
  );
}
