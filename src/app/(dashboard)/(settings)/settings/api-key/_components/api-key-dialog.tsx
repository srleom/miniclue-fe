"use client";

// react
import { useState, useEffect } from "react";

// third-party
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

// icons
import { HelpCircle } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OpenAIAPIKeyTutorialDialog } from "./openai-api-key-tutorial-dialog";

// actions
import { storeAPIKey } from "../_actions/api-key-actions";
import type { Provider } from "./provider-list";

const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

interface ApiKeyDialogProps {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  hasKey: boolean;
}

const providerNames: Record<Provider, string> = {
  openai: "OpenAI",
  gemini: "Google Gemini",
};

const providerLogos: Record<Provider, React.ReactNode> = {
  openai: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className="h-6 w-6"
    >
      <path
        fill="currentColor"
        d="M20.562 10.188c.25-.688.313-1.376.25-2.063c-.062-.687-.312-1.375-.625-2c-.562-.937-1.375-1.687-2.312-2.125c-1-.437-2.063-.562-3.125-.312c-.5-.5-1.063-.938-1.688-1.25S11.687 2 11 2a5.17 5.17 0 0 0-3 .938c-.875.624-1.5 1.5-1.813 2.5c-.75.187-1.375.5-2 .875c-.562.437-1 1-1.375 1.562c-.562.938-.75 2-.625 3.063a5.44 5.44 0 0 0 1.25 2.874a4.7 4.7 0 0 0-.25 2.063c.063.688.313 1.375.625 2c.563.938 1.375 1.688 2.313 2.125c1 .438 2.062.563 3.125.313c.5.5 1.062.937 1.687 1.25S12.312 22 13 22a5.17 5.17 0 0 0 3-.937c.875-.625 1.5-1.5 1.812-2.5a4.54 4.54 0 0 0 1.938-.875c.562-.438 1.062-.938 1.375-1.563c.562-.937.75-2 .625-3.062c-.125-1.063-.5-2.063-1.188-2.876m-7.5 10.5c-1 0-1.75-.313-2.437-.875c0 0 .062-.063.125-.063l4-2.312a.5.5 0 0 0 .25-.25a.57.57 0 0 0 .062-.313V11.25l1.688 1v4.625a3.685 3.685 0 0 1-3.688 3.813M5 17.25c-.438-.75-.625-1.625-.438-2.5c0 0 .063.063.125.063l4 2.312a.56.56 0 0 0 .313.063c.125 0 .25 0 .312-.063l4.875-2.812v1.937l-4.062 2.375A3.7 3.7 0 0 1 7.312 19c-1-.25-1.812-.875-2.312-1.75M3.937 8.563a3.8 3.8 0 0 1 1.938-1.626v4.751c0 .124 0 .25.062.312a.5.5 0 0 0 .25.25l4.875 2.813l-1.687 1l-4-2.313a3.7 3.7 0 0 1-1.75-2.25c-.25-.937-.188-2.062.312-2.937M17.75 11.75l-4.875-2.812l1.687-1l4 2.312c.625.375 1.125.875 1.438 1.5s.5 1.313.437 2.063a3.7 3.7 0 0 1-.75 1.937c-.437.563-1 1-1.687 1.25v-4.75c0-.125 0-.25-.063-.312c0 0-.062-.126-.187-.188m1.687-2.5s-.062-.062-.125-.062l-4-2.313c-.125-.062-.187-.062-.312-.062s-.25 0-.313.062L9.812 9.688V7.75l4.063-2.375c.625-.375 1.312-.5 2.062-.5c.688 0 1.375.25 2 .688c.563.437 1.063 1 1.313 1.625s.312 1.375.187 2.062m-10.5 3.5l-1.687-1V7.063c0-.688.187-1.438.562-2C8.187 4.438 8.75 4 9.375 3.688a3.37 3.37 0 0 1 2.062-.313c.688.063 1.375.375 1.938.813c0 0-.063.062-.125.062l-4 2.313a.5.5 0 0 0-.25.25c-.063.125-.063.187-.063.312zm.875-2L12 9.5l2.187 1.25v2.5L12 14.5l-2.188-1.25z"
      />
    </svg>
  ),
  gemini: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className="h-6 w-6"
    >
      <path
        fill="currentColor"
        d="M12 11h8.533q.066.578.067 1.184c0 2.734-.98 5.036-2.678 6.6c-1.485 1.371-3.518 2.175-5.942 2.175A8.976 8.976 0 0 1 3 11.98A8.976 8.976 0 0 1 11.98 3c2.42 0 4.453.89 6.008 2.339L16.526 6.8C15.368 5.681 13.803 5 12 5a7 7 0 0 0 0 14c3.527 0 6.144-2.608 6.577-6H12z"
      />
    </svg>
  ),
};

export function ApiKeyDialog({
  provider,
  open,
  onOpenChange,
  onSuccess,
  hasKey,
}: ApiKeyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({ apiKey: "" });
    }
  }, [open, form]);

  const onSubmit = async (values: ApiKeyFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await storeAPIKey(provider, values.apiKey);
      if (result.error) {
        // Check if error message indicates invalid API key
        const errorMessage = result.error.toLowerCase();
        if (
          errorMessage.includes("invalid") ||
          errorMessage.includes("authentication") ||
          errorMessage.includes("unauthorized")
        ) {
          toast.error("Invalid API key. Please check your key and try again.");
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success(
          `${providerNames[provider]} API key ${hasKey ? "updated" : "stored"} successfully`,
        );
        form.reset();
        onSuccess?.();
      }
    } catch {
      toast.error("Failed to store API key");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {providerLogos[provider]}
            <div>
              <DialogTitle>{providerNames[provider]}</DialogTitle>
              <DialogDescription
                className={hasKey ? "text-green-500" : "text-muted-foreground"}
              >
                {hasKey ? "1 active key" : "No active key"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        provider === "openai" ? "sk-..." : "Enter your API key"
                      }
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Your API key will be encrypted and stored securely. We
                    cannot access your key.
                    {provider === "openai" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTutorialOpen(true);
                        }}
                        className="text-primary ml-1 inline-flex items-center gap-1 hover:underline"
                      >
                        <HelpCircle className="h-3 w-3" />
                        How to get your API key
                      </button>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={hasKey ? "destructive" : "default"}
              >
                {isSubmitting ? "Saving..." : hasKey ? "Override" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      {provider === "openai" && (
        <OpenAIAPIKeyTutorialDialog
          open={isTutorialOpen}
          onOpenChange={setIsTutorialOpen}
        />
      )}
    </Dialog>
  );
}
