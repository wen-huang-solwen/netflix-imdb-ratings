import { useState, useEffect } from 'react'
import type { Movie } from '../types/movie'
import { searchMovies } from '../services/tmdb'

export function useMovieSearch(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      setTotalPages(0)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchMovies(query, page)
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
  }, [query, page])

  return { movies, totalPages, loading, error }
}
