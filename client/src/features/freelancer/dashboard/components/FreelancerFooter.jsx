import { Link } from "react-router-dom";

export default function FreelancerFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 h-30 flex flex-col items-center justify-center">
        <nav className="flex items-center justify-center gap-6 mb-8">
          <Link 
            to="/contact" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Contact us
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/faq" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            FAQ
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/terms" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Terms
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <Link 
            to="/privacy" 
            className="text-blue-500 text-xs font-normal hover:underline"
          >
            Privacy
          </Link>
        </nav>
        <p className="text-gray-600 text-sm text-center">
          © 2025 Grolance — Empowering Freelancers Worldwide
        </p>
      </div>
    </footer>
  );
}
