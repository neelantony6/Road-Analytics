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

export default function SubmitReport() {
  const { toast } = useToast();
  const [error] = useState(null);

  // Query for fetching submitted reports
  const { data: submittedReports = [] } = useQuery({
    queryKey: ['accidentReports'],
    queryFn: firebaseService.getAccidentReports
  });

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

  const suggestionForm = useForm({
    resolver: zodResolver(safetySuggestionSchema),
  });

  // Mutations for handling form submissions
  const accidentMutation = useMutation({
    mutationFn: firebaseService.submitAccidentReport,
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

  // Analysis helpers - JavaScript functions for data processing
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
    return submittedReports.reduce((acc, report) => {
      acc[report.accidentType] = (acc[report.accidentType] || 0) + 1;
      return acc;
    }, {});
  };

  const getAverageVehiclesInvolved = () => {
    if (submittedReports.length === 0) return 0;
    const total = submittedReports.reduce((sum, report) => sum + report.vehiclesInvolved, 0);
    return (total / submittedReports.length).toFixed(1);
  };

  // Rest of the component JSX remains the same...
  // (Component render code continues as before)
}
