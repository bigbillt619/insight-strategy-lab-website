import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DIAGNOSTIC_QUESTIONS, type DiagnosticQuestion } from "@/features/diagnostic/questions";
import { useRecommendationMap, computeRecommendation, useSaveDiagnosticResult } from "@/features/diagnostic/api";
import { useCreateLead } from "@/features/leads/api";
import { useContent } from "@/features/content/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

const optionsFor = (key: string) =>
  DIAGNOSTIC_QUESTIONS.find((q) => q.key === key)?.options ?? [];

const QUALIFIERS: { key: DiagnosticQuestion["key"]; label: string }[] = [
  { key: "business_type", label: "Business type" },
  { key: "company_size", label: "Team size" },
  { key: "biggest_bottleneck", label: "Biggest bottleneck" },
  { key: "current_tools", label: "Current tools" },
  { key: "revenue_range", label: "Annual revenue" },
];

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { data: mapData = [], isLoading: mapLoading } = useRecommendationMap();
  const saveResult = useSaveDiagnosticResult();
  const createLead = useCreateLead();
  const { get } = useContent("diagnostic");

  const isComplete = step === DIAGNOSTIC_QUESTIONS.length;
  const showLeadForm = step === DIAGNOSTIC_QUESTIONS.length + 1;
  const isFinished = step > DIAGNOSTIC_QUESTIONS.length + 1;

  // The recommendation is calculated when they finish the questions
  const recommendation = useMemo(() => {
    if (!isComplete && !showLeadForm && !isFinished) return null;
    return computeRecommendation(answers, mapData);
  }, [isComplete, showLeadForm, isFinished, answers, mapData]);

  // Structured intake schema — qualifiers are prefilled from the diagnostic
  // answers (and remain editable) so the lead carries the full context.
  const leadSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    business_type: z.string().optional(),
    company_size: z.string().optional(),
    biggest_bottleneck: z.string().optional(),
    current_tools: z.string().optional(),
    revenue_range: z.string().optional(),
    message: z.string().min(10, "Please share a little more detail"),
  });

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
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

  // Prefill the qualifier selects from the diagnostic answers exactly once when
  // the intake step is reached. Using reset (rather than the controlled `values`
  // prop) seeds the fields without re-syncing over the user's subsequent edits.
  const prefilled = useRef(false);
  const onIntakeStep = isComplete || showLeadForm;
  useEffect(() => {
    if (onIntakeStep && !prefilled.current) {
      prefilled.current = true;
      form.reset({
        name: "",
        email: "",
        phone: "",
        message: "",
        business_type: answers.business_type ?? "",
        company_size: answers.company_size ?? "",
        biggest_bottleneck: answers.biggest_bottleneck ?? "",
        current_tools: answers.current_tools ?? "",
        revenue_range: answers.revenue_range ?? "",
      });
    }
  }, [onIntakeStep, answers, form]);

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(s => s + 1), 300); // Auto advance
  };

  const handleLeadSubmit = async (data: z.infer<typeof leadSchema>) => {
    if (!recommendation) return;
    setSubmitError(null);

    const emptyToNull = (v?: string) => (v && v.length > 0 ? v : null);
    try {
      const lead = await createLead.mutateAsync({
        name: data.name,
        email: data.email,
        phone: emptyToNull(data.phone),
        message: data.message,
        source: "diagnostic",
        business_type: emptyToNull(data.business_type),
        company_size: emptyToNull(data.company_size),
        biggest_bottleneck: emptyToNull(data.biggest_bottleneck),
        current_tools: emptyToNull(data.current_tools),
        revenue_range: emptyToNull(data.revenue_range),
      });

      // The lead is the critical capture; persisting the diagnostic detail is
      // best-effort, so don't block the confirmation on it.
      try {
        await saveResult.mutateAsync({
          lead_id: lead.id,
          answers,
          recommended_systems: recommendation
        });
      } catch (err) {
        console.error("Failed to save diagnostic result (lead was captured):", err);
      }

      setStep(s => s + 1); // Move to finished state
    } catch {
      setSubmitError(
        "Something went wrong submitting your audit. Please try again, or reach out to us directly."
      );
    }
  };

  // 1. Loading state
  if (mapLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );

  // 2. Finished state
  if (isFinished) {
    return (
      <div className="py-24 bg-background min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">{get("finished_heading")}</h2>
          <p className="text-muted-foreground mb-8">
            {get("finished_body")}
          </p>
          <Button asChild variant="outline">
            <Link href="/">{get("finished_button")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 3. Recommendation + Lead Capture
  if (showLeadForm || isComplete) {
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {get("report_label")}
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {get("report_opportunity_prefix")} {recommendation?.primary}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed border-l-4 border-accent pl-6">
              "{recommendation?.why}"
            </p>
            
            <div className="bg-secondary/50 rounded-xl p-6">
               <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">{get("report_also_consider")}</h4>
               <ul className="space-y-2">
                 {recommendation?.also_consider.map((sys, i) => (
                   <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                     <CheckCircle2 className="h-4 w-4 text-primary" /> {sys}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <div className="bg-background border border-border rounded-3xl p-8 md:p-12">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">{get("form_heading")}</h2>
              <p className="text-muted-foreground mb-8">
                {get("form_body")}
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLeadSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {QUALIFIERS.map((q) => (
                      <FormField
                        key={q.key}
                        control={form.control}
                        name={q.key}
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
                                {optionsFor(q.key).map((o) => (
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
                        <FormLabel>Anything else we should know?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={get("form_message_placeholder")}
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {submitError && (
                    <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {submitError}
                    </p>
                  )}
                  <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={createLead.isPending || saveResult.isPending}>
                    {createLead.isPending || saveResult.isPending ? "Submitting..." : get("form_submit")}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 4. Wizard Questions
  const currentQ = DIAGNOSTIC_QUESTIONS[step];
  
  return (
    <div className="py-24 bg-background min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-2xl px-4">
        
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            <span>Step {step + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
            <span>{Math.round(((step + 1) / DIAGNOSTIC_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out" 
              style={{ width: `${((step + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{currentQ.question}</h1>
          {currentQ.helper && <p className="text-muted-foreground text-lg mb-8">{currentQ.helper}</p>}

          <RadioGroup 
            value={answers[currentQ.key] || ""} 
            onValueChange={(val) => handleAnswer(currentQ.key, val)}
            className="space-y-4 mt-8"
          >
            {currentQ.options.map((opt) => (
              <label 
                key={opt.value}
                className={`flex items-center space-x-4 border rounded-xl p-6 cursor-pointer transition-all hover-elevate ${
                  answers[currentQ.key] === opt.value 
                    ? "border-accent bg-accent/5 ring-1 ring-accent" 
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  answers[currentQ.key] === opt.value ? "border-accent" : "border-muted-foreground/50"
                }`}>
                  {answers[currentQ.key] === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-accent" />}
                </div>
                <span className="text-lg font-medium text-foreground">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

      </div>
    </div>
  );
}
