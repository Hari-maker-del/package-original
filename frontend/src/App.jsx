import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ScanProduct from "./pages/ScanProduct";
import ScanResult from "./pages/ScanResult";
import IngredientAnalysis from "./pages/IngredientAnalysis";
import VisualEvidence from "./pages/VisualEvidence";
import QRVerification from "./pages/QRVerification";
import History from "./pages/History";
import Reports from "./pages/Reports";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth";

function NotFound() { return <div className="min-h-screen grid place-items-center p-6"><div className="text-center"><h1 className="text-3xl font-bold text-slate-900">Page not found</h1><a href="/" className="inline-block mt-4 text-teal-700 font-semibold">Back to home</a></div></div>; }

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute><DashboardLayout>
              <Dashboard />
            </DashboardLayout></ProtectedRoute>
          }
        />

        {/* Scan Product */}
        <Route
          path="/scan-product"
          element={
            <ProtectedRoute><DashboardLayout>
              <ScanProduct />
            </DashboardLayout></ProtectedRoute>
          }
        />
        <Route
        path="/scan-result"
         element={
         <ProtectedRoute><DashboardLayout>
           <ScanResult />
         </DashboardLayout></ProtectedRoute>
        }
         />
         <Route
          path="/ingredient-analysis"
          element={
          <ProtectedRoute><DashboardLayout>
          <IngredientAnalysis />
           </DashboardLayout></ProtectedRoute>
          }
        />
        <Route
        path="/visual-evidence"
        element={
         <ProtectedRoute><DashboardLayout>
         <VisualEvidence />
         </DashboardLayout></ProtectedRoute>
          }
        />
        <Route
        path="/qr-verification"
        element={
        <ProtectedRoute><DashboardLayout>
        <QRVerification />
        </DashboardLayout></ProtectedRoute>
        }
       />
       <Route
       path="/history"
       element={
        <ProtectedRoute><DashboardLayout>
        <History />
       </DashboardLayout></ProtectedRoute>
       }
      />
      <Route
      path="/reports"
      element={
       <ProtectedRoute><DashboardLayout>
        <Reports />
       </DashboardLayout></ProtectedRoute>
      }
      />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;