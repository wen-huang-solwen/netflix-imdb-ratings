import { useEffect, useState } from 'react'
import { useMovieDetail } from '../hooks/useMovieDetail'
import { getImageUrl, getIMDBUrl, isOnNetflixTW } from '../services/tmdb'
import { getOMDbRatings } from '../services/omdb'
import type { OMDbRatings } from '../types/movie'
import { RatingBadge } from './RatingBadge'
import { LoadingSpinner } from './LoadingSpinner'

interface MovieModalProps {
  movieId: number
  onClose: () => void
}

export function MovieModal({ movieId, onClose }: MovieModalProps) {
  const { detail, loading, error } = useMovieDetail(movieId)
  const [omdb, setOmdb] = useState<OMDbRatings | null>(null)

  const imdbId = detail?.external_ids?.imdb_id

  useEffect(() => {
    if (!imdbId) return
    let cancelled = false
    getOMDbRatings(imdbId).then(data => {
      if (!cancelled) setOmdb(data)
    })
    return () => { cancelled = true }
  }, [imdbId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const netflixTW = detail ? isOnNetflixTW(detail) : false
  const backdropUrl = getImageUrl(detail?.backdrop_path ?? null, 'w1280')
  const posterUrl = getImageUrl(detail?.poster_path ?? null, 'w500')
  const year = detail?.release_date?.split('-')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-[5vh]" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-gray-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && <LoadingSpinner />}
        {error && <p className="p-8 text-center text-red-400">{error}</p>}

        {detail && (
          <>
            {/* Backdrop */}
            {backdropUrl && (
              <div className="relative h-48 sm:h-64">
                <img src={backdropUrl} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
            )}

            <div className="flex flex-col gap-6 p-6 sm:flex-row">
              {/* Poster */}
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={detail.title}
                  className="w-40 shrink-0 self-start rounded-lg shadow-lg sm:-mt-24"
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{detail.title}</h2>
                {detail.english_title && detail.english_title !== detail.title && (
                  <p className="mt-0.5 text-sm text-gray-400">{detail.english_title}</p>
                )}

                {detail.tagline && (
                  <p className="mt-1 text-sm italic text-gray-500">"{detail.tagline}"</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {detail.vote_average > 0 && <RatingBadge rating={detail.vote_average} size="md" />}
                  {year && <span className="text-sm text-gray-400">{year}</span>}
                  {detail.runtime && <span className="text-sm text-gray-400">{detail.runtime} 分鐘</span>}
                </div>

                {/* IMDb & Rotten Tomatoes ratings */}
                {omdb && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {omdb.imdbRating !== 'N/A' && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-3 py-1.5 text-lg font-bold text-black">
                        <span className="text-sm font-black">IMDb</span>
                        {omdb.imdbRating}
                      </span>
                    )}
                    {omdb.rottenTomatoes && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-lg font-bold text-white">
                        🍅 {omdb.rottenTomatoes}
                      </span>
                    )}
                  </div>
                )}

                {/* Genres */}
                {detail.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detail.genres.map(g => (
                      <span key={g.id} className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300">
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Netflix badge */}
                {netflixTW && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded bg-red-600/20 px-2.5 py-1 text-sm font-medium text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Netflix 台灣可觀看
                  </div>
                )}

                {/* Overview */}
                {detail.overview && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">{detail.overview}</p>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {imdbId && (
                    <a
                      href={getIMDBUrl(imdbId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black transition-colors hover:bg-yellow-400"
                    >
                      <span className="text-sm font-black">IMDb</span>
                      查看評分
                    </a>
                  )}
                  {netflixTW && (
                    <a
                      href={`https://www.netflix.com/search?q=${encodeURIComponent(detail.original_title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-500"
                    >
                      在 Netflix 觀看
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
