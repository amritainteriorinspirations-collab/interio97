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

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Email input */}
        <div className="space-y-1">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>

        {/* Password input */}
        <div className="space-y-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>

        {/* Forgot password */}
        <div className="h-3 w-28 bg-gray-200 rounded" />

        {/* Submit button */}
        <div className="h-11 bg-gray-200 rounded mt-2" />

        {/* Bottom text */}
        <div className="h-3 w-48 bg-gray-200 rounded mx-auto mt-3" />
      </div>
    </div>
  );
}
