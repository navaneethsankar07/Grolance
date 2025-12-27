import { Calendar, Building2, MapPin } from "lucide-react";
import { useProfile } from "./profileQueries";
import { Link } from "react-router-dom";

export default function ProfileOverview() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return <div className="p-8 text-gray-500">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load profile</div>;
  }

  const {
    full_name,
    email,
    profile_photo,
    company_name,
    location,
    categories,
    joined_at,
  } = data;

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[26px] font-bold text-gray-900 mb-8">
          Profile Overview
        </h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <img
              src={
                profile_photo ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(full_name)
              }
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {full_name}
                  </h2>
                  <p className="text-sm text-gray-600">{email}</p>
                </div>

                <Link
                  to=""
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Member since{" "}
                    {joined_at
                      ? new Date(joined_at).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                {company_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{company_name}</span>
                  </div>
                )}

                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-6">
            Skills & Interests
          </h3>

          {categories?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-500 text-xs font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              You haven’t added any skills or interests yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
