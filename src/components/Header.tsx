import { SearchBar } from './SearchBar'

interface HeaderProps {
  onSearch: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
          <span className="rounded bg-red-600 px-2 py-0.5">Netflix</span>
          <span>台灣電影搜尋</span>
        </h1>
        <div className="w-full sm:w-80">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </header>
  )
}
