import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import ActiveWork from "./pages/portal/ActiveWork";
import Requests from "./pages/portal/Requests";
import Documents from "./pages/portal/Documents";
import Updates from "./pages/portal/Updates";
import Account from "./pages/portal/Account";
import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminClients from "./pages/admin/AdminClients";
import AdminWorkManager from "./pages/admin/AdminWorkManager";
import AdminRequestsInbox from "./pages/admin/AdminRequestsInbox";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Client Portal (authenticated) */}
            <Route path="/portal" element={<ProtectedRoute><PortalLayout><PortalDashboard /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/active-work" element={<ProtectedRoute><PortalLayout><ActiveWork /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/requests" element={<ProtectedRoute><PortalLayout><Requests /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/documents" element={<ProtectedRoute><PortalLayout><Documents /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/updates" element={<ProtectedRoute><PortalLayout><Updates /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/account" element={<ProtectedRoute><PortalLayout><Account /></PortalLayout></ProtectedRoute>} />

            {/* Admin Back Office (admin only) */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout><AdminOverview /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requireAdmin><AdminLayout><AdminClients /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/work" element={<ProtectedRoute requireAdmin><AdminLayout><AdminWorkManager /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute requireAdmin><AdminLayout><AdminRequestsInbox /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute requireAdmin><AdminLayout><AdminDocuments /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/templates" element={<ProtectedRoute requireAdmin><AdminLayout><AdminTemplates /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
