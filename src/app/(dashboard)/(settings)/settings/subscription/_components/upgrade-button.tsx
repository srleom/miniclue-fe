"use client";

// react
import { useState } from "react";

// third-party
import { toast } from "sonner";

// components
import { Button } from "@/components/ui/button";

// actions
import { createCheckoutSession } from "@/app/(dashboard)/_actions/user-actions";

interface UpgradeButtonProps {
  plan: "monthly_launch" | "annual_launch";
  variant?: "outline" | "default" | "secondary" | "destructive" | "ghost";
}

export function UpgradeButton({ plan, variant }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgradeToPro(formData: FormData) {
    setIsLoading(true);
    try {
      const planType = formData.get("plan") as
        | "monthly"
        | "annual"
        | "monthly_launch"
        | "annual_launch";
      const { data: checkoutUrl, error } =
        await createCheckoutSession(planType);

      if (error) {
        console.error("Failed to create checkout session:", error);
        toast.error("Failed to create checkout session. Please try again.");
        return;
      }

      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Show only the specific plan button
  const buttonText =
    plan === "monthly_launch" ? "Pro Monthly ($10/mo)" : "Pro Annual ($6/mo)";

  return (
    <form action={handleUpgradeToPro}>
      <input type="hidden" name="plan" value={plan} />
      <Button
        type="submit"
        size="sm"
        variant={variant}
        className="w-full hover:cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : buttonText}
      </Button>
    </form>
  );
}
