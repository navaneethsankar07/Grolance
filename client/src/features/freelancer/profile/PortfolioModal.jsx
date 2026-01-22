import React, { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { uploadToCloudinary } from "../../client/profile/cloudinaryHelper";

export default function PortfolioModal({ isOpen, onClose, onSave, initialData }) {
  const [item, setItem] = useState({ title: "", description: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setItem(initialData);
    } else {
      setItem({ title: "", description: "", image_url: "" });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadToCloudinary(file);
      setItem((prev) => ({ ...prev, image_url: data.secure_url }));
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Project" : "Add New Project"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Project Image</label>
            <div className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden group">
              {item.image_url ? (
                <img src={item.image_url} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Camera size={32} strokeWidth={1.5} />
                  <span className="text-xs mt-2 font-medium">Click to upload work</span>
                </div>
              )}
              
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                  {uploading ? "Uploading..." : "Browse Image"}
                </span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
            <input
              placeholder="e.g. E-commerce Dashboard"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
            <textarea
              placeholder="Briefly describe your role and the technologies used..."
              rows={3}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!item.image_url || !item.title || uploading}
            onClick={() => onSave(item)}
            className="flex-2 h-12 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {initialData ? "Update Project" : "Add to Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}