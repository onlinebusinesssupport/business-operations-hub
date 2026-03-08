import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Search, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SubscriberRow {
  email: string;
  full_name?: string;
  source: string;
  date: string;
  is_active: boolean;
  popi_consent?: boolean;
  origin: "newsletter" | "contact" | "application";
  id?: string;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);

    const [nlRes, csRes, appRes] = await Promise.all([
      (supabase as any).from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
      supabase.from("contact_submissions").select("email, created_at").order("created_at", { ascending: false }),
      supabase.from("applications").select("email, created_at").order("created_at", { ascending: false }),
    ]);

    const rows: SubscriberRow[] = [];
    const seen = new Set<string>();

    (nlRes.data || []).forEach((s: any) => {
      const key = s.email.toLowerCase();
      seen.add(key);
      rows.push({
        email: s.email,
        source: s.source || "newsletter",
        date: s.subscribed_at,
        is_active: s.is_active,
        origin: "newsletter",
        id: s.id,
      });
    });

    (csRes.data || []).forEach((c: any) => {
      const key = c.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        rows.push({ email: c.email, source: "contact_form", date: c.created_at, is_active: true, origin: "contact" });
      }
    });

    (appRes.data || []).forEach((a: any) => {
      const key = a.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        rows.push({ email: a.email, source: "application", date: a.created_at, is_active: true, origin: "application" });
      }
    });

    setSubscribers(rows);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleActive = async (row: SubscriberRow) => {
    if (row.origin !== "newsletter" || !row.id) return;
    const { error } = await (supabase as any)
      .from("newsletter_subscribers")
      .update({ is_active: !row.is_active, unsubscribed_at: row.is_active ? new Date().toISOString() : null })
      .eq("id", row.id);
    if (!error) {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === row.id ? { ...s, is_active: !s.is_active } : s))
      );
    }
  };

  const sources = useMemo(() => {
    const s = new Set(subscribers.map((r) => r.source));
    return ["all", ...Array.from(s)];
  }, [subscribers]);

  const filtered = useMemo(() => {
    return subscribers.filter((r) => {
      const matchesSearch = r.email.toLowerCase().includes(search.toLowerCase());
      const matchesSource = sourceFilter === "all" || r.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [subscribers, search, sourceFilter]);

  const exportCsv = () => {
    const header = "Email,Source,Date,Active,Origin\n";
    const body = filtered
      .map((r) => `${r.email},${r.source},${format(new Date(r.date), "yyyy-MM-dd")},${r.is_active},${r.origin}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filtered.length} emails exported.` });
  };

  const sourceBadgeColor = (source: string) => {
    switch (source) {
      case "footer": return "default";
      case "media": return "secondary";
      case "contact_form": return "outline";
      case "application": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight flex items-center gap-2">
            <Mail size={22} /> Subscribers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All emails collected across the platform — {subscribers.length} total
          </p>
        </div>
        <Button onClick={exportCsv} size="sm" variant="outline" className="gap-1.5 text-xs">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {sources.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={sourceFilter === s ? "default" : "outline"}
              onClick={() => setSourceFilter(s)}
              className="text-[10px] uppercase tracking-wider h-9"
            >
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">No subscribers found</TableCell>
              </TableRow>
            ) : (
              filtered.map((row, i) => (
                <TableRow key={`${row.email}-${i}`}>
                  <TableCell className="font-medium text-sm">{row.email}</TableCell>
                  <TableCell>
                    <Badge variant={sourceBadgeColor(row.source) as any} className="text-[10px] uppercase tracking-wider">
                      {row.source.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(row.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {row.origin === "newsletter" ? (
                      <Switch checked={row.is_active} onCheckedChange={() => toggleActive(row)} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSubscribers;
