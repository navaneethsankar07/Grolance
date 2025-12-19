import { useModal } from "../../../hooks/modal/useModalStore";
import { 
  X, 
  Wallet, 
  Calendar, 
  Tag, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

function ConfirmProjectModal({ isPending, onConfirm }) {
  const { modalProps, closeModal } = useModal();
  const { data, categories } = modalProps;

  if (!data) return null;

  const categoryName =
    categories?.find((c) => String(c.id) === String(data.category))?.name ??
    "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-inter">
              Review Project
            </h2>
          </div>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            
            {/* Title Section */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Project Title</label>
              <h3 className="text-lg font-semibold text-gray-800 leading-snug">
                {data.title}
              </h3>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-tight">Category</span>
                </div>
                <p className="font-semibold text-gray-700">{categoryName}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
  <div className="flex items-center gap-2 text-gray-500 mb-1">
    <Wallet className="w-4 h-4" />
    <span className="text-xs font-medium uppercase tracking-tight">
      Budget
    </span>
  </div>

  {data.pricing_type === "fixed" ? (
    <p className="font-semibold text-gray-700">
      ₹{data.fixed_price.toLocaleString()}
    </p>
  ) : (
    <p className="font-semibold text-gray-700">
      ₹{data.min_budget.toLocaleString()} – ₹{data.max_budget.toLocaleString()}
    </p>
  )}
</div>


              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-tight">Timeline</span>
                </div>
                <p className="font-semibold text-gray-700">{data.delivery_days} Days</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-tight">Type</span>
                </div>
                <p className="font-semibold text-gray-700">
  {data.pricing_type === "fixed" ? "Fixed Price" : "Range Price"}
</p>

              </div>
            </div>

            {/* Skills Section */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Please double-check your budget and timeline. Once posted, the project will be visible to all qualified freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-all hover:bg-gray-200 rounded-xl"
          >
            Go Back & Edit
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm & Post Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmProjectModal;