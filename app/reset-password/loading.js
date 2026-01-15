export default function AuthLoading() {
  return (
    <div className="mx-auto my-12 w-full max-w-lg p-6 rounded-lg border border-gray-200 shadow-sm bg-white animate-pulse">
      {/* Title */}
      <div className="h-6 w-40 bg-gray-200 rounded mx-auto mb-6" />

      {/* Role selector */}
      <div className="flex justify-center mb-6">
        <div className="flex w-full max-w-xs rounded-lg overflow-hidden border border-gray-300">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-10 bg-gray-200 border-r last:border-r-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
