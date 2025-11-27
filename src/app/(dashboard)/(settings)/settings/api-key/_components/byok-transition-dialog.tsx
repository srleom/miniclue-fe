"use client";

// react

// icons
import { CheckCircle2, Heart } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BYOKTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  {
    title: "Fairness",
    description:
      "You pay only for what you use — no monthly subscriptions or unused credits.",
  },
  {
    title: "Transparency",
    description:
      "All costs are billed directly by the provider with no markup from us.",
  },
  {
    title: "Sustainability",
    description:
      "MiniClue can continue improving without limiting usage or charging arbitrary subscription tiers.",
  },
];

export function BYOKTransitionDialog({
  open,
  onOpenChange,
}: BYOKTransitionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Why we&apos;re transitioning to a BYOK model
          </DialogTitle>
          <DialogDescription>
            A transparent explanation of our decision and what it means for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Over the past few months of Closed Beta, we&apos;ve been thrilled
              to see so many of you actively using MiniClue to deepen your
              understanding of lecture materials. Your support and engagement
              have helped us validate and improve the product in meaningful
              ways.
            </p>

            <p className="text-sm leading-relaxed">
              During this period, MiniClue has fully covered all API usage
              costs. As our user base grew, however, these expenses increased
              significantly. Continuing to absorb these costs is no longer
              sustainable without compromising the quality and reliability of
              the service.
            </p>

            <p className="text-sm leading-relaxed">
              We explored alternative pricing options, including a fixed monthly
              subscription with a set number of credits. However, we found this
              approach unfair for many users, especially those who might not
              fully utilise their allotted credits each month. We believe you
              should only pay for what you actually use.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              To uphold transparency, fairness, and long-term sustainability,
              MiniClue is transitioning to a Bring Your Own Key (BYOK) model.
              This approach ensures:
            </p>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-medium">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-2">
              <Heart className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  Your support means everything
                </p>
                <p className="text-muted-foreground text-sm">
                  Thank you for being a part of our journey so far. We&apos;re
                  excited to continue building MiniClue with you, and we
                  appreciate your understanding as we make this important shift.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => onOpenChange(false)}>Got it</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
