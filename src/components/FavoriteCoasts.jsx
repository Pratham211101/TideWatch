import { Star } from "lucide-react";

export default function FavoriteCoasts({ favorites }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-gray-700" />
        <h2 className="text-base font-semibold text-gray-800">Favorite Coasts</h2>
      </div>

      {/* List of favorite coasts */}
      <ul className="space-y-2">
        {favorites.length === 0 ? (
          <li className="text-sm text-gray-500">No favorites saved yet</li>
        ) : (
          favorites.map((fav, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 shadow-sm hover:bg-gray-100 transition-colors"
            >
              {/* Left side: Location Name */}
              <span className="text-sm font-medium text-gray-800">{fav.name}</span>

              {/* Right side: High and Low tide times */}
              <span className="text-sm text-gray-500">
                Next High: {new Date(fav.nextHigh.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}{" "}
                <span className="mx-1">•</span>
                Next Low: {new Date(fav.nextLow.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
