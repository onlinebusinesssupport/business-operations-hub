import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LekoProvider } from "@/contexts/LekoContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import LekoChat from "@/components/LekoChat";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Studios from "./pages/Studios";
import HowWeWork from "./pages/HowWeWork";
import Clients from "./pages/Clients";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// Apply page removed — all partner acquisition routes through Contact → Application pipeline
import AdminApplications from "./pages/admin/AdminApplications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Media from "./pages/Media";
import MfaVerify from "./pages/MfaVerify";

// Client Portal
import PortalDashboard from "./pages/portal/PortalDashboard";
import StudiosHub from "./pages/portal/StudiosHub";
import MyStudios from "./pages/portal/MyStudios";
import Requests from "./pages/portal/Requests";
import Progress from "./pages/portal/Progress";
import ClientReports from "./pages/portal/ClientReports";
import Files from "./pages/portal/Files";
import Billing from "./pages/portal/Billing";
import ClientSettings from "./pages/portal/ClientSettings";
import OperationsStudio from "./pages/portal/studios/OperationsStudio";
import AutomationStudio from "./pages/portal/studios/AutomationStudio";
import LeadEngineStudio from "./pages/portal/studios/LeadEngineStudio";
import SocialsStudio from "./pages/portal/studios/SocialsStudio";
import ExperiencesStudio from "./pages/portal/studios/ExperiencesStudio";
import ClientOnboarding from "./pages/portal/ClientOnboarding";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import AdminClients from "./pages/admin/AdminClients";
import AdminWorkManager from "./pages/admin/AdminWorkManager";
import AdminRequestsInbox from "./pages/admin/AdminRequestsInbox";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRevenue from "./pages/admin/AdminRevenue";
// AdminLeadPipeline removed — pipeline route redirects to Applications
import AdminReviews from "./pages/admin/AdminReviews";
import AdminOnboardingQueue from "./pages/admin/AdminOnboardingQueue";
import AdminAccountant from "./pages/admin/AdminAccountant";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminMessages from "./pages/admin/AdminMessages";

// Service detail pages
import DigitalPresence from "./pages/services/DigitalPresence";
import LeadEngine from "./pages/services/LeadEngine";
import AutomationService from "./pages/services/AutomationService";
import OperationsService from "./pages/services/Operations";
import CorporateEvents from "./pages/services/CorporateEvents";
import CompanyRegistration from "./pages/services/CompanyRegistration";
import Reviews from "./pages/Reviews";
import ReviewSubmit from "./pages/ReviewSubmit";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PortalMessages from "./pages/portal/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LekoProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/services/digital-presence" element={<DigitalPresence />} />
            <Route path="/services/lead-engine" element={<LeadEngine />} />
            <Route path="/services/automation" element={<AutomationService />} />
            <Route path="/services/operations" element={<OperationsService />} />
            <Route path="/services/corporate-events" element={<CorporateEvents />} />
            <Route path="/services/company-registration" element={<CompanyRegistration />} />
            <Route path="/results" element={<Media />} />
            <Route path="/media" element={<Media />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/review" element={<ReviewSubmit />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/how-it-works" element={<HowWeWork />} />
            <Route path="/clients" element={<Clients />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* /apply removed — routed through Contact */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/mfa-verify" element={<MfaVerify />} />

            {/* Client Portal */}
            <Route path="/portal" element={<ProtectedRoute><DashboardLayout portal="client"><PortalDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios" element={<ProtectedRoute><DashboardLayout portal="client"><StudiosHub /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/my-studios" element={<ProtectedRoute><DashboardLayout portal="client"><MyStudios /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/operations" element={<ProtectedRoute><DashboardLayout portal="client"><OperationsStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/automation" element={<ProtectedRoute><DashboardLayout portal="client"><AutomationStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/lead-engine" element={<ProtectedRoute><DashboardLayout portal="client"><LeadEngineStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/socials" element={<ProtectedRoute><DashboardLayout portal="client"><SocialsStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/studios/experiences" element={<ProtectedRoute><DashboardLayout portal="client"><ExperiencesStudio /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/requests" element={<ProtectedRoute><DashboardLayout portal="client"><Requests /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/progress" element={<ProtectedRoute><DashboardLayout portal="client"><Progress /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/reports" element={<ProtectedRoute><DashboardLayout portal="client"><ClientReports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/files" element={<ProtectedRoute><DashboardLayout portal="client"><Files /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/billing" element={<ProtectedRoute><DashboardLayout portal="client"><Billing /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/messages" element={<ProtectedRoute><DashboardLayout portal="client"><PortalMessages /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/settings" element={<ProtectedRoute><DashboardLayout portal="client"><ClientSettings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/portal/onboarding" element={<ProtectedRoute><ClientOnboarding /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminOverview /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminClients /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/work" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminWorkManager /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminRequestsInbox /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminDocuments /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/templates" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminTemplates /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminReports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/revenue" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminRevenue /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminApplications /></DashboardLayout></ProtectedRoute>} />
            {/* Pipeline removed — leads now handled via Applications */}
            <Route path="/admin/pipeline" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminApplications /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/onboarding" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminOnboardingQueue /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminReviews /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/finance" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminFinance /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/accountant" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminAccountant /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/subscribers" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminSubscribers /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminMessages /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><DashboardLayout portal="admin"><AdminSettings /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <LekoChat />
          </LekoProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
