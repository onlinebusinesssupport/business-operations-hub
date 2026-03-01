import { supabase } from "@/integrations/supabase/client";

interface LogActivityParams {
  client_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
}

export async function logActivity({ client_id, action, entity_type, entity_id, details }: LogActivityParams) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("activity_log").insert({
    client_id: client_id || null,
    actor_id: user?.id || null,
    action,
    entity_type,
    entity_id: entity_id || null,
    details: details || {},
  } as any);
}
