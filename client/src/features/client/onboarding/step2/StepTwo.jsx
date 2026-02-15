import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllSkillls } from "../../projectManagement/projectQueries";
import { useOnBoarding } from "../OnBoardingContext";
import OnboardingLayout from "../../../../layouts/OnBoardingLayout";
import { stepTwoSchema } from "./stepTwoSchema";
import { useAllCategories } from "../../../admin/categorymanagement/categoryQueries";

function StepTwo() {
  const { formData, updateFormData, nextStep } = useOnBoarding();
  const { data: categories } = useAllCategories();
  const { data: allSkills } = useAllSkillls();
  const [customInput, setCustomInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      primaryCategory: formData.primaryCategory || "",
      skills: formData.skills || [],
      experienceLevel: formData.experienceLevel || "",
    },
  });

  const [inputError, setInputError] = useState("");
  const selectedSkills = watch("skills");
  const selectedLevel = watch("experienceLevel");
  const selectedCategoryId = watch("primaryCategory");

  const filteredSkills = React.useMemo(() => {
    if (!selectedCategoryId || !allSkills) return [];
    return allSkills.filter(
      (skill) => String(skill.category) === String(selectedCategoryId)
    );
  }, [selectedCategoryId, allSkills]);

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const handleToggleSkill = (skillName) => {
    const isSelected = selectedSkills.includes(skillName);
    const newSkills = isSelected
      ? selectedSkills.filter((s) => s !== skillName)
      : [...selectedSkills, skillName];

    setValue("skills", newSkills, { shouldValidate: true });
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed.length < 2) {
      setInputError("Skill is too short");
      return;
    }
    if (/^\d+$/.test(trimmed)) {
      setInputError("Skill cannot be only numbers");
      return;
    }
    if (selectedSkills.includes(trimmed)) {
      setInputError("Skill already added");
      return;
    }
    setValue("skills", [...selectedSkills, trimmed], { shouldValidate: true });
    setCustomInput("");
    setInputError("");
  };

  return (
    <OnboardingLayout
      title="Add Your Skills & Expertise"
      subtitle="Help us match you with the right projects."
    >
      <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-10">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">Primary Category</label>
          <div className="relative">
            <select
              {...register("primaryCategory")}
              className={`w-full h-[50px] md:h-[54px] px-4 md:px-5 rounded-xl border bg-white text-sm md:text-base focus:ring-2 focus:ring-primary/20 outline-none appearance-none ${
                errors.primaryCategory ? "border-red-500" : "border-[#D1D5DB]"
              }`}
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
          {errors.primaryCategory && <p className="text-red-500 text-xs font-medium">{errors.primaryCategory.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 block">
            Skills ({selectedSkills.length})
          </label>
          <div className="flex flex-wrap gap-2 p-3 md:p-5 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
            {selectedSkills.length === 0 && <p className="text-gray-400 text-xs md:text-sm">No skills selected yet...</p>}
            {selectedSkills.map((skill) => (
              <div key={skill} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-full text-[10px] md:text-xs font-bold">
                {skill}
                <button type="button" onClick={() => handleToggleSkill(skill)} className="hover:text-black text-sm">×</button>
              </div>
            ))}
          </div>
          {errors.skills && <p className="text-red-500 text-xs font-medium">{errors.skills.message}</p>}
        </div>

        <div className="space-y-4">
          <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
            {selectedCategoryId ? "Suggested for your category" : "Please select a category to see suggestions"}
          </p>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto md:max-h-none md:overflow-visible pr-1">
            {filteredSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleToggleSkill(skill.name)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold border transition-all ${
                  selectedSkills.includes(skill.name)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                }`}
              >
                {selectedSkills.includes(skill.name) ? "✓ " : "+ "} {skill.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="text"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="Add custom skill..."
                className={`min-h-[48px] md:h-[50px] px-4 md:px-5 rounded-xl border text-sm md:text-base transition-all flex-1 outline-none focus:ring-2 focus:ring-primary/20 ${
                  inputError ? "border-red-500" : "border-[#D1D5DB] focus:border-primary"
                }`}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
              />
              {inputError && <p className="text-red-500 text-[10px] ml-2 font-medium">{inputError}</p>}
            </div>
            <button
              type="button"
              onClick={handleAddCustom}
              className="min-h-11 md:h-[50px] w-full sm:w-auto px-8 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100">
          <label className="text-sm font-bold text-gray-900 block">Experience Level</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { id: 'beginner', label: 'Beginner', desc: 'Entry level' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Professional' },
              { id: 'expert', label: 'Expert', desc: 'Specialist' }
            ].map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setValue("experienceLevel", level.id, { shouldValidate: true })}
                className={`p-4 md:p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedLevel === level.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{level.label}</h3>
                <p className="text-[10px] md:text-xs text-gray-500">{level.desc}</p>
              </button>
            ))}
          </div>
          {errors.experienceLevel && <p className="text-red-500 text-xs font-medium">{errors.experienceLevel.message}</p>}
        </div>
      </form>
    </OnboardingLayout>
  );
}

export default StepTwo;