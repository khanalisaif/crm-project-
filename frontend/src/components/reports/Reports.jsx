import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function Reports() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    totalLeads: 0,
    wonDeals: 0,
    lostDeals: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports");
      setData(res.data.reports || {});
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchReports();
    }
  }, [user]);

  if (user?.role !== "Admin") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          You are not authorized to view reports.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Sales Reports
        </h3>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          Admin
        </span>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">
          Loading reports...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Total Leads
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {data.totalLeads}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Won Deals
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {data.wonDeals}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Lost Deals
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {data.lostDeals}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              ₹{data.revenue?.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
