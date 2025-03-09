import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { firebaseService } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schemas with my custom validation rules
const accidentReportSchema = z.object({
  // String type fields - I chose these specific text fields for detailed reporting
  location: z.string()
    .min(3, "Please enter a more specific location (at least 3 characters)")
    .max(100, "Location description is too long, please be more concise"),
  description: z.string()
    .min(20, "Could you provide more details? (at least 20 characters)")
    .max(500, "Description is a bit too long, please summarize"),

  // Integer type fields - These numbers help track severity
  vehiclesInvolved: z.number()
    .int()
    .min(1, "At least one vehicle must be involved")
    .max(10, "For major incidents with more than 10 vehicles, please contact emergency services"),
  injuryCount: z.number()
    .int()
    .min(0, "Number of injuries cannot be negative")
    .max(100, "For mass casualty incidents, please contact emergency services immediately"),

  // Boolean type fields - Critical flags for emergency response
  medicalAssistance: z.boolean()
    .default(false),
  hitAndRun: z.boolean()
    .default(false),

  date: z.string().min(1, "When did this happen? Please select a date"),
});

const trafficReportSchema = z.object({
  date: z.string().min(1, "When did this happen? Please select a date"),
  location: z.string()
    .min(3, "Please enter a more specific location (at least 3 characters)")
    .max(100, "Location description is too long, please be more concise"),
  severity: z.number()
    .min(1, "Minimum severity is 1")
    .max(5, "Maximum severity is 5"),
  description: z.string()
    .min(20, "Could you provide more details? (at least 20 characters)")
    .max(500, "Description is a bit too long, please summarize"),
});

