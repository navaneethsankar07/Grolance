import { CheckCircle, XCircle, CreditCard, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { usePendingPayouts } from './payoutQueries';
import { useModal } from '../../../hooks/modal/useModalStore';
import { useRefundPayment } from './payoutMutations';

export default function PaymentRelease() {
  const { data: payments = [], isLoading } = usePendingPayouts();
  const { openModal } = useModal();
  const refundMutation = useRefundPayment();
console.log(payments);


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
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Freelancer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gateway</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.contract_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 font-medium text-slate-700">{pay.payment_id}</td>
                      <td className="px-6 py-5 text-slate-600">{pay.client_name}</td>
                      <td className="px-6 py-5 text-slate-600">{pay.freelancer_name}</td>
                      <td className="px-6 py-5 font-bold text-slate-900">${pay.amount.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock className="w-3 h-3 mr-1" /> {pay.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-slate-500">
                          <CreditCard className="w-4 h-4 mr-2" /> {pay.gateway}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => openModal('release-payout', { id: pay.contract_id, total_amount: pay.amount })}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
                          >
                            Release
                          </button>
                          <button 
                        disabled={refundMutation.isPending}
                        onClick={() => handleRefund(pay.payment_id)}
                        className="text-rose-600 border border-rose-200 hover:bg-rose-50 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {refundMutation.isPending ? 'Processing...' : 'Refund'}
                      </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {payments.map((pay) => (
                <div key={pay.contract_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">{pay.payment_id}</span>
                      <h3 className="font-bold text-slate-900 text-lg">${pay.amount.toLocaleString()}</h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      {pay.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Client</p>
                      <p className="text-sm text-slate-700 font-medium">{pay.client_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Freelancer</p>
                      <p className="text-sm text-slate-700 font-medium">{pay.freelancer_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => openModal('release-payout', { id: pay.contract_id, total_amount: pay.amount })}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
                    >
                      Release Payment
                    </button>
                    <button 
                        disabled={refundMutation.isPending}
                        onClick={() => handleRefund(pay.payment_id)}
                        className="text-rose-600 border border-rose-200 hover:bg-rose-50 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {refundMutation.isPending ? 'Processing...' : 'Refund'}
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}