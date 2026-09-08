import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  FileText,
  ScanLine,
  Search,
  Download,
  Eye,
  PackageSearch,
  BarChart3,
} from "lucide-react";

function Reports() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Reports");
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.inspections().then((data) => { if (active) setAllReports(data.inspections || []); })
      .catch((err) => { if (active) setError(err.message || "Unable to load reports."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const reports = useMemo(() => allReports.filter((item) => {
    const text = `${item.productName || ""} ${item.brand || ""}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = status === "All Reports" || item.status === status || (status === "Compliant" && item.status === "Pass");
    return matchesQuery && matchesStatus;
  }), [allReports, query, status]);

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-slate-500">Loading reports…</div>;
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
            COMPLIANCE MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Compliance Reports
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Access and manage your packaging compliance inspection reports.
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

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search reports..."
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
            <option>All Reports</option>
            <option>Compliant</option>
            <option>Requires Verification</option>
            <option>Non-Compliant</option>
          </select>

        </div>
      </div>

      {/* Reports */}
      {reports.length === 0 ? (
        <EmptyReports
          onScan={() => navigate("/scan-product")}
        />
      ) : (
        <ReportsTable
          reports={reports}
          navigate={navigate}
        />
      )}

    </div>
  );
}


/* Empty Reports */
function EmptyReports({ onScan }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

      <div className="flex flex-col items-center justify-center text-center px-6 py-20">

        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <FileText
            size={28}
            className="text-slate-400"
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-slate-900">
          No compliance reports
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500 leading-6">
          Your inspection reports will appear here after
          you complete a product inspection.
        </p>

        <button
          onClick={onScan}
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
        >
          <ScanLine size={17} />
          Create Your First Report
        </button>

      </div>
    </div>
  );
}


async function downloadReport(report, format = "html") {
  const token = localStorage.getItem("packsure_token");
  try {
    const response = await fetch(api.reportUrl(report.id, format), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) { let data={}; try{data=await response.json();}catch{} throw new Error(data.message || `Report download failed (${response.status})`); }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href=url; link.download=`packsure-${report.id}.${format === "csv" ? "csv" : "html"}`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  } catch (err) { window.alert(err.message || "Unable to download the report."); }
}

function ReportsTable({ reports, navigate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Inspection Reports
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Your compliance inspection reports
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {reports.length} reports
          </span>

        </div>
      </div>

      {/* Report Rows */}
      <div className="divide-y divide-slate-100">

        {reports.map((report) => (
          <div
            key={report.id}
            className="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-slate-50 transition"
          >

            {/* Report Info */}
            <div className="flex items-center gap-4 min-w-0">

              <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <FileText
                  size={21}
                  className="text-teal-700"
                />
              </div>

              <div className="min-w-0">

                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {report.productName}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {report.brand} · {new Date(report.createdAt).toLocaleDateString()}
                </p>

              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-6">

              <div className="hidden sm:flex items-center gap-2">
                <BarChart3
                  size={17}
                  className="text-slate-400"
                />

                <div>
                  <p className="text-[11px] text-slate-400">
                    Score
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    {report.score}%
                  </p>
                </div>
              </div>

              {/* Status */}
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {report.status}
              </span>

              {/* View */}
              <button
                onClick={() =>
                  navigate("/scan-result", {
                    state: {
                      inspectionId: report.id,
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                <Eye size={16} />
                View
              </button>

              {/* Download report */}
              <button
                type="button"
                onClick={() => downloadReport(report, "html")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <Download size={16} />
                <span className="hidden md:inline">Download Report</span>
              </button>

              <button type="button" onClick={() => downloadReport(report, "csv")} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                <Download size={16} />
                <span className="hidden md:inline">CSV</span>
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}


export default Reports;