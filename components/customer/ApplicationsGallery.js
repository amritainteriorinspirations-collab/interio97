export default function ApplicationsGallery({ applications }) {
  if (!applications || applications.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <h2 className="text-md sm:text-md font-bold text-gray-900 mb-4">
        Applications
      </h2>

      {/* Static Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {applications.map((app, idx) => (
          <div key={app._id || idx} className="flex flex-col items-center">
            {/* Image Container - No BG, No Roundness */}
            <div className="w-16 sm:w-18 aspect-square overflow-hidden mb-1.5">
              {app.image ? (
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">🏠</span>
                </div>
              )}
            </div>

            {/* Application Name */}
            <p className="text-xs font-medium text-gray-900 text-center line-clamp-2">
              {app.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}