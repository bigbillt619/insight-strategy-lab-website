import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeads } from "@/features/leads/api";
import { useAllApps } from "@/features/apps/api";
import { useRecommendationMap } from "@/features/diagnostic/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Database, GitMerge } from "lucide-react";
import { LeadManager } from "./LeadManager";
import { AppManager } from "./AppManager";
import { RecommendationManager } from "./RecommendationManager";
import { SiteSettingsManager } from "./SiteSettingsManager";
import { PageContentManager } from "./PageContentManager";

export default function Dashboard() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: apps = [], isLoading: appsLoading } = useAllApps();
  const { data: recMap = [], isLoading: mapLoading } = useRecommendationMap();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your pipeline, systems, and social proof.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{leadsLoading ? "-" : leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Apps</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{appsLoading ? "-" : apps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Map Rules</CardTitle>
            <GitMerge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{mapLoading ? "-" : recMap.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 flex-wrap">
          <TabsTrigger value="leads" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Leads Pipeline</TabsTrigger>
          <TabsTrigger value="apps" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Apps Manager</TabsTrigger>
          <TabsTrigger value="recmap" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Recommendation Map</TabsTrigger>
          <TabsTrigger value="pages" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Page Content</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="m-0">
          <LeadManager />
        </TabsContent>

        <TabsContent value="apps" className="m-0">
          <AppManager />
        </TabsContent>

        <TabsContent value="recmap" className="m-0">
          <RecommendationManager />
        </TabsContent>

        <TabsContent value="pages" className="m-0">
          <PageContentManager />
        </TabsContent>

        <TabsContent value="settings" className="m-0">
          <SiteSettingsManager />
        </TabsContent>

      </Tabs>
    </div>
  );
}
