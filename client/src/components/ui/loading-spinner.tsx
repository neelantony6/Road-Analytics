import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8"
};

export default function LoadingSpinner({ className, size = "default" }: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn(
        "animate-spin text-primary/80",
        sizeClasses[size],
        className
      )} 
    />
  );
}
