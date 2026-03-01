import { useState, useEffect } from 'react'
import type { Genre } from '../types/movie'
import { getGenres } from '../services/tmdb'

const GENRE_NAME_MAP: Record<string, string> = {
  '动作': '動作',
  '冒险': '冒險',
  '动画': '動畫',
  '喜剧': '喜劇',
  '纪录': '紀錄',
  '剧情': '劇情',
  '奇幻': '奇幻',
  '历史': '歷史',
  '悬疑': '懸疑',
  '爱情': '愛情',
  '科幻': '科幻',
  '电视电影': '電視電影',
  '惊悚': '驚悚',
  '战争': '戰爭',
  '西部': '西部',
  '犯罪': '犯罪',
  '家庭': '家庭',
  '恐怖': '恐怖',
  '音乐': '音樂',
}

function toTraditional(genres: Genre[]): Genre[] {
  return genres.map(g => ({
    ...g,
    name: GENRE_NAME_MAP[g.name] ?? g.name,
  }))
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getGenres()
      .then(data => {
        if (!cancelled) setGenres(toTraditional(data))
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { genres, loading }
}
