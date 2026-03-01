const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || import.meta.env.VITE_INSFORGE_URL || ''

export function getPhotoUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${baseUrl}/api/storage/buckets/photos/objects/${encodeURIComponent(path)}`
}
