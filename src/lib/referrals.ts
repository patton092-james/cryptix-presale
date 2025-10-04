'use client'

import { supabase } from './supabaseClient'

/**
 * Save a new user (wallet) to Supabase with auto-generated referral code.
 */
export async function saveUser(walletAddress: string) {
  if (!walletAddress) return

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ wallet_address: walletAddress }])
      .select()

    if (error) {
      console.error('Error saving user:', error.message)
      return null
    }

    return data?.[0]
  } catch (err) {
    console.error('Unexpected error saving user:', err)
    return null
  }
}

/**
 * Record a referral (User A refers User B).
 */
export async function recordReferral(referrerWallet: string, referredWallet: string) {
  if (!referrerWallet || !referredWallet) return

  try {
    const { data, error } = await supabase
      .from('referrals')
      .insert([
        {
          referrer_wallet: referrerWallet,
          referred_wallet: referredWallet,
        },
      ])
      .select()

    if (error) {
      console.error('Error recording referral:', error.message)
      return null
    }

    return data?.[0]
  } catch (err) {
    console.error('Unexpected error recording referral:', err)
    return null
  }
}

/**
 * Get a user's referral code by wallet.
 */
export async function getReferralCode(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('referral_code')
    .eq('wallet_address', walletAddress)
    .single()

  if (error) {
    console.error('Error fetching referral code:', error.message)
    return null
  }

  return data?.referral_code
}
