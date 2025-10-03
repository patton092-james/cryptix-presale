'use client'

import { useEffect, useMemo, useState } from 'react'
import {
useAccount,
usePublicClient,
useWriteContract,
useWaitForTransactionReceipt,
useBalance,
} from 'wagmi'
import { formatEther, parseEther, parseUnits, formatUnits } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast, { Toaster } from 'react-hot-toast'

// Addresses
const presaleAddress = '0x275d27f222412033A43747eBF8D996FadbF0603a'
const tokenAddress = '0xc20F68e63ADEE0d8934e72bb8cC809C6E1770758'

// ABIs
import presaleAbi from '@/lib/abis/presale.json'
import tokenAbi from '@/lib/abis/token.json'

type PhaseInfo = {
priceUSD: bigint
allocation: bigint
sold: bigint
}

const ALLOWED_PRICES = [0.001, 0.005, 0.01, 0.05, 0.1]
const DECIMAL_CANDIDATES = [18, 8, 6, 3, 0] as const

function clamp(n: number, min: number, max: number) {
return Math.max(min, Math.min(max, n))
}

export default function PresalePage() {
const { address } = useAccount()
const publicClient = usePublicClient()

// Inputs
const [bnbAmount, setBnbAmount] = useState('')
const [usdtAmount, setUsdtAmount] = useState('')

// Expected outputs
const [bnbTokens, setBnbTokens] = useState('0')
const [usdtTokens, setUsdtTokens] = useState('0')

// On-chain state
const [presaleStart, setPresaleStart] = useState<number>(0)
const [presaleEnd, setPresaleEnd] = useState<number>(0)
const [currentPhase, setCurrentPhase] = useState<number | null>(null)
const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null)
const [purchased, setPurchased] = useState<string>('0')
const [bnbPrice, setBnbPrice] = useState<number>(0)
const [usdtAddress, setUsdtAddress] = useState<string>('')
const [usdtDecimals, setUsdtDecimals] = useState<number>(18)
const [usdtBalance, setUsdtBalance] = useState<string>('0')

const [pricePerTokenUSD, setPricePerTokenUSD] = useState<number>(0)

// Clock
const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000))
useEffect(() => {
const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
return () => clearInterval(t)
}, [])

const { data: bnbBalanceData } = useBalance({ address })

// ---------- Helpers ----------
const readPresale = async <T,>(fn: string, args: any[] = []) => {
if (!publicClient) throw new Error('No public client')
return publicClient.readContract({
address: presaleAddress,
abi: presaleAbi as any,
functionName: fn as any,
args,
}) as Promise<T>
}

const readErc20 = async <T,>(tokenAddr: string, fn: string, args: any[] = []) => {
if (!publicClient) throw new Error('No public client')
return publicClient.readContract({
address: tokenAddr as `0x${string}`,
abi: tokenAbi as any,
functionName: fn as any,
args,
}) as Promise<T>
}

// ---------- Fetch data ----------
const fetchTimes = async () => {
try {
const start = await readPresale<bigint>('presaleStart')
const end = await readPresale<bigint>('presaleEnd')
setPresaleStart(Number(start))
setPresaleEnd(Number(end))
} catch (e) { console.error('fetchTimes', e) }
}

const fetchCurrentPhaseAndInfo = async () => {
try {
const phaseRaw = await readPresale<bigint>('currentPhase')
const phaseNum = Number(phaseRaw)
setCurrentPhase(phaseNum)

let info: PhaseInfo | null = null
try {
const r = await readPresale<any>('phases', [phaseNum])
info = { priceUSD: r[0], allocation: r[1], sold: r[2] }
} catch {
if (phaseNum > 0) {
const r = await readPresale<any>('phases', [phaseNum - 1])
info = { priceUSD: r[0], allocation: r[1], sold: r[2] }
}
}
setPhaseInfo(info)
if (info) autoGuessPriceScale(info.priceUSD)
} catch (e) { console.error('fetchCurrentPhaseAndInfo', e) }
}

const autoGuessPriceScale = (raw: bigint) => {
let best = { p: parseFloat(formatUnits(raw, 18)), score: Infinity }
for (const d of DECIMAL_CANDIDATES) {
const p = parseFloat(formatUnits(raw, d))
if (p <= 0 || p > 2) continue
const nearest = ALLOWED_PRICES.reduce((acc, val) => Math.min(acc, Math.abs(val - p)), Infinity)
if (nearest < best.score) best = { p, score: nearest }
}
setPricePerTokenUSD(best.p > 0 ? best.p : parseFloat(formatUnits(raw, 18)))
}

