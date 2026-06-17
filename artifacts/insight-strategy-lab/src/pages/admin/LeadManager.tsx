import { useState } from "react";
import { useLeads, useUpdateLeadStatus, useUpdateLeadNotes } from "@/features/leads/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Lead, LeadStatus } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";

export function LeadManager() {
  const { data: leads = [], isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const updateNotes = useUpdateLeadNotes();
  const { toast } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    updateStatus.mutate({ lead, status: newStatus }, {
      onSuccess: () => toast({ title: "Status updated" })
    });
  };

  const handleSaveNotes = (leadId: string) => {
    updateNotes.mutate({ leadId, notes }, {
      onSuccess: () => {
        toast({ title: "Notes saved" });
        setNotes("");
        setExpandedId(null);
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading leads...</div>;
  if (leads.length === 0) return <div className="p-8 text-center text-muted-foreground">No leads found.</div>;

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-0 divide-y divide-border">
        {leads.map(lead => (
          <div key={lead.id} className="flex flex-col">
            <div 
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
            >
              <div>
                <h4 className="font-bold text-foreground text-lg">{lead.name}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
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
              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <Select value={lead.status} onValueChange={(val) => handleStatusChange(lead, val as LeadStatus)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
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
                        <dd className="font-medium text-foreground">{lead.business_type || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <dt className="text-muted-foreground">Team Size:</dt>
                        <dd className="font-medium text-foreground">{lead.company_size || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <dt className="text-muted-foreground">Bottleneck:</dt>
                        <dd className="font-medium text-foreground">{lead.biggest_bottleneck || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <dt className="text-muted-foreground">Current Tools:</dt>
                        <dd className="font-medium text-foreground">{lead.current_tools || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <dt className="text-muted-foreground">Revenue:</dt>
                        <dd className="font-medium text-foreground">{lead.revenue_range || "N/A"}</dd>
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
                      onChange={e => setNotes(e.target.value)}
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
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
