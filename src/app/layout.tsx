'use client'

import './globals.css'
import { useEffect, useState } from 'react'
import AOS from 'aos'
import { WagmiProvider, useAccount } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/wallet'
import Link from 'next/link'
import Image from 'next/image'
import { FaTelegramPlane, FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa'

const queryClient = new QueryClient()

// ✅ Referral Section
function ReferralSection() {
  const { address, isConnected } = useAccount()
  const [refLink, setRefLink] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      setRefLink(`https://cryptixcoin.com/?ref=${address}`)
    } else {
      setRefLink(null)
    }
  }, [isConnected, address])

  const copyToClipboard = () => {
    if (refLink) {
      navigator.clipboard.writeText(refLink)
      alert('Referral link copied!')
    }
  }

  if (!isConnected) return null

  return (
    <section
      id="referral"
      className="rounded-xl border border-purple-500/40 bg-black/40 backdrop-blur-md p-6 shadow-lg mt-10 text-center"
      data-aos="fade-up"
    >
      <h3 className="text-2xl font-bold text-purple-400 mb-4">🔗 Your Referral Link</h3>
      <p className="text-sm text-zinc-300 mb-4">
        Share this link with your friends. You’ll earn CRPX rewards for every referral that buys during the presale.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <input
          type="text"
          value={refLink || ''}
          readOnly
          className="w-full md:w-2/3 px-3 py-2 rounded-lg bg-white/10 text-white border border-purple-400/30"
        />
        <button
          onClick={copyToClipboard}
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition"
        >
          Copy
        </button>
      </div>
    </section>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="bg-gradient-to-br from-black via-purple-900 to-blue-900 text-white min-h-screen">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact" theme={darkTheme()}>

              {/* Navbar */}
              <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo-cryptix.png"
                      alt="Cryptix Logo"
                      width={140}
                      height={40}
                      priority
                    />
                  </Link>

                  <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
                    <a href="#presale" className="hover:text-purple-400 transition">Presale</a>
                    <a href="#roadmap" className="hover:text-purple-400 transition">Roadmap</a>
                    <a href="#whitepaper" className="hover:text-purple-400 transition">Whitepaper</a>
                    <a href="#community" className="hover:text-purple-400 transition">Community</a>
                  </nav>

                  <div className="flex items-center gap-4">
                    <ConnectButton />
                  </div>
                </div>
              </header>

              {/* Hero */}
              <section className="relative text-center py-24 md:py-32 bg-gradient-to-b from-transparent to-black/40">
                <h1
                  className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
                  data-aos="fade-down"
                >
                  The Future of Crypto Starts with <span className="text-purple-400">Cryptix</span>
                </h1>
                <p
                  className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/90"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Fast. Secure. Limitless. Join the presale and become an early believer of CRPX.
                </p>
                <div className="mt-8" data-aos="zoom-in" data-aos-delay="400">
                  <a
                    href="#presale"
                    className="inline-block px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.9)] transition"
                  >
                    🚀 Join Presale
                  </a>
                </div>
              </section>

              {/* Main */}
              <div className="max-w-5xl mx-auto px-4 py-12" id="presale">
                {children}

                {/* Referral Section */}
                <ReferralSection />

                {/* How to Buy Section */}
                <section
                  id="how-to-buy"
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-lg mt-16"
                  data-aos="fade-up"
                >
                  <h3 className="text-2xl font-bold mb-6 text-purple-400">💰 How to Buy CRPX</h3>
                  <ul className="space-y-4 text-left">
                    <li className="text-lg text-purple-400 font-semibold">
                      1️⃣ Connect your wallet (MetaMask, TrustWallet, WalletConnect).
                    </li>
                    <li className="text-lg text-cyan-400 font-semibold">
                      2️⃣ Choose payment: BNB or USDT (BEP20 on BNB Chain).
                    </li>
                    <li className="text-lg text-purple-400 font-semibold">
                      3️⃣ Enter the amount and confirm the transaction.
                    </li>
                    <li className="text-lg text-cyan-400 font-semibold">
                      4️⃣ After presale ends, claim your CRPX tokens directly from the site.
                    </li>
                  </ul>
                  <p className="mt-6">
                    Visit:{" "}
                    <a href="https://cryptixcoin.com" target="_blank" className="text-black font-bold underline">
                      cryptixcoin.com
                    </a>
                  </p>
                </section>

                <footer className="mt-20 space-y-10 text-center">
                  {/* Only one logo */}
                  <div className="flex justify-center gap-6" data-aos="fade-up">
                    <Image
                      src="/logo-cryptix.png"
                      alt="Cryptix Logo"
                      width={160}
                      height={160}
                    />
                  </div>

                  {/* Roadmap */}
                  <section
                    id="roadmap"
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-10 shadow-lg mt-16"
                    data-aos="fade-up"
                  >
                    <h2 className="text-3xl font-bold text-center mb-12 text-purple-400 drop-shadow">
                      🚀 Roadmap
                    </h2>

                    <div className="relative grid md:grid-cols-4 gap-10 md:gap-8 text-center">
                      <div className="p-6 rounded-2xl border border-purple-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] hover:scale-105 transition relative">
                        <p className="text-lg font-semibold text-white">🔹 Phase 1</p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Presale Launch: Deploy Cryptix smart contracts, open presale platform with BNB & USDT
                          support, and start first wave of marketing campaigns. Ensure secure token distribution
                          and seamless user experience.
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl border border-green-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.9)] hover:scale-105 transition relative">
                        <p className="text-lg font-semibold text-white">🌍 Phase 2</p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Community Growth: Build global awareness through AMAs, influencer collaborations,
                          referral programs, and social media expansion. Engage with early adopters and reward loyal
                          supporters.
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl border border-blue-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.9)] hover:scale-105 transition relative">
                        <p className="text-lg font-semibold text-white">📈 Phase 3</p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Exchange Listings: Apply for CoinGecko & CoinMarketCap, secure CEX/DEX listings, and
                          launch staking pools. Form NFT marketplace collaborations to add real use cases for CRPX.
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl border border-pink-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] hover:scale-105 transition relative">
                        <p className="text-lg font-semibold text-white">♾ Phase 4</p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Ecosystem Expansion: Launch P2E gaming integration, expand DeFi utilities (staking,
                          farming, liquidity pools), and develop cross-chain bridges. Global brand partnerships and
                          mainstream marketing to scale Cryptix worldwide.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Whitepaper */}
                  <section id="whitepaper" data-aos="fade-up">
                    <a
                      href="/Cryptix-whitepaper.pdf"
                      target="_blank"
                      className="inline-block px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition"
                    >
                      📑 Read Whitepaper
                    </a>
                  </section>

                  {/* Community */}
                  <section
                    id="community"
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg"
                    data-aos="fade-up"
                  >
                    <h3 className="text-lg font-semibold mb-6">Join Our Community</h3>
                    <div className="flex justify-center gap-6">
                      <a href="https://t.me/cryptixcoin" target="_blank" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition">
                        <FaTelegramPlane size={24} />
                      </a>
                      <a href="https://x.com/cryptix_ai25?s=21" target="_blank" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition">
                        <FaTwitter size={24} />
                      </a>
                      <a href="#" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition">
                        <FaDiscord size={24} />
                      </a>
                      <a href="#" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition">
                        <FaGlobe size={24} />
                      </a>
                    </div>
                  </section>
                </footer>
              </div>

            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
