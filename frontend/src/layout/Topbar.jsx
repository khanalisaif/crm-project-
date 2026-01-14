import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur  px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition focus:outline-none"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          CRM Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {user?.role === "Admin" ? "Admin" : "Sales User"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 transition focus:outline-none"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
