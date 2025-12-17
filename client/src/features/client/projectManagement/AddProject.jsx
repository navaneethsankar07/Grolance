import { CheckCircle2, Lightbulb } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { projectCreateSchema } from "./projectSchemas";


function AddProject() {
  const { register, handleSubmit, setValue, watch, formState: { errors }, } = useForm({ resolver: zodResolver(projectCreateSchema), defaultValues: { skills: [] } });

  const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
  const Input = (props) => <input {...props} />;
  const [skillInput, setSkillInput] = useState("");
  const skills = watch("skills") || [];

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setValue("skills", [...skills, skillInput.trim()]);
    setSkillInput("");
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[31px] font-bold text-gray-900 leading-10 mb-2 font-inter">
              Post a New Project
            </h1>
            <p className="text-base text-gray-600 leading-6 font-roboto">
              Describe your project details to receive competitive proposals from
              our community of skilled freelancers.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] p-8"
              >
                {/* Project Title */}
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

                {/* Project Description */}
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

                {/* Requirements From Freelancer */}
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

                {/* Expected Deliverables */}
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
                    {...register("deliverables")}
                    className="w-full px-3 py-4 border-2 min-h-[170px] text-base border-gray-400 rounded-lg placeholder:text-[#CCC] resize-none"

                  />
                  {errors.deliverables && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deliverables.message}
                    </p>
                  )}

                </div>

                {/* Category */}
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
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="design">Design</option>
                    <option value="writing">Writing</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}


                </div>

                {/* Required Skills */}
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-xs font-medium text-gray-700 leading-5">
                      Required Skills
                    </span>
                    <span className="text-xs font-medium text-red-500 ml-1">
                      *
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="w-full px-3 py-4 border-2 h-[50px] text-base border-gray-400 rounded-lg placeholder:text-[#CCC] flex-1"
                    />


                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      variant="outline"
                      className="px-6 py-4 border-2 h-[50px]  text-sm font-medium text-gray-700 border-gray-400 rounded-lg  "
                    >
                      Add
                    </Button>

                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.skills.message}
                    </p>
                  )}
                  {skills.length > 0 && (
                    <div className=" flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className=" bg-blue-50 text-blue-700 px-3 py-1 rounded-2xl text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "skills",
                                skills.filter((_, i) => i !== index)
                              )
                            }

                            className="ml-2 text-xl text-gray-500 hover:text-primary/90"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget and Delivery Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Budget */}
                  <div>
                    <label className="block mb-2">
                      <span className="text-xs font-medium text-gray-700 leading-5">
                        Budget (Fixed Price)
                      </span>
                      <span className="text-xs font-medium text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="number"
                      {...register("budget", { valueAsNumber: true })}
                      className="w-full px-3 h-[50px] border rounded-lg"
                      placeholder='eg:15000'
                    />
                    {errors.budget && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>

                  {/* Delivery Days */}
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
                      {...register("deliveryDays", { valueAsNumber: true })}
                      className="w-full px-3 h-[50px] border rounded-lg"
                      placeholder='eg:14'
                    />
                    {errors.deliveryDays && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.deliveryDays.message}
                      </p>
                    )}

                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full h-[52px] bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                  >
                    Post Project
                  </Button>
                </div>
              </form>
            </div>

            {/* Tips Section */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-blue-100 rounded-lg p-6 sticky top-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 leading-7 font-roboto">
                    Tips for success
                  </h3>
                </div>

                {/* Tips List */}
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