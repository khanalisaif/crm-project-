import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function DealForm({ onSuccess }) {
  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    customer: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers/active");
        setCustomers(res.data.customers || []);
      } catch (err) {
        setError("Failed to load customers");
      }
    };

    fetchCustomers();
  }, []);

  const validate = () => {
    if (!form.title.trim()) return "Deal title is required";
    if (!form.customer) return "Customer is required";
    if (!form.value || Number(form.value) <= 0)
      return "Valid deal value is required";
    return "";
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/deals", {
        title: form.title,
        customer: form.customer,
        value: Number(form.value),
        stage: "New",
      });

      setForm({ title: "", customer: "", value: "" });
      onSuccess && onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create deal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Create Deal
      </h3>

      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <input
          value={form.title}
          placeholder="Deal title"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          value={form.customer}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) =>
            setForm({ ...form, customer: e.target.value })
          }
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={form.value}
          placeholder="Deal value"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Deal"}
      </button>

      <p className="mt-3 text-xs text-gray-500">
        Deal will be created in <span className="font-medium">New</span> stage
      </p>
    </div>
  );
}
