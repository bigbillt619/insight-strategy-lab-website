import { useIsAdmin, signOut } from "@/features/auth/api";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useIsAdmin();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // A session alone is not enough — only owners on the app_admins allowlist
    // may enter the admin shell. Sign out any non-owner session and return to
    // the public site. Use the "~" prefix so navigation ignores the nested
    // "/admin" router base (otherwise it resolves to "/admin/...").
    if (!loading && !isAdmin) {
      signOut().finally(() => setLocation("~/"));
    }
  }, [loading, isAdmin, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-6 w-auto" />
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-semibold text-sm hidden sm:block">Command Center</span>
        </Link>
        <button 
          onClick={async () => {
            await signOut();
            // "~" navigates relative to the root router, escaping the nested
            // "/admin" base so the owner lands back on the public home page.
            setLocation("~/");
          }} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
