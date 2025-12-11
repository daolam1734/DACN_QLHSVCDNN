'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import type { TrendData } from '@/types/dashboard';

interface TrendChartProps {
  data: TrendData[];
  title: string;
}

export default function TrendChart({ data, title }: TrendChartProps) {
  const chartData = Array.isArray(data) ? data.map((item) => ({
    thang: item.thang,
    'Số lượng': item.so_luong
  })) : [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSoLuong" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="thang" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="Số lượng" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorSoLuong)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
