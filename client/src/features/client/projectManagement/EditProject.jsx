import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Lightbulb, X } from "lucide-react";
import { projectCreateSchema } from "./projectSchemas";
import { useCategories, useSkills, useProjectDetails } from "./projectQueries";
import { useUpdateProject } from "./projectMutations";
import { toast } from "react-toastify";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");

  const { data: project, isLoading: projectLoading } = useProjectDetails(id);
  const { data: categoriesData } = useCategories();
  const { data: skillsResponse } = useSkills();
  const { mutateAsync: editProject, isPending: isUpdating } = useUpdateProject();

  const categories = categoriesData?.results ?? [];
  const skillsData = skillsResponse?.results ?? [];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectCreateSchema),
  });

  const selectedCategory = watch("category");
  const selectedSkills = watch("skills") || [];
  const pricingType = watch("pricing_type");
const onFormError = (errors) => {
  console.log("❌ Zod Validation Errors:", errors);
};
  const suggestedSkills = skillsData
    .filter(
      (skill) =>
        String(skill.category) === String(selectedCategory) &&
        !selectedSkills.includes(skill.name)
    )
    .slice(0, 8);

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        requirements: project.requirements || "",
        expected_deliverables: project.expected_deliverables || "",
        category: project.category_id || String(project.category), 
        pricing_type: project.pricing_type,
        fixed_price: project.fixed_price,
        min_budget: project.min_budget,
        max_budget: project.max_budget,
        delivery_days: project.delivery_days,
        skills: project.skills_display || [],
      });
    }
  }, [project, reset]);

  const addSkill = (skillName) => {
    if (selectedSkills.includes(skillName)) return;
    setValue("skills", [...selectedSkills, skillName], { shouldValidate: true });
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    addSkill(skillInput.trim());
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
      toast.success("Post Edited Successfully")
    } catch (error) {
      toast.error("Update failed:", error);
    }
  };

  if (projectLoading) return <div className="p-10 text-center">Loading Project Data...</div>;

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
                  className="px-3 h-[47px] w-full border-2 border-gray-300 rounded-lg"
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }}}
                    className="w-full px-3 border-2 h-[50px] border-gray-400 rounded-lg flex-1"
                  />
                  <button type="button" onClick={handleAddSkill} className="px-6 border-2 h-[50px] text-sm font-medium border-gray-400 rounded-lg">Add</button>
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
                
                {/* Selected Skills Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-2xl text-sm flex items-center">
                      {skill}
                      <button type="button" onClick={() => setValue("skills", selectedSkills.filter((_, i) => i !== index))} className="ml-2 text-lg text-gray-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing and Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Pricing Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="radio" value="fixed" {...register("pricing_type")} /> Fixed Price</label>
                    <label className="flex items-center gap-2 text-sm"><input type="radio" value="range" {...register("pricing_type")} /> Range Price</label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Delivery Days *</label>
                  <input type="number" {...register("delivery_days", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg" />
                </div>
              </div>

              {/* Budget Inputs */}
              {pricingType === "fixed" ? (
                <div className="mb-8">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Fixed Budget (₹) *</label>
                  <input type="number" {...register("fixed_price", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <input type="number" placeholder="Min Budget" {...register("min_budget", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg" />
                  <input type="number" placeholder="Max Budget" {...register("max_budget", { valueAsNumber: true })} className="w-full px-3 h-[50px] border-2 border-gray-300 rounded-lg" />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Tips */}
          <div className="lg:col-span-4">
             <div className="bg-white border border-blue-100 rounded-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Editing Tips</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm text-gray-600">Updating skills helps find the right experts.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}