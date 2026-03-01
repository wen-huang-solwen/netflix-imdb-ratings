import type { OMDbRatings } from '../types/movie'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com'

interface OMDbResponse {
  Response: string
  imdbRating?: string
  Metascore?: string
  Ratings?: { Source: string; Value: string }[]
}

export async function getOMDbRatings(imdbId: string): Promise<OMDbRatings | null> {
  const url = `${BASE_URL}/?apikey=${API_KEY}&i=${imdbId}`
  const res = await fetch(url)
  if (!res.ok) return null

  const data: OMDbResponse = await res.json()
  if (data.Response !== 'True') return null

  const rt = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')

  return {
    imdbRating: data.imdbRating ?? 'N/A',
    rottenTomatoes: rt?.Value ?? null,
    metascore: data.Metascore ?? 'N/A',
  }
}
