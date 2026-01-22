import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OnboardingLayout from '../../../../layouts/OnBoardingLayout';
import { useOnBoarding } from '../OnBoardingContext';
import { stepThreeSchema } from "./stepThreeSchema";

function StepThree() {
  const { formData, updateFormData, nextStep } = useOnBoarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const getError = (tier, field) => errors.packages?.[tier]?.[field]?.message;

  return (
    <OnboardingLayout 
      title="Set Up Your Service Packages" 
      subtitle="Create clear pricing for your clients."
    >
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10 flex items-start gap-3 p-4 border border-amber-200 bg-amber-50 rounded-xl">
          <div className="flex-shrink-0 text-amber-600">⚠️</div>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Feature List:</strong> Please enter each feature on a new line. Each line will automatically appear as a bullet point on your public profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {['starter', 'pro'].map((tier) => (
            <div key={tier} className={`border rounded-2xl p-8 bg-white shadow-sm transition-all ${getError(tier, 'price') || getError(tier, 'deliveryTime') ? 'border-red-200 ring-1 ring-red-50' : 'border-gray-100'}`}>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 capitalize">{tier}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {tier === 'starter' ? 'Perfect for small project tasks' : 'For comprehensive, end-to-end projects'}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                    <input
                      type="number"
                      {...register(`packages.${tier}.price`, { valueAsNumber: true })}
                      placeholder="0"
                      className="w-full h-[54px] pl-10 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                  {getError(tier, 'price') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getError(tier, 'price')}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Delivery Time</label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register(`packages.${tier}.deliveryTime`, { valueAsNumber: true })}
                      placeholder="e.g. 5"
                      className="w-full h-[54px] px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">days</span>
                  </div>
                  {getError(tier, 'deliveryTime') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getError(tier, 'deliveryTime')}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Package Features (One per line)</label>
                  <textarea
                    {...register(`packages.${tier}.description`)}
                    placeholder="Example:&#10;Custom Logo Design&#10;3 Revisions&#10;Source Files Included"
                    className="w-full min-h-[140px] p-5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-sm leading-relaxed"
                  />
                  {getError(tier, 'description') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getError(tier, 'description')}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </OnboardingLayout>
  );
}

export default StepThree;