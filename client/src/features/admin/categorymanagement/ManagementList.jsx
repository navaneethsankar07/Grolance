import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

export const ManagementList = ({
  title,
  icon: Icon,
  items,
  iconColor,
  onAdd,
  onEdit,
  onDelete,

  searchValue,
  onSearchChange,
  onSearchSubmit,

  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white shadow">
            <Icon className={`w-6 h-6 text-${iconColor}-600`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">
              {items.length} {title.toLowerCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/30 hover:text-black transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus size={18} />
          Add {title}
        </button>
      </div>

      <div className="mb-4">
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchSubmit();
            }
          }}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-gray-300" />
                <span className="text-[15px] font-medium text-gray-700">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No {title.toLowerCase()} found
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          disabled={!hasPrev}
          onClick={onPrev}
          className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={!hasNext}
          onClick={onNext}
          className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};
