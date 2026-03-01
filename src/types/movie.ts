export interface Movie {
  id: number
  title: string
  original_title: string
  english_title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  genres: Genre[]
  runtime: number | null
  tagline: string
  status: string
  external_ids: {
    imdb_id: string | null
  }
  'watch/providers'?: {
    results?: {
      TW?: WatchProviderRegion
    }
  }
}

export interface WatchProviderRegion {
  link?: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
}

export interface Genre {
  id: number
  name: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type SortOption = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc'

export interface OMDbRatings {
  imdbRating: string
  rottenTomatoes: string | null
  metascore: string
}

