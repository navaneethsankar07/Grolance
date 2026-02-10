import React from 'react';
import { ShieldCheck, Zap, Users, CheckCircle, ArrowRight, Briefcase, Wallet, Scale } from 'lucide-react';
import Header from '../../features/client/landingPage/components/Header';
import Footer from '../../features/client/landingPage/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ClientHeader from '../../features/client/homepage/components/ClientHeader';
import { FreelancerHeader } from '../../features/freelancer/dashboard/components/Header';

const WhyUsPage = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const stats = [
    { label: "Successful Projects", value: "12K+" },
    { label: "Active Freelancers", value: "4.5K" },
    { label: "Total Paid Out", value: "$25M+" },
    { label: "Dispute Resolution", value: "98%" }
  ];

  const handleAction = () => {
    if (user) {
      user.current_role === 'client' ? navigate('/create-project') : navigate('/freelancer/jobs');
    } else {
      toast.warn('Please Login or Signup to continue');
      navigate('/login');
    }
  };

  const freelancerPillars = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Guaranteed Payouts",
      description: "Our mandatory escrow funding means the money is secured before you even start. Never chase a client for payment again."
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: "Fair Dispute Policy",
      description: "We provide an unbiased mediation process. Our team reviews evidence manually to ensure talent is protected from unfair claims."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "High-Value Contracts",
      description: "We attract serious businesses and enterprise clients, moving you away from 'race-to-the-bottom' bidding wars."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {user ? 
        (user?.current_role === 'client' ? <ClientHeader /> : <div className='fixed w-full z-100'><FreelancerHeader/></div> ) 
        : <Header />
      }

      <main className="flex-grow">
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05]">
              Built for <span className="text-primary">Reliability.</span> <br /> 
              Trusted by <span className="text-primary">Both Sides.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Grolance bridges the gap between ambitious companies and elite global talent 
              through a platform rooted in transparency, security, and mutual growth.
            </p>
          </div>
        </section>

        <section className="bg-primary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl lg:text-5xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center lg:text-left">
               <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Why Top Talent Chooses Us</h2>
               <p className="text-slate-500 font-medium">The best freelancers stay here because we respect their craft.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {freelancerPillars.map((pillar, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{pillar.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-40 px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-8 lg:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">Better for Clients.<br/>Better for Talent.</h2>
                <ul className="space-y-6">
                  {[
                    { c: "Clients", t: "pay only for verified milestones." },
                    { c: "Freelancers", t: "keep more of their earnings." },
                    { c: "Both", t: "benefit from escrow system." },
                    { c: "Both", t: "get 24/7 dedicated support tickets." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                      <span className="text-slate-300 font-medium">
                        <strong className="text-white">{item.c}</strong> {item.t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
                 <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">Freelancer Retention Rate</div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[92%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">Client Repeat Rate</div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[88%]" />
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-8">Ready to start?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleAction} 
                className="h-16 px-12 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
              >
                {user?.current_role === 'freelancer' ? 'Find Work' : 'Launch Project'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WhyUsPage;