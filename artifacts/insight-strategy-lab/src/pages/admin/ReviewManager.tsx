import { useState } from "react";
import { useAllReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/features/reviews/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Review } from "@/lib/types";

interface ReviewFormState {
  name: string;
  rating: number;
  text: string;
  source: string;
  published: boolean;
}

const emptyForm: ReviewFormState = { name: "", rating: 5, text: "", source: "google", published: true };

function ReviewForm({
  initial,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: ReviewFormState;
  submitLabel: string;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (data: ReviewFormState) => void;
}) {
  const [formData, setFormData] = useState<ReviewFormState>(initial);
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Reviewer name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Source (e.g. google)" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} />
        </div>
        <Textarea placeholder="Review text" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} />
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Rating</Label>
            <Select value={String(formData.rating)} onValueChange={v => setFormData({ ...formData, rating: Number(v) })}>
              <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={formData.published} onCheckedChange={c => setFormData({ ...formData, published: c })} id="rev-pub" />
            <Label htmlFor="rev-pub">Published</Label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(formData)} disabled={!formData.name || !formData.text || pending}>{submitLabel}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewManager() {
  const { data: reviews = [], isLoading } = useAllReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = (data: ReviewFormState) => {
    createReview.mutate({ ...data, sort_order: reviews.length }, {
      onSuccess: () => { toast({ title: "Review added" }); setIsCreating(false); },
      onError: (e) => toast({ title: "Create failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  const handleUpdate = (id: string, data: ReviewFormState) => {
    updateReview.mutate({ id, ...data }, {
      onSuccess: () => { toast({ title: "Review updated" }); setEditingId(null); },
      onError: (e) => toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    updateReview.mutate({ id, published }, {
      onSuccess: () => toast({ title: published ? "Review published" : "Review hidden" }),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review? This cannot be undone.")) {
      deleteReview.mutate(id, { onSuccess: () => toast({ title: "Review deleted" }) });
    }
  };

  const toFormState = (r: Review): ReviewFormState => ({
    name: r.name, rating: r.rating, text: r.text, source: r.source, published: r.published,
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(!isCreating); setEditingId(null); }} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancel" : "Add Review"}
        </Button>
      </div>

      {isCreating && (
        <ReviewForm
          initial={emptyForm}
          submitLabel={createReview.isPending ? "Saving..." : "Save Review"}
          pending={createReview.isPending}
          onCancel={() => setIsCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id}>
            {editingId === review.id ? (
              <ReviewForm
                initial={toFormState(review)}
                submitLabel={updateReview.isPending ? "Saving..." : "Save Changes"}
                pending={updateReview.isPending}
                onCancel={() => setEditingId(null)}
                onSubmit={(data) => handleUpdate(review.id, data)}
              />
            ) : (
              <Card className="border-border">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold">{review.name}</h4>
                      <span className="text-accent text-sm" aria-hidden>
                        {"\u2605".repeat(Math.max(1, Math.min(5, review.rating)))}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{review.source}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic mt-2">"{review.text}"</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch checked={review.published} onCheckedChange={(c) => handleTogglePublish(review.id, c)} id={`rev-${review.id}`} />
                      <Label htmlFor={`rev-${review.id}`} className="text-sm">Published</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setEditingId(review.id); setIsCreating(false); }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
        {reviews.length === 0 && !isCreating && <div className="text-center p-8 text-muted-foreground border rounded-lg">No reviews yet.</div>}
      </div>
    </div>
  );
}
