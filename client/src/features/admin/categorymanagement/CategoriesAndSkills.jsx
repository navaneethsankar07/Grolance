import { useState } from "react";
import { LayoutGrid, Wrench } from "lucide-react";
import { ManagementList } from "./ManagementList";
import { useAllCategories, useCategories } from "./categoryQueries";
import { useSkills } from "./skillQueries";
import { useModal } from "../../../hooks/modal/useModalStore";

export default function CategoriesAndSkills() {
  const { openModal } = useModal();
  const [categoryPage, setCategoryPage] = useState(1);
  const [skillPage, setSkillPage] = useState(1);
  const [categoryInput, setCategoryInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const { data: categoryData, isLoading: catLoading } = useCategories({
    page: categoryPage,
    search: categorySearch,
  });
  const allCategories = useAllCategories()
  const { data: skillData, isLoading: skillLoading } = useSkills({
    page: skillPage,
    search: skillSearch,
  });

  if (
    (catLoading && !categoryData) ||
    (skillLoading && !skillData)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading management data...
      </div>
    );
  }

  const categories = categoryData?.results ?? [];
  const skills = skillData?.results ?? [];

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">

        <ManagementList
          title="Categories"
          icon={LayoutGrid}
          items={categories}
          iconColor="blue"
          searchValue={categoryInput}
          onSearchChange={setCategoryInput}
          onSearchSubmit={() => {
            setCategorySearch(categoryInput);
            setCategoryPage(1);
          }}
          onNext={() => setCategoryPage(p => p + 1)}
          onPrev={() => setCategoryPage(p => p - 1)}
          hasNext={!!categoryData?.next}
          hasPrev={!!categoryData?.previous}
          onAdd={() => openModal("add-category")}
          onEdit={(item) => openModal("edit-category", item)}
          onDelete={(item) => openModal("delete-category", item)}
        />

        <ManagementList
          title="Skills"
          icon={Wrench}
          items={skills}
          iconColor="purple"
          searchValue={skillInput}
          onSearchChange={setSkillInput}
          onSearchSubmit={() => {
            setSkillSearch(skillInput);
            setSkillPage(1);
          }}
          onNext={() => setSkillPage(p => p + 1)}
          onPrev={() => setSkillPage(p => p - 1)}
          hasNext={!!skillData?.next}
          hasPrev={!!skillData?.previous}
          onAdd={() => openModal("add-skill", { allCategories })}
          onEdit={(item) => openModal("edit-skill", { item, categories })}
          onDelete={(item) => openModal("delete-skill", item)}
        />

      </div>
    </div>
  );
}
