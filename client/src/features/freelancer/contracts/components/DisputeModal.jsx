import { useState } from "react";
import { useDisputeMutation } from "../contractMutation";
import { X, AlertTriangle, UploadCloud } from "lucide-react";

export default function DisputeModal({ onClose, contractId }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate, isPending } = useDisputeMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      contract: contractId,
      reason,
      description,
      files,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 bg-red-50 rounded-2xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">Raise a Dispute</h1>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">Order #ORD-{contractId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Dropdown Fix */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">
              Reason for Dispute <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-[56px] px-5 text-sm font-bold text-gray-900 bg-gray-50 border border-transparent rounded-2xl appearance-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
                required
              >
                <option value="" className="text-gray-400">Select a reason</option>
                <option value="scope_creep">Client requesting extra work outside scope</option>
                <option value="no_feedback">Client is unresponsive</option>
                <option value="Unlimited Revisions">Unlimited Revisions (Endless edits)</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-gray-400">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">
              Describe the Issue <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the situation in detail..."
              className="w-full h-[140px] px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 bg-gray-50 border border-transparent rounded-2xl resize-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">
              Supporting Files <span className="text-gray-300 font-normal italic">(optional)</span>
            </label>
            <div className="relative group">
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.mp4"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileSelect}
              />
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-500">
                  {files.length > 0 ? `${files.length} files selected` : "Tap to upload evidence"}
                </p>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-600">
                    <span className="truncate max-w-[100px]">{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="w-full sm:flex-1 h-14 px-6 text-xs font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || !description || isPending}
              className={`w-full sm:flex-1 h-14 px-6 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${
                isPending ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-primary hover:brightness-110"
              }`}
            >
              {isPending ? "Submitting..." : "Submit Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}