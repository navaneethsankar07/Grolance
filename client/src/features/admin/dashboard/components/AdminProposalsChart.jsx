import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useProposalsChart } from "../dashboardQueries";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-xl shadow-2xl border border-gray-800 min-w-[120px]">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-bold">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-[11px] text-gray-200 capitalize">{item.name}</span>
              </div>
              <span className="text-[12px] font-bold font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminProposalsChart() {
  const { data } = useProposalsChart();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-row items-center justify-between mb-8">
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Activity Overview</h3>
          <p className="text-[12px] text-gray-500">Projects vs Proposals</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50/80 p-1.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
            <span className="text-[11px] font-medium text-gray-600">Projects</span>
          </div>
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-2 h-2 rounded-full bg-[#BFDBFE]"></div>
            <span className="text-[11px] font-medium text-gray-600">Proposals</span>
          </div>
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#F1F5F9" 
              vertical={false} 
            />
            <XAxis 
              dataKey="date" 
              stroke="#94A3B8" 
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94A3B8" 
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickCount={6}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#F8FAFC', radius: 8 }}
              shared={true}
            />
            <Bar 
              dataKey="projects" 
              fill="#3B82F6" 
              radius={[6, 6, 0, 0]} 
              barSize={14}
              animationDuration={1500}
              animationBegin={200}
            />
            <Bar 
              dataKey="proposals" 
              fill="#BFDBFE" 
              radius={[6, 6, 0, 0]} 
              barSize={14}
              animationDuration={1500}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}