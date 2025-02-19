import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { firebaseService } from "@/lib/firebase";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schemas with enhanced validation
const trafficReportSchema = z.object({
  date: z.string()
    .min(1, "Date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  location: z.string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must not exceed 100 characters"),
  severity: z.number()
    .min(1, "Minimum severity is 1")
    .max(5, "Maximum severity is 5"),
  description: z.string()
    .min(20, "Please provide a more detailed description (at least 20 characters)")
    .max(500, "Description must not exceed 500 characters"),
});

const safetySuggestionSchema = z.object({
  suggestion: z.string()
    .min(20, "Please provide a more detailed suggestion (at least 20 characters)")
    .max(500, "Suggestion must not exceed 500 characters"),
  category: z.enum(["infrastructure", "education", "enforcement"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
});

type TrafficReport = z.infer<typeof trafficReportSchema>;
type SafetySuggestion = z.infer<typeof safetySuggestionSchema>;

export default function SubmitReport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const reportForm = useForm<TrafficReport>({
    resolver: zodResolver(trafficReportSchema),
    defaultValues: {
      severity: 1,
    },
  });

  const suggestionForm = useForm<SafetySuggestion>({
    resolver: zodResolver(safetySuggestionSchema),
  });

  const reportMutation = useMutation({
    mutationFn: async (data: TrafficReport) => {
      setSubmissionError(null);
      return await firebaseService.submitTrafficReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Report Submitted Successfully",
        description: "Thank you for contributing to road safety.",
      });
      reportForm.reset();
    },
    onError: (error: Error) => {
      setSubmissionError(error.message);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const suggestionMutation = useMutation({
    mutationFn: async (data: SafetySuggestion) => {
      setSubmissionError(null);
      return await firebaseService.submitSafetySuggestion(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      toast({
        title: "Suggestion Submitted Successfully",
        description: "Thank you for your valuable input.",
      });
      suggestionForm.reset();
    },
    onError: (error: Error) => {
      setSubmissionError(error.message);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Submit Traffic Safety Information</h1>
        <p className="text-muted-foreground">
          Help improve road safety by reporting incidents or suggesting safety improvements.
        </p>
      </div>

      {submissionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="report" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="report">Incident Report</TabsTrigger>
          <TabsTrigger value="suggestion">Safety Suggestion</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Incident Report</CardTitle>
              <CardDescription>
                Report details about a traffic incident to help identify patterns and improve safety measures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...reportForm}>
                <form onSubmit={reportForm.handleSubmit((data) => reportMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={reportForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Incident</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reportForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter precise location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reportForm.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity Level</FormLabel>
                        <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((level) => (
                              <SelectItem key={level} value={level.toString()}>
                                {level} - {
                                  level === 1 ? "Minor" : 
                                  level === 2 ? "Moderate" :
                                  level === 3 ? "Serious" :
                                  level === 4 ? "Severe" :
                                  "Critical"
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reportForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed information about the incident"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={reportMutation.isPending}>
                    {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestion">
          <Card>
            <CardHeader>
              <CardTitle>Safety Suggestion</CardTitle>
              <CardDescription>
                Share your ideas on how to improve road safety in your area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...suggestionForm}>
                <form onSubmit={suggestionForm.handleSubmit((data) => suggestionMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={suggestionForm.control}
                    name="suggestion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Suggestion</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your safety improvement suggestion"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={suggestionForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="infrastructure">Infrastructure Improvement</SelectItem>
                            <SelectItem value="education">Public Education & Awareness</SelectItem>
                            <SelectItem value="enforcement">Law Enforcement & Regulations</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={suggestionMutation.isPending}>
                    {suggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}