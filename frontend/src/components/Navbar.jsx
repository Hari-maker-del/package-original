import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <ShieldCheck size={22} strokeWidth={2} />
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight text-slate-950">
              PackSure
            </div>

            <div className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              AI
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#platform"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Platform
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            About
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Login
          </a>

          <Button onClick={() => { window.location.href = "/signup"; }}>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            <a
              href="#platform"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              Platform
            </a>

            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              How It Works
            </a>

            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              Features
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              About
            </a>

            <a
              href="/login"
              className="mt-2 text-sm font-medium text-teal-700"
            >
              Login
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;