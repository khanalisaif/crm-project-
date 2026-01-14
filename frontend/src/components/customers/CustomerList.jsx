import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function CustomerList() {
  const [tab, setTab] = useState("active");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get(`/customers/${tab}`).then((res) => {
      setCustomers(res.data.customers || []);
    });
  }, [tab]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Customers
      </h3>

      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setTab("active")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "active"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Active Customers
        </button>

        <button
          onClick={() => setTab("completed")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "completed"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Completed Customers
        </button>
      </div>

      {customers.length === 0 && (
        <p className="text-sm text-gray-500">
          No customers found
        </p>
      )}

      <div className="space-y-3">
        {customers.map((c) => (
          <div
            key={c._id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="font-medium text-gray-800">
              {c.name}
            </p>
            <p className="text-xs text-gray-500">
              {c.email}
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                c.status === "Active"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
