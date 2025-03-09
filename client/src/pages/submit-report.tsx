import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { firebaseService } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ref, push, get, getDatabase } from "firebase/database";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";


// Form validation schema
const accidentReportSchema = z.object({
  location: z.string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must not exceed 100 characters"),
  accidentType: z.enum(["collision", "pedestrian", "vehicle_failure"], {
    required_error: "Please select an accident type",
  }),
  vehiclesInvolved: z.string()
    .transform((val) => parseInt(val, 10))
    .refine((num) => !isNaN(num) && num > 0 && num <= 10, {
      message: "Number of vehicles must be between 1 and 10",
    }),
  date: z.string().min(1, "Date is required"),
});

type AccidentReport = z.infer<typeof accidentReportSchema>;

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
  const [submittedReports, setSubmittedReports] = useState<any[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AccidentReport>({
    resolver: zodResolver(accidentReportSchema),
    defaultValues: {
      vehiclesInvolved: "1",
    },
  });

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

  useEffect(() => {
    // Load existing reports
    const loadReports = async () => {
      try {
        const reportsRef = ref(getDatabase(), 'accident_reports');
        const snapshot = await get(reportsRef);
        if (snapshot.exists()) {
          const reports = Object.values(snapshot.val());
          setSubmittedReports(reports);
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        setError('Failed to load existing reports');
      }
    };

    loadReports();
  }, []);

  const onSubmit = async (data: AccidentReport) => {
    try {
      setError(null);
      const reportsRef = ref(getDatabase(), 'accident_reports');
      await push(reportsRef, {
        ...data,
        timestamp: new Date().toISOString(),
      });

      // Refresh the reports list
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        setSubmittedReports(Object.values(snapshot.val()));
      }

      form.reset();
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Data Collection [AR2]
        </h1>
        <p className="text-lg text-muted-foreground">
          Submit accident report data for analysis
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {submissionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="accidentReport" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accidentReport">Accident Report</TabsTrigger>
          <TabsTrigger value="report">Incident Report</TabsTrigger>
          <TabsTrigger value="suggestion">Safety Suggestion</TabsTrigger>
        </TabsList>

        <TabsContent value="accidentReport">
          <Card>
            <CardHeader>
              <CardTitle>Submit Accident Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter incident location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accidentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accident Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accident type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="collision">Vehicle Collision</SelectItem>
                            <SelectItem value="pedestrian">Pedestrian Involved</SelectItem>
                            <SelectItem value="vehicle_failure">Vehicle Failure</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehiclesInvolved"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Vehicles Involved</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Display submitted reports */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submittedReports.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Type:</strong> {report.accidentType.replace('_', ' ')}</p>
                      <p><strong>Vehicles:</strong> {report.vehiclesInvolved}</p>
                    </div>
                  </div>
                ))}
                {submittedReports.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No reports submitted yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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