import { useState, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("leads");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "Admin") {
      setActiveTab("leads");
    } else {
      setActiveTab("leads");
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={isSidebarOpen}
      />

      <div className="flex flex-1 flex-col">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children(activeTab)}
          </div>
        </main>
      </div>
    </div>
  );
}
