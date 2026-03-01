interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = '找不到電影' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  )
}
