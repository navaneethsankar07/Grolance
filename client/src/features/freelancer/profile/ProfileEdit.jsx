import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Camera, X, Check, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "../../../utils/cloudinaryHelper";
import { useFreelancerProfile } from "./profileQueries";
import { useUpdateFreelancerProfile } from "./profileMutation";
import PortfolioModal from "./PortfolioModal"; 
import { useNavigate } from "react-router-dom";

const SkillTag = ({ skill, onRemove }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50">
    <span className="text-xs font-medium text-blue-500 leading-5">{skill}</span>
    <button onClick={onRemove} className="p-0.5 rounded-full hover:bg-blue-100 transition-colors">
      <X className="w-3.5 h-3.5 text-blue-500" />
    </button>
  </div>
);

const PackageCard = ({ title, data, onChange }) => (
  <div className="flex flex-col gap-4 p-5 rounded-xl border-2 border-blue-100 bg-blue-50/30">
    <h3 className="text-sm font-semibold text-gray-900 leading-6">{title}</h3>
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-700">Price ($)</label>
        <input
          type="number"
          value={data.price}
          onChange={(e) => onChange("price", e.target.value)}
          className="h-[46px] px-4 rounded-lg border border-gray-300 bg-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-700">Delivery Days</label>
        <input
          type="number"
          value={data.deliveryTime}
          onChange={(e) => onChange("deliveryTime", e.target.value)}
          className="h-[46px] px-4 rounded-lg border border-gray-300 bg-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-700">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
          className="px-4 py-3 rounded-lg border border-gray-300 bg-white resize-none"
        />
      </div>
    </div>
  </div>
);

export default function ProfileEdit() {
  const { data: initialData, isLoading } = useFreelancerProfile();
  const { mutate: update, isPending } = useUpdateFreelancerProfile();

  const [profile, setProfile] = useState({
    fullName: "",
    tagline: "",
    bio: "",
    skills: [],
    isAvailable: true,
    profilePhoto: null,
  });

  const [packages, setPackages] = useState({
    starter: { price: "", deliveryTime: "", description: "" },
    pro: { price: "", deliveryTime: "", description: "" },
  });

  const [portfolios, setPortfolios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProfile({
        fullName: initialData.full_name || "",
        tagline: initialData.tagline || "",
        bio: initialData.bio || "",
        skills: initialData.skills || [],
        isAvailable: initialData.availability ?? true,
        profilePhoto: initialData.profile_photo || null,
      });

      if (initialData.packages) {
        setPackages({
          starter: {
            price: initialData.packages.starter?.price || "",
            deliveryTime: initialData.packages.starter?.delivery_days || "",
            description: Array.isArray(initialData.packages.starter?.description)
              ? initialData.packages.starter.description.join("\n")
              : initialData.packages.starter?.description || "",
          },
          pro: {
            price: initialData.packages.pro?.price || "",
            deliveryTime: initialData.packages.pro?.delivery_days || "",
            description: Array.isArray(initialData.packages.pro?.description)
              ? initialData.packages.pro.description.join("\n")
              : initialData.packages.pro?.description || "",
          },
        });
      }

      setPortfolios(initialData.portfolios || []);
    }
  }, [initialData]);

  const handlePackageChange = (tier, field, value) => {
    setPackages((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], [field]: value },
    }));
  };
  const navigate = useNavigate()
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await uploadToCloudinary(file);
      setProfile((prev) => ({ ...prev, profilePhoto: data.secure_url }));
    } catch (err) {
      alert("Photo upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSavePortfolioItem = (itemData) => {
    if (editingItem) {
      setPortfolios((prev) =>
        prev.map((p) => (p.id === editingItem.id ? { ...itemData } : p))
      );
    } else {
      setPortfolios((prev) => [...prev, { ...itemData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleRemovePortfolio = (id) => {
    setPortfolios((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveChanges = () => {
    const payload = {
      full_name: profile.fullName,
      profile_photo: profile.profilePhoto,
      tagline: profile.tagline,
      bio: profile.bio,
      skills: profile.skills,
      availability: profile.isAvailable,
      packages: {
        starter: {
          price: packages.starter.price,
          delivery_days: packages.starter.deliveryTime,
          description: packages.starter.description,
        },
        pro: {
          price: packages.pro.price,
          delivery_days: packages.pro.deliveryTime,
          description: packages.pro.description,
        },
      },
      portfolios: portfolios,
    };
    update(payload);
    navigate(-1)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-[1024px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Professional Profile</h1>
            <p className="text-sm text-gray-500">Update your details to attract more clients.</p>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={isPending || isUploading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {isPending ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>

        <div className="space-y-6">
          <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-gray-900">Basic Information</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-gray-100 relative">
                  {isUploading && (
                    <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
                       <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                  )}
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">{profile.fullName ? profile.fullName[0] : "?"}</span>
                  )}
                </div>
                <label className="absolute top-18 -right-2 p-2 bg-white rounded-full shadow-lg border cursor-pointer hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" disabled={isUploading} />
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tagline</label>
                  <input
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
                  <textarea
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
  <h2 className="text-lg font-bold mb-4 text-gray-900">Skills & Expertise</h2>
  
  <div className="flex flex-wrap gap-2 mb-6">
    {profile.skills.length > 0 ? (
      profile.skills.map((skill) => (
        <SkillTag
          key={skill}
          skill={skill}
          onRemove={() => 
            setProfile({ 
              ...profile, 
              skills: profile.skills.filter((s) => s !== skill) 
            })
          }
        />
      ))
    ) : (
      <p className="text-sm text-gray-400 italic">No skills added yet.</p>
    )}
  </div>

  <div className="flex flex-col sm:flex-row gap-3">
    <div className="flex-1 relative">
      <input
        placeholder="Add skill (e.g. React)..."
        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 outline-none transition-all text-sm md:text-base"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && newSkill.trim()) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            setNewSkill("");
          }
        }}
      />
    </div>
    <button
      onClick={() => {
        if (newSkill.trim()) {
          setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
          setNewSkill("");
        }
      }}
      className="w-full sm:w-auto px-8 h-12 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
    >
      Add
    </button>
  </div>
</section>

          <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-gray-900">Service Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PackageCard title="Starter" data={packages.starter} onChange={(f, v) => handlePackageChange("starter", f, v)} />
              <PackageCard title="Professional" data={packages.pro} onChange={(f, v) => handlePackageChange("pro", f, v)} />
            </div>
          </section>

          <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Portfolio Items</h2>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {portfolios.map((item) => (
                <div key={item.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white">
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                      <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm"
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </button>
                      <button 
                        onClick={() => handleRemovePortfolio(item.id)}
                        className="p-2 bg-white rounded-full hover:bg-red-50 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-50">
                    <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <PortfolioModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onSave={handleSavePortfolioItem}
              initialData={editingItem}
            />
          </section>
        </div>
      </div>
    </div>
  );
}