/**
 * Enhanced local storage management with compression, encryption, and quota management
 */

import { compressToUTF16, decompressFromUTF16 } from "lz-string"

// Types
interface StorageOptions {
  compress?: boolean
  encrypt?: boolean
  expiry?: number // in milliseconds
}

interface StorageItem<T> {
  value: T
  timestamp: number
  expiry?: number
}

// Default options
const defaultOptions: StorageOptions = {
  compress: true,
  encrypt: false,
  expiry: undefined,
}

// Simple XOR encryption (for demo purposes - not secure for production)
const encryptionKey = "naijaspark-quiz-app"
function simpleEncrypt(str: string): string {
  let result = ""
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length))
  }
  return btoa(result) // Base64 encode
}

function simpleDecrypt(str: string): string {
  const decoded = atob(str) // Base64 decode
  let result = ""
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length))
  }
  return result
}

// Storage quota management
async function checkStorageQuota(): Promise<{ available: boolean; usage: number; quota: number }> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const available = usage < quota * 0.9 // 90% threshold

    return { available, usage, quota }
  }

  return { available: true, usage: 0, quota: 0 }
}

// Enhanced set function
export async function setItem<T>(key: string, value: T, options?: StorageOptions): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    // Check storage quota
    const { available } = await checkStorageQuota()
    if (!available) {
      console.warn("Storage quota nearly full. Attempting to clear old items.")
      await clearOldItems()
    }

    // Merge options with defaults
    const opts = { ...defaultOptions, ...options }

    // Prepare item with metadata
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiry: opts.expiry ? Date.now() + opts.expiry : undefined,
    }

    // Convert to string
    let serialized = JSON.stringify(item)

    // Compress if needed
    if (opts.compress) {
      serialized = compressToUTF16(serialized)
    }

    // Encrypt if needed
    if (opts.encrypt) {
      serialized = simpleEncrypt(serialized)
    }

    // Store with prefix to identify enhanced items
    localStorage.setItem(`enhanced_${key}`, serialized)
    return true
  } catch (error) {
    console.error("Error storing item:", error)

    // Fallback to regular storage without enhancements
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (fallbackError) {
      console.error("Fallback storage failed:", fallbackError)
      return false
    }
  }
}

// Enhanced get function
export function getItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === "undefined") return defaultValue || null

  try {
    // Try to get enhanced item first
    const serialized = localStorage.getItem(`enhanced_${key}`)

    if (serialized) {
      // Assume it's an enhanced item

      // Try to decrypt (if it was encrypted)
      let deserialized: string
      try {
        deserialized = simpleDecrypt(serialized)
      } catch (e) {
        // If decryption fails, assume it wasn't encrypted
        deserialized = serialized
      }

      // Try to decompress (if it was compressed)
      try {
        deserialized = decompressFromUTF16(deserialized) || deserialized
      } catch (e) {
        // If decompression fails, assume it wasn't compressed
      }

      // Parse the item
      const item: StorageItem<T> = JSON.parse(deserialized)

      // Check if expired
      if (item.expiry && item.expiry < Date.now()) {
        localStorage.removeItem(`enhanced_${key}`)
        return defaultValue || null
      }

      return item.value
    }

    // Fallback to regular item
    const regularItem = localStorage.getItem(key)
    if (regularItem) {
      return JSON.parse(regularItem)
    }

    return defaultValue || null
  } catch (error) {
    console.error("Error retrieving item:", error)
    return defaultValue || null
  }
}

// Remove item
export function removeItem(key: string): boolean {
  if (typeof window === "undefined") return false

  try {
    localStorage.removeItem(`enhanced_${key}`)
    localStorage.removeItem(key) // Also remove regular key if it exists
    return true
  } catch (error) {
    console.error("Error removing item:", error)
    return false
  }
}

// Clear all enhanced items
export function clearEnhancedItems(): boolean {
  if (typeof window === "undefined") return false

  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("enhanced_")) {
        localStorage.removeItem(key)
      }
    })
    return true
  } catch (error) {
    console.error("Error clearing enhanced items:", error)
    return false
  }
}

// Clear old items (expired or oldest)
export async function clearOldItems(): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const items: { key: string; timestamp: number; expiry?: number }[] = []

    // Collect all enhanced items with their timestamps
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("enhanced_")) {
        try {
          const serialized = localStorage.getItem(key)
          if (!serialized) return

          // Try to decrypt and decompress
          let deserialized = serialized
          try {
            deserialized = simpleDecrypt(deserialized)
          } catch (e) {}

          try {
            deserialized = decompressFromUTF16(deserialized) || deserialized
          } catch (e) {}

          const item = JSON.parse(deserialized)
          items.push({
            key,
            timestamp: item.timestamp,
            expiry: item.expiry,
          })
        } catch (e) {
          // Skip items that can't be parsed
        }
      }
    })

    // First remove expired items
    const now = Date.now()
    const expiredItems = items.filter((item) => item.expiry && item.expiry < now)
    expiredItems.forEach((item) => localStorage.removeItem(item.key))

    // If we removed some expired items, we're done
    if (expiredItems.length > 0) {
      return true
    }

    // Otherwise, remove the oldest 20% of items
    items.sort((a, b) => a.timestamp - b.timestamp)
    const removeCount = Math.ceil(items.length * 0.2)
    items.slice(0, removeCount).forEach((item) => localStorage.removeItem(item.key))

    return true
  } catch (error) {
    console.error("Error clearing old items:", error)
    return false
  }
}

// Get storage usage statistics
export async function getStorageStats(): Promise<{
  usage: number
  quota: number
  percentUsed: number
  itemCount: number
  enhancedItemCount: number
}> {
  if (typeof window === "undefined") {
    return { usage: 0, quota: 0, percentUsed: 0, itemCount: 0, enhancedItemCount: 0 }
  }

  try {
    const { usage, quota } = await checkStorageQuota()
    const percentUsed = quota > 0 ? (usage / quota) * 100 : 0
    const itemCount = localStorage.length
    const enhancedItemCount = Object.keys(localStorage).filter((key) => key.startsWith("enhanced_")).length

    return {
      usage,
      quota,
      percentUsed,
      itemCount,
      enhancedItemCount,
    }
  } catch (error) {
    console.error("Error getting storage stats:", error)
    return { usage: 0, quota: 0, percentUsed: 0, itemCount: 0, enhancedItemCount: 0 }
  }
}

