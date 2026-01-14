import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import LeadAssign from "./LeadAssign";
import LeadFollowUp from "./LeadFollowUp";

export default function LeadList({ refreshKey }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "Admin";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [convertingId, setConvertingId] = useState(null);

  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      setLeads(res.data.leads || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load leads"
      );
    } finally {
      setLoading(false);
    }
  };

  const convertLead = async (id) => {
    try {
      setConvertingId(id);
      await api.post(`/leads/${id}/convert`);
      fetchLeads();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to convert lead"
      );
    } finally {
      setConvertingId(null);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch {
      alert("Failed to delete lead");
    }
  };

  const openEdit = (lead) => {
    setEditingLead(lead._id);
    setEditForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    });
  };

  const updateLead = async () => {
    try {
      await api.put(`/leads/${editingLead}`, editForm);
      setEditingLead(null);
      fetchLeads();
    } catch {
      alert("Failed to update lead");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshKey]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Leads
      </h3>

      {loading && (
        <p className="text-sm text-gray-500">
          Loading leads...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && leads.length === 0 && (
        <p className="text-sm text-gray-500">
          No leads available
        </p>
      )}

      <div className="space-y-4">
        {leads.map((l) => {
          const isAssignedToUser =
            l.assignedTo && l.assignedTo === user?._id;

          return (
            <div
              key={l._id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {l.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {l.email}
                  </p>
                  <p className="mt-1 text-xs">
                    {l.assignedTo ? (
                      <span className="font-medium text-emerald-600">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Not Assigned
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isAdmin && !l.assignedTo && (
                    <LeadAssign
                      leadId={l._id}
                      onAssigned={fetchLeads}
                    />
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => openEdit(l)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => deleteLead(l._id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}

                  {!isAdmin && isAssignedToUser && (
                    <button
                      onClick={() => convertLead(l._id)}
                      disabled={convertingId === l._id}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                      {convertingId === l._id
                        ? "Converting..."
                        : "Convert"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <LeadFollowUp lead={l} />
              </div>

              {editingLead === l._id && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.name}
                      placeholder="Name"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.email}
                      placeholder="Email"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          email: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.phone}
                      placeholder="Phone"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={updateLead}
                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLead(null)}
                      className="rounded-lg bg-gray-400 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
