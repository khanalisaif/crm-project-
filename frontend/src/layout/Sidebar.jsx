import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const { user } = useContext(AuthContext);

  const menu =
    user?.role === "Admin"
      ? [
          { key: "leads", label: "Leads" },
        { key: "sales-users", label: "Sales Users" },

          { key: "customers", label: "Customers" },
          { key: "reports", label: "Reports" },
        ]
      : [
          { key: "leads", label: "Leads" },
          { key: "customers", label: "Customers" },
          { key: "deals", label: "Deals" },
          { key: "tasks", label: "Tasks" },
        ];

  return (
    <aside
      className={`h-screen bg-white border-r transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}
      `}
    >
      <div className="px-6 py-5 border-b  border-blue-600">
        <h2 className="text-xl font-bold text-blue-600 tracking-tight pl-5">
          SAIF ALI KHAN
        </h2>
      </div>

      <ul className="mt-4 px-3 space-y-1">
        {menu.map((item) => (
          <li
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium transition
              ${
                activeTab === item.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
