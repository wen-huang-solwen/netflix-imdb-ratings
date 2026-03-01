import { useState, useCallback } from 'react'
import type { Movie, SortOption } from './types/movie'
import { useGenres } from './hooks/useGenres'
import { useMovies } from './hooks/useMovies'
import { useMovieSearch } from './hooks/useMovieSearch'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { MovieGrid } from './components/MovieGrid'
import { MovieModal } from './components/MovieModal'
import { Pagination } from './components/Pagination'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './components/EmptyState'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc')
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>()
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  const { genres } = useGenres()
  const isSearchMode = searchQuery.length > 0

  const browse = useMovies(isSearchMode ? 1 : page, sortBy, selectedGenre)
  const search = useMovieSearch(searchQuery, isSearchMode ? page : 1)

  const movies = isSearchMode ? search.movies : browse.movies
  const totalPages = isSearchMode ? search.totalPages : browse.totalPages
  const loading = isSearchMode ? search.loading : browse.loading
  const error = isSearchMode ? search.error : browse.error

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setPage(1)
  }, [])

  const handleGenreChange = (genreId?: number) => {
    setSelectedGenre(genreId)
    setPage(1)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    setPage(1)
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onSearch={handleSearch} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {!isSearchMode && (
          <div className="mb-6">
            <FilterBar
              genres={genres}
              selectedGenre={selectedGenre}
              sortBy={sortBy}
              onGenreChange={handleGenreChange}
              onSortChange={handleSortChange}
            />
          </div>
        )}

        {isSearchMode && (
          <p className="mb-4 text-sm text-gray-400">
            搜尋「{searchQuery}」的結果
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/30 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : movies.length === 0 ? (
          <EmptyState message={isSearchMode ? `找不到「${searchQuery}」相關的電影` : '目前沒有電影資料'} />
        ) : (
          <>
            <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  )
}

export default App
