import OnboardingLayout from "../../../../layouts/OnBoardingLayout";
import { stepOneSchema } from "./stepOneSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnBoarding } from "../OnBoardingContext";
import { useFreelancerProfile } from "../onBoardingQueries";
import { useSendPhoneOtp } from "../onBoardingMutations";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function StepOne() {
  const { formData, updateFormData, nextStep } = useOnBoarding();
  const { openModal } = useModal();

  const { data: freelancerProfile } = useFreelancerProfile();
  const { mutateAsync: sendOtp, isPending } = useSendPhoneOtp();

  const phoneVerified = freelancerProfile?.phone_verified === true;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepOneSchema),
    defaultValues: formData,
  });

  const phoneValue = watch("phone");

const handleVerify = async () => {
  console.log("VERIFY CLICKED", phoneValue);

  if (!phoneValue) return;

  await sendOtp({ phone: phoneValue });
  openModal("phone-otp", { phone: phoneValue });
};

const onSubmit = (data) => {
  if (!phoneVerified) {
    alert("Please verify your phone number before continuing.");
    return;
  }

  updateFormData(data);
  nextStep();
};


  return (
    <OnboardingLayout 
      title="Tell Us About Yourself" 
      subtitle="Let clients know who you are and what you bring to the table."
    >
      <form
        id="onboarding-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Tagline
          </label>
          <input
            {...register("tagline")}
            type="text"
            placeholder="Full-stack Developer | UI/UX Enthusiast"
            className={`w-full h-[54px] px-5 rounded-xl border transition-all text-base focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.tagline
                ? "border-red-500"
                : "border-[#D1D5DB] focus:border-primary"
            }`}
          />
          {errors.tagline && (
            <p className="text-red-500 text-xs font-medium">
              {errors.tagline.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Short Bio
          </label>
          <textarea
            {...register("bio")}
            placeholder="Tell clients about your experience..."
            className={`w-full min-h-[140px] px-5 py-4 rounded-xl border transition-all text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.bio
                ? "border-red-500"
                : "border-[#D1D5DB] focus:border-primary"
            }`}
          />
          {errors.bio && (
            <p className="text-red-500 text-xs font-medium">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Phone Number
          </label>
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              {...register("phone")}
              type="tel"
              disabled={phoneVerified}
              placeholder="+1 (555) 000-0000"
              className={`h-[54px] px-5 rounded-xl border transition-all text-base flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.phone
                  ? "border-red-500"
                  : "border-[#D1D5DB] focus:border-primary"
              }`}
            />

            {!phoneVerified && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={isPending}
                className="h-[54px] px-6 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
              >
                Verify
              </button>
            )}
          </div>

          {phoneVerified && (
            <p className="text-green-600 text-xs font-semibold mt-1">
              ✔ Phone number verified
            </p>
          )}

          {errors.phone && (
            <p className="text-red-500 text-xs font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-4 pt-4">
            <input
              {...register("agreedToTerms")}
              id="agreedToTerms"
              type="checkbox"
              className="mt-1.5 w-5 h-5 accent-primary border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="agreedToTerms"
              className="text-sm text-gray-600 leading-relaxed cursor-pointer"
            >
              I have read and agree to the{" "}
              <a
                href="/terms"
                className="text-primary font-bold hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-primary font-bold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-red-500 text-xs font-medium">
              {errors.agreedToTerms.message}
            </p>
          )}
        </div>
      </form>
    </OnboardingLayout>
  );
}
