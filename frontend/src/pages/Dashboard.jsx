import { useState, useContext } from "react";
import Layout from "../layout/Layout";
import LeadForm from "../components/leads/LeadForm";
import LeadList from "../components/leads/LeadList";
import CustomerList from "../components/customers/CustomerList";
import DealBoard from "../components/deals/DealBoard";
import TaskList from "../components/tasks/TaskList";
import Reports from "../components/reports/Reports";
import { AuthContext } from "../context/AuthContext";
import SalesUsersList from "../components/users/SalesUsersList";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Layout>
      {(activeTab) => (
        <div className="space-y-6">
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <LeadForm onSuccess={handleLeadAdded} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <LeadList refreshKey={refreshKey} />
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <CustomerList />
            </div>
          )}

          {activeTab === "deals" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <DealBoard />
            </div>
          )}

          {activeTab === "tasks" && user?.role !== "Admin" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <TaskList />
            </div>
          )}
          {activeTab === "sales-users" && user?.role === "Admin" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <SalesUsersList />
            </div>
)}

          {activeTab === "reports" && user?.role === "Admin" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <Reports />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
