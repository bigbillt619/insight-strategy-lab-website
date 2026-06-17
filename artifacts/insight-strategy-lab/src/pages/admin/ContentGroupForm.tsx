import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useContentBlocks, useUpsertContent, uploadMedia } from "@/features/content/api";
import type { ContentField, ContentGroup } from "@/features/content/schema";
import type { ContentBlockInput } from "@/features/content/types";

function MediaField({
  field,
  page,
  value,
  onChange,
}: {
  field: ContentField;
  page: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(page, field.key, file);
      onChange(url);
      toast({ title: "Uploaded" });
    } catch (e) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder={`Paste a ${field.type} URL or upload below`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={field.type === "image" ? "image/*" : "video/*"}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading..." : `Upload ${field.type}`}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Clear
          </Button>
        )}
      </div>
      {value && field.type === "image" && (
        <img src={value} alt="" className="h-24 w-auto rounded border border-border object-contain" />
      )}
      {value && field.type === "video" && (
        <p className="text-xs text-muted-foreground break-all">{value}</p>
      )}
    </div>
  );
}

function FieldInput({
  field,
  page,
  value,
  onChange,
}: {
  field: ContentField;
  page: string;
  value: string;
  onChange: (v: string) => void;
}) {
  switch (field.type) {
    case "textarea":
      return <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />;
    case "list":
      return (
        <Textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="One item per line"
        />
      );
    case "color":
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded border border-border bg-transparent p-1"
          />
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000 (empty = theme default)" className="max-w-[200px]" />
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              Reset
            </Button>
          )}
        </div>
      );
    case "number":
      return (
        <Input
          type="number"
          step="0.1"
          min="0.5"
          max="3"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-[160px]"
        />
      );
    case "image":
    case "video":
      return <MediaField field={field} page={page} value={value} onChange={onChange} />;
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function ContentGroupForm({ group }: { group: ContentGroup }) {
  const { data: blocks = [], isLoading } = useContentBlocks();
  const upsert = useUpsertContent();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const seededFor = useRef<string | null>(null);

  // Rows that already exist as overrides for this page, keyed by content key.
  const existing = useRef<Record<string, true>>({});

  useEffect(() => {
    if (isLoading) return;
    if (seededFor.current === group.page) return;
    const rows: Record<string, string> = {};
    for (const b of blocks) {
      if (b.page === group.page) rows[b.key] = b.value;
    }
    existing.current = Object.keys(rows).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {} as Record<string, true>);
    const initial: Record<string, string> = {};
    for (const f of group.fields) {
      // Use a stored override even when it is empty (an intentional clear);
      // fall back to the in-code default only when no row exists.
      initial[f.key] = f.key in rows ? rows[f.key] : f.default;
    }
    setValues(initial);
    seededFor.current = group.page;
  }, [isLoading, blocks, group]);

  // Re-seed when the selected group changes.
  useEffect(() => {
    seededFor.current = null;
  }, [group.page]);

  const handleSave = () => {
    // Persist overrides only: write a row when the value differs from the
    // in-code default, or when an override row already exists (so edits back to
    // the default, and intentional clears, are preserved).
    const inputs: ContentBlockInput[] = group.fields
      .filter((f) => (values[f.key] ?? "") !== f.default || existing.current[f.key])
      .map((f) => ({
        page: group.page,
        key: f.key,
        label: f.label,
        type: f.type,
        value: values[f.key] ?? "",
      }));
    if (inputs.length === 0) {
      toast({ title: "No changes to save" });
      return;
    }
    upsert.mutate(inputs, {
      onSuccess: () => toast({ title: "Saved", description: "Your changes are live on the site." }),
      onError: (e) => toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading content...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
          <div className="grid grid-cols-1 gap-6">
            {group.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label className="text-sm font-medium">{f.label}</Label>
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                <FieldInput
                  field={f}
                  page={group.page}
                  value={values[f.key] ?? ""}
                  onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave} disabled={upsert.isPending} size="lg" className="shadow-lg">
          {upsert.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
