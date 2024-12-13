'use client'

import { cn } from '../utils'
import { GrazProvider } from './_providers/graz'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter, Poppins } from 'next/font/google'
import "./globals.css";
import initGame from "./game/initGame";
import { Provider } from "jotai";
import { store } from "./game/store";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AbstraxionProvider } from '@burnt-labs/abstraxion'
import { AbstractProvider } from './_providers/abstract'


const client = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['900', '800', '700'],
  variable: '--font-display',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full w-full'>
      <body className={cn(inter.variable, poppins.variable, 'h-full w-full bg-white')}>
        <canvas id="game" ></canvas>
        <Provider store={store}>

          <QueryClientProvider client={client}>
            <GrazProvider client={client}>
              <AbstraxionProvider
                config={{
                  // treasury: 'xion1h82c0efsxxq4pgua754u6xepfu6avglup20fl834gc2ah0ptgn5s2zffe9',

                  contracts: ["xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka"],
                }}
              >
                <AbstractProvider>
                  {children}
                </AbstractProvider>
              </AbstraxionProvider>
            </GrazProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}


initGame();
