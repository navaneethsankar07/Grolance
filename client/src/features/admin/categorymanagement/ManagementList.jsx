import { GripVertical, Pencil, Trash2 } from "lucide-react";

export const ManagementList = ({ title, icon: Icon, items, iconColor }) => {
      console.log(items, Array.isArray(items),'hi');

   return  (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-xl bg-white shadow`}>
        <Icon className={`w-6 h-6 text-${iconColor}-600`} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">
          {items.length} {title.toLowerCase()}
        </p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between px-6 py-5 hover:bg-gray-50/50"
          >
            <div className="flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-gray-300" />
              <span className="text-[15px] font-medium text-gray-700">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Pencil size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
  </div>
)};