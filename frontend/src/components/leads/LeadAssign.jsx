import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function LeadAssign({ leadId, onAssigned }) {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user?.role !== "Admin") return null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users || []);
      } catch (err) {
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const assignLead = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.put(`/leads/${leadId}/assign`, {
        userId: selectedUser,
      });

      onAssigned && onAssigned();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to assign lead"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Assign to Sales User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      <button
        onClick={assignLead}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Assigning..." : "Assign"}
      </button>

      {error && (
        <p className="w-full text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
