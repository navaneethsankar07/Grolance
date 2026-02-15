import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import Footer from "../../landingPage/components/Footer";
import FreelancerFooter from "../../../freelancer/dashboard/components/FreelancerFooter";
import AdminFooter from "../../../admin/dashboard/components/AdminFooter";

export default function ClientFooter() {
  const year = new Date().getFullYear();
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Footer />;
  }

  if (user?.current_role === "freelancer") {
    return <FreelancerFooter />;
  }
  
  if (user?.is_admin) {
    return <AdminFooter />;
  }

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          <div className="flex flex-col items-center sm:items-start gap-3">
            <h2 className="text-3xl md:text-[37px] font-bold leading-tight" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
              <span className="text-[#1A1A1A]">Gro</span>
              <span className="text-primary">lance</span>
            </h2>
            <p className="text-sm font-medium text-gray-700 sm:ml-2" style={{ fontFamily: 'Murecho, sans-serif' }}>
              Your Craft, Your Crown.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Company
            </h3>
            <nav className="flex flex-col items-center sm:items-start gap-2">
              <Link to='/about-us' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                About Us
              </Link>
              <Link to='/contact-us' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Support
            </h3>
            <nav className="flex flex-col items-center sm:items-start gap-2">
              <Link to='/faq' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                FAQs
              </Link>
              <Link to='/support' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Support
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Legal
            </h3>
            <nav className="flex flex-col items-center sm:items-start gap-2">
              <Link to='/terms-and-conditions' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Terms & Conditions
              </Link>
              <Link to='/privacy-policies' className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm font-bold text-gray-500 text-center md:text-left" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            © {year} <Link to='/'><span className="text-black hover:text-primary transition-colors">gro</span><span className="text-primary">lance.</span></Link> All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/NavaneethSankar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-black transition-colors text-xl"
              aria-label="Follow us on X"
            >
              <FaXTwitter />
            </a>
            <a 
              href="https://www.linkedin.com/in/navaneethsankar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#0077B5] transition-colors text-xl"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}