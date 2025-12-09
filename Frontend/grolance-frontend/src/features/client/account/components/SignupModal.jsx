import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModelWrapper";
import SignupForm from "./SignupForm";
import SignupLayout from "./SignupLayout";

export default function SignupModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <ModalWrapper onClose={onClose}>
      <SignupLayout onClose={onClose} />
    </ModalWrapper>,
    document.getElementById("modal-root")
  );
}




































//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
//       <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[1121px] md:h-[780px] flex flex-col md:flex-row bg-white rounded-[25px] overflow-hidden shadow-2xl relative">

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl"
//         >
//           ×
//         </button>

//         <div className="w-full md:w-[646px] h-[300px] md:h-full bg-linear-to-br from-blue-500 to-blue-700 relative overflow-hidden">
//           <img
//             src="https://api.builder.io/api/v1/image/assets/TEMP/d5a056a1a9dcfe6edb4f50fccc858ae5f35d3183?width=1292"
//             alt="Team collaboration"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="w-full md:w-[474px] bg-white p-8 md:p-12 flex flex-col">
//           <h1 className="font-poppins font-semibold text-[28px] md:text-[37px] leading-[41px] text-[#100F14] text-center mb-8 md:mb-12">
//             Create an account
//           </h1>

//           <form onSubmit={handleSubmit(onsubmit)} className="flex-1 flex flex-col">

//             <button
//               type="button"
//               className="w-full h-[52px] flex items-center justify-center gap-4 px-4 rounded-[10px] border border-[#CBCAD7] bg-white hover:bg-gray-50 transition-colors mb-6"
//             >
//               <span className="font-poppins font-medium text-base text-[#19181F]">
//                 Create account with Google
//               </span>
//               <img
//                 src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//                 alt="Google Icon"
//                 className="w-6 h-6"
//               />
//             </button>

//             <div className="flex items-center gap-6 mb-6">
//               <div className="flex-1 h-[1.5px] bg-[#CBCAD7] opacity-80" />
//               <span className="font-poppins font-medium text-lg text-[#686677]">Or</span>
//               <div className="flex-1 h-[1.5px] bg-[#CBCAD7] opacity-80" />
//             </div>

//             <div className="mb-6">
//               <label className="block font-poppins font-medium text-base text-[#9794AA] mb-2">
//                 Email Address
//               </label>
//                           <input
//                               type="email"
//                               placeholder="Enter your email address"
//                               {...register("email", { required: "Email is required" })}
//                               className="..."
//                           />
//                           {errors.email && (
//                               <p className="text-red-500 text-xs">{errors.email.message}</p>
//                           )}

//             </div>

//             <div className="mb-6">
//               <label className="block font-poppins font-medium text-base text-[#9794AA] mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 {...register("fullName", { required: "Full name is required" })}

//                 className="w-full h-[41px] px-4 font-poppins font-medium text-base text-[#686677] border border-[#CBCAD7] rounded-md focus:ring-2 focus:ring-[#3B82F6]"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block font-poppins font-medium text-base text-[#9794AA] mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Create your password"
//                   {...register("password", { required: "Password is required" })}

