import AuthLayout from "./AuthLayout";
import SignupForm from "./SignupForm";

export default function SignupLayout({ onClose }) {
  return (

    <AuthLayout
      title="Create an account"
      onClose={onClose}
      
    >

   

        <button
          type="button"
          className="w-full h-[52px] flex items-center justify-center gap-1 px-4 rounded-[10px] border border-[#CBCAD7] bg-white hover:bg-gray-50 transition-colors mb-5 mt-5"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            className="w-9 h-9"
            alt="Google"
          />
          <span className="font-poppins font-medium text-base text-[#19181F]">
            Create account with Google
          </span>
          
        </button>

        
        <SignupForm />
            </AuthLayout>
  );
}
