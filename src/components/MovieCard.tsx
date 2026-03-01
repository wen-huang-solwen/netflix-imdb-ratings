import { useState, useEffect } from 'react'
import type { Movie, OMDbRatings } from '../types/movie'
import { getImageUrl, getMovieDetail } from '../services/tmdb'
import { getOMDbRatings } from '../services/omdb'
import { RatingBadge } from './RatingBadge'

interface MovieCardProps {
  movie: Movie
  onClick: (movie: Movie) => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const [ratings, setRatings] = useState<OMDbRatings | null>(null)
  const [loadingRatings, setLoadingRatings] = useState(true)
  const year = movie.release_date?.split('-')[0] || ''
  const posterUrl = getImageUrl(movie.poster_path, 'w342')

  useEffect(() => {
    let cancelled = false
    setLoadingRatings(true)
    setRatings(null)

    getMovieDetail(movie.id)
      .then(detail => {
        const imdbId = detail.external_ids?.imdb_id
        if (imdbId && !cancelled) {
          return getOMDbRatings(imdbId)
        }
        return null
      })
      .then(omdb => {
        if (!cancelled) setRatings(omdb)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingRatings(false)
      })

    return () => { cancelled = true }
  }, [movie.id])

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 hover:ring-2 hover:ring-red-600">
      <div
        onClick={() => onClick(movie)}
        className="relative cursor-pointer"
      >
        <div className="aspect-[2/3] w-full">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-700 text-gray-400">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{movie.title}</h3>
          {movie.english_title && movie.english_title !== movie.title && (
            <p className="line-clamp-1 text-xs text-gray-400">{movie.english_title}</p>
          )}
          <div className="mt-1 flex items-center gap-2">
            {movie.vote_average > 0 && <RatingBadge rating={movie.vote_average} />}
            {year && <span className="text-xs text-gray-400">{year}</span>}
          </div>
        </div>
      </div>

      {/* Ratings bar */}
      <div className="flex items-center justify-center gap-2 bg-gray-900 px-2 py-2">
        {loadingRatings ? (
          <span className="text-xs text-gray-500">載入評分中...</span>
        ) : ratings ? (
          <>
            {ratings.imdbRating !== 'N/A' && (
              <span className="inline-flex items-center gap-1.5 rounded bg-yellow-500 px-2 py-1 text-sm font-bold text-black">
                IMDb {ratings.imdbRating}
              </span>
            )}
            {ratings.rottenTomatoes && (
              <span className="inline-flex items-center gap-1.5 rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
                🍅 {ratings.rottenTomatoes}
              </span>
            )}
            {!ratings.rottenTomatoes && ratings.imdbRating === 'N/A' && (
              <span className="text-xs text-gray-500">暫無評分</span>
            )}
          </>
        ) : (
          <span className="text-xs text-gray-500">暫無評分</span>
        )}
      </div>
    </div>
  )
}
