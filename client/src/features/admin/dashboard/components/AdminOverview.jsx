import { Users, Briefcase, FileText, File, AlertCircle, DollarSign, Wallet } from "lucide-react";
import AdminStatsCard from "./AdminStatsCard";
import AdminRevenueChart from "./AdminRevenueChart";
import AdminProposalsChart from "./AdminProposalsChart";
import { useDashboardStats } from "../dashboardQueries";

export default function AdminOverview() {
  const {data:dashboardStats} = useDashboardStats()
  console.log(dashboardStats);
  
  return (
    <div className="space-y-8 px-10 py-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome back, here's what's happening at Grolance today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total Users"
          value={dashboardStats?.total_users}
          change={`${dashboardStats?.users_change}%`}
          changeType={dashboardStats?.users_change >= 0 ? "positive" : "negative"}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title="Total Projects"
          value={dashboardStats?.total_projects}
          change={`${dashboardStats?.projects_change}%`}
          changeType={dashboardStats?.projects_change >= 0 ? "positive" : "negative"}
          icon={Briefcase}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Active Contracts"
          value={dashboardStats?.active_contracts}
          change={`${dashboardStats?.contracts_change}%`}
          changeType={dashboardStats?.contracts_change >= 0 ? "positive" : "negative"}
          icon={FileText}
          iconBgColor="bg-green-50"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Total Proposals"
          value={dashboardStats?.total_proposals}
          change={`${dashboardStats?.proposals_change}%`}
          changeType={dashboardStats?.proposals_change >= 0 ? "positive" : "negative"}
          icon={File}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatsCard
          title="Open Disputes"
          value={dashboardStats?.total_disputes}
          change={`${dashboardStats?.dispute_change}%`}
          changeType={dashboardStats?.dispute_change >= 0 ? "positive" : "negative"}
          icon={AlertCircle}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <AdminStatsCard
          title="Platform Revenue"
          value={`$${dashboardStats?.platform_revenue}`}
          change={`${dashboardStats?.revenue_change}%`}
          changeType={dashboardStats?.revenue_change >= 0 ? "positive" : "negative"}
          icon={DollarSign}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Pending Withdrawals"
          value={`$${dashboardStats?.pending_withdrawals}`}
          change={`${dashboardStats?.pending_withdrawals_count} pending`}
          changeType={dashboardStats?.pending_withdrawals_count  >= 0 ? "positive" : "negative"}
          icon={Wallet}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRevenueChart />
        <AdminProposalsChart />
      </div>

      
    </div>
  );
}
