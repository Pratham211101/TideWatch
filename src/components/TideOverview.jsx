import TideChart from './TideChart';
import formatLocalTime from '../../util/formatLocalTime';
import moment from "moment";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TideOverview({ nextHigh, nextLow, tides }) {
  // Calculate time until next tide
  const getTimeUntil = (time) => {
    if (!time) return '--';
    const now = moment();
    const target = moment(time);
    const diffMinutes = target.diff(now, 'minutes');

    if (diffMinutes < 60) return `in ${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `in ${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
          <span className="text-gray-800 font-semibold">Tide Overview</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            Today
          </span>
        </h2>
      </div>

      {/* Tide Info Cards */}
      <div className="flex justify-between gap-4 mb-6">
        {/* Next High Tide */}
        <div className="flex-1 bg-rose-50 rounded-xl p-3 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Next High Tide</p>
          <p className="text-lg font-bold text-gray-800">
            {nextHigh?.time ? formatLocalTime(nextHigh.time) : '--'}
          </p>
          <p className="text-gray-400 text-xs">
            {getTimeUntil(nextHigh?.time)}
          </p>
        </div>

        {/* Next Low Tide */}
        <div className="flex-1 bg-rose-50 rounded-xl p-3 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Next Low Tide</p>
          <p className="text-lg font-bold text-gray-800">
            {nextLow?.time ? formatLocalTime(nextLow.time) : '--'}
          </p>
          <p className="text-gray-400 text-xs">
            {getTimeUntil(nextLow?.time)}
          </p>
        </div>
      </div>

      {/* Tide Graph Block */}
      <div className="bg-gray-50 rounded-xl shadow-inner p-3 flex flex-col flex-1">
        {/* Top Labels */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">High Tide</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Low Tide</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          <TideChart tides={tides} />
        </div>
      </div>
    </div>
  );
}
