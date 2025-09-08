import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import moment from "moment";

export default function TideChart({ tides }) {
  // Prepare formatted data for the chart
  const data = tides.map(({ time, sg }) => ({
    time: moment(time).format("h A"), // e.g., "2 PM"
    height: sg,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap="30%">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbcfe8" stopOpacity={0.9} />   {/* baby pink */}
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.9} /> {/* baby blue */}
            </linearGradient>
          </defs>

          {/* X-axis styling */}
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#6b7280" }} // subtle gray text
            axisLine={false}
            tickLine={false}
          />

          {/* Y-axis styling */}
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip styling */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "#374151" }}
          />

          {/* Bars with gradient + thinner width */}
          <Bar
            dataKey="height"
            fill="url(#tideGradient)"
            radius={[6, 6, 0, 0]}
            barSize={20} // controls bar thickness
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
