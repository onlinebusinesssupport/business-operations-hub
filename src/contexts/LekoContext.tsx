import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LekoInsight {
  type: "risk" | "opportunity" | "action" | "forecast";
  title: string;
  body: string;
  action: { label: string; route: string } | null;
  severity: "critical" | "warning" | "info" | "positive";
}

interface LekoContextType {
  insights: LekoInsight[];
  isLoading: boolean;
  lastPage: string;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  refreshInsights: (page: string, data: Record<string, any>) => Promise<void>;
}

const LekoContext = createContext<LekoContextType>({
  insights: [],
  isLoading: false,
  lastPage: "",
  panelOpen: false,
  setPanelOpen: () => {},
  refreshInsights: async () => {},
});

export const useLeko = () => useContext(LekoContext);

export const LekoProvider = ({ children }: { children: ReactNode }) => {
  const [insights, setInsights] = useState<LekoInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const { user } = useAuth();

  const refreshInsights = useCallback(async (page: string, data: Record<string, any>) => {
    if (!user) return;
    setIsLoading(true);
    setLastPage(page);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leko-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ page, data }),
        }
      );

      if (!resp.ok) {
        console.error("LEKO insights error:", resp.status);
        setInsights([{
          type: "info",
          title: "Temporarily unavailable",
          body: "LEKO intelligence is refreshing. Try again in a moment.",
          action: null,
          severity: "info",
        }]);
        return;
      }

      const result = await resp.json();
      setInsights(result.insights || []);
    } catch (e) {
      console.error("LEKO fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <LekoContext.Provider value={{ insights, isLoading, lastPage, panelOpen, setPanelOpen, refreshInsights }}>
      {children}
    </LekoContext.Provider>
  );
};
