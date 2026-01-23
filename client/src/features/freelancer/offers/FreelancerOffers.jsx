import { Tag, Calendar, Banknote, ArrowRight, FileCheck } from "lucide-react";
import { useMyOffers } from "./offersQuries";
import { useModal } from "../../../hooks/modal/useModalStore";

export default function FreelancerOffers() {
  const { data: offers, isLoading, isError } = useMyOffers();
  const { openModal } = useModal();

  if (isLoading) return <div className="p-10 text-center">Loading offers...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading offers.</div>;

  const offerList = offers || [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project Offers</h1>
          <p className="text-gray-600">Review and sign contracts to start working.</p>
        </div>

        <div className="grid gap-4">
          {offerList.length > 0 ? (
            offerList.map((offer) => (
              <div key={offer.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-1 rounded">
                        New Offer
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        Received {new Date(offer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{offer.project_title}</h3>
                    <p className="text-sm text-gray-500">From {offer.client_name}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total Budget</p>
                    <p className="text-xl font-bold text-gray-900">${Number(offer.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-50 mb-6">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">Fully Funded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">Client Signed</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => openModal('offer-modal', { offer })}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors group"
                  >
                    <span>Review & Sign</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No pending offers at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}