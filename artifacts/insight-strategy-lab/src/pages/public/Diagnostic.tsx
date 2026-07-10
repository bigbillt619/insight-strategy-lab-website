import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DIAGNOSTIC_QUESTIONS } from "@/features/diagnostic/questions";
import {
  computeAssessment,
  pillarLabel,
  riskLabel,
  useSaveDiagnosticResult,
} from "@/features/diagnostic/api";
import { useCreateLead } from "@/features/leads/api";
import { QUALIFIER_FIELDS } from "@/features/leads/qualifiers";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import type { DiagnosticAnswers } from "@/lib/types";

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const saveResult = useSaveDiagnosticResult();
  const createLead = useCreateLead();
  const { get } = useContent("diagnostic");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  // After all 6 pillar questions are answered, step === questions.length
  // shows the scorecard + lead capture form; submitting the form advances
  // straight to the finished/confirmation screen (step === length + 1).
  const showScorecard = step === DIAGNOSTIC_QUESTIONS.length;
  const isFinished = step === DIAGNOSTIC_QUESTIONS.length + 1;

  // The BOS maturity assessment is calculated once they finish all 6 pillars.
  const assessment = useMemo(() => {
    if (!showScorecard && !isFinished) return null;
    return computeAssessment(answers);
  }, [showScorecard, isFinished, answers]);

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

  const handleAnswer = (key: (typeof DIAGNOSTIC_QUESTIONS)[number]["key"], score: number) => {
    setAnswers((prev) => ({ ...prev, [key]: score }));
    setTimeout(() => setStep((s) => s + 1), 300); // Auto advance
  };

  const handleLeadSubmit = async (data: z.infer<typeof leadSchema>) => {
    if (!assessment) return;
    setSubmitError(null);

    const storedSource = sessionStorage.getItem("isl_lead_source");
    const source = storedSource === "vehicle_qr" ? "vehicle_qr" : "diagnostic";

    const emptyToNull = (v?: string) => (v && v.length > 0 ? v : null);
    try {
      const lead = await createLead.mutateAsync({
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
      });

      // The lead is the critical capture; persisting the assessment detail is
      // best-effort, so don't block the confirmation on it.
      try {
        await saveResult.mutateAsync({
          lead_id: lead.id,
          answers,
          assessment,
        });
      } catch (err) {
        console.error("Failed to save diagnostic result (lead was captured):", err);
      }

      sessionStorage.removeItem("isl_lead_source");
      setStep((s) => s + 1); // Move to finished state
    } catch {
      setSubmitError(
        "Something went wrong submitting your assessment. Please try again, or reach out to us directly."
      );
    }
  };

  // 1. Finished state
  if (isFinished) {
    return (
      <div className="py-24 bg-background min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">{get("finished_heading")}</h2>
          <p className="text-muted-foreground mb-8">{get("finished_body")}</p>
          <Button asChild variant="outline">
            <Link href="/">{get("finished_button")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 2. Scorecard + Lead Capture
  if (showScorecard) {
    const a = assessment!;
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">

          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> {get("scorecard_label")}
            </h2>

            {/* Per-pillar scorecard */}
            <div className="space-y-4 mb-10">
              {DIAGNOSTIC_QUESTIONS.map((q) => {
                const score = a.scores[q.key];
                return (
                  <div key={q.key}>
                    <div className="flex justify-between text-sm font-semibold text-foreground mb-1.5">
                      <span>{pillarLabel(q.key)}</span>
                      <span className="text-muted-foreground">{score}/5</span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall score / health meter */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-8">
              <div className="flex items-end justify-between mb-3">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">{get("overall_score_label")}</h4>
                <span className="text-3xl font-bold text-foreground">{a.overallScore}<span className="text-lg text-muted-foreground">/30</span></span>
              </div>
              <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${(a.overallScore / 30) * 100}%` }}
                />
              </div>
              <p className="text-center mt-3 text-lg font-bold text-accent">{a.level.name}</p>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {get("level_prefix")} {a.level.name}
            </h1>
            <ul className="space-y-2 mb-8">
              {a.level.focusAreas.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <div className="bg-secondary/50 rounded-xl p-6 mb-8">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">{get("risk_areas_label")}</h4>
              <ul className="space-y-2">
                {a.riskAreas.map((pillar, i) => (
                  <li key={pillar} className="flex items-center gap-3 text-muted-foreground font-medium">
                    <AlertCircle className="h-4 w-4 text-accent" /> {i + 1}. {riskLabel(pillar)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-accent pl-6">
              "{a.level.nextStep}"
            </p>
          </div>

          <div className="bg-background border border-border rounded-3xl p-8 md:p-12">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">{get("form_heading")}</h2>
              <p className="text-muted-foreground mb-8">{get("form_body")}</p>

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
                    {QUALIFIER_FIELDS.map((qf) => (
                      <FormField
                        key={qf.name}
                        control={form.control}
                        name={qf.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{qf.label}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                              <FormControl>
                                <SelectTrigger>
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

  // 3. Wizard Questions
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

        {/* Intro framing (first step only) */}
        {step === 0 && (
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-accent mb-3">{get("wizard_intro_eyebrow")}</p>
            <p className="text-lg text-muted-foreground mb-6">{get("wizard_intro_body")}</p>
            {get("wizard_outcome_items").trim() && (
              <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">{get("wizard_outcome_heading")}</h2>
                <ul className="space-y-2">
                  {get("wizard_outcome_items").split("\n").filter((s) => s.trim()).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-1 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Question */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <p className="text-sm font-bold uppercase tracking-widest text-accent mb-3">{currentQ.pillarLabel}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{currentQ.question}</h1>
          {currentQ.helper && <p className="text-muted-foreground text-lg mb-8">{currentQ.helper}</p>}

          <RadioGroup
            value={answers[currentQ.key]?.toString() || ""}
            onValueChange={(val) => handleAnswer(currentQ.key, Number(val))}
            className="space-y-4 mt-8"
          >
            {currentQ.options.map((opt) => (
              <label
                key={opt.score}
                className={`flex items-center space-x-4 border rounded-xl p-6 cursor-pointer transition-all hover-elevate ${
                  answers[currentQ.key] === opt.score
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <RadioGroupItem value={opt.score.toString()} id={`${currentQ.key}-${opt.score}`} className="sr-only" />
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  answers[currentQ.key] === opt.score ? "border-accent" : "border-muted-foreground/50"
                }`}>
                  {answers[currentQ.key] === opt.score && <div className="h-2.5 w-2.5 rounded-full bg-accent" />}
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