//                   className="w-full h-[41px] px-4 pr-12 font-poppins font-medium text-base text-[#686677] border border-[#CBCAD7] rounded-md focus:ring-2 focus:ring-[#3B82F6]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M4.53033 3.46967C4.23744 3.17678 3.76256 3.17678 3.46967 3.46967C3.17678 3.76256 3.17678 4.23744 3.46967 4.53033L4.53033 3.46967ZM19.4697 20.5303C19.7626 20.8232 20.2374 20.8232 20.5303 20.5303C20.8232 20.2374 20.8232 19.7626 20.5303 19.4697L19.4697 20.5303ZM14.5002 14.795C14.8088 14.5187 14.8351 14.0446 14.5589 13.7359C14.2826 13.4273 13.8085 13.401 13.4998 13.6773L14.5002 14.795ZM10.3227 10.5002C10.599 10.1915 10.5727 9.71739 10.2641 9.44115C9.95543 9.1649 9.48129 9.19117 9.20504 9.49981L10.3227 10.5002ZM19.1153 15.0421C18.8029 15.314 18.7701 15.7878 19.0421 16.1002C19.3141 16.4126 19.7878 16.4453 20.1002 16.1734L19.1153 15.0421ZM9.18831 4.69699C8.79307 4.82092 8.57313 5.24179 8.69705 5.63703C8.82098 6.03227 9.24185 6.25221 9.63709 6.12829L9.18831 4.69699ZM6.90354 7.43556C7.25269 7.21269 7.35505 6.74898 7.13218 6.39984C6.90931 6.0507 6.4456 5.94833 6.09646 6.1712L6.90354 7.43556ZM17.5515 18.0471C17.9064 17.8335 18.021 17.3727 17.8075 17.0177C17.5939 16.6628 17.1331 16.5482 16.7782 16.7618L17.5515 18.0471ZM3.46967 4.53033L19.4697 20.5303L20.5303 19.4697L4.53033 3.46967L3.46967 4.53033ZM8.25 12C8.25 14.0711 9.92893 15.75 12 15.75V14.25C10.7574 14.25 9.75 13.2426 9.75 12H8.25ZM12 15.75C12.96 15.75 13.8372 15.3883 14.5002 14.795L13.4998 13.6773C13.1012 14.034 12.5767 14.25 12 14.25V15.75ZM9.20504 9.49981C8.61169 10.1628 8.25 11.04 8.25 12H9.75C9.75 11.4233 9.96602 10.8988 10.3227 10.5002L9.20504 9.49981ZM2.32608 14.6636C4.2977 16.738 7.84898 19.75 12 19.75V18.25C8.51999 18.25 5.35328 15.6713 3.41334 13.6302L2.32608 14.6636ZM21.6739 9.33641C19.7023 7.26198 16.151 4.25 12 4.25V5.75C15.48 5.75 18.6467 8.32869 20.5867 10.3698L21.6739 9.33641ZM21.6739 14.6636C23.1087 13.154 23.1087 10.846 21.6739 9.33641L20.5867 10.3698C21.4711 11.3004 21.4711 12.6996 20.5867 13.6302L21.6739 14.6636ZM3.41334 13.6302C2.52889 12.6996 2.52889 11.3004 3.41334 10.3698L2.32608 9.33641C0.891307 10.846 0.891306 13.154 2.32608 14.6636L3.41334 13.6302ZM20.1002 16.1734C20.6921 15.6581 21.2202 15.1409 21.6739 14.6636L20.5867 13.6302C20.1602 14.0789 19.6662 14.5624 19.1153 15.0421L20.1002 16.1734ZM12 4.25C11.0225 4.25 10.0801 4.41736 9.18831 4.69699L9.63709 6.12829C10.4042 5.88776 11.1948 5.75 12 5.75V4.25ZM6.09646 6.1712C4.57051 7.14527 3.28015 8.33259 2.32608 9.33641L3.41334 10.3698C4.31512 9.42098 5.51237 8.3236 6.90354 7.43556L6.09646 6.1712ZM12 19.75C14.0476 19.75 15.9403 19.0165 17.5515 18.0471L16.7782 16.7618C15.3131 17.6433 13.6886 18.25 12 18.25V19.75Z" fill="#49475A"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="mb-8">
//               <label className="block font-poppins font-medium text-base text-[#9794AA] mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                               <input
//                                   type={showConfirmPassword ? "text" : "password"}
//                                   placeholder="Enter your password again"
//                                   {...register("confirmPassword", {
//                                       required: "Confirm password is required",
//                                       validate: (value) =>
//                                           value === watch("password") || "Passwords do not match",
//                                   })}


