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

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import { ACCOUNT_FACTORY_ADDRESS } from './walletComponents/xion'

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
        <Provider store={store}>

          <QueryClientProvider client={client}>
            <GrazProvider client={client}>
              <AbstraxionProvider
                config={{
                  // treasury: 'xion1h82c0efsxxq4pgua754u6xepfu6avglup20fl834gc2ah0ptgn5s2zffe9',

                  contracts: [ACCOUNT_FACTORY_ADDRESS],
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
