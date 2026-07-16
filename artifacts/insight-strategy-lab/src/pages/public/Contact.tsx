import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Youtube, Facebook, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLead } from "@/features/leads/api";
import { QUALIFIER_FIELDS } from "@/features/leads/qualifiers";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { FadeUp } from "@/components/FadeUp";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  business_type: z.string().optional(),
  company_size: z.string().optional(),
  biggest_bottleneck: z.string().optional(),
  current_tools: z.string().optional(),
  revenue_range: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const SOCIAL_ICONS: Record<string, React.FC<{ className?: string }>> = {
  LinkedIn: ({ className }) => <Linkedin className={className} />,
  YouTube: ({ className }) => <Youtube className={className} />,
  Facebook: ({ className }) => <Facebook className={className} />,
};

export default function Contact() {
  const { toast } = useToast();
  const createLead = useCreateLead();
  const { get } = useContent("contact");
  const { get: getGlobal } = useContent("global");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const socialLinks = [
    { href: getGlobal("social_linkedin"), label: "LinkedIn" },
    { href: getGlobal("social_youtube"), label: "YouTube" },
    { href: getGlobal("social_facebook"), label: "Facebook" },
  ].filter((s) => s.href);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      business_type: "",
      company_size: "",
      biggest_bottleneck: "",
      current_tools: "",
      revenue_range: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    const emptyToNull = (v?: string) => (v && v.length > 0 ? v : null);
    const storedSource = sessionStorage.getItem("isl_lead_source");
    const source = storedSource === "vehicle_qr" ? "vehicle_qr" : "contact_direct";
    createLead.mutate(
      {
        name: data.name,
        email: data.email,
        phone: emptyToNull(data.phone),
        business_type: emptyToNull(data.business_type),
        company_size: emptyToNull(data.company_size),
        biggest_bottleneck: emptyToNull(data.biggest_bottleneck),
        current_tools: emptyToNull(data.current_tools),
        revenue_range: emptyToNull(data.revenue_range),
        message: data.message,
        source,
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem("isl_lead_source");
          toast({ title: "Message Sent", description: "We'll be in touch shortly." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      },
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(25%,-25%)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <FadeUp>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border mb-6" style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}>
              Contact
            </span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5 leading-tight">
              {get("hero_title") || "Let's Talk About Your Operations"}
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              {get("intro") || "Tell us where you are and where you want to go. We'll help you build a plan to get there."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Main content ─────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10">

            {/* Left: info */}
            <div className="space-y-6">
              {/* Contact details */}
              <FadeUp>
                <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                  <h2 className="text-lg font-black text-gray-900 mb-6">Contact Information</h2>
                  <div className="space-y-5">
                    {getGlobal("contact_address") && (
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                          <MapPin className="h-4 w-4" style={{ color: "#2563EB" }} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Location</p>
                          <p className="text-gray-800 font-medium">{getGlobal("contact_address")}</p>
                        </div>
                      </div>
                    )}
                    {getGlobal("contact_phone") && (
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                          <Phone className="h-4 w-4" style={{ color: "#2563EB" }} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-800 font-medium">{getGlobal("contact_phone")}</p>
                        </div>
                      </div>
                    )}
                    {getGlobal("contact_email") && (
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                          <Mail className="h-4 w-4" style={{ color: "#2563EB" }} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email</p>
                          <p className="text-gray-800 font-medium">{getGlobal("contact_email")}</p>
                        </div>
                      </div>
                    )}
                    {socialLinks.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Connect</p>
                        <div className="flex gap-3">
                          {socialLinks.map((s) => {
                            const Icon = SOCIAL_ICONS[s.label];
                            return (
                              <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={s.label}
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                                style={{ background: "rgba(37,99,235,0.08)" }}
                              >
                                {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs font-medium">{s.label[0]}</span>}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>

              {/* What to expect */}
              <FadeUp delay={80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                  <h2 className="text-base font-black text-gray-900 mb-5">What happens next</h2>
                  <div className="space-y-4">
                    {[
                      "We review your inquiry within 1 business day",
                      "We schedule a 30–60 min discovery call",
                      "You receive a tailored assessment and roadmap",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                        <span className="text-sm text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Diagnostic upsell */}
              {get("diagnostic_cta_heading") && (
                <FadeUp delay={160}>
                  <div className="rounded-2xl p-6 border" style={{ background: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.15)" }}>
                    <h2 className="text-base font-bold text-gray-900 mb-2">{get("diagnostic_cta_heading")}</h2>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{get("diagnostic_cta_body")}</p>
                    <Button asChild variant="outline" size="sm" className="font-semibold">
                      <Link href="/diagnostic">
                        {get("diagnostic_cta_button") || "Take the Assessment"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </FadeUp>
              )}
            </div>

            {/* Right: form */}
            <FadeUp delay={120}>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-7">{get("form_heading") || "Send a Message"}</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Phone <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 000-0000" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {QUALIFIER_FIELDS.map((qf) => (
                        <FormField
                          key={qf.name}
                          control={form.control}
                          name={qf.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-gray-700">{qf.label}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {qf.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-gray-700">How can we help?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your current systems and bottlenecks..."
                              className="min-h-[130px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold"
                      style={{ background: "#2563EB", color: "white" }}
                      disabled={createLead.isPending}
                    >
                      {createLead.isPending ? "Sending…" : get("form_submit") || "Send Message"}
                    </Button>
                    <p className="text-center text-xs text-gray-500">No obligation. We respond within 1 business day.</p>
                  </form>
                </Form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
}
