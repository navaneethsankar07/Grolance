import { LayoutGrid, Wrench, GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import { ManagementList } from "./ManagementList";
import { useCategories } from "./categoryQueries";
import { useSkills } from "./skillQueries";
import { useModal } from "../../../hooks/modal/useModalStore";


export default function CategoriesAndSkills() {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: skills = [], isLoading: skillLoading } = useSkills();
  const {openModal} = useModal()

if (catLoading || skillLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        <div className="flex flex-col items-center gap-2">
           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
           Loading management data...
        </div>
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
            Manage platform taxonomy and freelancer expertise tags
          </p>
        </div>

        {/* Category Management */}
        <ManagementList
          title="Categories"
          icon={LayoutGrid}
          items={categories}
          iconColor="blue"
          onAdd={() => openModal("add-category")}
          onEdit={(item) => openModal("edit-category", item)}
          onDelete={(item) => openModal("delete-category", item)}
        />

        {/* Skill Management */}
        <ManagementList
          title="Skills"
          icon={Wrench}
          items={skills}
          iconColor="purple"
          onAdd={() => openModal("add-skill")}
          onEdit={(item) => openModal("edit-skill", item)}
          onDelete={(item) => openModal("delete-skill", item)}
        />
      </div>
    </div>
  );
}