const safetySuggestionSchema = z.object({
  suggestion: z.string()
    .min(20, "Could you provide more details? (at least 20 characters)")
    .max(500, "Suggestion is a bit too long, please summarize"),
  category: z.enum(["infrastructure", "education", "enforcement"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
});

type AccidentReport = z.infer<typeof accidentReportSchema>;
type TrafficReport = z.infer<typeof trafficReportSchema>;
type SafetySuggestion = z.infer<typeof safetySuggestionSchema>;

interface SubmittedReport {
  date: string;
  location: string;
  description: string;
  vehiclesInvolved: number;
  injuryCount: number;
  medicalAssistance: boolean;
  hitAndRun: boolean;
  timestamp: string;
}

export default function SubmitReport() {
  const { toast } = useToast();
  const [error] = useState<string | null>(null);

  // Query for fetching submitted reports
  const { data: submittedReports = [] } = useQuery<SubmittedReport[]>({
    queryKey: ['accidentReports'],
    queryFn: firebaseService.getAccidentReports
  });

  // Form setup
  const accidentForm = useForm<AccidentReport>({
    resolver: zodResolver(accidentReportSchema),
    defaultValues: {
      vehiclesInvolved: 1,
      injuryCount: 0,
      medicalAssistance: false,
      hitAndRun: false,
    },
  });

  const trafficForm = useForm<TrafficReport>({
    resolver: zodResolver(trafficReportSchema),
    defaultValues: {
      severity: 1,
    },
  });

  const suggestionForm = useForm<SafetySuggestion>({
    resolver: zodResolver(safetySuggestionSchema),
  });

  // Mutations
  const accidentMutation = useMutation({
    mutationFn: firebaseService.submitAccidentReport,
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your accident report has been submitted successfully.",
      });
      accidentForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const trafficMutation = useMutation({
    mutationFn: firebaseService.submitTrafficReport,
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your traffic report has been submitted successfully.",
      });
      trafficForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const suggestionMutation = useMutation({
    mutationFn: firebaseService.submitSafetySuggestion,
    onSuccess: () => {
      toast({
        title: "Suggestion Submitted",
        description: "Your safety suggestion has been submitted successfully.",
      });
      suggestionForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Analysis helpers
  const getAverageInjuries = () => {
    if (submittedReports.length === 0) return 0;
    const total = submittedReports.reduce((sum, report) => sum + report.injuryCount, 0);
    return (total / submittedReports.length).toFixed(1);
  };

  const getMedicalAssistancePercentage = () => {
    if (submittedReports.length === 0) return 0;
    const medicalCases = submittedReports.filter(report => report.medicalAssistance).length;
    return ((medicalCases / submittedReports.length) * 100).toFixed(1);
  };

  const getAccidentTypeDistribution = () => {
    return submittedReports.reduce((acc: Record<string, number>, report) => {
      acc[report.accidentType] = (acc[report.accidentType] || 0) + 1;
      return acc;
    }, {});
  };

  const getAverageVehiclesInvolved = () => {
    if (submittedReports.length === 0) return 0;
    const total = submittedReports.reduce((sum, report) => sum + report.vehiclesInvolved, 0);
    return (total / submittedReports.length).toFixed(1);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Data Collection -  My Personalized Report System
        </h1>
        <p className="text-lg text-muted-foreground">
          Submit your reports for analysis. Let's work together to improve safety!
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="accidentReport" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accidentReport">Accident Report</TabsTrigger>
          <TabsTrigger value="trafficReport">Traffic Report</TabsTrigger>
          <TabsTrigger value="suggestion">Safety Suggestion</TabsTrigger>
        </TabsList>

        <TabsContent value="accidentReport">
          <Card>
            <CardHeader>
              <CardTitle>Submit Accident Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...accidentForm}>
                <form onSubmit={accidentForm.handleSubmit(data => accidentMutation.mutate(data))} className="space-y-4">
                  {/* String type fields */}
                  <FormField
                    control={accidentForm.control}
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
                    control={accidentForm.control}
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
                    control={accidentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide detailed description of the incident"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Integer type fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={accidentForm.control}
                      name="vehiclesInvolved"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Vehicles</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accidentForm.control}
                      name="injuryCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Injuries</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Boolean type fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={accidentForm.control}
                      name="medicalAssistance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Medical Assistance Required
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accidentForm.control}
                      name="hitAndRun"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Hit and Run Case
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={accidentMutation.isPending}
                  >
                    {accidentMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Display submitted reports */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submittedReports.slice(-5).reverse().map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Vehicles:</strong> {report.vehiclesInvolved}</p>
                      <p><strong>Injuries:</strong> {report.injuryCount}</p>
                      <p><strong>Medical Assistance:</strong> {report.medicalAssistance ? "Yes" : "No"}</p>
                      <p><strong>Hit & Run:</strong> {report.hitAndRun ? "Yes" : "No"}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>
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

        <TabsContent value="trafficReport">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Incident Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...trafficForm}>
                <form onSubmit={trafficForm.handleSubmit(data => trafficMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={trafficForm.control}
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
                    control={trafficForm.control}
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
                    control={trafficForm.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity Level</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
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
                    control={trafficForm.control}
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={trafficMutation.isPending}
                  >
                    {trafficMutation.isPending ? "Submitting..." : "Submit Report"}
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
            </CardHeader>
            <CardContent>
              <Form {...suggestionForm}>
                <form onSubmit={suggestionForm.handleSubmit(data => suggestionMutation.mutate(data))} className="space-y-4">
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={suggestionMutation.isPending}
                  >
                    {suggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis of Submitted Reports */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reports Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Accident Types Distribution */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Distribution by Accident Type</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(getAccidentTypeDistribution()).map(([type, count]) => (
                  <Card key={type} className="p-4">
                    <p className="text-sm text-muted-foreground capitalize">{type.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Trends */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Recent Trends</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Reports: {submittedReports.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Average Vehicles Involved: {getAverageVehiclesInvolved()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Average Injuries per Incident: {getAverageInjuries()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Medical Assistance Percentage: {getMedicalAssistancePercentage()}%
                </p>
              </div>
            </div>

            {/* Time-based Analysis */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Temporal Distribution</h4>
              <div className="space-y-2">
                {submittedReports.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Most Recent Report: {
                        new Date(
                          Math.max(...submittedReports.map(r => new Date(r.date).getTime()))
                        ).toLocaleDateString()
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Earliest Report: {
                        new Date(
                          Math.min(...submittedReports.map(r => new Date(r.date).getTime()))
                        ).toLocaleDateString()
                      }
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}