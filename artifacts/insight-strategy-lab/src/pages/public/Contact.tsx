import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLead } from "@/features/leads/api";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIAGNOSTIC_QUESTIONS } from "@/features/diagnostic/questions";
import { ReviewsSection } from "@/components/ReviewsSection";
import { useContent } from "@/features/content/api";

const optionsFor = (key: string) =>
  DIAGNOSTIC_QUESTIONS.find((q) => q.key === key)?.options ?? [];

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

const QUALIFIERS: { name: keyof ContactFormValues; label: string }[] = [
  { name: "business_type", label: "Business type" },
  { name: "company_size", label: "Team size" },
  { name: "biggest_bottleneck", label: "Biggest bottleneck" },
  { name: "current_tools", label: "Current tools" },
  { name: "revenue_range", label: "Annual revenue" },
];

export default function Contact() {
  const { toast } = useToast();
  const createLead = useCreateLead();
  const { get } = useContent("contact");
  const { get: getGlobal } = useContent("global");

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
        source: "contact_direct",
      },
      {
        onSuccess: () => {
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
    <div className="bg-background">
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                {get("hero_title")}
              </h1>
              <p className="text-lg text-muted-foreground mb-10">
                {get("intro")}
              </p>

              <div className="space-y-8">
                {getGlobal("contact_address") && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location</h3>
                    <p className="text-foreground font-medium text-lg">{getGlobal("contact_address")}</p>
                  </div>
                )}
                {getGlobal("contact_phone") && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Phone</h3>
                    <p className="text-foreground font-medium text-lg">{getGlobal("contact_phone")}</p>
                  </div>
                )}
                {getGlobal("contact_email") && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Email</h3>
                    <p className="text-foreground font-medium text-lg">{getGlobal("contact_email")}</p>
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Connect</h3>
                    <div className="flex gap-4">
                      {socialLinks.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium">{s.label}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-primary/5 border border-border rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-foreground mb-2">{get("diagnostic_cta_heading")}</h2>
                <p className="text-muted-foreground mb-4">{get("diagnostic_cta_body")}</p>
                <Button asChild variant="outline">
                  <Link href="/diagnostic">
                    {get("diagnostic_cta_button")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">{get("form_heading")}</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {QUALIFIERS.map((q) => (
                      <FormField
                        key={q.name}
                        control={form.control}
                        name={q.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{q.label}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {optionsFor(q.name).map((o) => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
                        <FormLabel>How can we help?</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about your current systems and bottlenecks..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={createLead.isPending}>
                    {createLead.isPending ? "Sending..." : get("form_submit")}
                  </Button>
                </form>
              </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection heading="What clients say" className="border-t border-border" />
    </div>
  );
}
