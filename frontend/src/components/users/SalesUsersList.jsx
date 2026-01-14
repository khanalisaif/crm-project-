import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function SalesUsersList() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/users");

        const salesUsers = (res.data.users || []).filter(
          (u) => u.role === "Sales"
        );

        setUsers(salesUsers);
      } catch (err) {
        console.error("USERS ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load users"
        );
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Sales Users
      </h3>

      {loading && (
        <p className="text-sm text-gray-500">
          Loading users...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-sm text-gray-500">
          No sales users found
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="rounded-xl border border-gray-200 p-4"
          >
            <p className="font-medium text-gray-800">
              {u.name}
            </p>
            <p className="text-xs text-gray-500">
              {u.email}
            </p>
            

            <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Sales User
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
