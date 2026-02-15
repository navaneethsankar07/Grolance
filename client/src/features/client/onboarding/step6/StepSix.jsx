import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnBoarding } from '../OnBoardingContext';
import OnboardingLayout from '../../../../layouts/OnBoardingLayout';
import { stepSixSchema } from "./stepSixSchema";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSubmitFreelancerOnboarding } from '../onBoardingMutations';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../account/auth/authslice';

export default function StepSix() {
  const { formData, updateFormData } = useOnBoarding();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSubmitFreelancerOnboarding();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepSixSchema),
    defaultValues: {
      paymentDetails: {
        paypalEmail: formData.paymentDetails?.paypalEmail || '',
        isConfirmed: formData.paymentDetails?.isConfirmed || false,
      }
    },
  });
  
  const onSubmit = async (data) => {
    const payload = {
      tagline: formData.tagline,
      bio: formData.bio,
      phone: formData.phone,
      primary_category: formData.primaryCategory,
      skills: formData.skills,
      experience_level: formData.experienceLevel,
      packages: formData.packages,
      portfolios: formData.portfolios,
      payment_details: {
        paypalEmail: data.paymentDetails.paypalEmail
      },
    };

    try {
      await mutateAsync(payload);
      dispatch(setUser({
        ...user,
        is_freelancer: true,
        current_role: 'freelancer'
      }));
      toast.success("Profile completed successfully");
      navigate("/freelancer");
    } catch (err) {
      toast.error("Failed to complete onboarding");
    }
  };

  return (
    <OnboardingLayout 
      title="Payout Method" 
      subtitle="Enter your PayPal email to receive payments for completed projects."
    >
      <div className="w-full max-w-[720px] mx-auto">
        <form id="onboarding-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">PayPal Email Address</label>
            <input
              type="email"
              {...register("paymentDetails.paypalEmail")}
              placeholder="e.g., yourname@example.com"
              className={`h-[54px] px-5 rounded-xl border outline-none transition-all ${
                errors.paymentDetails?.paypalEmail ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
              }`}
            />
            {errors.paymentDetails?.paypalEmail && <p className="text-red-500 text-xs font-bold">{errors.paymentDetails.paypalEmail.message}</p>}
          </div>

          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed pt-1">
              Payments will be sent automatically to this PayPal account once the client approves your work. Please ensure the email is verified in your PayPal settings.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-1">
              <input
                type="checkbox"
                id="confirm-details"
                {...register("paymentDetails.isConfirmed")}
                className="w-5 h-5 rounded-md border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="confirm-details" className="text-sm text-gray-700 font-bold cursor-pointer">
                I confirm this PayPal email is correct and active.
              </label>
            </div>
            {errors.paymentDetails?.isConfirmed && <p className="text-red-500 text-xs font-bold ml-8">{errors.paymentDetails.isConfirmed.message}</p>}
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}