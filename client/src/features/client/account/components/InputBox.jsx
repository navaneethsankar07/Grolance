import { useState } from "react";
import EyeShow from "../../../../assets/icons/eye-show-svgrepo-com.svg";
import EyeHide from "../../../../assets/icons/eye-password-hide-svgrepo-com.svg"

export default function InputBox({
  label,
  name,
  type = "text",
  register,
  validation = {},
  error,
  placeholder = "",
  passwordToggle = false,
}) {
  const [show, setShow] = useState(false);

  const inputType = passwordToggle ? (show ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="block font-poppins font-medium text-base text-[#9794AA] mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...register(name, validation)}
          className="w-full h-[41px] px-4 pr-12 font-poppins text-base text-[#686677] border border-[#CBCAD7] rounded-md focus:ring-2 focus:ring-[#3B82F6]"
        />

        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {show ? (
  <img src={EyeHide} alt="hide password" className="w-5 h-5" />
) : (
  <img src={EyeShow} alt="show password" className="w-5 h-5" />
)}

          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
