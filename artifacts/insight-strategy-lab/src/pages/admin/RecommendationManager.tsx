import { useState } from "react";
import {
  useRecommendationMap,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from "@/features/diagnostic/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIAGNOSTIC_QUESTIONS, labelForAnswer } from "@/features/diagnostic/questions";
import type { RecommendationMap } from "@/lib/types";

const TRIGGER_TYPES = DIAGNOSTIC_QUESTIONS.map((q) => q.key);

interface RecFormState {
  trigger_type: string;
  trigger_value: string;
  recommended_systems: string;
  rationale: string;
  priority: number;
}

const emptyForm: RecFormState = {
  trigger_type: TRIGGER_TYPES[0],
  trigger_value: "",
  recommended_systems: "",
  rationale: "",
  priority: 1,
};

function optionsFor(triggerType: string) {
  return DIAGNOSTIC_QUESTIONS.find((q) => q.key === triggerType)?.options ?? [];
}

function RecForm({
  initial,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: RecFormState;
  submitLabel: string;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (data: RecFormState) => void;
}) {
  const [formData, setFormData] = useState<RecFormState>(initial);
  const valueOptions = optionsFor(formData.trigger_type);
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Trigger type</Label>
            <Select value={formData.trigger_type} onValueChange={v => setFormData({ ...formData, trigger_type: v, trigger_value: "" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Trigger value</Label>
            <Select value={formData.trigger_value || undefined} onValueChange={v => setFormData({ ...formData, trigger_value: v })}>
              <SelectTrigger><SelectValue placeholder="Select answer value" /></SelectTrigger>
              <SelectContent>
                {valueOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Recommended systems (comma-separated)</Label>
          <Input placeholder="Fitness CRM, Booking Automation" value={formData.recommended_systems} onChange={e => setFormData({ ...formData, recommended_systems: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Why this matters (rationale)</Label>
          <Textarea placeholder="Short explanation shown with the recommendation" value={formData.rationale} onChange={e => setFormData({ ...formData, rationale: e.target.value })} />
        </div>
        <div className="space-y-1 max-w-[160px]">
          <Label className="text-xs">Priority (higher wins)</Label>
          <Input type="number" value={formData.priority} onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(formData)} disabled={!formData.trigger_value || !formData.recommended_systems.trim() || pending}>{submitLabel}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendationManager() {
  const { data: rules = [], isLoading } = useRecommendationMap();
  const createRule = useCreateRecommendation();
  const updateRule = useUpdateRecommendation();
  const deleteRule = useDeleteRecommendation();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const parseSystems = (s: string) =>
    s.split(",").map(x => x.trim()).filter(Boolean);

  const handleCreate = (data: RecFormState) => {
    createRule.mutate(
      { trigger_type: data.trigger_type, trigger_value: data.trigger_value, recommended_systems: parseSystems(data.recommended_systems), rationale: data.rationale || null, priority: data.priority },
      {
        onSuccess: () => { toast({ title: "Rule added" }); setIsCreating(false); },
        onError: (e) => toast({ title: "Create failed", description: (e as Error).message, variant: "destructive" }),
      },
    );
  };

  const handleUpdate = (id: string, data: RecFormState) => {
    updateRule.mutate(
      { id, trigger_type: data.trigger_type, trigger_value: data.trigger_value, recommended_systems: parseSystems(data.recommended_systems), rationale: data.rationale || null, priority: data.priority },
      {
        onSuccess: () => { toast({ title: "Rule updated" }); setEditingId(null); },
        onError: (e) => toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" }),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this rule? This cannot be undone.")) {
      deleteRule.mutate(id, { onSuccess: () => toast({ title: "Rule deleted" }) });
    }
  };

  const toFormState = (r: RecommendationMap): RecFormState => ({
    trigger_type: r.trigger_type,
    trigger_value: r.trigger_value,
    recommended_systems: r.recommended_systems.join(", "),
    rationale: r.rationale ?? "",
    priority: r.priority,
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading rules...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground max-w-2xl">
          These rules drive the diagnostic recommendation. When a visitor's answer
          matches a trigger, its systems are suggested (highest priority first).
        </p>
        <Button onClick={() => { setIsCreating(!isCreating); setEditingId(null); }} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancel" : "Add Rule"}
        </Button>
      </div>

      {isCreating && (
        <RecForm
          initial={emptyForm}
          submitLabel={createRule.isPending ? "Saving..." : "Save Rule"}
          pending={createRule.isPending}
          onCancel={() => setIsCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id}>
            {editingId === rule.id ? (
              <RecForm
                initial={toFormState(rule)}
                submitLabel={updateRule.isPending ? "Saving..." : "Save Changes"}
                pending={updateRule.isPending}
                onCancel={() => setEditingId(null)}
                onSubmit={(data) => handleUpdate(rule.id, data)}
              />
            ) : (
              <Card className="border-border">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{rule.trigger_type}</span>
                      <span className="text-muted-foreground">=</span>
                      <span className="font-semibold text-foreground">{labelForAnswer(rule.trigger_type as never, rule.trigger_value)}</span>
                      <span className="ml-2 text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">priority {rule.priority}</span>
                    </div>
                    <p className="text-sm text-foreground mt-2">{rule.recommended_systems.join(", ")}</p>
                    {rule.rationale && <p className="text-sm text-muted-foreground italic mt-1">{rule.rationale}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => { setEditingId(rule.id); setIsCreating(false); }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(rule.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
        {rules.length === 0 && !isCreating && <div className="text-center p-8 text-muted-foreground border rounded-lg">No rules configured.</div>}
      </div>
    </div>
  );
}
