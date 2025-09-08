import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default function TideMap({ station }) {
  if (!station) return null;

  // Custom icon to ensure it's bundled properly
  const customIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const openInGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${station.lat},${station.lng}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-gray-700" />
        <h2 className="text-base font-semibold text-gray-800">Location & Map</h2>
      </div>

      {/* Map Display */}
      <div className="flex-1 rounded-xl overflow-hidden">
        <MapContainer
          center={[station.lat, station.lng]}
          zoom={12}
          className="h-full w-full"
          style={{ minHeight: "250px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[station.lat, station.lng]} icon={customIcon}>
            <Popup>{station.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Button aligned at bottom-right */}
      <div className="flex justify-end mt-4">
        <button
          onClick={openInGoogleMaps}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-200 transition-colors"
        >
          Open in Google Maps
        </button>
      </div>
    </div>
  );
}
