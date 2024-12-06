import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { store } from "./store.js";

import ReactUI from "./ReactUI";
import initGame from "./initGame";

import "./index.css";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

const ui = document.getElementById("ui");

new ResizeObserver(() => {
  document.documentElement.style.setProperty(
    "--scale",
    Math.min(
      ui.parentElement.offsetWidth / ui.offsetWidth,
      ui.parentElement.offsetHeight / ui.offsetHeight
    ).toString()
  );
}).observe(ui.parentElement);


const treasuryConfig = {
  treasury: "xion1nn55ch09p4a4z30am967n5n8r75m2ag3s3sujutxfmchhsxqtg3qghdg7h", // Example XION treasury instance for executing seat contract
  gasPrice: "0.001uxion", // If you feel the need to change the gasPrice when connecting to signer, set this value. Please stick to the string format seen in example
  // Optional params to activate mainnet config
  // rpcUrl: "https://rpc.xion-mainnet-1.burnt.com:443",
  // restUrl: "https://api.xion-mainnet-1.burnt.com:443",
};

import {
  QueryClient, QueryClientProvider

} from '@tanstack/react-query'
import { AbstractProvider, createConfig } from '@abstract-money/react'
import { xionProvider } from '@abstract-money/provider-xion'

const client = new QueryClient()
const config = createConfig({
  apiUrl: 'https://testnet.api.abstract.money/graphql',
  provider: xionProvider
})

const YOUR_CONTRACT_ADDRESS = 'xion1...xyz';

const ABSTRAXION_CONFIG = {
  contracts: [
    // Usually, you would have a list of different contracts here
    {
      address: YOUR_CONTRACT_ADDRESS,
      amounts: [{ denom: 'uxion', amount: "1000000" }],
    },
  ],
  bank: [
    {
      denom: 'uxion',
      amount: "1000000",
    },
  ],
};


createRoot(document.getElementById("ui")).render(
  <StrictMode>
    <Provider store={store}>
      <AbstraxionProvider config={ABSTRAXION_CONFIG}>
        <QueryClientProvider client={client}>
          <AbstractProvider config={config}>
            <ReactUI />
          </AbstractProvider>
        </QueryClientProvider>
      </AbstraxionProvider>
    </Provider>
  </StrictMode >
);

initGame();
