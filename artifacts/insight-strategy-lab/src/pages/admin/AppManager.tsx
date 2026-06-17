import { useState } from "react";
import { useAllApps, useCreateApp, useUpdateApp, useDeleteApp } from "@/features/apps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AppManager() {
  const { data: apps = [], isLoading } = useAllApps();
  const createApp = useCreateApp();
  const updateApp = useUpdateApp();
  const deleteApp = useDeleteApp();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", youtube_url: "", category: "", use_case: "", results_summary: "", published: false });

  const handleCreate = () => {
    createApp.mutate({ ...formData, sort_order: apps.length }, {
      onSuccess: () => {
        toast({ title: "App created" });
        setIsCreating(false);
        setFormData({ title: "", description: "", youtube_url: "", category: "", use_case: "", results_summary: "", published: false });
      }
    });
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    updateApp.mutate({ id, published }, {
      onSuccess: () => toast({ title: published ? "App published" : "App unpublished" })
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteApp.mutate(id, {
        onSuccess: () => toast({ title: "App deleted" })
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading apps...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancel" : "Add New App"}
        </Button>
      </div>

      {isCreating && (
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg">New Application</h3>
            <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="YouTube URL" value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} />
              <Input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <Input placeholder="Use Case" value={formData.use_case} onChange={e => setFormData({...formData, use_case: e.target.value})} />
              <Input placeholder="Results Summary" value={formData.results_summary} onChange={e => setFormData({...formData, results_summary: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published} onCheckedChange={c => setFormData({...formData, published: c})} id="pub" />
              <Label htmlFor="pub">Publish immediately</Label>
            </div>
            <Button onClick={handleCreate} disabled={!formData.title || createApp.isPending}>Save App</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {apps.map(app => (
          <Card key={app.id} className="border-border">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg">{app.title}</h4>
                <p className="text-sm text-muted-foreground">{app.category || "Uncategorized"}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={app.published} onCheckedChange={(c) => handleTogglePublish(app.id, c)} id={`pub-${app.id}`} />
                  <Label htmlFor={`pub-${app.id}`} className="text-sm">Published</Label>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(app.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {apps.length === 0 && !isCreating && <div className="text-center p-8 text-muted-foreground border rounded-lg">No apps configured.</div>}
      </div>
    </div>
  );
}
