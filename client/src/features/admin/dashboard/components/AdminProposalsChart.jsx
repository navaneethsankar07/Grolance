import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", projects: 40, proposals: 52 },
  { day: "Tue", projects: 55, proposals: 75 },
  { day: "Wed", projects: 48, proposals: 65 },
  { day: "Thu", projects: 60, proposals: 48 },
  { day: "Fri", projects: 58, proposals: 70 },
  { day: "Sat", projects: 35, proposals: 55 },
  { day: "Sun", projects: 42, proposals: 60 },
];

export default function AdminProposalsChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Projects vs</h3>
          <h3 className="text-[15px] font-semibold text-gray-900">Proposals</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="text-xs text-gray-500">Projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
            <span className="text-xs text-gray-500">Proposals</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF" 
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Bar dataKey="projects" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="proposals" fill="#BFDBFE" radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
