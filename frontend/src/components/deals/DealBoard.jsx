import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import DealForm from "./DealForm";

const STAGES = [
  "New",
  "Contacted",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export default function DealBoard() {
  const { user } = useContext(AuthContext);

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/deals");
      setDeals(res.data.deals || []);
      setError("");
    } catch {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const moveDeal = async (dealId, stage) => {
    try {
      setUpdatingId(dealId);
      await api.put(`/deals/${dealId}/stage`, { stage });
      fetchDeals();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update deal stage"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className="space-y-6">
      <DealForm onSuccess={fetchDeals} />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Sales Pipeline
          </h3>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {user?.role}
          </span>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">
            Loading deals...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {STAGES.map((stage) => (
              <div
                key={stage}
                className="rounded-xl bg-gray-50 p-4"
              >
                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                  {stage}
                </h4>

                <div className="space-y-3">
                  {deals
                    .filter((d) => d.stage === stage)
                    .map((d) => {
                      const currentIndex =
                        STAGES.indexOf(stage);
                      const nextStage =
                        STAGES[currentIndex + 1];

                      const isClosed =
                        d.stage === "Won" ||
                        d.stage === "Lost";

                      return (
                        <div
                          key={d._id}
                          className="rounded-lg bg-white p-3 shadow-sm"
                        >
                          <p className="text-sm font-semibold text-gray-800">
                            ₹{d.value}
                          </p>

                          {isClosed && (
                            <span
                              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                d.stage === "Won"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {d.stage}
                            </span>
                          )}

                          {!isClosed && (
                            <>
                              {stage !== "Negotiation" &&
                                nextStage && (
                                  <button
                                    disabled={
                                      updatingId === d._id
                                    }
                                    onClick={() =>
                                      moveDeal(
                                        d._id,
                                        nextStage
                                      )
                                    }
                                    className="mt-2 w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                                  >
                                    {updatingId === d._id
                                      ? "Updating..."
                                      : `Move to ${nextStage}`}
                                  </button>
                                )}

                              {stage ===
                                "Negotiation" && (
                                <div className="mt-2 flex gap-2">
                                  <button
                                    disabled={
                                      updatingId === d._id
                                    }
                                    onClick={() =>
                                      moveDeal(
                                        d._id,
                                        "Won"
                                      )
                                    }
                                    className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition disabled:opacity-50"
                                  >
                                    Mark Won
                                  </button>

                                  <button
                                    disabled={
                                      updatingId === d._id
                                    }
                                    onClick={() =>
                                      moveDeal(
                                        d._id,
                                        "Lost"
                                      )
                                    }
                                    className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                                  >
                                    Mark Lost
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
