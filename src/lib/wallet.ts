'use client'

import { http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// ✅ Use your real WalletConnect Project ID
export const wagmiConfig = getDefaultConfig({
  appName: 'Cryptix Presale',
  projectId: '20a191638971c0c25b62b32305af4da2', // 👈 real project ID
  chains: [bsc],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true,
})
