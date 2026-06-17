import { Link } from "wouter";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import { useContent } from "@/features/content/api";
import logo from "@/assets/logo.png";

export default function Footer() {
  const { get } = useContent("global");

  const socials = [
    { href: get("social_facebook"), label: "Facebook", icon: Facebook },
    { href: get("social_linkedin"), label: "LinkedIn", icon: Linkedin },
    { href: get("social_youtube"), label: "YouTube", icon: Youtube },
  ].filter((s) => s.href);

  const address = get("contact_address");
  const phone = get("contact_phone");
  const email = get("contact_email");

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/">
              <img src={logo} alt="Insight Strategy Lab" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              {get("footer_tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              {address && <p>{address}</p>}
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </address>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Social</h4>
            <div className="flex space-x-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <s.icon className="h-5 w-5" />
                  <span className="sr-only">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {get("footer_copyright")}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/admin/login" className="hover:text-foreground transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
