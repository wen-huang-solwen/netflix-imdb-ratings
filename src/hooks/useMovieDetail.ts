import { useState, useEffect } from 'react'
import type { MovieDetail } from '../types/movie'
import { getMovieDetail } from '../services/tmdb'

export function useMovieDetail(movieId: number | null) {
  const [detail, setDetail] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setDetail(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getMovieDetail(movieId)
      .then(data => {
        if (!cancelled) setDetail(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [movieId])

  return { detail, loading, error }
}
