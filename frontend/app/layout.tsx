'use client'

import { cn } from '../utils'
import { GrazProvider } from './_providers/graz'
import { grazProvider } from '@abstract-money/provider-graz'
import { AbstractProvider, createConfig } from '@abstract-money/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter, Poppins } from 'next/font/google'
import "./globals.css";
import { ABSTRACT_API_URL } from '@/app/_lib/constants'
import initGame from "./game/initGame";
import { Provider } from "jotai";
import { store } from "./game/store";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


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

const abstractConfig = createConfig({
  provider: grazProvider,
  apiUrl: process.env.NEXT_PUBLIC_ABSTRACT_API_URL || ABSTRACT_API_URL
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
              <AbstractProvider config={abstractConfig}>
                {children}
              </AbstractProvider>
            </GrazProvider>
            <ReactQueryDevtools client={client} initialIsOpen={false} buttonPosition={'bottom-left'}/>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}


initGame();
