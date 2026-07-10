import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";
import logo from "@/assets/logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
      if (!data.session) {
        toast({
          title: "Recovery link expired",
          description: "Request a new password reset email and try again.",
          variant: "destructive",
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You can now sign in." });
      setLocation("~/admin/login");
    } catch (err: any) {
      toast({
        title: "Could not update password",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-32 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Choose a new password for your admin account.
          </p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!ready}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={!ready}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !ready}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
            <KeyRound className="h-4 w-4" /> Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
}