const fetchBNBPrice = async () => {
try {
const p = await readPresale<bigint>('getLatestBNBPrice')
setBnbPrice(Number(p) / 1e8)
} catch (e) { console.error('fetchBNBPrice', e) }
}

const fetchPurchased = async () => {
if (!address) return
try {
const amt = await readPresale<bigint>('purchased', [address])
setPurchased(formatEther(amt))
} catch (e) { console.error('fetchPurchased', e) }
}

const fetchUSDTMeta = async () => {
try {
const usdt = await readPresale<`0x${string}`>('usdt')
setUsdtAddress(usdt)
const dec = await readErc20<bigint>(usdt, 'decimals')
setUsdtDecimals(Number(dec))
const bal = await readErc20<bigint>(usdt, 'balanceOf', [address])
setUsdtBalance(formatUnits(bal, Number(dec)))
} catch (e) { console.warn('fetchUSDTMeta', e) }
}

const refreshAll = async (withToast = true) => {
await Promise.allSettled([
fetchTimes(),
fetchCurrentPhaseAndInfo(),
fetchBNBPrice(),
fetchPurchased(),
fetchUSDTMeta(),
])
if (withToast) toast.success('Data refreshed')
}

useEffect(() => { refreshAll(false) }, [publicClient, address])

// ---------- Calculate expected tokens ----------
useEffect(() => {
if (!bnbAmount || !bnbPrice || !phaseInfo || pricePerTokenUSD <= 0) {
setBnbTokens('0')
return
}
const usd = Number(bnbAmount) * bnbPrice
const tokens = usd / pricePerTokenUSD
setBnbTokens(tokens.toFixed(2))
}, [bnbAmount, bnbPrice, phaseInfo, pricePerTokenUSD])

useEffect(() => {
if (!usdtAmount || pricePerTokenUSD <= 0) {
setUsdtTokens('0')
return
}
const tokens = Number(usdtAmount) / pricePerTokenUSD
setUsdtTokens(tokens.toFixed(2))
}, [usdtAmount, pricePerTokenUSD])

// ---------- Writers ----------
const { writeContract, data: txHash } = useWriteContract()
const { isLoading: txPending, isSuccess: txSuccess, isError: txError } =
useWaitForTransactionReceipt({ hash: txHash })

useEffect(() => {
if (txPending) toast.loading('Transaction pending...', { id: 'tx' })
if (txSuccess) { toast.success('Transaction confirmed!', { id: 'tx' }); refreshAll(false) }
if (txError) toast.error('Transaction failed', { id: 'tx' })
}, [txPending, txSuccess, txError])

const buyWithBNB = () => {
if (!bnbAmount || Number(bnbAmount) <= 0) return toast.error('Enter BNB amount')
try {
writeContract({
address: presaleAddress,
abi: presaleAbi as any,
functionName: 'buyWithBNB',
value: parseEther(bnbAmount),
})
} catch { toast.error('Failed to send transaction') }
}

const buyWithUSDT = async () => {
if (!usdtAmount || Number(usdtAmount) <= 0) return toast.error('Enter USDT amount')
if (!usdtAddress) { await fetchUSDTMeta(); if (!usdtAddress) return toast.error('USDT address unavailable') }
try {
const amount = parseUnits(usdtAmount, usdtDecimals)
await writeContract({
address: usdtAddress as `0x${string}`,
abi: tokenAbi as any,
functionName: 'approve',
args: [presaleAddress, amount],
})
await writeContract({
address: presaleAddress,
abi: presaleAbi as any,
functionName: 'buyWithUSDT',
args: [amount],
})
} catch { toast.error('USDT purchase failed') }
}

const claimTokens = () => {
try {
writeContract({
address: presaleAddress,
abi: presaleAbi as any,
functionName: 'claimTokens',
})
} catch { toast.error('Claim failed') }
}

// ---------- Derived values ----------
const statusText = useMemo(() => {
if (!presaleStart || !presaleEnd) return 'Loading...'
if (now < presaleStart) return 'Presale not started yet'
if (now > presaleEnd) return 'Presale ended'
return 'Presale live'
}, [now, presaleStart, presaleEnd])

const progressPct = useMemo(() => {
if (!phaseInfo || phaseInfo.allocation === 0n) return 0
return clamp((Number(phaseInfo.sold) / Number(phaseInfo.allocation)) * 100, 0, 100)
}, [phaseInfo])

