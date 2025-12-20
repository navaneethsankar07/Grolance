import { Users, Briefcase, FileText, File, AlertCircle, DollarSign, Wallet } from "lucide-react";
import AdminStatsCard from "./AdminStatsCard";
import AdminRevenueChart from "./AdminRevenueChart";
import AdminProposalsChart from "./AdminProposalsChart";

export default function AdminOverview() {
  return (
    <div className="space-y-8 px-10 py-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome back, here's what's happening at Grolance today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total Users"
          value="24,593"
          change="12%"
          changeType="positive"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title="Total Projects"
          value="1,842"
          change="8.5%"
          changeType="positive"
          icon={Briefcase}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Active Contracts"
          value="645"
          change="3.2%"
          changeType="positive"
          icon={FileText}
          iconBgColor="bg-green-50"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Total Proposals"
          value="12,204"
          change="5.4%"
          changeType="negative"
          icon={File}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatsCard
          title="Open Disputes"
          value="18"
          change="2 new"
          changeType="negative"
          icon={AlertCircle}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <AdminStatsCard
          title="Platform Revenue"
          value="$142,300"
          change="15.3%"
          changeType="positive"
          icon={DollarSign}
          iconBgColor="bg-white"
          iconColor="text-gray-900"
        />
        <AdminStatsCard
          title="Pending Withdrawals"
          value="$23,450"
          change="12 pending"
          changeType="positive"
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
