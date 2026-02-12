import {useSelector} from "react-redux";
export default function AdminHeader() {
  const user = useSelector(state=>state.auth.user)
  console.log(user);
  
  return (

    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-5">
        <div className="border-l border-gray-200 pl-5">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.full_name}
            </p>
            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
