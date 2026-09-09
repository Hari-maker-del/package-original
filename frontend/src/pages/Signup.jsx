import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const accountType = "User";
  const [terms, setTerms] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!terms) { setError("Please accept the terms and conditions."); return; }
    setError("");
    setSubmitting(true);
    try {
      const result = await signup({ name: fullName, email, password, accountType });
      if (result?.verificationRequired) return;
      if (result?.token) navigate("/dashboard", { replace: true });
      else navigate("/login?registered=1", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center"><ShieldCheck className="text-white" size={21} /></div>
          <div className="leading-tight"><p className="font-bold text-slate-900">PackSure</p><p className="text-[11px] font-semibold tracking-[0.18em] text-teal-700">AI</p></div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <section className="hidden lg:flex bg-slate-950 text-white p-12 flex-col justify-between min-h-[680px]">
            <div>
              <div className="flex items-center gap-3 mb-12"><div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center"><ShieldCheck size={24} /></div><div><h2 className="text-xl font-bold">PackSure AI</h2><p className="text-xs text-slate-400">Intelligent Compliance Platform</p></div></div>
              <p className="text-sm font-semibold text-teal-400 tracking-widest uppercase mb-4">GET STARTED</p>
              <h1 className="text-4xl font-semibold leading-tight">Build smarter,<br /><span className="text-teal-400">compliant products.</span></h1>
              <p className="mt-6 text-slate-400 leading-7 max-w-md">Create your PackSure AI account and start transforming packaging compliance into actionable intelligence.</p>
            </div>
            <div className="space-y-4"><Feature text="AI-powered package analysis" /><Feature text="Automated compliance verification" /><Feature text="Ingredient & allergen intelligence" /><Feature text="Detailed compliance reports" /></div>
          </section>

          <section className="p-8 md:p-12 lg:p-14">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-7"><p className="text-sm font-semibold text-teal-700 mb-3">CREATE ACCOUNT</p><h1 className="text-3xl font-bold text-slate-900">Create your account</h1><p className="mt-2 text-slate-500 text-sm">Join PackSure AI and simplify packaging compliance.</p></div>
              {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
              <form onSubmit={handleSignup} className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Full name</label><div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition" /></div></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Email address</label><div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition" /></div></div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"><p className="text-sm font-medium text-slate-700">Account type: User</p><p className="text-xs text-slate-500 mt-1">Compliance Officer access is assigned by an administrator.</p></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Password</label><div className="relative"><Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" minLength={8} required className="w-full h-12 pl-11 pr-12 rounded-lg border border-slate-300 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Confirm password</label><div className="relative"><Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required className="w-full h-12 pl-11 pr-12 rounded-lg border border-slate-300 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <label className="flex items-start gap-3 pt-1 cursor-pointer"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="w-4 h-4 mt-0.5 accent-teal-700" /><span className="text-sm text-slate-500 leading-5">I agree to the Terms & Conditions and Privacy Policy.</span></label>
                <button type="submit" disabled={submitting} className="w-full h-12 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Creating account…" : "Create account"}<ArrowLeft size={17} className="rotate-180" /></button>
              </form>
              <div className="mt-7 pt-6 border-t border-slate-200 text-center"><p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">Sign in</Link></p></div>
            </div>
          </section>
        </div>
      </main>
      <footer className="py-5 text-center text-xs text-slate-400">© 2026 PackSure AI. Intelligent Packaging Compliance.</footer>
    </div>
  );
}

function Feature({ text }) { return <div className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-teal-400" /><span>{text}</span></div>; }

export default Signup;
