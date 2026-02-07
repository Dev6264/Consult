"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export type RealtimePoint = {
  minute: string;
  views: number;
};

export function RealtimeChart({ data }: { data: RealtimePoint[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#256bff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#256bff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="minute" stroke="#94a3b8" fontSize={10} />
          <YAxis stroke="#94a3b8" fontSize={10} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
          <Area type="monotone" dataKey="views" stroke="#256bff" fillOpacity={1} fill="url(#views)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
