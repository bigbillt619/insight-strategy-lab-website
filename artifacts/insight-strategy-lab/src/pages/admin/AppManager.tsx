import { useState } from "react";
import { useAllApps, useCreateApp, useUpdateApp, useDeleteApp } from "@/features/apps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { AppItem } from "@/lib/types";

interface AppFormState {
  title: string;
  description: string;
  problem_solved: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  use_case: string;
  results_summary: string;
  published: boolean;
}

const emptyForm: AppFormState = {
  title: "",
  description: "",
  problem_solved: "",
  youtube_url: "",
  thumbnail_url: "",
  category: "",
  use_case: "",
  results_summary: "",
  published: false,
};

function AppForm({
  initial,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: AppFormState;
  submitLabel: string;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (data: AppFormState) => void;
}) {
  const [formData, setFormData] = useState<AppFormState>(initial);
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-4">
        <Input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <Textarea placeholder="What it does (description)" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        <Textarea placeholder="Problem solved" value={formData.problem_solved} onChange={e => setFormData({ ...formData, problem_solved: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="YouTube URL" value={formData.youtube_url} onChange={e => setFormData({ ...formData, youtube_url: e.target.value })} />
          <Input placeholder="Thumbnail URL" value={formData.thumbnail_url} onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })} />
          <Input placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
          <Input placeholder="Use Case" value={formData.use_case} onChange={e => setFormData({ ...formData, use_case: e.target.value })} />
        </div>
        <Textarea placeholder="Results Summary" value={formData.results_summary} onChange={e => setFormData({ ...formData, results_summary: e.target.value })} />
        <div className="flex items-center gap-2">
          <Switch checked={formData.published} onCheckedChange={c => setFormData({ ...formData, published: c })} id="pub-form" />
          <Label htmlFor="pub-form">Published</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(formData)} disabled={!formData.title || pending}>{submitLabel}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function toFormState(app: AppItem): AppFormState {
  return {
    title: app.title,
    description: app.description ?? "",
    problem_solved: app.problem_solved ?? "",
    youtube_url: app.youtube_url ?? "",
    thumbnail_url: app.thumbnail_url ?? "",
    category: app.category ?? "",
    use_case: app.use_case ?? "",
    results_summary: app.results_summary ?? "",
    published: app.published,
  };
}

export function AppManager() {
  const { data: apps = [], isLoading } = useAllApps();
  const createApp = useCreateApp();
  const updateApp = useUpdateApp();
  const deleteApp = useDeleteApp();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = (data: AppFormState) => {
    createApp.mutate({ ...data, sort_order: apps.length }, {
      onSuccess: () => {
        toast({ title: "App created" });
        setIsCreating(false);
      },
      onError: (e) => toast({ title: "Create failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  const handleUpdate = (id: string, data: AppFormState) => {
    updateApp.mutate({ id, ...data }, {
      onSuccess: () => {
        toast({ title: "App updated" });
        setEditingId(null);
      },
      onError: (e) => toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    updateApp.mutate({ id, published }, {
      onSuccess: () => toast({ title: published ? "App published" : "App unpublished" }),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this app? This cannot be undone.")) {
      deleteApp.mutate(id, { onSuccess: () => toast({ title: "App deleted" }) });
    }
  };

  // Reorder by swapping sort_order with the adjacent app.
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= apps.length) return;
    const a = apps[index];
    const b = apps[target];
    updateApp.mutate({ id: a.id, sort_order: b.sort_order });
    updateApp.mutate({ id: b.id, sort_order: a.sort_order }, {
      onSuccess: () => toast({ title: "Order updated" }),
    });
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading apps...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(!isCreating); setEditingId(null); }} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancel" : "Add New App"}
        </Button>
      </div>

      {isCreating && (
        <AppForm
          initial={emptyForm}
          submitLabel={createApp.isPending ? "Saving..." : "Save App"}
          pending={createApp.isPending}
          onCancel={() => setIsCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      <div className="grid gap-4">
        {apps.map((app, i) => (
          <div key={app.id}>
            {editingId === app.id ? (
              <AppForm
                initial={toFormState(app)}
                submitLabel={updateApp.isPending ? "Saving..." : "Save Changes"}
                pending={updateApp.isPending}
                onCancel={() => setEditingId(null)}
                onSubmit={(data) => handleUpdate(app.id, data)}
              />
            ) : (
              <Card className="border-border">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button aria-label="Move down" disabled={i === apps.length - 1} onClick={() => move(i, 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{app.title}</h4>
                      <p className="text-sm text-muted-foreground">{app.category || "Uncategorized"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch checked={app.published} onCheckedChange={(c) => handleTogglePublish(app.id, c)} id={`pub-${app.id}`} />
                      <Label htmlFor={`pub-${app.id}`} className="text-sm">Published</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setEditingId(app.id); setIsCreating(false); }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(app.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
        {apps.length === 0 && !isCreating && <div className="text-center p-8 text-muted-foreground border rounded-lg">No apps configured.</div>}
      </div>
    </div>
  );
}
