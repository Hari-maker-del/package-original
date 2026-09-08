import {
  ShieldCheck,
  LayoutDashboard,
  ScanLine,
  ClipboardCheck,
  FlaskConical,
  ImageIcon,
  QrCode,
  History,
  FileText,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../auth";

function Sidebar() {
  const { user } = useAuth();
  const initials = (user?.name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const sections = [
    {
      title: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "INSPECTION",
      items: [
        {
          name: "Scan Product",
          path: "/scan-product",
          icon: ScanLine,
        },
        {
          name: "Scan Results",
          path: "/scan-result",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      title: "ANALYSIS",
      items: [
        {
          name: "Ingredient Analysis",
          path: "/ingredient-analysis",
          icon: FlaskConical,
        },
        {
          name: "Visual Evidence",
          path: "/visual-evidence",
          icon: ImageIcon,
        },
        {
          name: "QR Verification",
          path: "/qr-verification",
          icon: QrCode,
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "History",
          path: "/history",
          icon: History,
        },
        {
          name: "Reports",
          path: "/reports",
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 w-64 min-h-screen bg-slate-950 text-white flex-col">

      {/* Logo */}
      <div className="h-20 px-6 flex items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              PackSure AI
            </h1>

            <p className="text-[11px] text-slate-400">
              Compliance Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">

        {sections.map((section) => (
          <div key={section.title} className="mb-7">

            <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.16em] text-slate-500">
              {section.title}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                        isActive
                          ? "bg-teal-700 text-white"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} />

                        <span className="flex-1">
                          {item.name}
                        </span>

                        {isActive && (
                          <ChevronRight size={15} />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

            </div>
          </div>
        ))}

      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900">

          <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center font-semibold">
            {initials}
          </div>

          <div>
            <p className="text-sm font-medium">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.account_type || "User Account"}
            </p>
          </div>

        </div>
      </div>

    </aside>
  );
}

export default Sidebar;