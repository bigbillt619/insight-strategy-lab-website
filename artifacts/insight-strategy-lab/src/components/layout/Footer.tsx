import { Link } from "wouter";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/">
              <img src={logo} alt="Insight Strategy Lab" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Helping mission-driven organizations transform through people-first innovation, modular agentic workflows, and performance-driven architecture.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>Murrieta, CA 92563</p>
              <p>(951) 528-1192</p>
            </address>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Social</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/InsightStrategyLab" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.linkedin.com/in/billtamayo/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/@InsightStrategyLab" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            Copyright © 2026 Insight Strategy Lab - All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/admin/login" className="hover:text-foreground transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
