import { Mail, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';
import Footer from '../../features/client/landingPage/components/Footer';
import { useSelector } from 'react-redux';
import ClientHeader from '../../features/client/homepage/components/ClientHeader';
import { FreelancerHeader } from '../../features/freelancer/dashboard/components/Header';
import Header from '../../features/client/landingPage/components/Header';
import ClientFooter from '../../features/client/homepage/components/ClientFooter';
import FreelancerFooter from '../../features/freelancer/dashboard/components/FreelancerFooter';


const ContactPage = () => {
  const emailAddress = "support@yourdomain.com";
  const officeAddress = "123 Business Avenue, Suite 500, New York, NY 10001";
  const phoneNumber = "+1 (555) 000-0000";
  const user = useSelector(state=>state.auth.user)

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans selection:bg-slate-200">
      
      {user?
      user.current_role === 'client' ? <ClientHeader/> : <FreelancerHeader/> : <Header/>}
      <main className="flex-grow">
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto pt-32 pb-20 lg:pt-52 lg:pb-32 px-6 text-center">
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-8 leading-[1.1]">
              Get in touch with our team 
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Connect with our specialized team through our established 
              corporate channels for reliable, high-tier assistance.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-16 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-3">Electronic Mail</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">For technical documentation <br/>and general inquiries.</p>
              <a 
                href={`mailto:${emailAddress}`}
                className="w-full py-4 bg-slate-50 text-[#1E293B] border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300"
              >
                {emailAddress}
              </a>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-3">Global Headquarters</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Strategic operations and <br/>scheduled consultations.</p>
              <address className="not-italic text-[#1E293B] font-bold text-sm leading-relaxed bg-slate-50 w-full py-4 rounded-xl border border-slate-100 px-4">
                {officeAddress}
              </address>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center mb-8">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-3">Direct Line</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Live support available <br/>during standard EST hours.</p>
              <a 
                href={`tel:${phoneNumber}`}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
              >
                {phoneNumber}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start border-t border-slate-100 pt-24">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0F172A] mb-6 tracking-tight">Support Documentation</h2>
                <p className="text-slate-500 leading-relaxed font-medium">Review our most frequently requested information for immediate clarity.</p>
              </div>
              
              <div className="space-y-10">
                {[
                  { q: "Standard SLA Response", a: "Formal inquiries are addressed within one business day via our ticketing protocol." },
                  { q: "Priority Account Management", a: "Enterprise partners maintain 24/7 access through encrypted dedicated channels." },
                  { q: "Governance & Appointments", a: "On-site visits are managed through our corporate scheduling department." }
                ].map((faq, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="mt-1 shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E293B] mb-2">{faq.q}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary p-12 rounded-[3rem] text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-10">
                  <ShieldCheck className="w-7 h-7 " />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">Security Protocol</h3>
                <p className=" leading-relaxed mb-10 font-medium">
                  To maintain the integrity of your account, verify that all correspondence originates from our verified domain. Our security team will never request confidential credentials or sensitive financial keys.
                </p>
                
              </div>
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>
      </main>

      {user?
      user.current_role === 'client' ? <ClientFooter/> : <FreelancerFooter/> : <Footer/>}
    </div>
  );
};

export default ContactPage;