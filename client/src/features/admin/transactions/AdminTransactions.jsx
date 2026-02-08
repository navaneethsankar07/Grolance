import { useState, useRef, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight, Loader2, ChevronDown } from "lucide-react";
import { usePlatformTransactions } from "./transactionQuery";

export default function AdminTransactions() {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data: payments, isLoading } = usePlatformTransactions(currentPage, statusFilter);

    const statuses = [
        { label: "All Transactions", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Escrow", value: "escrow" },
        { label: "Released", value: "released"},
        { label: "Refunded", value: "refunded" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "released":
            case 'completed':
                return "bg-green-50 text-green-600";
            case "pending":
            case "escrow":
                return "bg-yellow-50 text-yellow-600";
            case "refunded":
                return "bg-red-50 text-red-600";
            default:
                return "bg-gray-50 text-gray-600";
        }
    };

    const handleSelectStatus = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
        setIsDropdownOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white w-full overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-[26px] font-semibold text-gray-900 leading-9 mb-2">
                        Transactions
                    </h1>
                    <p className="text-xs sm:text-[13.6px] font-light text-gray-500 leading-[26px]">
                        View and manage all payment transactions
                    </p>
                </div>

                <div className="flex justify-end mb-8 sm:mb-12 relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors capitalize min-w-[160px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" strokeWidth={1.5} />
                            <span className="text-sm text-gray-900">
                                {statuses.find(s => s.value === statusFilter)?.label || "All"}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 origin-top-right">
                            {statuses.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleSelectStatus(status.value)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                        statusFilter === status.value 
                                        ? "bg-blue-50 text-blue-600 font-medium" 
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/30">
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Freelancer</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 xl:px-8 py-4 text-[10.2px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments?.results?.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="px-4 xl:px-8 py-5 text-sm font-medium">{transaction.payment_id}</td>
                                        <td className="px-4 xl:px-8 py-5 text-sm">{transaction.client_name}</td>
                                        <td className="px-4 xl:px-8 py-5 text-sm">{transaction.freelancer_name}</td>
                                        <td className="px-4 xl:px-8 py-5 text-sm font-semibold">${transaction.amount_total}</td>
                                        <td className="px-4 xl:px-8 py-5 text-sm text-gray-700">${transaction.platform_fee}</td>
                                        <td className="px-4 xl:px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium capitalize ${getStatusStyles(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-4 xl:px-8 py-5 text-sm text-gray-500">{transaction.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:hidden space-y-4">
                    {payments?.results?.map((transaction) => (
                        <div key={transaction.id} className="border border-gray-100 rounded-lg p-4">
                            <div className="flex justify-between mb-3">
                                <span className="text-sm font-medium">{transaction.payment_id}</span>
                                <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusStyles(transaction.status)}`}>{transaction.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">Client: {transaction.client_name}</div>
                                <div className="text-gray-900 font-bold text-right">${transaction.amount_total}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Showing {payments?.results?.length || 0} of {payments?.count || 0} transactions
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={!payments?.previous}
                            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium px-4">Page {currentPage}</span>
                        <button
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={!payments?.next}
                            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}