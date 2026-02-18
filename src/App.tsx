import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Client Portal */}
          <Route path="/portal" element={<PortalLayout><PortalDashboard /></PortalLayout>} />
          <Route path="/portal/active-work" element={<PortalLayout><ActiveWork /></PortalLayout>} />
          <Route path="/portal/requests" element={<PortalLayout><Requests /></PortalLayout>} />
          <Route path="/portal/documents" element={<PortalLayout><Documents /></PortalLayout>} />
          <Route path="/portal/updates" element={<PortalLayout><Updates /></PortalLayout>} />
          <Route path="/portal/account" element={<PortalLayout><Account /></PortalLayout>} />
          {/* Admin Back Office */}
          <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
          <Route path="/admin/clients" element={<AdminLayout><AdminClients /></AdminLayout>} />
          <Route path="/admin/work" element={<AdminLayout><AdminWorkManager /></AdminLayout>} />
          <Route path="/admin/requests" element={<AdminLayout><AdminRequestsInbox /></AdminLayout>} />
          <Route path="/admin/documents" element={<AdminLayout><AdminDocuments /></AdminLayout>} />
          <Route path="/admin/templates" element={<AdminLayout><AdminTemplates /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
