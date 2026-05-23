import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Upload, LayoutDashboard, LogOut, Plane, Sparkles } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar — dark glass effect with gradient accent */}
      <aside className="w-64 flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Logo area */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* gradient icon */}
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 
              flex items-center justify-center shadow-lg shadow-sky-500/30"
            >
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">
                TripPlanner
              </span>
              {/* AI badge next to logo */}
              <span
                className="ml-1 text-xs font-medium bg-gradient-to-r from-sky-400 to-indigo-400 
                bg-clip-text text-transparent"
              >
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border border-sky-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border border-sky-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Upload className="w-4 h-4" />
            New Trip
          </NavLink>
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {/* Avatar with gradient */}
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 
              flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
