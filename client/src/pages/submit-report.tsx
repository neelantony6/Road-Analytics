import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTrafficReport, InsertSafetySuggestion, insertTrafficReportSchema, insertSafetySuggestionSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SubmitReport() {
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
        title: "Report Submitted Successfully",
        description: "Thank you for contributing to road safety.",
      });
      reportForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
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
        title: "Suggestion Submitted Successfully",
        description: "Thank you for your valuable input.",
      });
      suggestionForm.reset();
    },
    onError: (error: Error) => {
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