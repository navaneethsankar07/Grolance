import { Link } from "react-router-dom";

export default function FreelancerFooter() {
  const d = new Date();
let year = d.getFullYear();
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 h-30 flex flex-col items-center justify-center">
        <nav className="flex items-center justify-center gap-6 mb-8">
          <Link 
            to="/freelancer/support" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Support
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/freelancer/faq" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            FAQ
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/freelancer/terms-and-conditions" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Terms
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/freelancer/privacy-policies" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Privacy
          </Link>
        </nav>
        <p className="text-gray-600 text-sm text-center">
          © {year} <Link to={'/'}><span className="text-black">gro</span><span className="text-primary">lance.</span></Link> Your Craft Your Crown
        </p>
      </div>
    </footer>
  );
}
