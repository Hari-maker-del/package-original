import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileImage, X, ArrowLeft, ScanLine, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { api } from "../services/api";

function ScanProduct() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) return setError("Please upload a PNG, JPG or WEBP image.");
    if (file.size > 10 * 1024 * 1024) return setError("Image size must be less than 10 MB.");
    if (preview) URL.revokeObjectURL(preview);
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedImage(null); setPreview(null); setError("");
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isAnalyzing) return;
    setError("");
    setIsAnalyzing(true);
    try {
      const result = await api.createInspection(selectedImage);
      navigate("/scan-result", { state: { inspectionId: result.id } });
    } catch (err) {
      setError(err.message || "Unable to analyze the product image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return <div className="max-w-5xl mx-auto">
    <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5"><ArrowLeft size={17}/>Back to Dashboard</button>
    <div className="mb-8 flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center"><ScanLine size={22} className="text-teal-700"/></div><div><h1 className="text-2xl font-bold text-slate-900">Scan Product</h1><p className="text-sm text-slate-500 mt-1">Upload a clear package image for OCR and compliance analysis.</p></div></div>
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-7 py-6 border-b border-slate-200"><h2 className="text-lg font-semibold text-slate-900">Product Package Image</h2><p className="text-sm text-slate-500 mt-1">The image is securely sent to the PackSure API, which coordinates AI analysis and inspection storage.</p></div>
      <div className="p-7">
        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0"/><span>{error}</span></div>}
        {!preview ? <label htmlFor="product-image" className="group block border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition"><input id="product-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden"/><div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center"><Upload size={28} className="text-slate-500 group-hover:text-teal-700"/></div><h3 className="mt-5 text-base font-semibold text-slate-900">Upload product image</h3><p className="mt-2 text-sm text-slate-500">PNG, JPG or WEBP · Maximum 10 MB</p></label> : <div className="grid lg:grid-cols-[1fr_320px] gap-7"><div className="relative bg-slate-100 rounded-xl border border-slate-200 overflow-hidden min-h-[400px] flex items-center justify-center"><img src={preview} alt="Uploaded product package" className="max-h-[520px] max-w-full object-contain"/><button onClick={removeImage} className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-red-600"><X size={18}/></button></div><div className="border border-slate-200 rounded-xl p-6 h-fit"><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center"><FileImage size={20} className="text-teal-700"/></div><div className="min-w-0"><p className="text-sm font-semibold truncate">{selectedImage.name}</p><p className="text-xs text-slate-500 mt-1">{(selectedImage.size/1024/1024).toFixed(2)} MB</p></div></div><div className="flex gap-3"><ShieldCheck size={18} className="text-teal-700 shrink-0"/><p className="text-xs text-slate-500 leading-5">OCR extracts package information, ingredients and potential allergens, then applies supported packaging checks.</p></div><button disabled={isAnalyzing} onClick={handleAnalyze} className="mt-7 w-full h-12 rounded-lg bg-teal-700 disabled:opacity-60 text-white font-semibold text-sm hover:bg-teal-800 flex items-center justify-center gap-2">{isAnalyzing ? <><Loader2 size={18} className="animate-spin"/>Analyzing…</> : <><ScanLine size={18}/>Analyze Product</>}</button></div></div>}
      </div>
    </div>
  </div>;
}
export default ScanProduct;
