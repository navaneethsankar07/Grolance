import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "./profileMutations";
import { useProfile } from "./profileQueries";

export default function AccountSettings() {
  const { data: profile } = useProfile();
  const { mutate, isLoading, error, isSuccess } = useChangePassword();

  const isGoogleUser = profile?.is_google_account;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const onSubmit = (data) => {
    mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[26px] font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        {/* EMAIL */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded-lg">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Email Address</h2>
              <p className="text-sm text-gray-500 mb-4">
                Your primary email for account access
              </p>

              <input
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-100"
              />
            </div>
          </div>
        </div>

        {!isGoogleUser ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl border p-6"
          >
            <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 bg-purple-50 flex items-center justify-center rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500">
                  Update your password securely
                </p>
              </div>
            </div>

            {/* CURRENT PASSWORD */}
            <div className="space-y-1 mb-4">
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  placeholder="Current password"
                  {...register("current_password", {
                    required: "Current password is required",
                  })}
                  className="w-full px-4 py-3 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((p) => ({ ...p, current: !p.current }))
                  }
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-1 mb-4">
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  placeholder="New password"
                  {...register("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="w-full px-4 py-3 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1 mb-6">
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("new_password") ||
                      "Passwords do not match",
                  })}
                  className="w-full px-4 py-3 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((p) => ({ ...p, confirm: !p.confirm }))
                  }
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error.response?.data?.detail || "Password update failed"}
              </p>
            )}

            {isSuccess && (
              <p className="text-green-600 text-sm mb-3">
                Password updated successfully
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-yellow-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Password managed by Google
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  You signed in using Google. Your password is managed through
                  your Google account.
                </p>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  Manage Google Account →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
