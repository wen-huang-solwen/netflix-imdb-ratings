export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-red-600" />
    </div>
  )
}
