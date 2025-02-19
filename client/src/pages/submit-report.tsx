import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTrafficReport, InsertSafetySuggestion, insertTrafficReportSchema, insertSafetySuggestionSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SubmitReport() {
  const [formType, setFormType] = useState<'report' | 'suggestion'>('report');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportForm = useForm<InsertTrafficReport>({
    resolver: zodResolver(insertTrafficReportSchema),
    defaultValues: {
      severity: 1,
    },
  });

  const suggestionForm = useForm<InsertSafetySuggestion>({
    resolver: zodResolver(insertSafetySuggestionSchema),
  });

  const reportMutation = useMutation({
    mutationFn: async (data: InsertTrafficReport) => {
      const res = await apiRequest("POST", "/api/reports", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Report Submitted",
        description: "Thank you for your report.",
      });
      reportForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const suggestionMutation = useMutation({
    mutationFn: async (data: InsertSafetySuggestion) => {
      const res = await apiRequest("POST", "/api/suggestions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      toast({
        title: "Suggestion Submitted",
        description: "Thank you for your suggestion.",
      });
      suggestionForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit suggestion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Submit Feedback</h1>
        <p className="text-muted-foreground">
          Help us improve road safety by submitting accident reports or suggestions.
        </p>
      </div>

      <div className="mb-6">
        <Select value={formType} onValueChange={(value: 'report' | 'suggestion') => setFormType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select form type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="report">Traffic Incident Report</SelectItem>
            <SelectItem value="suggestion">Safety Suggestion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formType === 'report' ? (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Incident Report</CardTitle>
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
                        <Input placeholder="Enter location" {...field} />
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
                      <FormLabel>Severity (1-5)</FormLabel>
                      <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <SelectItem key={level} value={level.toString()}>
                              {level} - {level === 1 ? "Minor" : level === 5 ? "Severe" : "Moderate"}
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the incident" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={reportMutation.isPending}>
                  {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Safety Suggestion</CardTitle>
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
                        <Textarea placeholder="Enter your safety suggestion" {...field} />
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
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="enforcement">Enforcement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={suggestionMutation.isPending}>
                  {suggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
