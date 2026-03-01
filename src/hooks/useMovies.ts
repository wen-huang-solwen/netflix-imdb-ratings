import { useState, useEffect } from 'react'
import type { Movie, SortOption } from '../types/movie'
import { discoverNetflixTW } from '../services/tmdb'

export function useMovies(page: number, sortBy: SortOption, genreId?: number) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    discoverNetflixTW(page, sortBy, genreId)
      .then(data => {
        if (!cancelled) {
          setMovies(data.results)
          setTotalPages(Math.min(data.total_pages, 500))
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, sortBy, genreId])

  return { movies, totalPages, loading, error }
}
