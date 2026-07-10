import { useState } from "react";
import { useLocation } from "wouter";
import { signIn } from "@/features/auth/api";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Enter your email first",
        description: "Type your admin email above, then click 'Forgot password?'",
        variant: "destructive",
      });
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We sent a password reset link.",
      });
    } catch (err: any) {
      toast({
        title: "Could not send reset email",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      setLocation("/admin");
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive"
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
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-2">Authorized access only.</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" /> Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
}
