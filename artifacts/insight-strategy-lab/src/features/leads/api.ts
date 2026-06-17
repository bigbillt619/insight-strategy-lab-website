import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  Lead,
  LeadEvent,
  LeadInput,
  LeadStatus,
} from "@/lib/types";

export const leadsKey = ["leads"] as const;
export const leadEventsKey = (leadId: string) =>
  ["lead_events", leadId] as const;

/**
 * Public: create a lead (from the diagnostic intake or the direct contact
 * form). Also writes the initial "created" entry to the lead timeline.
 * Returns the created lead so the caller can link a diagnostic result.
 */
export function useCreateLead() {
  return useMutation({
    mutationFn: async (input: LeadInput): Promise<Lead> => {
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...input, status: "New" })
        .select()
        .single();
      if (error) throw error;
      const lead = data as Lead;

      await supabase.from("lead_events").insert({
        lead_id: lead.id,
        event_type: "created",
        to_status: "New",
      });

      return lead;
    },
  });
}

/* ---------------- Admin ---------------- */

export function useLeads() {
  return useQuery({
    queryKey: leadsKey,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });
}

export function useLeadEvents(leadId: string) {
  return useQuery({
    queryKey: leadEventsKey(leadId),
    enabled: !!leadId,
    queryFn: async (): Promise<LeadEvent[]> => {
      const { data, error } = await supabase
        .from("lead_events")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LeadEvent[];
    },
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lead,
      status,
    }: {
      lead: Lead;
      status: LeadStatus;
    }) => {
      const { data, error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", lead.id)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("lead_events").insert({
        lead_id: lead.id,
        event_type: "status_changed",
        from_status: lead.status,
        to_status: status,
      });

      return data as Lead;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: leadsKey });
      qc.invalidateQueries({ queryKey: leadEventsKey(vars.lead.id) });
    },
  });
}

export function useUpdateLeadNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadId,
      notes,
    }: {
      leadId: string;
      notes: string;
    }) => {
      const { data, error } = await supabase
        .from("leads")
        .update({ notes })
        .eq("id", leadId)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("lead_events").insert({
        lead_id: leadId,
        event_type: "note_added",
        note: notes,
      });

      return data as Lead;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: leadsKey });
      qc.invalidateQueries({ queryKey: leadEventsKey(vars.leadId) });
    },
  });
}
