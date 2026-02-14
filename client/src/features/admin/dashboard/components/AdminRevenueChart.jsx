import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { useRevenueChart } from "../dashboardQueries";

export default function AdminRevenueChart() {
  const [range, setRange] = useState("this_year");
  const { data: chartData, isLoading } = useRevenueChart(range);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-[12px] text-gray-500">Platform earnings via commissions</p>
        </div>
        <select 
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="this_year">This Year</option>
          <option value="last_year">Last Year</option>
          <option value="all_time">All Time</option>
        </select>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF" 
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}