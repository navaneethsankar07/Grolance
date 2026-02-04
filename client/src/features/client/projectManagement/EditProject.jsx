import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Lightbulb, X, Plus } from "lucide-react";
import { projectCreateSchema } from "./projectSchemas";
import { useProjectDetails, useAllSkillls, useAllCategories } from "./projectQueries";
import { useUpdateProject } from "./projectMutations";
import { toast } from "react-toastify";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");

  const { data: project, isLoading: projectLoading } = useProjectDetails(id);
  const { data: categoriesData } = useAllCategories();
  const { data: skillsResponse } = useAllSkillls();
  
  const { mutateAsync: editProject, isPending: isUpdating } = useUpdateProject();

  const categories = categoriesData ?? [];
  const skillsData = skillsResponse ?? [];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectCreateSchema),
  });

  const selectedCategory = watch("category");
  const selectedSkills = watch("skills") || [];
  const pricingType = watch("pricing_type");

  const onFormError = (errors) => {
    console.log("Zod Validation Errors:", errors);
  };

  const suggestedSkills = skillsData
    .filter(
      (skill) =>
        String(skill.category) === String(selectedCategory) &&
        !selectedSkills.includes(skill.name)
    )
    .slice(0, 12);

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        requirements: project.requirements || "",
        expected_deliverables: project.expected_deliverables || "",
        category: project.category ? String(project.category) : "", 
        pricing_type: project.pricing_type,
        fixed_price: project.fixed_price,
        min_budget: project.min_budget,
        max_budget: project.max_budget,
        delivery_days: project.delivery_days,
        skills: project.skills || [],
      });
    }
  }, [project, reset]);

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const addSkill = (skillName) => {
    const normalizedSkill = skillName.trim();
    if (!normalizedSkill || selectedSkills.includes(normalizedSkill)) return;
    setValue("skills", [...selectedSkills, normalizedSkill], { shouldValidate: true });
  };

  const handleAddSkill = () => {
    addSkill(skillInput);
    setSkillInput("");
  };

  const onSubmit = async (data) => {
    const formattedData = { ...data };
    if (data.pricing_type === "fixed") {
      formattedData.min_budget = null;
      formattedData.max_budget = null;
    } else {
      formattedData.fixed_price = null;
    }

    try {
      await editProject({ id, data: formattedData });
      navigate("/my-projects");
      toast.success("Post Edited Successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (projectLoading) return <div className="p-10 text-center text-gray-500">Loading Project Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[31px] font-bold text-gray-900 leading-10 mb-2 font-inter">Edit Project</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit, onFormError)} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-3 h-[50px] text-base border-gray-400 border-2 rounded-lg"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea
                  {...register("description")}
                  className="w-full px-3 py-4 border-2 min-h-[150px] text-base border-gray-400 rounded-lg resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Requirements From Freelancer *</label>
                <textarea
                  {...register("requirements")}
                  className="w-full px-3 py-4 border-2 min-h-[150px] text-base border-gray-400 rounded-lg resize-none"
                />
                {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Expected Deliverables *</label>
                <textarea
                  {...register("expected_deliverables")}
                  className="w-full px-3 py-4 border-2 min-h-[150px] text-base border-gray-400 rounded-lg resize-none"
                />
                {errors.expected_deliverables && <p className="text-red-500 text-xs mt-1">{errors.expected_deliverables.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Category *</label>
                <select
                  {...register("category")}
                  className="px-3 h-[47px] w-full border-2 border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-gray-700 mb-2">Required Skills *</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }}}
                    placeholder="e.g. React, Python..."
                    className="w-full px-3 border-2 h-[50px] border-gray-400 rounded-lg flex-1"
                  />
                  <button type="button" onClick={handleAddSkill} className="px-6 bg-primary text-white h-[50px] text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors">Add</button>
                </div>

                {suggestedSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested for your category</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map((skill) => (
                          <button
                          key={skill.id}
                          type="button"
                          onClick={() => addSkill(skill.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:border-primary hover:text-primary hover:bg-blue-50 transition-all group"
                        >
                          <Plus className="w-3 h-3 text-gray-400 group-hover:text-primary" />
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill, index) => (
                    <span key={index} className="bg-primary text-white pl-4 pr-2 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => setValue("skills", selectedSkills.filter((_, i) => i !== index))} 
                        className="hover:bg-primary rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-3">Pricing Type *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" value="fixed" {...register("pricing_type")} className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-600">Fixed Price</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" value="range" {...register("pricing_type")} className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-600">Range Price</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Delivery Days *</label>
                  <input type="number" {...register("delivery_days", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>

              {pricingType === "fixed" ? (
                <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Fixed Budget ($) *</label>
                  <input type="number" {...register("fixed_price", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 mb-8 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Min Budget ($)</label>
                    <input type="number" placeholder="Min" {...register("min_budget", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Max Budget ($)</label>
                    <input type="number" placeholder="Max" {...register("max_budget", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg focus:border-primary outline-none" />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-10 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition-all">
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-white border border-blue-100 rounded-xl p-6 sticky top-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Editing Guide</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">Changing the category refreshes the <b>Suggested Skills</b> to help you find specialized talent.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">Detailed requirements attract higher quality proposals from experts.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">Ensure your budget matches the complexity of the project for better results.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}