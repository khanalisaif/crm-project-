import { useEffect, useState } from "react";
import api from "../../utils/api";

function TaskFollowUps({ leadId, onClose }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await api.get(`/leads/${leadId}/followups`);
        setFollowUps(res.data.followUps || []);
      } catch (err) {
        alert("Failed to load follow-ups");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [leadId]);

  return (
    <div className="mt-4 rounded-xl border bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-emerald-700">
          Follow-ups ({followUps.length})
        </h4>
        <button
          onClick={onClose}
          className="text-xs font-medium text-red-500 hover:underline"
        >
          Close
        </button>
      </div>

      {loading && (
        <p className="text-xs text-gray-500">Loading follow-ups...</p>
      )}

      {!loading && followUps.length === 0 && (
        <p className="text-xs text-gray-500">No follow-ups found</p>
      )}

      <ul className="space-y-2">
        {followUps.map((f, i) => (
          <li
            key={i}
            className="rounded-lg bg-white p-3 text-xs shadow-sm"
          >
            <p className="text-gray-700">{f.note}</p>
            <p className="mt-1 text-[11px] text-gray-400">
              {new Date(f.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openTaskId, setOpenTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to update task"
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Tasks & Follow-ups
      </h3>

      {loading && (
        <p className="text-sm text-gray-500">Loading tasks...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && tasks.length === 0 && (
        <p className="text-sm text-gray-500">
          No tasks available
        </p>
      )}

      <div className="space-y-4">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">
                  {t.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={
                      t.completed
                        ? "font-medium text-emerald-600"
                        : "font-medium text-amber-600"
                    }
                  >
                    {t.completed ? "Completed" : "Pending"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {t.lead && (
                  <button
                    onClick={() =>
                      setOpenTaskId(
                        openTaskId === t._id ? null : t._id
                      )
                    }
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    {openTaskId === t._id
                      ? "Hide Follow-ups"
                      : "See Follow-ups"}
                  </button>
                )}

                {!t.completed && (
                  <button
                    onClick={() => completeTask(t._id)}
                    className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>

            {openTaskId === t._id && t.lead && (
              <TaskFollowUps
                leadId={t.lead._id}
                onClose={() => setOpenTaskId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
