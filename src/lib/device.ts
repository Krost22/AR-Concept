export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined'
}

export function isSecureContext(): boolean {
  return isBrowser() ? window.isSecureContext : false
}

export function isTouchDevice(): boolean {
  if (!isBrowser()) return false
  return navigator.maxTouchPoints > 0
}

export function isMobileDevice(): boolean {
  if (!isBrowser()) return false
  const userAgent = navigator.userAgent
  const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(userAgent)
  const ipadOs = userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1
  return mobileUserAgent || ipadOs
}

export function supportsCamera(): boolean {
  if (!isBrowser()) return false
  return typeof navigator.mediaDevices?.getUserMedia === 'function'
}
