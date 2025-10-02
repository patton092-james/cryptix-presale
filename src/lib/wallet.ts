'use client'

import { http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// ✅ Directly use getDefaultConfig (don't wrap in createConfig)
export const wagmiConfig = getDefaultConfig({
  appName: 'Cryptix Presale',
  projectId: 'WALLETCONNECT_PROJECT_ID', // can leave as-is for MetaMask
  chains: [bsc],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true,
})
