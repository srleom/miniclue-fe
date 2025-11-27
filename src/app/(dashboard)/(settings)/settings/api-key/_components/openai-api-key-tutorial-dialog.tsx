"use client";

// react

// icons
import { ExternalLink, CheckCircle2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface OpenAIAPIKeyTutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    number: 1,
    title: "Sign in to OpenAI",
    description: (
      <>
        Go to{" "}
        <a
          href="https://platform.openai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          platform.openai.com
        </a>{" "}
        and sign in to your account, or create a new account if you don&apos;t
        have one.
      </>
    ),
  },
  {
    number: 2,
    title: "Navigate to API Keys",
    description: (
      <>
        Click on <span className="italic">Dashboard</span> on top right corner,
        then in the left sidebar click on{" "}
        <span className="italic">API keys</span>.
      </>
    ),
  },
  {
    number: 3,
    title: "Create a new API key",
    description: (
      <>
        Click the <span className="italic">Create new secret key</span> button.
        Give it a name (optional) with project left to default and permissions
        to <span className="italic">All</span> and click{" "}
        <span className="italic">Create secret key</span>.
      </>
    ),
  },
  {
    number: 4,
    title: "Copy your API key",
    description:
      "Copy your API key immediately and paste it into the API key field in MiniClue. You won't be able to see it again after closing the dialog in OpenAI Platform.",
  },
  {
    number: 5,
    title: "Add credits",
    description: (
      <>
        Credits are required to use the API. Click the{" "}
        <span className="italic">Settings</span> icon on the top right corner,
        click on <span className="italic">Billing</span> in the left sidebar,
        and then click <span className="italic">Add to credit balance</span>.
      </>
    ),
  },
];

export function OpenAIAPIKeyTutorialDialog({
  open,
  onOpenChange,
}: OpenAIAPIKeyTutorialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>How to get your OpenAI API key</DialogTitle>
          <DialogDescription>
            Follow these steps to create and retrieve your OpenAI API key.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                  {step.number}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{step.title}</h3>
                <div className="text-muted-foreground text-sm">
                  {step.description}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Security tip</p>
                <p className="text-muted-foreground text-sm">
                  Your API key is sensitive. Never share it publicly. Keep it
                  secure and rotate it if you suspect it&apos;s been
                  compromised.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" asChild className="flex-1">
              <Link
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Open OpenAI Platform
              </Link>
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
