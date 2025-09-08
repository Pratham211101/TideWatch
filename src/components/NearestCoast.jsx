import { useEffect, useState } from "react";
import { Clock,Waves } from "lucide-react";

export default function NearestCoastHeader({ nearestStation }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    setCurrentTime(new Date())
    
    const now=new Date()
    const delay=(60-now.getSeconds())*1000

    const timeout=setTimeout(()=>{

      setCurrentTime(new Date())

      const interval= setInterval(()=>{
        setCurrentTime(new Date())
      },60*1000)

      return ()=> clearInterval(interval)
    },delay)
  }, []);

  return (
     <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-pink-50 to-blue-50 border-t border-gray-200 ">
      
      {/* Left Section - Nearest Coast */}
      <div className="flex items-center gap-2 mt-2">
        {/* Wave Icon */}
        <Waves className="w-8 h-8 text-blue-500" />

        <div className="leading-tight">
          <h2 className="text-sm font-semibold text-gray-800">
            Nearest Coast: {nearestStation?.name || "Unknown"}
          </h2>
          <p className="text-xs text-gray-500">
            {nearestStation? `${nearestStation.city}, ${nearestStation.country}`: "City, Country"} •{" "}
            {nearestStation
              ? `${nearestStation.lat.toFixed(4)}°N, ${nearestStation.lng.toFixed(4)}°W`
              : "Coordinates unavailable"}
          </p>
        </div>
      </div>

      {/* Right Section - Current Time */}
      <div className="mt-2 px-3 py-1 flex items-center gap-1 text-sm text-gray-600 bg-blue-100 rounded-2xl">
        <Clock className="w-6 h-6 text-gray-600" />
        <span>
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
    </div>
  );
}
