import { useState, useEffect } from "react";
import { FileText, Shield, HelpCircle, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGlobalSettings } from "./adminSettingsQueries";
import { useUpdateSettings } from "./adminsettingsMutations";

export default function AdminSettings() {
  const { data: settings, isLoading } = useGlobalSettings();
  const updateMutation = useUpdateSettings();
  const [activeModal, setActiveModal] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        commission_percentage: settings.commission_percentage,
        support_email: settings.support_email,
      });
    }
  }, [settings, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate(data, {
      onSuccess: () => setActiveModal(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-8 space-y-2">
          <h1 className="text-[26px] font-bold leading-9 text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-600">Configure your platform's core settings and integrations.</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-[15px] font-semibold text-gray-900">Platform Commission Percentage</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-[31px] font-bold leading-10 text-blue-500">
                  {settings?.commission_percentage} %
                </div>
                <p className="text-xs text-gray-600">This percentage is deducted from every successful order.</p>
              </div>
              <button 
                onClick={() => setActiveModal('commission')}
                className="rounded-md border border-gray-300 bg-transparent px-[17px] py-[11px] text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-[15px] font-semibold text-gray-900">Support Email Address</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-base font-normal text-gray-900">{settings?.support_email}</div>
                <p className="text-xs text-gray-600">Primary contact email for customer support inquiries.</p>
              </div>
              <button 
                onClick={() => setActiveModal('email')}
                className="rounded-md border border-gray-300 bg-transparent px-[17px] py-[11px] text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Update Email
              </button>
            </div>
          </div>

          {/* Site Pages Section Stays Same */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-80">
            <h2 className="mb-2 text-[15px] font-semibold text-gray-900">Manage Site Pages</h2>
            <p className="mb-6 text-xs text-gray-600">Edit Terms & Conditions, Privacy Policy, and FAQ.</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Terms & Conditions", icon: FileText, desc: "Manage legal agreements." },
                { title: "Privacy Policy", icon: Shield, desc: "Edit data protection info." },
                { title: "FAQ", icon: HelpCircle, desc: "Manage frequently asked questions." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <item.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-[15px] font-semibold text-gray-900">{item.title}</h3>
                    <button className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">Edit Page</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Settings Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModal === 'commission' ? 'Edit Commission' : 'Update Support Email'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {activeModal === 'commission' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Percentage (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...register("commission_percentage", {
                        required: "Commission is required",
                        min: { value: 0, message: "Minimum 0%" },
                        max: { value: 100, message: "Maximum 100%" }
                      })}
                      className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.commission_percentage ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  {errors.commission_percentage && <p className="mt-1 text-xs text-red-500">{errors.commission_percentage.message}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Email Address</label>
                  <input
                    type="email"
                    {...register("support_email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.support_email ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'}`}
                    placeholder="support@example.com"
                  />
                  {errors.support_email && <p className="mt-1 text-xs text-red-500">{errors.support_email.message}</p>}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}