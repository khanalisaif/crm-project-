import { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function LeadFollowUp({ lead }) {
  const { user } = useContext(AuthContext);

  const [note, setNote] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (
    user?.role === "Admin" ||
    !lead?.assignedTo ||
    lead.assignedTo !== user?._id
  ) {
    return null;
  }

  const submitFollowUp = async () => {
    if (!note.trim()) {
      setError("Follow-up note is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post(`/leads/${lead._id}/followup`, {
        note,
        nextDate,
      });

      setSuccess("Follow-up added");
      setNote("");
      setNextDate("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add follow-up"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl bg-gray-50 p-4">
      <p className="mb-2 text-xs font-semibold text-gray-700">
        Add Follow-up
      </p>

      {error && (
        <p className="mb-2 text-xs text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-2 text-xs text-emerald-600">
          {success}
        </p>
      )}

      <textarea
        rows={3}
        value={note}
        placeholder="Write follow-up note..."
        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setNote(e.target.value)}
      />

      <input
        type="date"
        value={nextDate}
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setNextDate(e.target.value)}
      />

      <button
        onClick={submitFollowUp}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Follow-up"}
      </button>
    </div>
  );
}
