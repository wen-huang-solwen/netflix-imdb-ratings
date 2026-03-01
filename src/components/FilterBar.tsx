import type { Genre, SortOption } from '../types/movie'

interface FilterBarProps {
  genres: Genre[]
  selectedGenre?: number
  sortBy: SortOption
  onGenreChange: (genreId?: number) => void
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity.desc', label: '熱門程度' },
  { value: 'vote_average.desc', label: '評分最高' },
  { value: 'primary_release_date.desc', label: '最新上映' },
]

export function FilterBar({ genres, selectedGenre, sortBy, onGenreChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreChange(undefined)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            !selectedGenre ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedGenre === genre.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value as SortOption)}
        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white outline-none focus:border-red-600"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