//                   className="w-full h-[41px] px-4 pr-12 font-poppins font-medium text-base text-[#9993c2] border border-[#CBCAD7] rounded-md focus:ring-2 focus:ring-[#3B82F6]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowConfirmPassword(!showConfirmPassword)
//                   }
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M4.53033 3.46967C4.23744 3.17678 3.76256 3.17678 3.46967 3.46967C3.17678 3.76256 3.17678 4.23744 3.46967 4.53033L4.53033 3.46967ZM19.4697 20.5303C19.7626 20.8232 20.2374 20.8232 20.5303 20.5303C20.8232 20.2374 20.8232 19.7626 20.5303 19.4697L19.4697 20.5303ZM14.5002 14.795C14.8088 14.5187 14.8351 14.0446 14.5589 13.7359C14.2826 13.4273 13.8085 13.401 13.4998 13.6773L14.5002 14.795ZM10.3227 10.5002C10.599 10.1915 10.5727 9.71739 10.2641 9.44115C9.95543 9.1649 9.48129 9.19117 9.20504 9.49981L10.3227 10.5002ZM19.1153 15.0421C18.8029 15.314 18.7701 15.7878 19.0421 16.1002C19.3141 16.4126 19.7878 16.4453 20.1002 16.1734L19.1153 15.0421ZM9.18831 4.69699C8.79307 4.82092 8.57313 5.24179 8.69705 5.63703C8.82098 6.03227 9.24185 6.25221 9.63709 6.12829L9.18831 4.69699ZM6.90354 7.43556C7.25269 7.21269 7.35505 6.74898 7.13218 6.39984C6.90931 6.0507 6.4456 5.94833 6.09646 6.1712L6.90354 7.43556ZM17.5515 18.0471C17.9064 17.8335 18.021 17.3727 17.8075 17.0177C17.5939 16.6628 17.1331 16.5482 16.7782 16.7618L17.5515 18.0471ZM3.46967 4.53033L19.4697 20.5303L20.5303 19.4697L4.53033 3.46967L3.46967 4.53033ZM8.25 12C8.25 14.0711 9.92893 15.75 12 15.75V14.25C10.7574 14.25 9.75 13.2426 9.75 12H8.25ZM12 15.75C12.96 15.75 13.8372 15.3883 14.5002 14.795L13.4998 13.6773C13.1012 14.034 12.5767 14.25 12 14.25V15.75ZM9.20504 9.49981C8.61169 10.1628 8.25 11.04 8.25 12H9.75C9.75 11.4233 9.96602 10.8988 10.3227 10.5002L9.20504 9.49981ZM2.32608 14.6636C4.2977 16.738 7.84898 19.75 12 19.75V18.25C8.51999 18.25 5.35328 15.6713 3.41334 13.6302L2.32608 14.6636ZM21.6739 9.33641C19.7023 7.26198 16.151 4.25 12 4.25V5.75C15.48 5.75 18.6467 8.32869 20.5867 10.3698L21.6739 9.33641ZM21.6739 14.6636C23.1087 13.154 23.1087 10.846 21.6739 9.33641L20.5867 10.3698C21.4711 11.3004 21.4711 12.6996 20.5867 13.6302L21.6739 14.6636ZM3.41334 13.6302C2.52889 12.6996 2.52889 11.3004 3.41334 10.3698L2.32608 9.33641C0.891307 10.846 0.891306 13.154 2.32608 14.6636L3.41334 13.6302ZM20.1002 16.1734C20.6921 15.6581 21.2202 15.1409 21.6739 14.6636L20.5867 13.6302C20.1602 14.0789 19.6662 14.5624 19.1153 15.0421L20.1002 16.1734ZM12 4.25C11.0225 4.25 10.0801 4.41736 9.18831 4.69699L9.63709 6.12829C10.4042 5.88776 11.1948 5.75 12 5.75V4.25ZM6.09646 6.1712C4.57051 7.14527 3.28015 8.33259 2.32608 9.33641L3.41334 10.3698C4.31512 9.42098 5.51237 8.3236 6.90354 7.43556L6.09646 6.1712ZM12 19.75C14.0476 19.75 15.9403 19.0165 17.5515 18.0471L16.7782 16.7618C15.3131 17.6433 13.6886 18.25 12 18.25V19.75Z" fill="#49475A"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full h-[47px] rounded-[40px] bg-[#3B82F6] hover:bg-[#3B82F6]/90 font-poppins font-medium text-xl text-white mb-4"
//             >
//               Create an account
//             </button>

//             <p className="font-poppins font-normal text-xs text-[#49475A] text-center leading-[25px] tracking-[0.06px]">
//               Already have an account?{" "}
//               <span className="font-semibold text-[#3B82F6] underline cursor-pointer">
//                 Login
//               </span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>,
//      document.getElementById("modal-root")
//   );
// }
