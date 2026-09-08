import {
  ArrowRight,
  ScanLine,
  ShieldCheck,
  FileCheck2,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Search,
  Zap,
  BarChart3,
  QrCode,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">

      <Navbar />

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section className="relative overflow-hidden pt-32">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* LEFT */}
          <div>

            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-teal-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              AI-Powered Compliance
            </div>

            {/* Main Heading */}
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Packaging compliance,
              <span className="block text-teal-700">
                powered by intelligence.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Analyze product packaging, detect regulatory violations,
              verify declarations, and transform package data into
              actionable compliance intelligence.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button>
                Scan a Product
              </Button>

              <Button variant="secondary">
                Explore Platform
              </Button>
            </div>

            {/* Trust line */}
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={17} className="text-teal-700" />
              Built for smarter and faster packaging verification
            </div>
          </div>


          {/* RIGHT — AI ANALYSIS CARD */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute -inset-5 rounded-[2rem] bg-teal-200/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)]">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <ScanLine size={20} className="text-teal-700" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Package Analysis
                    </p>

                    <p className="text-xs text-slate-500">
                      AI verification engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </div>
              </div>


              {/* Product preview */}
              <div className="relative mt-5 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.08),transparent_60%)]" />

                {/* Fake package */}
                <div className="relative h-48 w-32 rounded-lg border border-slate-300 bg-white shadow-xl">

                  <div className="border-b border-slate-200 px-3 py-4 text-center">
                    <div className="mx-auto mb-2 h-7 w-7 rounded-full bg-teal-700" />

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-800">
                      Sample Foods
                    </p>
                  </div>

                  <div className="space-y-2 px-3 pt-4">
                    <div className="h-2 rounded bg-slate-200" />
                    <div className="h-2 w-4/5 rounded bg-slate-200" />
                    <div className="h-2 w-3/5 rounded bg-slate-200" />
                  </div>

                  <div className="absolute bottom-4 left-3 right-3 h-8 rounded border border-slate-200 bg-slate-50" />
                </div>

                {/* Scan line */}
                <div className="absolute left-8 right-8 top-1/2 h-px bg-teal-500/70 shadow-[0_0_15px_rgba(20,184,166,0.6)]" />

                {/* Detection marker */}
                <div className="absolute right-20 top-16 flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] font-semibold text-amber-700 shadow-lg">
                  <AlertTriangle size={14} />
                  Check required
                </div>

              </div>


              {/* Analysis items */}
              <div className="mt-5 space-y-3">

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Product information
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-600">
                    Verified
                  </span>
                </div>


                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Net quantity
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-600">
                    Verified
                  </span>
                </div>


                <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-amber-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Allergen declaration
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-amber-600">
                    Review
                  </span>
                </div>

              </div>


              {/* Score */}
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 p-5 text-white">

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Compliance Score
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Overall package assessment
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-semibold">
                    92<span className="text-lg text-slate-400">/100</span>
                  </p>

                  <p className="text-xs font-medium text-emerald-400">
                    Strong compliance
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================
          TRUST / INTRO SECTION
      ========================================= */}

      <section
        id="platform"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <FeatureIntro
              number="01"
              icon={<BrainCircuit size={20} />}
              title="AI-Powered Analysis"
              description="Turn package images into structured compliance intelligence."
            />

            <FeatureIntro
              number="02"
              icon={<Search size={20} />}
              title="Smart Detection"
              description="Identify missing, incorrect, or suspicious declarations."
            />

            <FeatureIntro
              number="03"
              icon={<FileCheck2 size={20} />}
              title="Rule Validation"
              description="Validate packaging information against compliance rules."
            />

            <FeatureIntro
              number="04"
              icon={<BarChart3 size={20} />}
              title="Actionable Reports"
              description="Understand violations with clear evidence and recommendations."
            />

          </div>
        </div>
      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
            From package image to compliance intelligence.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            PackSure AI combines image processing, OCR, AI analysis,
            and rule-based validation into one streamlined workflow.
          </p>
        </div>


        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <ProcessCard
            number="01"
            icon={<ScanLine />}
            title="Scan"
            description="Upload or capture a product package."
          />

          <ProcessCard
            number="02"
            icon={<Search />}
            title="Extract"
            description="Extract product information using intelligent OCR."
          />

          <ProcessCard
            number="03"
            icon={<BrainCircuit />}
            title="Verify"
            description="Analyze information using AI and compliance rules."
          />

          <ProcessCard
            number="04"
            icon={<FileCheck2 />}
            title="Report"
            description="Receive a clear compliance score and actionable findings."
          />

        </div>
      </section>


      {/* =========================================
          FEATURES
      ========================================= */}

      <section
        id="features"
        className="bg-slate-950 text-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-400">
              Platform capabilities
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Everything you need to verify packaging compliance.
            </h2>

          </div>


          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2 lg:grid-cols-3">

            <DarkFeature
              icon={<BrainCircuit />}
              title="AI Compliance Engine"
              description="Analyze package declarations and identify potential compliance issues automatically."
            />

            <DarkFeature
              icon={<ScanLine />}
              title="Image-to-Compliance"
              description="Convert packaging images into structured information using OCR and AI."
            />

            <DarkFeature
              icon={<AlertTriangle />}
              title="Violation Detection"
              description="Detect missing, incorrect, or suspicious information before it becomes a problem."
            />

            <DarkFeature
              icon={<Zap />}
              title="Real-Time Analysis"
              description="Get compliance insights immediately after scanning a product."
            />

            <DarkFeature
              icon={<QrCode />}
              title="QR Verification"
              description="Verify product information and identify suspicious or unverifiable QR data."
            />

            <DarkFeature
              icon={<BarChart3 />}
              title="Compliance Reports"
              description="Generate clear reports with scores, violations, evidence, and recommendations."
            />

          </div>

        </div>
      </section>


      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section
        id="about"
        className="border-t border-slate-200 bg-white"
      >

        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <ShieldCheck size={28} />
          </div>

          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
            Ready to verify smarter?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Transform packaging data into actionable compliance
            intelligence with PackSure AI.
          </p>

          <div className="mt-8 flex justify-center">
            <Button>
              Start Scanning
            </Button>
          </div>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="font-semibold text-slate-950">
                PackSure AI
              </p>

              <p className="text-xs text-slate-500">
                Intelligent packaging compliance
              </p>
            </div>

          </div>

          <p className="text-sm text-slate-500">
            © 2026 PackSure AI. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}


/* =========================================
   SMALL REUSABLE COMPONENTS
========================================= */

function FeatureIntro({ number, icon, title, description }) {
  return (
    <div className="group">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {number}
        </span>

      </div>

      <h3 className="mt-5 font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function ProcessCard({ number, icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/50">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-teal-700">
          {icon}
        </div>

        <span className="text-xs font-bold text-slate-400">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function DarkFeature({ icon, title, description }) {
  return (
    <div className="bg-slate-950 p-8 transition hover:bg-slate-900">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-teal-400">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-teal-400">
        Explore capability
        <ArrowRight size={14} />
      </div>

    </div>
  );
}


export default Home;