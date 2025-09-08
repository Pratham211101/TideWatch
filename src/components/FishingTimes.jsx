import { Sunrise, Sunset, ArrowUp, ArrowDown, Fish } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FishingTimes({ nearestStation, nextHigh, nextLow }) {
  const [sunTimes, setSunTimes] = useState({ dawn: "", dusk: "" });
  const [fishingTimes, setFishingTimes] = useState([]);

  // Fetch sunrise & sunset based on NEAREST STATION
  useEffect(() => {
    if (!nearestStation) return;

    const fetchSunTimes = async () => {
      try {
        const res = await axios.get(
          `https://api.sunrise-sunset.org/json?lat=${nearestStation.lat}&lng=${nearestStation.lng}&formatted=0`
        );

        const dawn = new Date(res.data.results.sunrise).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const dusk = new Date(res.data.results.sunset).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setSunTimes({ dawn, dusk });
      } catch (error) {
        console.error("Error fetching sunrise/sunset times", error);
      }
    };

    fetchSunTimes();
  }, [nearestStation]);

  // Build dynamic fishing windows
  useEffect(() => {
    if (!nextHigh && !nextLow && !sunTimes.dawn && !sunTimes.dusk) return;

    const dynamicTimes = [];

    // Dawn fishing window (sunrise + 2 hours)
    if (sunTimes.dawn) {
      dynamicTimes.push({
        label: "Dawn Window",
        time: `${sunTimes.dawn} - ${addMinutes(sunTimes.dawn, 120)}`,
      });
      console.log(sunTimes.dawn)
    }

    // Dusk fishing window (sunset + 2 hours)
    if (sunTimes.dusk) {
      dynamicTimes.push({
        label: "Dusk Window",
        time: `${sunTimes.dusk} - ${addMinutes(sunTimes.dusk, 120)}`,
      });
    }

    // Tides fishing windows
    if (nextHigh) {
      const high = new Date(nextHigh.time);

      const beforeHigh = formatRange(new Date(high.getTime() - 60 * 60 * 1000), high);
      const afterHigh = formatRange(high, new Date(high.getTime() + 60 * 60 * 1000));

      dynamicTimes.push({ label: "1h Before High Tide", time: beforeHigh });
      dynamicTimes.push({ label: "1h After High Tide", time: afterHigh });
    }

    setFishingTimes(dynamicTimes);
  }, [nextHigh, sunTimes]);

  // Helper: Format time ranges
  const formatRange = (start, end) =>
    `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  // Helper: Add minutes to a time string
  function addMinutes(timeString, minutes) {
    // Get today's date
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-08"

    // Combine date + time so JS can parse it correctly
    const date = new Date(`${today} ${timeString}`);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", `${today} ${timeString}`);
      return "Invalid Date";
    }

    // Return formatted time
    return new Date(date.getTime() + minutes * 60000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }


  // Icons for different time labels
  const iconMap = {
    "Dawn Window": <Sunrise className="w-5 h-5 text-gray-500" />,
    "Dusk Window": <Sunset className="w-5 h-5 text-gray-500" />,
    "1h Before High Tide": <ArrowUp className="w-5 h-5 text-gray-500" />,
    "1h After High Tide": <ArrowDown className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full">
      <h2 className="text-sm font-semibold mb-4 text-gray-700 flex items-center gap-2">
        <Fish className="w-5 h-5 text-gray-600" />
        Best Fishing Times
      </h2>

      <ul className="space-y-2 flex-1">
        {fishingTimes.map((t, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center p-2 bg-pink-50 rounded-2xl hover:bg-blue-50 transition"
          >
            <div className="flex items-center gap-2">
              {iconMap[t.label] || <ArrowUp className="w-5 h-5 text-blue-500" />}
              <span className="text-gray-700 font-medium text-sm">{t.label}</span>
            </div>
            <span className="text-gray-500 text-sm">{t.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
