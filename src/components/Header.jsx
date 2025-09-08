import { Star,Trash2 } from "lucide-react";
import { useState,useEffect } from "react";
import { LocateFixed } from "lucide-react";

export default function Header({setLocation,setPlace,place,getLocation,setTides,setNearestStation,saveFavoriteCoast,isFavorite}) {

  const [currentTime,setCurrentTime]=useState(new Date())
  const [showLocation,setShowLocation]=useState(false)

  const handleGetLocation=async()=>{
    await getLocation()
    setShowLocation(true)
  }
  const clearLocation=()=>{
    localStorage.removeItem('user_location')
    localStorage.removeItem('user_place')
    localStorage.removeItem('cachedTideData')
    localStorage.removeItem('favoriteCoasts')
    localStorage.removeItem('nearestStation')
    setLocation(null)
    setPlace("")
    setShowLocation(false)
    setTides([])
    setNearestStation(null)
  }

  useEffect(()=>{
    if(place) setShowLocation(true)
    
  },[place])
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-blue-100 rounded-lg shadow">
      <h1 className="text-xl font-bold text-gray-800">TideWatch</h1>
      
      <div className="flex items-center gap-3">
      

        <button
          onClick={handleGetLocation}
          title="Get Current Location"
          className={`flex items-center gap-2 p-2 rounded-full bg-white hover:bg-gray-300 transition-all duration-300 overflow-hidden
            ${showLocation ? "px-3 max-w-xs sm:max-w-md" : "w-10"} 
          `}
        >
          <LocateFixed className="w-5 h-5 text-gray-700 flex-shrink-0" />
          {showLocation && (
            <span
              className="text-sm text-gray-700 whitespace-nowrap"
              title={place || "Fetching location..."}
            >
              {place || "Fetching Location..."}
            </span>
          )}
          
        </button>

        <button
          onClick={saveFavoriteCoast}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? "bg-yellow-400 hover:bg-yellow-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
          }`}
        >
          <Star
            className={`w-5 h-5 transition-transform ${
              isFavorite ? "fill-current scale-110" : ""
            }`}
          />
        </button>
        <button 
          title="Clear Local Storage"
          onClick={clearLocation}
          className="p-2 rounded-full bg-red-400 hover:bg-red-500"
        >
          <Trash2 />
        </button>
      </div>
    </header>
  );
}
