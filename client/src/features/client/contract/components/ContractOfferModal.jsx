import React, { useState, useRef } from "react";
import { X } from "lucide-react"; 
import { useVerifyPayment } from "../contractMutations";
import SignatureCanvas from 'react-signature-canvas'; 
import { useModal } from "../../../../hooks/modal/useModalStore";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function ContractOfferModal() {
  const { closeModal, modalProps } = useModal();
  const [agreed, setAgreed] = useState(false);
  const [signatureMode, setSignatureMode] = useState("type");
  const [fullName, setFullName] = useState("");
  const sigCanvas = useRef(null);

  const { mutate: verifyPayment, isLoading: isVerifying } = useVerifyPayment();
console.log(modalProps);

  const projectName = modalProps?.projectName || "E-commerce Website Redesign";
  const freelancerName = modalProps?.freelancerName || "Sarah Chen";
  const amount = modalProps?.amount || 0;

  const agreementItems = [
    {
      title: "Escrow & Payment Protection",
      description: [
        "Funds will be held securely in Escrow until project milestones are approved.",
        "Payment is released only upon your satisfaction with the deliverables.",
      ],
    },
    {
      title: "Intellectual Property Transfer",
      description: [
        "Upon full payment, all intellectual property rights, including copyrights and source",
        "code, are automatically transferred to the Client.",
      ],
    },
    {
      title: "Confidentiality",
      description: [
        "The Freelancer agrees to keep all project details, trade secrets, and proprietary",
        "information strictly confidential in perpetuity.",
      ],
    },
    {
      title: "Independent Contractor Status",
      description: [
        "The Freelancer is an independent contractor, not an employee. Both parties are",
        "responsible for their own taxes and benefits.",
      ],
    },
    {
      title: "Dispute Resolution",
      description: [
        "Any disputes arising from this agreement shall be resolved through the platform's",
        "mediation center before seeking external legal recourse.",
      ],
    },
  ];

  const getSignatureData = () => {
    if (signatureMode === "draw") {
      if (sigCanvas.current.isEmpty()) return null;
      return sigCanvas.current.getCanvas().toDataURL('image/png');
    } else {
      if (!fullName.trim()) return null;
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "italic 70px 'Mr Dafoe', cursive";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fullName, canvas.width / 2, canvas.height / 2);
      return canvas.toDataURL('image/png');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-[672px] bg-white rounded-xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 px-6 py-6 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] wrap-anywhere font-semibold text-slate-900 leading-7 mb-1">
              {projectName}
            </h1>
            <p className="text-xs text-slate-500 leading-5">
              Contract with <span className="text-slate-700  font-medium">{freelancerName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1 px-[17px] py-[10px] rounded-full border border-blue-200 bg-blue-50">
              <span className="text-xs font-bold text-blue-700 leading-5">Total: ${amount}</span>
            </div>
            <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 leading-5 uppercase tracking-wide">
              Standard Service Agreement
            </h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-6 max-h-[200px] overflow-y-auto">
              {agreementItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-semibold text-slate-900 leading-5">{item.title}</h3>
                    {item.description.map((line, i) => (
                      <p key={i} className="text-xs text-slate-600 leading-[20px]">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-[17px]">
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 bg-white checked:bg-blue-600 transition-colors"
              />
              <span className="flex-1 text-xs font-medium text-slate-700 leading-5">
                I have read and agree to the Standard Service Agreement and understand that funds will be held in Escrow.
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-500 leading-5 uppercase tracking-wide">Signature</h2>
              <div className="flex gap-1 p-1 rounded-lg bg-slate-100">
                <button
                  onClick={() => setSignatureMode("type")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${signatureMode === "type" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}
                >
                  Type
                </button>
                <button
                  onClick={() => setSignatureMode("draw")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${signatureMode === "draw" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}
                >
                  Draw
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {signatureMode === "type" ? (
                <>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Type your full name to sign"
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="w-full h-36 flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">DIGITAL PREVIEW</div>
                    <span 
                      className="text-5xl text-slate-900 select-none px-4 text-center underline" 
                      style={{ 
                        fontFamily: "'Mr Dafoe', cursive",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.05)" 
                      }}
                    >
                      {fullName || "Your Signature"}
                    </span>
                    <div className="absolute bottom-4 w-[80%] h-px bg-slate-200"></div>
                  </div>
                </>
              ) : (
                <div className="relative border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner">
                  <button onClick={() => sigCanvas.current.clear()} className="absolute top-3 right-3 text-[10px] font-bold text-slate-400 hover:text-red-500 z-10">
                    CLEAR
                  </button>
                  <SignatureCanvas 
                    ref={sigCanvas} 
                    penColor="#0f172a"
                    canvasProps={{ className: "w-full h-40 cursor-crosshair" }} 
                  />
                  <div className="absolute bottom-6 left-[10%] right-[10%] h-px bg-slate-100 pointer-events-none"></div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed italic">Digital signature captured via IP & Timestamp audit trail.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 py-6 border-t bg-slate-50/50">
          {agreed && (signatureMode === "draw" || fullName.trim()) ? (
            <PayPalButtons
              style={{ layout: "horizontal", height: 45 }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: amount.toString(),
                      currency_code: "USD"
                    },
                    description: `Contract for ${projectName}`
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const signatureFinal = getSignatureData();
                
                verifyPayment({
                  paypal_order_id: details.id,
                  project_id: modalProps?.projectId,
                  freelancer_id: modalProps?.freelancerId,
                  total_amount: amount,
                  client_signature: signatureFinal,
                  client_signature_type: signatureMode,
                }, {
                  onSuccess: () => {
                    toast.success("Payment successful and Contract created!");
                    closeModal();
                  },
                  onError: (error) => {
                    toast.error(error.response?.data?.error || "Verification failed. Contact support.");
                  }
                });
              }}
            />
          ) : (
             <div className="flex items-center justify-end gap-3">
                <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100">
                    Cancel
                </button>
                <button
                    disabled={true}
                    className="px-8 py-2.5 text-sm font-bold text-white rounded-lg bg-blue-300 shadow-sm min-w-[160px]"
                >
                    Complete Steps to Hire
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}