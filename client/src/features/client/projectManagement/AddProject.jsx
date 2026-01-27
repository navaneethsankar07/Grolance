import { CheckCircle2, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { projectCreateSchema } from "./projectSchemas";
import { useAllSkillls, useCategories, useSkills } from './projectQueries';
import { useCreateProject } from "./projectMutations";
import { useModal } from '../../../hooks/modal/useModalStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAllCategories } from '../../admin/categorymanagement/categoryQueries';


function AddProject() {
useEffect(() => {
  const unloadCallback = (event) => {
    event.preventDefault();
    event.returnValue = "";
    return "";
  };

  window.addEventListener("beforeunload", unloadCallback);
  return () => window.removeEventListener("beforeunload", unloadCallback);
}, []);

  const { register, handleSubmit, setValue, watch, formState: { errors }, } = useForm({
    resolver: zodResolver(projectCreateSchema),
    shouldUnregister: true,
    defaultValues: {
      pricing_type: "fixed",
      skills: [],
      delivery_days: 0,
    }
  });
  const {
    data: categoriesData
  } = useAllCategories();

  
  const categories = categoriesData??[];
  const { data: skillsResponse } = useAllSkillls();
  const skillsData = skillsResponse ?? [];
  const { mutateAsync: createProject, isPending } = useCreateProject();
  const { openModal, closeModal } = useModal()
  const selectedCategory = watch("category");
  const selectedSkills = watch("skills") || [];
  const pricingType = watch("pricing_type");
  const navigate = useNavigate()
  const suggestedSkills = skillsData
    .filter(
      (skill) =>
        String(skill.category) === String(selectedCategory) &&
        !selectedSkills.includes(skill.name)
    )
    .slice(0, 8);
  const addSkill = (skillName) => {
    if (selectedSkills.includes(skillName)) return;

    setValue("skills", [...selectedSkills, skillName], {
      shouldValidate: true,
    });
  };
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    addSkill(skillInput.trim());
    setSkillInput("");
  };

  const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
  const Input = (props) => <input {...props} />;
  const [skillInput, setSkillInput] = useState("");

  const onSubmit = (data) => {
    const formattedData = { ...data };

    if (data.pricing_type === "fixed") {
      delete formattedData.min_budget;
      delete formattedData.max_budget;
    } else {
      delete formattedData.fixed_price;
    }

    openModal("confirm-project", {
      data: formattedData,
      categories,
      onConfirm: async () => {
        try {
          const res = await createProject(formattedData);
          console.log("Project created:", res);
          closeModal();
          navigate('/my-projects', { replace: true })
          toast.success("Project Posted Successfully")
        } catch (error) {
          closeModal();
          if (error.response) {
            toast.error("Server error:", error.response.data);
  
          } else {
            toast.error("Unexpected error:", error);
          }
        }
      },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-[31px] font-bold text-gray-900 leading-10 mb-2 font-inter">
              Post a New Project
            </h1>
            <p className="text-base text-gray-600 leading-6 font-roboto">
              Describe your project details to receive competitive proposals from
              our community of skilled freelancers.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] p-8"
              >
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Project Title
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Build a responsive e-commerce website"
                    {...register("title")}
                    className="w-full px-3   h-[50px] text-base border-gray-400 border-2  rounded-lg placeholder:text-[#CCC]"

                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}

                </div>

                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Project Description
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <textarea
                    placeholder="Describe what you need... Include details about your project goals, requirements, and any specific preferences."
                    {...register("description")}
                    className="w-full px-3 py-4 border-2 min-h-[170px] text-base border-gray-400 rounded-lg placeholder:text-[#CCC] resize-none"

                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}

                </div>

                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Requirements From Freelancer
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <textarea
                    placeholder="Explain what you expect from the freelancer (tools, experience, deliverables, guidelines, references)."
                    {...register("requirements")}
                    className="w-full px-3 py-4 border-2 min-h-[170px] text-base border-gray-400 rounded-lg placeholder:text-[#CCC] resize-none"

                  />
                  {errors.requirements && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.requirements.message}
                    </p>
                  )}

                </div>

                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Expected Deliverables
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <textarea
                    placeholder="List what the freelancer should deliver (design files, code, reports, videos, documentation, etc.)"
                    {...register("expected_deliverables")}
                    className="w-full px-3 py-4 border-2 min-h-[170px] text-base border-gray-400 rounded-lg placeholder:text-[#CCC] resize-none"

                  />
                  {errors.expected_deliverables && (
                    <p className="text-red-500 text-xs mt-1">{errors.expected_deliverables.message}</p>
                  )}

                </div>

                <div className="mb-8">
                  <label htmlFor='category' className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Category
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <select
                    {...register("category")}
                    className="px-3  h-[47px] w-full border-2 border-gray-300 rounded-lg"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}


                </div>

                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Required Skills
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">*</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="w-full px-3 py-4 border-2 h-[50px] text-base border-gray-400 rounded-lg flex-1"
                    />

                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-4 border-2 h-[50px] text-sm font-medium text-gray-700 border-gray-400 rounded-lg"
                    >
                      Add
                    </Button>
                  </div>

                  {errors.skills && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.skills.message}
                    </p>
                  )}

                  {skillInput === "" && suggestedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {suggestedSkills.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => addSkill(skill.name)}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border"
                        >
                          + {skill.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-2xl text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "skills",
                                selectedSkills.filter((_, i) => i !== index)
                              )
                            }
                            className="ml-2 text-lg text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="mb-8">
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Pricing Type *
                    </label>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          value="fixed"
                          {...register("pricing_type")}
                        />
                        Fixed Price
                      </label>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          value="range"
                          {...register("pricing_type")}
                        />
                        Range Price
                      </label>
                    </div>

                    {errors.pricing_type && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pricing_type.message}
                      </p>
                    )}
                  </div>

                  {pricingType === "fixed" && (
                    <div className="mb-8">
                      <label className="block mb-2 text-xs font-medium text-gray-700">
                        Fixed Budget *
                      </label>

                      <input
                        type="number"
                        {...register("fixed_price", { valueAsNumber: true })}
                        className="w-full px-3 h-[50px] border rounded-lg"
                      />

                      {errors.fixed_price && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fixed_price.message}
                        </p>
                      )}
                    </div>
                  )}

                  {pricingType === "range" && (
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block mb-2 text-xs font-medium text-gray-700">
                          Minimum Budget *
                        </label>

                        <input
                          type="number"
                          {...register("min_budget", { valueAsNumber: true })}
                          className="w-full px-3 h-[50px] border rounded-lg"
                        />

                        {errors.min_budget && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.min_budget.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-xs font-medium text-gray-700">
                          Maximum Budget *
                        </label>

                        <input
                          type="number"
                          {...register("max_budget", { valueAsNumber: true })}
                          className="w-full px-3 h-[50px] border rounded-lg"
                        />

                        {errors.max_budget && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.max_budget.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2">
                      <span className="text-xs font-medium text-gray-700 leading-5">
                        Delivery Days
                      </span>
                      <span className="text-xs font-medium text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="number"
                      {...register("delivery_days", { valueAsNumber: true })}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = ''
                        }
                      }}
                      className="w-full px-3 h-[50px] border rounded-lg"
                    />
                    {errors.delivery_days && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.delivery_days.message}
                      </p>
                    )}

                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-[52px] bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-60"
                  >
                    {isPending ? "Posting..." : "Post Project"}
                  </Button>

                </div>
              </form>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-blue-100 rounded-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 leading-7 font-roboto">
                    Tips for success
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-base text-gray-600 leading-6 font-roboto">
                      <span className="font-medium text-gray-700">
                        Be specific:
                      </span>{" "}
                      Detailed descriptions attract better proposals.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-base text-gray-600 leading-6 font-roboto">
                      <span className="font-medium text-gray-700">
                        Set a realistic budget:
                      </span>{" "}
                      Research market rates for quality work.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 hrink-0 mt-0.5" />
                    <p className="text-base text-gray-600 leading-6 font-roboto">
                      <span className="font-medium text-gray-700">
                        Define deliverables:
                      </span>{" "}
                      Clearly state what you expect to receive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddProject