import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useModal } from "../../../../hooks/modal/useModalStore";
export default function AuthLayout({
  title,
  children,
  onClose,
}) {

  const {openModal} = useModal()
  return (
    <div className="w-full max-w-[1120px] md:h-[780px] flex flex-col md:flex-row bg-white rounded-[28px] overflow-hidden shadow-2xl relative">

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-5xl"
        >
          ×
        </button>
      )}

      <div className="w-full md:w-[646px] h-[300px] md:h-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d5a056a1a9dcfe6edb4f50fccc858ae5f35d3183?width=1292"
          alt="Auth Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-[474px]  bg-white p-8 md:p-12 flex flex-col">
        <h1 className={`font-Museo font-bold text-[28px] md:text-[40px] ${title==='Welcome Back'?'mt-20':'mt-0'} text-center `}>
          {title}
        </h1>
        {title=='Welcome Back'?<span className="text-lg text-gray-600 mb-8 md:mb-10 ml-17 flex gap-1">
              Don't have an account?{" "}
              <button onClick={()=>openModal('signup')} className=" text-blue-500 font-semibold hover:underline flex gap-2 ">
                <span >Sign up</span>
                <ExternalLink size={20} className="text-blue-500 mt-[0.1rem]" />
              </button>
            </span>:null}
        

        {children}
      </div>
    </div>
  );
}
