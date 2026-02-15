import { 
  DollarSign, 
  Briefcase, 
  Clock, 
  TrendingUp 
} from "lucide-react";
import { useClientSpendingSummary } from "./profileQueries";

export default function SpendingSummary() {
  const { data, isLoading, isError } = useClientSpendingSummary();

  if (isLoading) return <div className="p-10 text-center">Loading Summary...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading data</div>;

  const stats = [
    {
      label: "Total Spent",
      value: `$${Number(data.total_spent).toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-[#EFF6FF]",
      iconColor: "text-black",
    },
    {
      label: "Projects Completed",
      value: data.projects_completed,
      icon: Briefcase,
      bgColor: "bg-[#F0FDF4]",
      iconColor: "text-[#16A34A]",
    },
    {
      label: "Ongoing Projects",
      value: data.ongoing_projects,
      icon: Clock,
      bgColor: "bg-[#FFF7ED]",
      iconColor: "text-[#EA580C]",
    },
    {
      label: "Avg. per Project",
      value: `$${Number(data.avg_per_project).toLocaleString()}`,
      icon: TrendingUp,
      bgColor: "bg-[#FAF5FF]",
      iconColor: "text-[#9333EA]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-[26px] font-bold leading-9 text-[#111827]">
          Spending Summary
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[67px]">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl border border-[#F3F4F6] bg-white p-6 shadow-sm">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} strokeWidth={2} />
              </div>
              <div className="mb-1 text-xl font-bold leading-8 text-[#111827]">
                {stat.value}
              </div>
              <div className="text-xs leading-5 text-[#6B7280]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#F3F4F6] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[15px] font-semibold leading-7 text-[#111827]">
            Recent Projects
          </h2>

          <div className="space-y-4">
            {data.recent_projects?.map((project) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-lg border border-[#F3F4F6] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-medium leading-6 text-[#111827]">
                    {project.project_title}
                  </h3>
                  <p className="text-xs leading-5 text-[#6B7280]">
                    with {project.freelancer_name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold leading-6 text-[#111827]">
                    ${Number(project.total_amount).toLocaleString()}
                  </span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium leading-4 capitalize ${
                    project.status === 'completed' 
                      ? "bg-[#F0FDF4] text-[#15803D]" 
                      : "bg-[#EFF6FF] text-[#1D4ED8]"
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}

            {data.recent_projects?.length === 0 && (
              <div className="py-4 text-center text-sm text-gray-500">
                No recent projects found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}