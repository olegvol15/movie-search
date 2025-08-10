const API = 'https://www.omdbapi.com/'
const KEY = import.meta.env.VITE_OMDB_API_KEY

export async function searchMovies({ q, page = 1, type = 'movie' }) {
  const params = new URLSearchParams({ apikey: KEY, s: q, page: String(page), type })
  const res = await fetch(`${API}?${params.toString()}`)
  const data = await res.json()
  if (data.Response === 'True') return { items: data.Search || [], total: Number(data.totalResults) || 0 }
  throw new Error(data.Error || 'Search failed')
}

export async function getMovieById(id) {
  const params = new URLSearchParams({ apikey: KEY, i: id, plot: 'full' })
  const res = await fetch(`${API}?${params.toString()}`)
  return res.json()
}