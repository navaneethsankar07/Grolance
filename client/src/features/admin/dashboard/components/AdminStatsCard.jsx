export default function AdminStatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
  changeLabel = "vs last month",
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">
            {title}
          </p>
          <h3 className="text-xl font-bold text-gray-900">
            {value}
          </h3>
        </div>
    
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            changeType === "positive"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {changeType === "positive" && "+"}
          {change}
        </span>

        <span className="text-[10px] text-gray-400">
          {changeLabel}
        </span>
      </div>
    </div>
  );
}
