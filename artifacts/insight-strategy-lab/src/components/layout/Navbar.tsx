import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const socials = [
  { href: "https://www.facebook.com/InsightStrategyLab", label: "Facebook", icon: Facebook },
  { href: "https://www.linkedin.com/in/billtamayo/", label: "LinkedIn", icon: Linkedin },
  { href: "https://www.youtube.com/@InsightStrategyLab", label: "YouTube", icon: Youtube },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/apps", label: "Apps in Production" },
    { href: "/services", label: "Services & Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Link href="/">
          <img src={logo} alt="Insight Strategy Lab" className="h-12 md:h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 pl-2 border-l border-border/60">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <Button asChild variant="default" size="sm" className="ml-2">
            <Link href="/diagnostic">Free Strategy Call</Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-4 pt-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <Button asChild variant="default" className="w-full mt-4" onClick={() => setIsOpen(false)}>
            <Link href="/diagnostic">Free Strategy Call</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
