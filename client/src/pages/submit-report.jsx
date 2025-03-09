import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schemas
const accidentReportSchema = z.object({
  location: z.string()
    .min(3, "Please enter a more specific location")
    .max(100, "Location must not exceed 100 characters"),
  description: z.string()
    .min(20, "Please provide more details")
    .max(500, "Description must not exceed 500 characters"),
  vehiclesInvolved: z.number()
    .int()
    .min(1, "At least one vehicle must be involved")
    .max(10, "For major incidents, contact emergency services"),
  injuryCount: z.number()
    .int()
    .min(0, "Cannot be negative")
    .max(100, "For mass casualties, contact emergency services"),
  medicalAssistance: z.boolean().default(false),
  hitAndRun: z.boolean().default(false),
  date: z.string().min(1, "Date is required"),
});

const trafficReportSchema = z.object({
  date: z.string().min(1, "Date is required"),
  location: z.string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must not exceed 100 characters"),
  severity: z.number()
    .min(1, "Minimum severity is 1")
    .max(5, "Maximum severity is 5"),
  description: z.string()
    .min(20, "Please provide more details")
    .max(500, "Description must not exceed 500 characters"),
});

async function submitAccidentReport(data) {
  const response = await fetch('/api/accidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit accident report');
  }

  return response.json();
}

async function submitTrafficReport(data) {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit traffic report');
  }

  return response.json();
}

export default function SubmitReport() {
  const { toast } = useToast();
  const [error] = useState(null);

  // Form setup
  const accidentForm = useForm({
    resolver: zodResolver(accidentReportSchema),
    defaultValues: {
      vehiclesInvolved: 1,
      injuryCount: 0,
      medicalAssistance: false,
      hitAndRun: false,
    },
  });

  const trafficForm = useForm({
    resolver: zodResolver(trafficReportSchema),
    defaultValues: {
      severity: 1,
    },
  });

  // Mutations
  const accidentMutation = useMutation({
    mutationFn: submitAccidentReport,
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your accident report has been submitted successfully.",
      });
      accidentForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const trafficMutation = useMutation({
    mutationFn: submitTrafficReport,
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your traffic report has been submitted successfully.",
      });
      trafficForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Data Collection [AR2]
        </h1>
        <p className="text-lg text-muted-foreground">
          Submit your reports to help improve road safety
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="accidentReport" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accidentReport">Accident Report</TabsTrigger>
          <TabsTrigger value="trafficReport">Traffic Report</TabsTrigger>
        </TabsList>

        <TabsContent value="accidentReport">
          <Card>
            <CardHeader>
              <CardTitle>Submit Accident Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...accidentForm}>
                <form onSubmit={accidentForm.handleSubmit(data => accidentMutation.mutate(data))} className="space-y-4">
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide detailed description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value}
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
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            <FormLabel>Medical Assistance Required</FormLabel>
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
                            <FormLabel>Hit and Run Case</FormLabel>
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
        </TabsContent>

        <TabsContent value="trafficReport">
          <Card>
            <CardHeader>
              <CardTitle>Submit Traffic Report</CardTitle>
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
                          <Input placeholder="Enter incident location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={trafficForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide detailed description" className="min-h-[100px]" {...field} />
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
                        <FormLabel>Severity (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={trafficMutation.isPending}>
                    {trafficMutation.isPending ? "Submitting..." : "Submit Report"}
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