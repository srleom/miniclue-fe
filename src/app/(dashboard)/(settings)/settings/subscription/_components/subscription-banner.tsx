// components
import { AlertTriangle, Info } from "lucide-react";
import { ManageBillingButton } from "./manage-billing-button";

// lib
import { formatDate } from "@/lib/utils";

// types
import type { components } from "@/types/api";

type SubscriptionData =
  components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"];

interface SubscriptionBannerProps {
  subscription: SubscriptionData;
}

function getBannerConfig(subscription: SubscriptionData) {
  switch (subscription.status) {
    case "past_due":
      return {
        icon: AlertTriangle,
        message:
          "Your last payment failed. Please update your payment method to restore access.",
        buttonText: "Update Payment",
        buttonVariant: "destructive" as const,
        className: "border-destructive/20 bg-destructive/5",
        iconClassName: "text-destructive",
        textClassName: "text-destructive",
      };
    case "cancelled":
      return {
        icon: Info,
        message: `You have Pro access until ${subscription.ends_at ? formatDate(subscription.ends_at) : "the end of your billing period"}. You can resubscribe at any time.`,
        buttonText: "Resubscribe",
        buttonVariant: "outline" as const,
        className: "border-blue-200 bg-blue-50",
        iconClassName: "text-blue-600",
        textClassName: "text-blue-800",
      };
    default:
      return null;
  }
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  const config = getBannerConfig(subscription);

  if (!config) {
    return null;
  }

  const IconComponent = config.icon;

  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${config.className}`}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <IconComponent
          className={`mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0 ${config.iconClassName}`}
        />
        <div className="flex flex-col gap-1">
          <p className={`text-sm font-medium ${config.textClassName}`}>
            {config.message}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ManageBillingButton
          text={config.buttonText}
          variant={config.buttonVariant}
          disabled={false}
        />
      </div>
    </div>
  );
}
