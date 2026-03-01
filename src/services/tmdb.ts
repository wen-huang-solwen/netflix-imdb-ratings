import type { Movie, MovieDetail, Genre, TMDBResponse } from '../types/movie'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'zh-TW')
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`TMDB API 錯誤：${res.status} ${res.statusText}`)
  }
  return res.json()
}

function mergeEnglishTitles(zhMovies: Movie[], enMovies: Movie[]): Movie[] {
  const enMap = new Map(enMovies.map(m => [m.id, m.title]))
  return zhMovies.map(m => ({
    ...m,
    english_title: enMap.get(m.id) ?? m.original_title,
  }))
}

export async function discoverNetflixTW(
  page: number = 1,
  sortBy: string = 'popularity.desc',
  genreId?: number,
): Promise<TMDBResponse<Movie>> {
  const params: Record<string, string> = {
    with_watch_providers: '8',
    watch_region: 'TW',
    sort_by: sortBy,
    page: String(page),
  }
  if (sortBy === 'vote_average.desc') {
    params['vote_count.gte'] = '50'
  }
  if (genreId) {
    params.with_genres = String(genreId)
  }

  const [zhResult, enResult] = await Promise.all([
    fetchTMDB<TMDBResponse<Movie>>('/discover/movie', params),
    fetchTMDB<TMDBResponse<Movie>>('/discover/movie', { ...params, language: 'en-US' }),
  ])

  return {
    ...zhResult,
    results: mergeEnglishTitles(zhResult.results, enResult.results),
  }
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<TMDBResponse<Movie>> {
  const [zhResult, enResult] = await Promise.all([
    fetchTMDB<TMDBResponse<Movie>>('/search/movie', {
      query,
      page: String(page),
    }),
    fetchTMDB<TMDBResponse<Movie>>('/search/movie', {
      query,
      page: String(page),
      language: 'en-US',
    }),
  ])

  // Merge English titles into zh-TW results
  const merged = mergeEnglishTitles(zhResult.results, enResult.results)

  // Add unique en-US results not in zh-TW
  const seenIds = new Set(zhResult.results.map(m => m.id))
  const uniqueEn = enResult.results
    .filter(m => !seenIds.has(m.id))
    .map(m => ({ ...m, english_title: m.title }))

  return {
    ...zhResult,
    results: [...merged, ...uniqueEn],
    total_results: zhResult.total_results + uniqueEn.length,
  }
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  const [zhDetail, enDetail] = await Promise.all([
    fetchTMDB<MovieDetail>(`/movie/${movieId}`, {
      append_to_response: 'external_ids,watch/providers',
    }),
    fetchTMDB<MovieDetail>(`/movie/${movieId}`, {
      language: 'en-US',
    }),
  ])

  return {
    ...zhDetail,
    english_title: enDetail.title,
  }
}

export async function getGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/movie/list')
  return data.genres
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getIMDBUrl(imdbId: string): string {
  return `https://www.imdb.com/title/${imdbId}/`
}

export function isOnNetflixTW(detail: MovieDetail): boolean {
  const tw = detail['watch/providers']?.results?.TW
  return tw?.flatrate?.some(p => p.provider_id === 8) ?? false
}
