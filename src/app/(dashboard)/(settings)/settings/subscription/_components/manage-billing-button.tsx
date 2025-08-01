"use client";

// components
import { Button } from "@/components/ui/button";

// utils
import { useManageBilling } from "./billing-utils";

export function ManageBillingButton({
  disabled = false,
  text = "Manage billing",
  variant = "outline",
}: {
  disabled?: boolean;
  text?: string;
  variant?: "outline" | "default" | "secondary" | "destructive" | "ghost";
}) {
  const { handleManageBilling, isLoading } = useManageBilling();

  return (
    <form action={handleManageBilling} className="w-full">
      <Button
        type="submit"
        variant={variant}
        size="sm"
        disabled={disabled || isLoading}
        className="w-full hover:cursor-pointer"
      >
        {isLoading ? "Loading..." : text}
      </Button>
    </form>
  );
}
