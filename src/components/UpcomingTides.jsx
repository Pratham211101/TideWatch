import { TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import moment from "moment";
import formatLocalTime from "../../util/formatLocalTime";

export default function UpcomingTides({ tides }) {
  const formatDay = (time) => {
    const now = moment().startOf("day");
    const tideDay = moment(time).startOf("day");

    if (tideDay.isSame(now)) return "Today";
    if (tideDay.isSame(now.clone().add(1, "day"))) return "Tomorrow";
    return tideDay.format("dddd"); // Fallback to weekday name
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-gray-700" />
        <h2 className="text-base font-semibold text-gray-800">Upcoming Tides</h2>
      </div>

      {/* Tide List */}
      <ul className="space-y-3">
        {tides.slice(0, 6).map((tide, index) => {
          const isHigh = tide.sg > 1; // Threshold for high vs low tide
          const dayLabel = formatDay(tide.time);
          const timeFormatted = moment(tide.time).format("h:mm A");

          return (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 shadow-sm"
            >
              {/* Left side: Icon + Tide Type */}
              <div className="flex items-center gap-2">
                {isHigh ? (
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {isHigh ? "High Tide" : "Low Tide"}
                </span>
              </div>

              {/* Right side: Day + Time */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>{dayLabel}</span>
                <span className="mx-1">•</span>
                <span>{timeFormatted}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
