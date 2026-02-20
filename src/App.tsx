import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import LekoChat from "@/components/LekoChat";
import Index from "./pages/Index";
import Services from "./pages/Services";
import HowWeWork from "./pages/HowWeWork";
import Clients from "./pages/Clients";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PortalDashboard from "./pages/portal/PortalDashboard";
import ActiveWork from "./pages/portal/ActiveWork";
import Requests from "./pages/portal/Requests";
import Documents from "./pages/portal/Documents";
import Updates from "./pages/portal/Updates";
import Account from "./pages/portal/Account";
import Automation from "./pages/portal/Automation";
import Pipeline from "./pages/portal/Pipeline";
import Reports from "./pages/portal/Reports";
import Finance from "./pages/portal/Finance";
import StudiosHub from "./pages/portal/StudiosHub";
import OperationsStudio from "./pages/portal/studios/OperationsStudio";
import AutomationStudio from "./pages/portal/studios/AutomationStudio";
import LeadEngineStudio from "./pages/portal/studios/LeadEngineStudio";
import SocialsStudio from "./pages/portal/studios/SocialsStudio";
import ExperiencesStudio from "./pages/portal/studios/ExperiencesStudio";
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
            <Route path="/how-it-works" element={<HowWeWork />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Client Portal (authenticated) */}
            <Route path="/portal" element={<ProtectedRoute><DashboardLayout portal="client"><PortalDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/active-work" element={<ProtectedRoute><DashboardLayout portal="client"><StudiosHub /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/operations" element={<ProtectedRoute><DashboardLayout portal="client"><OperationsStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/automation" element={<ProtectedRoute><DashboardLayout portal="client"><AutomationStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/lead-engine" element={<ProtectedRoute><DashboardLayout portal="client"><LeadEngineStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/socials" element={<ProtectedRoute><DashboardLayout portal="client"><SocialsStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/experiences" element={<ProtectedRoute><DashboardLayout portal="client"><ExperiencesStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/requests" element={<ProtectedRoute><DashboardLayout portal="client"><Requests /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/documents" element={<ProtectedRoute><DashboardLayout portal="client"><Documents /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/updates" element={<ProtectedRoute><DashboardLayout portal="client"><Updates /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/account" element={<ProtectedRoute><DashboardLayout portal="client"><Account /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/automation" element={<ProtectedRoute><DashboardLayout portal="client"><Automation /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/pipeline" element={<ProtectedRoute><DashboardLayout portal="client"><Pipeline /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/reports" element={<ProtectedRoute><DashboardLayout portal="client"><Reports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/finance" element={<ProtectedRoute><DashboardLayout portal="client"><Finance /></DashboardLayout></ProtectedRoute>} />

            {/* Admin Back Office (admin only) */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminOverview /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminClients /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/work" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminWorkManager /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminRequestsInbox /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminDocuments /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/templates" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminTemplates /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminReports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminSettings /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <LekoChat />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
