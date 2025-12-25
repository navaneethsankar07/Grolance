import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCreateCategory } from "../categoryMutations";

export function AddCategoryModal({ open, onOpenChange }) {
  const [name, setName] = React.useState("");
  const createMutation = useCreateCategory();

  const handleSubmit = (e) => {
    e.preventDefault();

    createMutation.mutate(
      { name },
      {
        onSuccess: () => {
          setName("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8">
          <h2 className="text-lg font-semibold mb-4">Add Category</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Web Development"
              className="w-full h-12 px-4 border rounded-lg"
            />

            {createMutation.isError && (
              <p className="text-xs text-red-600">
                {createMutation.error.response?.data?.detail ||
                  "Failed to create category"}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-blue-600 text-white rounded-lg"
                disabled={createMutation.isLoading}
              >
                Add
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
