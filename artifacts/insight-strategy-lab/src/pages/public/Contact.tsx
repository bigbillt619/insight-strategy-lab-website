import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLead } from "@/features/leads/api";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const createLead = useCreateLead();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    createLead.mutate(
      { ...data, source: "contact_direct" },
      {
        onSuccess: () => {
          toast({ title: "Message Sent", description: "We'll be in touch shortly." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        }
      }
    );
  }

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              Ready to remove operational friction and build a system scoped to your business? Reach out directly.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location</h3>
                <p className="text-foreground font-medium text-lg">Murrieta, CA 92563</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Phone</h3>
                <p className="text-foreground font-medium text-lg">(951) 528-1192</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Connect</h3>
                <div className="flex gap-4">
                  <a href="https://www.linkedin.com/in/billtamayo/" target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium">LinkedIn</a>
                  <a href="https://www.youtube.com/@InsightStrategyLab" target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium">YouTube</a>
                  <a href="https://www.facebook.com/InsightStrategyLab" target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium">Facebook</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
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
                  {createLead.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}
