import { useState } from "react";
import { useLeads, useUpdateLeadStatus, useUpdateLeadNotes, useLeadEvents } from "@/features/leads/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Lead, LeadStatus, LeadEvent } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";
import { labelForAnswer } from "@/features/diagnostic/questions";

const STATUS_VARIANTS: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  Contacted: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  Qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  Closed: "bg-muted text-muted-foreground",
};

function eventLabel(e: LeadEvent): string {
  switch (e.event_type) {
    case "created":
      return "Lead created";
    case "status_changed":
      return `Status changed${e.from_status ? ` from ${e.from_status}` : ""} to ${e.to_status}`;
    case "note_added":
      return `Note added${e.note ? `: "${e.note}"` : ""}`;
    default:
      return e.event_type;
  }
}

function LeadTimeline({ leadId }: { leadId: string }) {
  const { data: events = [], isLoading } = useLeadEvents(leadId);
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading activity...</p>;
  if (events.length === 0) return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  return (
    <ol className="space-y-3">
      {events.map((e) => (
        <li key={e.id} className="flex gap-3 text-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
          <div>
            <p className="text-foreground">{eventLabel(e)}</p>
            <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function LeadManager() {
  const { data: leads = [], isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const updateNotes = useUpdateLeadNotes();
  const { toast } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "All">("All");

  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    updateStatus.mutate({ lead, status: newStatus }, {
      onSuccess: () => toast({ title: "Status updated" }),
      onError: (e) => toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  const handleSaveNotes = (leadId: string) => {
    updateNotes.mutate({ leadId, notes }, {
      onSuccess: () => {
        toast({ title: "Notes saved" });
        setNotes("");
      },
      onError: (e) => toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading leads...</div>;

  const visible = filter === "All" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["All", ...LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
            {s !== "All" && (
              <span className="ml-1.5 opacity-70">{leads.filter((l) => l.status === s).length}</span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">No leads in this view.</div>
      ) : (
        <Card className="border-border shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            {visible.map((lead) => (
              <div key={lead.id} className="flex flex-col">
                <div
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => { setExpandedId(expandedId === lead.id ? null : lead.id); setNotes(""); }}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-foreground text-lg">{lead.name}</h4>
                      <Badge className={`${STATUS_VARIANTS[lead.status]} border-0`}>{lead.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span>{lead.email}</span>
                      {lead.phone && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>{lead.phone}</span>
                        </>
                      )}
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="uppercase text-xs tracking-wider font-semibold text-accent">{lead.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    {lead.status !== "Contacted" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(lead, "Contacted")}>Mark Contacted</Button>
                    )}
                    {lead.status !== "Qualified" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(lead, "Qualified")}>Mark Qualified</Button>
                    )}
                    <Select value={lead.status} onValueChange={(val) => handleStatusChange(lead, val as LeadStatus)}>
                      <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground w-24 text-right">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {expandedId === lead.id && (
                  <div className="p-6 bg-muted/20 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Lead Details</h5>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-border/50 pb-1">
                            <dt className="text-muted-foreground">Business Type:</dt>
                            <dd className="font-medium text-foreground">{labelForAnswer("business_type", lead.business_type ?? undefined) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between border-b border-border/50 pb-1">
                            <dt className="text-muted-foreground">Team Size:</dt>
                            <dd className="font-medium text-foreground">{labelForAnswer("company_size", lead.company_size ?? undefined) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between border-b border-border/50 pb-1">
                            <dt className="text-muted-foreground">Bottleneck:</dt>
                            <dd className="font-medium text-foreground">{labelForAnswer("biggest_bottleneck", lead.biggest_bottleneck ?? undefined) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between border-b border-border/50 pb-1">
                            <dt className="text-muted-foreground">Current Tools:</dt>
                            <dd className="font-medium text-foreground">{labelForAnswer("current_tools", lead.current_tools ?? undefined) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between border-b border-border/50 pb-1">
                            <dt className="text-muted-foreground">Revenue:</dt>
                            <dd className="font-medium text-foreground">{labelForAnswer("revenue_range", lead.revenue_range ?? undefined) || "N/A"}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Message</h5>
                        <p className="text-sm text-foreground bg-background border border-border rounded-lg p-3 h-[120px] overflow-y-auto">
                          {lead.message || "No message provided."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Admin Notes</h5>
                        {lead.notes && (
                          <div className="mb-4 text-sm text-foreground bg-background border border-border rounded-lg p-3 whitespace-pre-wrap">
                            {lead.notes}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a new note..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <Button
                            className="self-end"
                            onClick={() => handleSaveNotes(lead.id)}
                            disabled={!notes.trim() || updateNotes.isPending}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Activity Timeline</h5>
                        <LeadTimeline leadId={lead.id} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
