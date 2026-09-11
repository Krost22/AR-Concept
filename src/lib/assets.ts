const EXTERNAL_URL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i

export function assetUrl(path: string): string {
  if (EXTERNAL_URL.test(path) || path.startsWith('data:')) return path
  const normalized = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
