import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContentGroupForm } from "./ContentGroupForm";
import { PAGE_GROUPS } from "@/features/content/schema";

export function PageContentManager() {
  const [page, setPage] = useState(PAGE_GROUPS[0].page);
  const group = PAGE_GROUPS.find((g) => g.page === page) ?? PAGE_GROUPS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Label className="text-sm">Page</Label>
        <Select value={page} onValueChange={setPage}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_GROUPS.map((g) => (
              <SelectItem key={g.page} value={g.page}>
                {g.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ContentGroupForm key={group.page} group={group} />
    </div>
  );
}
