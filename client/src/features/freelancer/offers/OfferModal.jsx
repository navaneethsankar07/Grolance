import React, { useState, useRef } from "react";
import { X, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react"; 
import SignatureCanvas from 'react-signature-canvas'; 
import { useModal } from "../../../hooks/modal/useModalStore";
import { useAcceptOffer } from "./offersQuries";
import { toast } from "react-toastify";

export default function OfferModal() {
  const { closeModal, modalProps } = useModal();
  const [agreed, setAgreed] = useState(false);
  const [signatureMode, setSignatureMode] = useState("type");
  const [fullName, setFullName] = useState("");
  const sigCanvas = useRef(null);

  const { mutate: acceptOffer, isPending } = useAcceptOffer();

  const offer = modalProps?.offer;
  const projectName = offer?.project_title || "Project Offer";
  const clientName = offer?.client_name || "Client";
  const amount = offer?.total_amount || 0;

  const freelancerAgreementItems = [
    {
      title: "Deliverables & Quality",
      description: [
        "I agree to provide high-quality work as per the project requirements.",
        "I understand that payment is released upon milestone approval by the client.",
      ],
    },
    {
      title: "Deadlines & Timelines",
      description: [
        "I commit to the delivery schedule agreed upon in the proposal.",
        "I will communicate promptly if any unforeseen delays occur.",
      ],
    },
    {
      title: "Intellectual Property",
      description: [
        "I acknowledge that upon receipt of full payment, all rights to the work",
        "transfer to the client, unless otherwise agreed in writing.",
      ],
    },
    {
      title: "Professional Conduct",
      description: [
        "I will maintain a professional relationship and handle all disputes",
        "through the platform's official mediation process.",
      ],
    },
  ];

  const handleSignAndAccept = () => {
    let signatureFinal = "";

    if (signatureMode === "draw") {
      if (sigCanvas.current.isEmpty()) {
        toast.error("Please provide a signature");
        return;
      }
      signatureFinal = sigCanvas.current.getCanvas().toDataURL('image/png');
    }else {
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
      signatureFinal = canvas.toDataURL('image/png');
    }

    const payload = {
      contractId: offer?.id,
      data: {
        freelancer_signature: signatureFinal,
        freelancer_signature_type: signatureMode,
      }
    };

    acceptOffer(payload, {
      onSuccess: () => {
        closeModal();
      },
      onError: (error) => {
        const message = error.response?.data?.error || "Failed to sign contract";
        toast.error(message);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-[672px] bg-white rounded-xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-start justify-between gap-4 px-6 py-6 border-b border-slate-100 bg-slate-50/30">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase mb-2">
              Incoming Offer
            </span>
            <h1 className="text-[17px] font-semibold text-slate-900 leading-tight mb-1">
              {projectName}
            </h1>
            <p className="text-xs text-slate-500">
              Contracting with <span className="text-slate-700 font-medium">{clientName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Contract Value</span>
              <span className="text-lg font-bold text-slate-900">${Number(amount).toLocaleString()}</span>
            </div>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              This project is <span className="font-bold">Fully Funded</span>. Your payment is secured in Escrow and will be released upon milestone completion.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 leading-5 uppercase tracking-wide">
              Freelancer Service Agreement
            </h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-6">
              {freelancerAgreementItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    {item.description.map((line, i) => (
                      <p key={i} className="text-xs text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 bg-white checked:bg-blue-600 transition-colors"
              />
              <span className="flex-1 text-xs font-medium text-slate-700 leading-relaxed">
                I agree to the terms above and confirm that I will deliver the project according to the client's specifications and deadlines.
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Digital Signature</h2>
              <div className="flex gap-1 p-1 rounded-lg bg-slate-100">
                <button
                  onClick={() => setSignatureMode("type")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${signatureMode === "type" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}
                >
                  Type
                </button>
                <button
                  onClick={() => setSignatureMode("draw")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${signatureMode === "draw" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}
                >
                  Draw
                </button>
              </div>
            </div>

            {signatureMode === "type" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name to sign"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="w-full h-32 flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden">
                  <span className="text-4xl text-slate-900 underline" style={{ fontFamily: "'Mr Dafoe', cursive" }}>
                    {fullName || "Digital Signature"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button onClick={() => sigCanvas.current.clear()} className="absolute top-2 right-2 text-[10px] font-bold text-slate-400 hover:text-red-500 z-10">
                  CLEAR
                </button>
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor="#0f172a"
                  canvasProps={{ className: "w-full h-32 cursor-crosshair" }} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-6 border-t bg-slate-50">
          <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900" disabled={isPending}>
            close
          </button>
          <button
            onClick={handleSignAndAccept}
            disabled={!agreed || (signatureMode === 'type' && !fullName.trim()) || isPending}
            className="px-8 py-2.5 text-sm font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing...
              </>
            ) : (
              "Sign & Start Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}