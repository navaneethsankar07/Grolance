import SignupForm from "./SignupForm";

export default function SignupLayout({ onClose }) {
  return (
    <div className="w-full max-w-[1121px] md:h-[780px] flex flex-col md:flex-row bg-white rounded-[28px] overflow-hidden shadow-2xl relative">

      <button
        onClick={onClose}
        className="absolute top-2 right-4 text-gray-600 hover:text-black text-5xl"
      >
        ×
      </button>

      <div className="w-full md:w-[646px] h-[300px] md:h-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d5a056a1a9dcfe6edb4f50fccc858ae5f35d3183?width=1292"
          alt="Signup Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-[474px] bg-white p-8 md:p-12 flex flex-col">
        <h1 className="font-poppins font-semibold text-[28px] md:text-[37px] text-center mb-8 md:mb-12">
          Create an account
        </h1>

        <button
          type="button"
          className="w-full h-[52px] flex items-center justify-center gap-4 px-4 rounded-[10px] border border-[#CBCAD7] bg-white hover:bg-gray-50 transition-colors mb-6"
        >
          <span className="font-poppins font-medium text-base text-[#19181F]">
            Create account with Google
          </span>
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            className="w-6 h-6"
            alt="Google"
          />
        </button>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex-1 h-[1.5px] bg-[#CBCAD7]" />
          <span className="font-poppins font-medium text-lg text-[#686677]">
            Or
          </span>
          <div className="flex-1 h-[1.5px] bg-[#CBCAD7]" />
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
