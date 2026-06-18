import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import BrandStyle from "@/features/content/BrandStyle";

import Home from "@/pages/public/Home";
import Apps from "@/pages/public/Apps";
import Services from "@/pages/public/Services";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Diagnostic from "@/pages/public/Diagnostic";
import VehicleQrLanding from "@/pages/public/VehicleQrLanding";

import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={Login} />
      
      {/* Admin Routes wrapped in Layout */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      {/* Hidden QR-only landing — rendered standalone, no Navbar/Footer */}
      <Route path="/vehicle-qr-code-1" component={VehicleQrLanding} />

      {/* Public Routes wrapped in Layout */}
      <Route>
        <PublicLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/apps" component={Apps} />
            <Route path="/services" component={Services} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/diagnostic" component={Diagnostic} />
            <Route component={NotFound} />
          </Switch>
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrandStyle />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
