import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 md:px-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center">
            <ShieldCheck className="text-white" size={21} />
          </div>

          <div className="leading-tight">
            <p className="font-bold text-slate-900">PackSure</p>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-teal-700">
              AI
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Left Branding */}
          <section className="hidden lg:flex bg-slate-950 text-white p-12 flex-col justify-between min-h-[620px]">

            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">PackSure AI</h2>
                  <p className="text-xs text-slate-400">
                    Intelligent Compliance Platform
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-teal-400 tracking-widest uppercase mb-4">
                Secure Access
              </p>

              <h1 className="text-4xl font-semibold leading-tight">
                Compliance intelligence,
                <br />
                <span className="text-teal-400">made simple.</span>
              </h1>

              <p className="mt-6 text-slate-400 leading-7 max-w-md">
                Access your packaging compliance workspace, analyze products,
                verify declarations, and manage inspection reports.
              </p>
            </div>

            <div className="space-y-4">
              <Feature text="AI-powered package analysis" />
              <Feature text="Automated compliance verification" />
              <Feature text="Ingredient & allergen intelligence" />
              <Feature text="Centralized inspection reports" />
            </div>
          </section>

          {/* Login Form */}
          <section className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">

            <div className="max-w-md w-full mx-auto">

              <div className="mb-8">
                <p className="text-sm font-semibold text-teal-700 mb-3">
                  WELCOME BACK
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  Sign in to PackSure
                </h1>

                <p className="mt-2 text-slate-500 text-sm">
                  Enter your credentials to access your compliance dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <span className="text-xs text-slate-400" title="Password reset endpoint is not part of the current authentication scope">Password reset via administrator</span>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full h-12 pl-11 pr-12 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400">Your session is stored securely in this browser for the current authentication lifetime.</p>

                {error && <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}

                {/* Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                  <ArrowLeft size={17} className="rotate-180" />
                </button>
              </form>

              {/* Signup */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-slate-400">
        © 2026 PackSure AI. Intelligent Packaging Compliance.
      </footer>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <CheckCircle2 size={18} className="text-teal-400" />
      <span>{text}</span>
    </div>
  );
}

export default Login;