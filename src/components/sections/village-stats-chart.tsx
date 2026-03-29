'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function VillageStatsChart({
  data,
}: {
  data: { year: string; लोकसंख्या: number; मतदार: number }[];
}) {
  if (data.length === 0) return null;
  return (
    <div className="h-80 w-full rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">तुलना / Comparison</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="लोकसंख्या" fill="#059669" />
          <Bar dataKey="मतदार" fill="#0d9488" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
