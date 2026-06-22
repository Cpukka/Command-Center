// frontend/components/charts/SimpleLineChart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// More flexible DataPoint type
interface DataPoint {
  name: string;
  [key: string]: string | number | undefined;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  title: string;
  lines: { key: string; color: string; name: string }[];
}

export default function SimpleLineChart({ data, title, lines }: SimpleLineChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}