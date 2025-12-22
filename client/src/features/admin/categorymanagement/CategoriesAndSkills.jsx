import { LayoutGrid, Wrench, GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import { ManagementList } from "./ManagementList";
import { useCategories } from "./categoryQueries";
import { useSkills } from "./skillQueries";


export default function CategoriesAndSkills() {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: skills = [], isLoading: skillLoading } = useSkills();


  if (catLoading || skillLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading categories & skills...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Categories & Skills
          </h1>
          <p className="text-gray-500">
            Manage platform categories and skills
          </p>
        </div>

        <ManagementList
          title="Categories"
          icon={LayoutGrid}
          items={categories}
          iconColor="blue"
        />

        <ManagementList
          title="Skills"
          icon={Wrench}
          items={skills}
          iconColor="purple"
        />
      </div>
    </div>
  );
}