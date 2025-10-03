'use client'

import './globals.css'
import { useEffect } from 'react'
import AOS from 'aos'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/wallet'
import Link from 'next/link'
import Image from 'next/image'
import { FaTelegramPlane, FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize AOS animations
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
        {/* ✅ Custom favicon (cache-busted so browser reloads it) */}
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
        <title>Cryptix Presale</title>
      </head>
      <body className="bg-gradient-to-br from-black via-purple-900 to-blue-900 text-white min-h-screen">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact" theme={darkTheme()}>

              {/* Navbar */}
              <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                  
                  {/* Left: Logo */}
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo-cryptix.png"
                      alt="Cryptix Logo"
                      width={140}
                      height={40}
                      priority
                    />
                  </Link>

                  {/* Center: Nav Links */}
                  <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
                    <a href="#presale" className="hover:text-purple-400 transition">Presale</a>
                    <a href="#roadmap" className="hover:text-purple-400 transition">Roadmap</a>
                    <a href="#whitepaper" className="hover:text-purple-400 transition">Whitepaper</a>
                    <a href="#community" className="hover:text-purple-400 transition">Community</a>
                  </nav>

                  {/* Right: Wallet Button */}
                  <div className="flex items-center gap-4">
                    <ConnectButton />
                  </div>
                </div>
              </header>

              {/* Hero Section */}
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

              {/* Main Content */}
              <div className="max-w-5xl mx-auto px-4 py-12" id="presale">
                {children}

                {/* Footer */}
                <footer className="mt-20 space-y-10 text-center">

                  {/* Logos Side by Side */}
                  <div className="flex justify-center gap-6" data-aos="fade-up">
                    <Image
                      src="/logo-cryptix.png"
                      alt="Cryptix Neon Logo"
                      width={160}
                      height={160}
                    />
                    <Image
                      src="/logo-original.png"
                      alt="Cryptix Original Logo"
                      width={160}
                      height={160}
                      className="rounded-lg"
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

                    <div className="relative">
                      {/* Neon line for desktop */}
                      <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-green-500 via-blue-500 to-pink-500 blur-sm opacity-70"></div>
                      {/* Neon line for mobile */}
                      <div className="md:hidden absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-purple-500 via-green-500 via-blue-500 to-pink-500 blur-sm opacity-70"></div>

                      {/* Roadmap phases */}
                      <div className="relative grid md:grid-cols-4 gap-10 md:gap-8 text-center">
                        <div className="p-6 rounded-2xl border border-purple-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 transition relative" data-aos="fade-up">
                          <p className="text-lg font-semibold text-white">🔹 Phase 1</p>
                          <p className="mt-2 text-sm text-zinc-300">Presale Launch</p>
                        </div>

                        <div className="p-6 rounded-2xl border border-green-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_35px_rgba(34,197,94,0.6)] hover:scale-105 transition relative" data-aos="fade-up" data-aos-delay="200">
                          <p className="text-lg font-semibold text-white">🌍 Phase 2</p>
                          <p className="mt-2 text-sm text-zinc-300">Community Growth</p>
                        </div>

                        <div className="p-6 rounded-2xl border border-blue-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:scale-105 transition relative" data-aos="fade-up" data-aos-delay="400">
                          <p className="text-lg font-semibold text-white">📈 Phase 3</p>
                          <p className="mt-2 text-sm text-zinc-300">Exchange Listings</p>
                        </div>

                        <div className="p-6 rounded-2xl border border-pink-500/40 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:scale-105 transition relative" data-aos="fade-up" data-aos-delay="600">
                          <p className="text-lg font-semibold text-white">♾ Phase 4</p>
                          <p className="mt-2 text-sm text-zinc-300">Ecosystem Expansion</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Whitepaper */}
                  <section id="whitepaper" data-aos="fade-up" data-aos-delay="200">
                    <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      className="inline-block px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition"
                    >
                      📑 Read Whitepaper
                    </a>
                  </section>

                  {/* Socials */}
                  <section
                    id="community"
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <h3 className="text-lg font-semibold mb-6">Join Our Community</h3>
                    <div className="flex justify-center gap-6">
                      <a href="https://t.me/cryptixcoin" target="_blank" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.6)] transition">
                        <FaTelegramPlane size={24} />
                      </a>
                      <a href="https://x.com/cryptix_ai25?s=21" target="_blank" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.6)] transition">
                        <FaTwitter size={24} />
                      </a>
                      <a href="#" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.6)] transition">
                        <FaDiscord size={24} />
                      </a>
                      <a href="#" className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.6)] transition">
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
