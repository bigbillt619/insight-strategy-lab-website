import { ContentGroupForm } from "./ContentGroupForm";
import { GLOBAL_GROUP } from "@/features/content/schema";

export function SiteSettingsManager() {
  return <ContentGroupForm group={GLOBAL_GROUP} />;
}
