import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClientSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CREATE_NEW_VALUE = "__create_new_invite__";

const ClientSelect = ({ value, onValueChange, placeholder = "Select client", className }: ClientSelectProps) => {
  const navigate = useNavigate();

  const { data: clients = [] } = useQuery({
    queryKey: ["client-select-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");
      return data || [];
    },
  });

  const handleChange = (val: string) => {
    if (val === CREATE_NEW_VALUE) {
      navigate("/admin/onboarding");
      return;
    }
    onValueChange(val);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clients.map((c: any) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
        {clients.length > 0 && <SelectSeparator />}
        <SelectItem value={CREATE_NEW_VALUE}>
          <span className="flex items-center gap-2 text-primary font-medium">
            <UserPlus size={14} /> + Create New &amp; Invite
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ClientSelect;
