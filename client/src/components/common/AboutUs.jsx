import React from "react";
import { ShieldCheck, Zap, Users, Landmark, Scale, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../../features/client/landingPage/components/Footer";

const Header = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link to="/" className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
        <h2 className="text-[37px] font-museo font-extrabold leading-7">
              <span className="text-[#1A1A1A]">Gro</span>
              <span className="text-[#3B82F6]">lance</span>
            </h2>
      </Link>
    
    
    </div>
  </nav>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-4 block">Our Purpose</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            Redefining the economy of <span className="text-blue-600">digital work.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            We built this platform to bridge the trust gap between elite freelancers and global clients. 
            By combining legal-grade service agreements with secure escrow technology, we ensure every project 
            is a guaranteed success.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Escrow Protection</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Funds are held securely by our platform and disbursed only when you approve the deliverables. 
              Zero risk, total transparency.
            </p>
          </div>
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Arbitration Excellence</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Our Resolution Center Audit ensures fair treatment. If a dispute arises, our unbiased 
              arbitrators review the contract specifications to provide a just outcome.
            </p>
          </div>
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <Landmark className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Legal Compliance</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Every order generates a legally binding Service Agreement, protecting the intellectual 
              property and commercial rights of both parties.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-24 px-6 rounded-[2rem] mx-4 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl font-black text-white mb-2 tracking-tighter">$2M+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escrowed Funds</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-2 tracking-tighter">99.2%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-2 tracking-tighter">24H</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Dispute Resolution</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-2 tracking-tighter">15k+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Professionals</p>
            </div>
          </div>
        </div>
      </section>

     
    <Footer/>
    </div>
  );
}