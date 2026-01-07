import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnBoarding } from '../OnBoardingContext';
import OnboardingLayout from '../../../../layouts/OnBoardingLayout';
import { stepSixSchema } from "./stepSixSchema";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSubmitFreelancerOnboarding } from '../onBoardingMutations';

export default function StepSix() {
  const { formData, updateFormData, nextStep } = useOnBoarding();
  const navigate = useNavigate(0)
  const {mutateAsync, isPending} = useSubmitFreelancerOnboarding()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepSixSchema),
    defaultValues: {
      bankDetails: {
        fullName: formData.bankDetails?.fullName || '',
        accountNumber: formData.bankDetails?.accountNumber || '',
        confirmAccountNumber: '',
        ifscCode: formData.bankDetails?.ifscCode || '',
        bankName: formData.bankDetails?.bankName || '',
        isConfirmed: formData.bankDetails?.isConfirmed || false,
      }
    },
  });


 const onSubmit = async (data) => {
  const { confirmAccountNumber, isConfirmed, ...cleanBankDetails } = data.bankDetails;

const payload = {
  tagline: formData.tagline,
  bio: formData.bio,
  phone: formData.phone,
  primary_category: formData.primaryCategory,
  skills: formData.skills,
  experience_level: formData.experienceLevel,
  packages: formData.packages,
  portfolios: formData.portfolios,
  bank_details: cleanBankDetails,
}

    try {
      await mutateAsync(payload);
      toast.success("Profile completed successfully 🎉");
      navigate("/freelancer/dashboard");
    } catch (err) {
      toast.error("Failed to complete onboarding");
    }
  };

  return (
    <OnboardingLayout 
      title="Add Your Bank Details" 
      subtitle="Your payouts will be sent securely to this account."
    >
      <div className="w-full max-w-[720px] mx-auto">
        <form id="onboarding-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name (as per bank account)</label>
            <input
              type="text"
              {...register("bankDetails.fullName")}
              placeholder="Enter your full name"
              className={`h-[54px] px-5 rounded-xl border outline-none transition-all ${
                errors.bankDetails?.fullName ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
              }`}
            />
            {errors.bankDetails?.fullName && <p className="text-red-500 text-xs font-bold">{errors.bankDetails.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Account Number</label>
              <input
                type="password"
                {...register("bankDetails.accountNumber")}
                placeholder="Enter account number"
                className={`h-[54px] px-5 rounded-xl border outline-none transition-all ${
                  errors.bankDetails?.accountNumber ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
              />
              {errors.bankDetails?.accountNumber && <p className="text-red-500 text-xs font-bold">{errors.bankDetails.accountNumber.message}</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Re-enter Account Number</label>
              <input
                type="text"
                {...register("bankDetails.confirmAccountNumber")}
                placeholder="Confirm account number"
                className={`h-[54px] px-5 rounded-xl border outline-none transition-all ${
                  errors.bankDetails?.confirmAccountNumber ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
              />
              {errors.bankDetails?.confirmAccountNumber && <p className="text-red-500 text-xs font-bold">{errors.bankDetails.confirmAccountNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">IFSC Code</label>
              <input
                type="text"
                {...register("bankDetails.ifscCode")}
                placeholder="e.g., SBIN0001234"
                className={`h-[54px] px-5 rounded-xl border outline-none transition-all uppercase ${
                  errors.bankDetails?.ifscCode ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
              />
              {errors.bankDetails?.ifscCode && <p className="text-red-500 text-xs font-bold">{errors.bankDetails.ifscCode.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Bank Name</label>
              <input
                type="text"
                {...register("bankDetails.bankName")}
                placeholder="Enter your bank name"
                className={`h-[54px] px-5 rounded-xl border outline-none transition-all ${
                  errors.bankDetails?.bankName ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
              />
              {errors.bankDetails?.bankName && <p className="text-red-500 text-xs font-bold">{errors.bankDetails.bankName.message}</p>}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              Your banking data is encrypted and stored securely. This information is only used for automated payouts to your account.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-1">
              <input
                type="checkbox"
                id="confirm-details"
                {...register("bankDetails.isConfirmed")}
                className="w-5 h-5 rounded-md border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="confirm-details" className="text-sm text-gray-700 font-bold cursor-pointer">
                I confirm these bank details are correct.
              </label>
            </div>
            {errors.bankDetails?.isConfirmed && <p className="text-red-500 text-xs font-bold ml-8">{errors.bankDetails.isConfirmed.message}</p>}
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}