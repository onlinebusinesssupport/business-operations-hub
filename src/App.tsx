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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portal" element={<PortalLayout><PortalDashboard /></PortalLayout>} />
          <Route path="/portal/active-work" element={<PortalLayout><ActiveWork /></PortalLayout>} />
          <Route path="/portal/requests" element={<PortalLayout><Requests /></PortalLayout>} />
          <Route path="/portal/documents" element={<PortalLayout><Documents /></PortalLayout>} />
          <Route path="/portal/updates" element={<PortalLayout><Updates /></PortalLayout>} />
          <Route path="/portal/account" element={<PortalLayout><Account /></PortalLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
