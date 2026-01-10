import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OnboardingLayout from '../../../../layouts/OnBoardingLayout';
import { useOnBoarding } from '../OnBoardingContext';
import { stepFourSchema } from "./stepFourSchema";
import { uploadToCloudinary } from '../../profile/cloudinaryHelper';

function StepFour() {
  const { formData, updateFormData, nextStep } = useOnBoarding();
  const [localItem, setLocalItem] = useState({ title: '', description: '', files: [] });
  const [inputError, setInputError] = useState("");
  const [localErrors, setLocalErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepFourSchema),
    defaultValues: { portfolios: formData.portfolios || [] },
  });

  const portfolios = watch("portfolios");

  const updateLocalField = (field, value) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
    if (localErrors[field]) {
      setLocalErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setInputError("Only image files are allowed.");
      return;
    }
    setInputError("");
    updateLocalField('files', [file]);
  };

  const handleSavePortfolio = async () => {
    const itemSchema = stepFourSchema.shape.portfolios.element;
    const result = itemSchema.safeParse(localItem);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setLocalErrors(formattedErrors);
      return;
    }

    if (localItem.files.length === 0) {
      setInputError("Please upload an image first.");
      return;
    }

    try {
      setIsUploading(true);
      const cloudinaryData = await uploadToCloudinary(localItem.files[0]);
      
      const portfolioEntry = {
        title: localItem.title,
        description: localItem.description,
        image_url: cloudinaryData.secure_url,
        files: localItem.files // Keep this so the Zod array validation passes
      };

      const newPortfolios = [...portfolios, portfolioEntry];
      setValue("portfolios", newPortfolios, { shouldValidate: true });
      
      setLocalItem({ title: '', description: '', files: [] });
      setLocalErrors({});
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setInputError("Failed to upload image.");
    }
};

  const removePortfolio = (index) => {
    const filtered = portfolios.filter((_, i) => i !== index);
    setValue("portfolios", filtered, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    if (localItem.title.trim() || localItem.files.length > 0) {
      setInputError("Please save or clear the current item before continuing.");
      return;
    }
    updateFormData(data);
    nextStep();
  };

  return (
    <OnboardingLayout
      title="Showcase Your Work"
      subtitle="Upload samples to help clients trust your skills. (Max 3)"
    >
      <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {errors.portfolios?.message && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-bold text-center">
            {errors.portfolios.message}
          </div>
        )}

        {portfolios?.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {portfolios.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-primary/10 flex items-center justify-center overflow-hidden">
                    <img src={item.image_url} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-[11px] text-gray-500">Image successfully uploaded</p>
                  </div>
                </div>
                <button type="button" onClick={() => removePortfolio(index)} className="text-xs text-red-500 font-bold px-3">Remove</button>
              </div>
            ))}
          </div>
        )}

        {portfolios.length < 3 ? (
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Add Portfolio Item {portfolios.length + 1}</h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 uppercase">Step 1: Upload Screenshot</label>
              <div className={`relative h-[140px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${localErrors.files ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} disabled={isUploading} />
                <p className="text-sm font-bold text-gray-700">{localItem.files.length > 0 ? "Change Image" : "Click to upload"}</p>
              </div>
              {localErrors.files && <p className="text-red-500 text-[11px] font-bold">{localErrors.files}</p>}

              {localItem.files.length > 0 && (
                <div className="relative w-24 h-20 rounded-lg overflow-hidden border">
                  <img src={URL.createObjectURL(localItem.files[0])} className="w-full h-full object-cover" alt="preview" />
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Step 2: Title</label>
                <input
                  type="text"
                  value={localItem.title}
                  disabled={isUploading}
                  placeholder="e.g., E-commerce Dashboard Design"
                  onChange={(e) => updateLocalField('title', e.target.value)}
                  className={`w-full h-[50px] px-4 rounded-xl border outline-none ${localErrors.title ? 'border-red-500' : 'border-gray-200'}`}
                />
                {localErrors.title && <p className="text-red-500 text-[11px] font-bold mt-1">{localErrors.title}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Step 3: Description</label>
                <textarea
                  value={localItem.description}
                  disabled={isUploading}
                  placeholder="Briefly explain your role and the tools used..."
                  onChange={(e) => updateLocalField('description', e.target.value)}
                  className={`w-full min-h-[100px] p-4 rounded-xl border outline-none resize-none ${localErrors.description ? 'border-red-500' : 'border-gray-200'}`}
                />
                {localErrors.description && <p className="text-red-500 text-[11px] font-bold mt-1">{localErrors.description}</p>}
              </div>
              
              {inputError && <p className="text-red-600 text-xs font-bold text-center">{inputError}</p>}
              
              <button
                type="button"
                onClick={handleSavePortfolio}
                disabled={isUploading}
                className={`w-full h-12 border-2 rounded-xl text-sm font-bold transition-all ${isUploading ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-primary text-primary hover:bg-primary hover:text-white'}`}
              >
                {isUploading ? "Uploading..." : "+ Save to Portfolio"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
            <p className="text-sm text-green-700 font-bold">Maximum limit reached (3/3 items). Remove an item to add a new one.</p>
          </div>
        )}
      </form>
    </OnboardingLayout>
  )
}

export default StepFour;