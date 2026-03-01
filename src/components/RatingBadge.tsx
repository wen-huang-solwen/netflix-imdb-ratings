interface RatingBadgeProps {
  rating: number
  size?: 'sm' | 'md'
}

export function RatingBadge({ rating, size = 'sm' }: RatingBadgeProps) {
  const color =
    rating >= 7 ? 'bg-green-600' :
    rating >= 5 ? 'bg-yellow-600' :
    'bg-red-700'

  const sizeClass = size === 'md' ? 'px-3 py-1 text-base' : 'px-2 py-0.5 text-sm'

  return (
    <span className={`inline-flex items-center gap-1 rounded font-bold text-white ${color} ${sizeClass}`}>
      <span className={size === 'md' ? 'text-xs' : 'text-[10px]'} style={{ opacity: 0.8 }}>TMDB</span>
      {rating.toFixed(1)}
    </span>
  )
}