// ---------- UI ----------
return (
<main className="mx-auto max-w-4xl px-4 py-12">
<div className="flex items-center justify-between">
<h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">Cryptix Presale</h1>
<ConnectButton />
</div>

{/* Countdown */}
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
<h2 className="text-lg font-semibold">Countdown</h2>
<p className="mt-2 text-sm text-zinc-300">
Start: {presaleStart ? new Date(presaleStart * 1000).toLocaleString() : '—'}
</p>
<p className="text-sm text-zinc-300">
End: {presaleEnd ? new Date(presaleEnd * 1000).toLocaleString() : '—'}
</p>
<p className="mt-2 text-green-400">{statusText}</p>
</section>

{/* Phase Info */}
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold">Phase Info</h2>
<button
onClick={() => refreshAll()}
className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition"
>
🔄 Refresh
</button>
</div>
{phaseInfo ? (
<div className="mt-3 grid grid-cols-2 gap-3 text-sm">
<div>Phase: <span className="text-zinc-200">{currentPhase ?? '—'}</span></div>
<div>BNB/USD: <span className="text-zinc-200">{bnbPrice ? `$${bnbPrice.toFixed(2)}` : '—'}</span></div>
<div>Price / CRPX: <span className="text-zinc-200">${pricePerTokenUSD.toFixed(6)}</span></div>
<div>Allocation: <span className="text-zinc-200">{formatEther(phaseInfo.allocation)} CRPX</span></div>
<div>Sold: <span className="text-zinc-200">{formatEther(phaseInfo.sold)} CRPX</span></div>
<div className="col-span-2 mt-1">
<div className="h-2 w-full rounded bg-zinc-800">
<div className="h-2 rounded bg-emerald-500" style={{ width: `${progressPct}%` }} />
</div>
<div className="mt-1 text-xs text-zinc-400">{progressPct}% sold</div>
</div>
</div>
) : <p className="mt-2 text-sm">Loading...</p>}
</section>

{/* Buy Section with Glassmorphism + Neon Glow */}
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
<h2 className="text-lg font-semibold mb-4">Buy CRPX</h2>
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
{/* BNB */}
<div className="rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-md">
<div className="flex justify-between items-center">
<label className="text-sm font-medium text-zinc-300">Pay with BNB</label>
{bnbBalanceData && (
<button
onClick={() => setBnbAmount(bnbBalanceData.formatted)}
className="text-xs text-emerald-400 hover:underline"
>
Max: {Number(bnbBalanceData.formatted).toFixed(4)} BNB
</button>
)}
</div>
<input
type="number"
min="0"
step="any"
placeholder="Enter BNB amount"
className="mt-2 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none text-white"
value={bnbAmount}
onChange={(e) => setBnbAmount(e.target.value)}
/>
<p className="mt-2 text-sm text-zinc-300">
You will receive: <b>{bnbTokens}</b> CRPX
</p>
<button
onClick={buyWithBNB}
className="mt-3 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] transition"
>
Buy with BNB
</button>
</div>

{/* USDT */}
<div className="rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-md">
<div className="flex justify-between items-center">
<label className="text-sm font-medium text-zinc-300">Pay with USDT</label>
{usdtBalance && (
<button
onClick={() => setUsdtAmount(usdtBalance)}
className="text-xs text-blue-400 hover:underline"
>
Max: {Number(usdtBalance).toFixed(2)} USDT
</button>
)}
</div>
<input
type="number"
min="0"
step="any"
placeholder="Enter USDT amount"
className="mt-2 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none text-white"
value={usdtAmount}
onChange={(e) => setUsdtAmount(e.target.value)}
/>
<p className="mt-2 text-sm text-zinc-300">
You will receive: <b>{usdtTokens}</b> CRPX
</p>
<button
onClick={buyWithUSDT}
className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition"
>
Buy with USDT
</button>
</div>
</div>
</section>

{/* Purchases */}
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
<h2 className="text-lg font-semibold">Your Purchases</h2>
<p className="mt-2 text-sm text-zinc-300">{purchased} CRPX</p>
</section>

{/* Claim */}
{now > presaleEnd && presaleEnd > 0 && (
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg">
<button
onClick={claimTokens}
className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition"
>
Claim Tokens
</button>
</section>
)}

<Toaster position="top-right" />
</main>
)
}
