import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, FlaskConical, Image as ImageIcon, RefreshCw, Loader2 } from "lucide-react";
import { api } from "../services/api";

function ScanResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        let id = location.state?.inspectionId;
        if (!id) {
          const list = await api.inspections();
          id = list.inspections?.[0]?.id;
        }
        if (!id) { if (active) setInspection(null); return; }
        const data = await api.inspection(id);
        if (active) setInspection(data);
      } catch (err) {
        if (active) setError(err.message || "Unable to load the inspection.");
      } finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [location.state?.inspectionId]);

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-slate-500"><Loader2 className="animate-spin" size={28}/></div>;
  if (error) return <div className="max-w-xl mx-auto text-center py-20"><AlertTriangle size={32} className="mx-auto text-red-500"/><h1 className="text-xl font-bold mt-4">Unable to load result</h1><p className="text-sm text-slate-500 mt-2">{error}</p><button onClick={()=>navigate("/history")} className="mt-6 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold">Go to History</button></div>;
  if (!inspection) return <Empty navigate={navigate}/>;

  const result = inspection;
  const passed = result.compliance?.status === "Pass" || result.compliance?.status === "Compliant";
  const routeState = { state: { inspectionId: result.id } };
  return <div className="max-w-6xl mx-auto">
    <button onClick={() => navigate("/scan-product")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5"><ArrowLeft size={17}/>New Inspection</button>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"><div><p className="text-sm font-semibold text-teal-700 tracking-wide">INSPECTION RESULT</p><h1 className="text-3xl font-bold text-slate-900 mt-2">{result.product?.name || "Product analysis"}</h1><p className="text-sm text-slate-500 mt-2">{result.product?.brand || "Unknown brand"} · {new Date(result.created_at).toLocaleString()}</p></div><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${passed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{passed ? <CheckCircle2 size={18}/> : <AlertTriangle size={18}/>} {result.compliance?.status}</div></div>
    <div className="grid lg:grid-cols-3 gap-6 mb-6"><Metric title="Information score" value={result.compliance?.score == null ? "—" : `${result.compliance.score}%`}/><Metric title="Potential allergens" value={result.allergens?.length || 0}/><Metric title="Compliance checks" value={result.compliance?.checks?.length || 0}/></div>
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6"><div className="p-6 grid md:grid-cols-[220px_1fr] gap-6 items-start">{result.image_url && <div className="rounded-xl bg-slate-100 border border-slate-200 overflow-hidden"><img src={result.image_url} alt="Inspected product package" className="w-full h-52 object-contain" /></div>}<div><h2 className="font-semibold">Detected product information</h2><p className="text-xs text-slate-500 mt-2">Original package image is retained with this inspection.</p></div></div><div className="px-6 py-5 border-t border-slate-200"><div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{Object.entries({Brand:result.product?.brand,Manufacturer:result.product?.manufacturer,MRP:result.product?.mrp ? `₹${result.product.mrp}`:null,"Net quantity":result.product?.net_quantity,"Batch / Lot":result.product?.batch_lot,"Manufacturing date":result.product?.manufacturing_date,"Expiry / Best before":result.product?.expiry_best_before}).map(([k,v])=><Info key={k} label={k} value={v}/>)}</div></div></section>
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6"><div className="px-6 py-5 border-b border-slate-200"><h2 className="font-semibold">Compliance checks</h2><p className="text-xs text-slate-500 mt-1">This is an information-detection assessment, not legal certification.</p></div><div className="divide-y divide-slate-100">{result.compliance?.checks?.map((c)=><div key={c.check} className="px-6 py-4 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold">{c.check}</p><p className="text-sm text-slate-500 mt-1">{c.message}</p></div><span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "Pass" ? "bg-emerald-50 text-emerald-700" : c.status === "Non-Compliant" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{c.status}</span></div>)}</div></section>
    {result.compliance?.issues?.length > 0 && <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6"><h2 className="font-semibold text-amber-900">Items requiring review</h2><div className="mt-4 space-y-3">{result.compliance.issues.map((issue,i)=><div key={i} className="text-sm text-amber-900"><strong>{issue.issue_type}:</strong> {issue.description}</div>)}</div></section>}
    <div className="grid md:grid-cols-3 gap-4"><Action icon={<FlaskConical size={18}/>} text="Ingredient Analysis" onClick={()=>navigate("/ingredient-analysis",routeState)}/><Action icon={<ImageIcon size={18}/>} text="Visual Evidence" onClick={()=>navigate("/visual-evidence",routeState)}/><Action icon={<FileText size={18}/>} text="Reports & History" onClick={()=>navigate("/reports")}/></div>
  </div>;
}
const Metric=({title,value})=><div className="bg-white border border-slate-200 rounded-2xl p-6"><p className="text-xs uppercase tracking-wider text-slate-400">{title}</p><p className="text-3xl font-bold text-slate-900 mt-2">{value}</p></div>;
const Info=({label,value})=><div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-800 mt-1 break-words">{value || "Not detected"}</p></div>;
const Action=({icon,text,onClick})=><button onClick={onClick} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3 hover:border-teal-300 hover:bg-teal-50/30 text-sm font-semibold text-slate-800">{icon}<span>{text}</span></button>;
function Empty({navigate}){return <div className="max-w-xl mx-auto text-center py-20"><RefreshCw size={32} className="mx-auto text-slate-400"/><h1 className="text-xl font-bold mt-4">No inspection result</h1><p className="text-sm text-slate-500 mt-2">Start a product scan to generate an analysis.</p><button onClick={()=>navigate("/scan-product")} className="mt-6 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold">Scan Product</button></div>}
export default ScanResult;
