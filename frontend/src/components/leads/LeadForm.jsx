import { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function LeadForm({ onSuccess }) {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user?.role !== "Admin") {
    return (
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Only admin can create leads.
        </p>
      </div>
    );
  }

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.includes("@")) return "Valid email is required";
    if (form.phone.length < 10)
      return "Valid phone number is required";
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

      await api.post("/leads", form);

      onSuccess && onSuccess();

      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create lead"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Create Lead
      </h3>

      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={form.name}
          placeholder="Full Name"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          value={form.email}
          placeholder="Email Address"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          value={form.phone}
          placeholder="Phone Number"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <button
          onClick={submit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Lead"}
        </button>
      </div>
    </div>
  );
}
