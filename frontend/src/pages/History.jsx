import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  History as HistoryIcon,
  ScanLine,
  Search,
  PackageSearch,
  ChevronRight,
} from "lucide-react";

function History() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [allInspections, setAllInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.inspections().then((data) => { if (active) setAllInspections(data.inspections || []); })
      .catch((err) => { if (active) setError(err.message || "Unable to load inspection history."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const inspections = useMemo(() => allInspections.filter((item) => {
    const text = `${item.productName || ""} ${item.brand || ""}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = status === "All Status" || item.status === status || (status === "Compliant" && item.status === "Pass");
    return matchesQuery && matchesStatus;
  }), [allInspections, query, status]);

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-slate-500">Loading inspection history…</div>;
  if (error) return <div className="max-w-xl mx-auto text-center py-20"><p className="text-red-600 text-sm">{error}</p></div>;

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <p className="text-sm font-semibold text-teal-700 tracking-wide mb-2">
            INSPECTION MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Inspection History
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Review your previous packaging compliance inspections.
          </p>
        </div>

        <button
          onClick={() => navigate("/scan-product")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition shadow-sm"
        >
          <ScanLine size={18} />
          New Inspection
        </button>
      </div>

      {/* Search / Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search inspections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-300 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-600 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option>All Status</option>
            <option>Compliant</option>
            <option>Requires Verification</option>
            <option>Non-Compliant</option>
          </select>

        </div>
      </div>

      {/* History Table / Empty State */}
      {inspections.length === 0 ? (
        <EmptyHistory onScan={() => navigate("/scan-product")} />
      ) : (
        <HistoryTable
          inspections={inspections}
          navigate={navigate}
        />
      )}

    </div>
  );
}


/* Empty History */
function EmptyHistory({ onScan }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

      <div className="flex flex-col items-center justify-center text-center px-6 py-20">

        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <HistoryIcon
            size={28}
            className="text-slate-400"
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-slate-900">
          No inspection history
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500 leading-6">
          Your completed packaging compliance inspections will
          appear here after you analyze your first product.
        </p>

        <button
          onClick={onScan}
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
        >
          <ScanLine size={17} />
          Scan Your First Product
        </button>

      </div>
    </div>
  );
}


/* Future Real History Table */
function HistoryTable({ inspections, navigate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Table Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Previous Inspections
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Your packaging compliance activity
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {inspections.length} inspections
          </span>

        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">

        {inspections.map((inspection) => (
          <button
            key={inspection.id}
            onClick={() =>
              navigate("/scan-result", {
                state: {
                  inspectionId: inspection.id,
                },
              })
            }
            className="w-full text-left px-6 py-5 hover:bg-slate-50 transition"
          >

            <div className="flex items-center justify-between gap-5">

              <div className="flex items-center gap-4 min-w-0">

                <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <PackageSearch
                    size={21}
                    className="text-slate-500"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {inspection.productName}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {inspection.brand} · {new Date(inspection.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-5 shrink-0">

                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-400">
                    Compliance Score
                  </p>

                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {inspection.score}%
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {inspection.status}
                </span>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />

              </div>

            </div>

          </button>
        ))}

      </div>
    </div>
  );
}


export default History;