import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { detectionRequestSchema, type DetectionRequestInput } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DetectionResult } from "@/pages/home";

interface DetectionFormProps {
  onResult: (result: DetectionResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function DetectionForm({ onResult, isLoading, setIsLoading }: DetectionFormProps) {
  const { toast } = useToast();
  const [inputIcon, setInputIcon] = useState("fas fa-globe");

  const form = useForm<DetectionRequestInput>({
    resolver: zodResolver(detectionRequestSchema),
    defaultValues: {
      domain: "",
    },
  });

  const detectionMutation = useMutation({
    mutationFn: async (data: DetectionRequestInput) => {
      const response = await apiRequest("POST", "/api/detect-wordpress", data);
      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
      onResult(null);
    },
    onSuccess: async (data: DetectionResult) => {
      // Add minimum loading duration for animations to be visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onResult(data);
      toast({
        title: "Analysis Complete",
        description: `WordPress detection finished for ${data.domain}`,
      });
    },
    onError: (error: any) => {
      console.error("Detection error:", error);
      
      // Try to extract error info from the response
      let errorMessage = "Unable to analyze the website. Please check the URL and try again.";
      let errorDetails = "";
      
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message.split(': ').slice(1).join(': '));
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch {
          // If parsing fails, use the raw error message
          errorMessage = error.message.split(': ').slice(1).join(': ') || errorMessage;
        }
      }

      // Create an error result to display
      const errorResult: DetectionResult = {
        id: Date.now().toString(),
        domain: form.getValues("domain").replace(/^https?:\/\//, ''),
        isWordPress: null,
        error: errorMessage,
        createdAt: new Date().toISOString(),
      };
      
      onResult(errorResult);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: DetectionRequestInput) => {
    detectionMutation.mutate(data);
  };

  const handleInputChange = (value: string) => {
    if (value.trim()) {
      setInputIcon("fas fa-check text-green-500");
    } else {
      setInputIcon("fas fa-globe text-muted-foreground");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-8 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL or Domain</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter website URL here"
                      className="pr-10"
                      data-testid="input-domain"
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e.target.value);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className={`${inputIcon} text-sm`}></i>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Enter a valid domain name or full URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            disabled={isLoading}
            data-testid="button-detect"
          >
            <span>{isLoading ? "Analyzing..." : "Check WordPress"}</span>
            <i className="fas fa-search text-sm"></i>
          </Button>
        </form>
      </Form>
    </div>
  );
}
