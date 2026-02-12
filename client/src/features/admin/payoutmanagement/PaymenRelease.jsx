import { CheckCircle, XCircle, CreditCard, Clock, ChevronRight, Loader2, AlertCircle, User, Briefcase, ChevronLeft } from 'lucide-react';
import { usePendingPayouts } from './payoutQueries';
import { useModal } from '../../../hooks/modal/useModalStore';
import { useRefundPayment } from './payoutMutations';
import { useState } from 'react';

export default function PaymentRelease() {
  const [page, setPage] = useState(1);
  const { data: payoutData, isLoading } = usePendingPayouts(page);
  
  const payments = payoutData?.results || [];
  const totalCount = payoutData?.count || 0;
  
  const { openModal } = useModal();
  const refundMutation = useRefundPayment();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefund = (paymentId) => {
    const numericId = paymentId.replace('PAY-', '');
    if (window.confirm("Are you sure you want to refund this payment to the client?")) {
      refundMutation.mutate(numericId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Manual Payment Release</h1>
          <p className="text-slate-500 mt-2">Review and process pending payments after the 24-hour safety window.</p>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No pending payouts</h3>
            <p className="text-slate-500">Payments will appear here 24 hours after project completion.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client / Freelancer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispute Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => {
                    const hasDispute = !!pay.dispute_status;
                    const isRefundingThis = refundMutation.isPending && refundMutation.variables === pay.payment_id.replace('PAY-', '');
                    
                    const shouldShowRelease = !hasDispute || 
                      (pay.dispute_raised_by === 'freelancer' && pay.dispute_status === 'resolved') || 
                      (pay.dispute_raised_by === 'client' && pay.dispute_status === 'rejected');

                    const shouldShowRefund = hasDispute && (
                      (pay.dispute_raised_by === 'client' && pay.dispute_status === 'resolved') || 
                      (pay.dispute_raised_by === 'freelancer' && pay.dispute_status === 'rejected')
                    );

                    return (
                      <tr key={pay.contract_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-medium text-slate-700 block">{pay.payment_id}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{pay.gateway}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-wrap max-w-[200px] break-words">
                            <p className="text-slate-900 font-semibold">{pay.client_name} <span className="text-slate-400 font-normal text-xs">(C)</span></p>
                            <p className="text-slate-500">{pay.freelancer_name} <span className="text-slate-400 font-normal text-xs">(F)</span></p>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-900">${pay.amount.toLocaleString()}</td>
                        <td className="px-6 py-5">
                          {hasDispute ? (
                            <div className="flex flex-col gap-1 break-words max-w-[150px]">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded w-fit ${pay.dispute_status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                <AlertCircle className="w-3 h-3 shrink-0" /> {pay.dispute_status}
                              </span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                {pay.dispute_raised_by === 'client' ? <User className="w-3 h-3 shrink-0" /> : <Briefcase className="w-3 h-3 shrink-0" />}
                                Raised by {pay.dispute_raised_by}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No Dispute</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 capitalize">
                            {pay.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            {shouldShowRelease && (
                              <button 
                                onClick={() => openModal('release-payout', { id: pay.contract_id, total_amount: pay.amount })}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                              >
                                Release
                              </button>
                            )}
                            {shouldShowRefund && (
                              <button 
                                disabled={refundMutation.isPending}
                                onClick={() => handleRefund(pay.payment_id)}
                                className="text-rose-600 border border-rose-200 hover:bg-rose-50 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 whitespace-nowrap min-w-[100px]"
                              >
                                {isRefundingThis ? 'Processing...' : 'Refund'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {payments.map((pay) => {
                const hasDispute = !!pay.dispute_status;
                const isRefundingThis = refundMutation.isPending && refundMutation.variables === pay.payment_id.replace('PAY-', '');
                
                const shouldShowRelease = !hasDispute || 
                      (pay.dispute_raised_by === 'freelancer' && pay.dispute_status === 'resolved') || 
                      (pay.dispute_raised_by === 'client' && pay.dispute_status === 'rejected');

                const shouldShowRefund = hasDispute && (
                      (pay.dispute_raised_by === 'client' && pay.dispute_status === 'resolved') || 
                      (pay.dispute_raised_by === 'freelancer' && pay.dispute_status === 'rejected')
                    );

                return (
                  <div key={pay.contract_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm break-words overflow-hidden">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-blue-600 uppercase block truncate">{pay.payment_id}</span>
                        <h3 className="font-bold text-slate-900 text-lg break-all">${pay.amount.toLocaleString()}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          {pay.status}
                        </span>
                        {hasDispute && (
                           <span className="text-[9px] font-black uppercase text-rose-600 text-right">Disputed By {pay.dispute_raised_by}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Client</p>
                        <p className="text-sm text-slate-700 font-medium break-words">{pay.client_name}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Freelancer</p>
                        <p className="text-sm text-slate-700 font-medium break-words">{pay.freelancer_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {shouldShowRelease && (
                        <button 
                          onClick={() => openModal('release-payout', { id: pay.contract_id, total_amount: pay.amount })}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                          Release Payment
                        </button>
                      )}
                      {shouldShowRefund && (
                        <button 
                          disabled={refundMutation.isPending}
                          onClick={() => handleRefund(pay.payment_id)}
                          className={`flex-1 text-rose-600 border border-rose-200 hover:bg-rose-50 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all`}
                        >
                          {isRefundingThis ? 'Processing...' : 'Refund Client'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
              <p className="text-sm text-gray-600">Showing {payments.length} of {totalCount} results</p>
              <nav className="flex items-center rounded-md shadow-sm">
                <button 
                  disabled={!payoutData?.previous}
                  onClick={() => handlePageChange(page - 1)}
                  className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="text-gray-400 w-5 h-5" />
                </button>
                <div className="h-9 px-4 bg-blue-600 text-white text-sm font-semibold flex items-center border-t border-b border-blue-600">
                  {page}
                </div>
                <button 
                  disabled={!payoutData?.next}
                  onClick={() => handlePageChange(page + 1)}
                  className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="text-gray-400 w-5 h-5" />
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}