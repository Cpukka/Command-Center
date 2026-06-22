'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type DataPoint = {
  name: string;
  [key: string]: string | number | undefined;
};

interface SimpleBarChartProps {
  data: DataPoint[];
  title: string;
  bars: { key: string; color: string; name: string }[];
}

export default function SimpleBarChart({ data, title, bars }: SimpleBarChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {bars.map(bar => (
            <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}