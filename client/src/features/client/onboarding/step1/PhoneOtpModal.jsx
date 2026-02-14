import { useState } from "react";
import { useVerifyPhoneOtp } from "../onBoardingMutations";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useSelector } from "react-redux";

export default function PhoneOtpModal({ phone }) {
  const [otp, setOtp] = useState("");
  const { closeModal } = useModal();
  const { mutateAsync: verifyOtp, isPending } = useVerifyPhoneOtp();
  const user = useSelector(state=>state.auth.user)

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    await verifyOtp({ phone, otp });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Verify Phone Number
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit OTP sent to <span className="font-semibold">{user?.email}</span>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
          className="w-full h-[54px] px-5 rounded-xl border border-[#D1D5DB] text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleVerify}
          disabled={isPending}
          className="mt-6 w-full h-[54px] rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50"
        >
          Verify OTP
        </button>

        <button
          onClick={closeModal}
          className="mt-4 w-full text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
