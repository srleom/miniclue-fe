import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

// components
import { UpgradeButton } from "./upgrade-button";
import { ManageBillingButton } from "./manage-billing-button";

// types
import type { components } from "@/types/api";

type SubscriptionData =
  components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"];

// Plan mapping from frontend IDs to Stripe price IDs
const PLAN_MAPPING = {
  free: "free",
  beta: "beta",
  monthly_launch: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_LAUNCH,
  annual_launch: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL_LAUNCH,
} as const;

// Reverse mapping from Stripe price IDs to frontend IDs
const STRIPE_TO_FRONTEND_MAPPING = Object.entries(PLAN_MAPPING).reduce(
  (acc, [frontendId, stripeId]) => {
    if (stripeId) {
      acc[stripeId] = frontendId as keyof typeof PLAN_MAPPING;
    }
    return acc;
  },
  {} as Record<string, keyof typeof PLAN_MAPPING>,
);

interface PricingPlansProps {
  currentSubscription: SubscriptionData;
}

type ButtonConfig =
  | {
      type: "manage";
      text: string;
      variant: "outline" | "default" | "secondary" | "destructive" | "ghost";
      disabled: boolean;
    }
  | {
      type: "disabled";
      text: string;
      variant: "outline" | "default" | "secondary" | "destructive" | "ghost";
      disabled: boolean;
    }
  | {
      type: "upgrade";
      plan: "monthly_launch" | "annual_launch";
      variant: "outline" | "default" | "secondary" | "destructive" | "ghost";
      disabled: boolean;
    };

export function PricingPlans({ currentSubscription }: PricingPlansProps) {
  // Map the Stripe price ID back to frontend plan ID
  const currentPlanId = currentSubscription.plan_id
    ? STRIPE_TO_FRONTEND_MAPPING[currentSubscription.plan_id] ||
      currentSubscription.plan_id
    : "free";

  // Helper function to determine button configuration
  const getButtonConfig = (
    planId: string,
    isCurrentPlan: boolean,
  ): ButtonConfig => {
    // Current plan - show manage billing
    if (isCurrentPlan) {
      let text = "Manage billing";
      let variant:
        | "outline"
        | "default"
        | "secondary"
        | "destructive"
        | "ghost" = "secondary";

      if (currentSubscription.status === "cancelled") {
        text = "Resubscribe";
        variant = "secondary";
      } else if (currentSubscription.status === "past_due") {
        text = "Update Payment";
        variant = "destructive";
      } else {
        variant = currentPlanId === "annual_launch" ? "default" : "secondary";
      }

      return {
        type: "manage",
        text,
        variant,
        disabled: false,
      };
    }

    // Beta users can't downgrade to free
    if (currentPlanId === "beta" && planId === "free") {
      return {
        type: "disabled",
        text: "Not available",
        variant: "outline",
        disabled: true,
      };
    }

    // Upgrade scenarios (free/beta to paid plans)
    if (
      (currentPlanId === "free" || currentPlanId === "beta") &&
      (planId === "monthly_launch" || planId === "annual_launch")
    ) {
      return {
        type: "upgrade",
        plan: planId as "monthly_launch" | "annual_launch",
        variant: (planId === "annual_launch" ? "default" : "outline") as
          | "outline"
          | "default",
        disabled: false,
      };
    }

    // Pro Annual user - both free and monthly get outline
    if (currentPlanId === "annual_launch") {
      if (planId === "free") {
        return {
          type: "manage",
          text: "Downgrade to Free",
          variant: "outline",
          disabled: false,
        };
      }
      if (planId === "monthly_launch") {
        return {
          type: "manage",
          text: "Change plan",
          variant: "outline",
          disabled: false,
        };
      }
    }

    // Pro Monthly user - annual gets default, free gets outline
    if (currentPlanId === "monthly_launch") {
      if (planId === "free") {
        return {
          type: "manage",
          text: "Downgrade to Free",
          variant: "outline",
          disabled: false,
        };
      }
      if (planId === "annual_launch") {
        return {
          type: "manage",
          text: "Change plan",
          variant: "default",
          disabled: false,
        };
      }
    }

    // Fallback - disabled manage billing
    return {
      type: "manage",
      text: "Manage billing",
      variant: "outline",
      disabled: true,
    };
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/ mo",
      description: "",
      features: [
        "3 lecture uploads per month",
        "Max 10 MB per lecture",
        "Limited chat usage",
      ],
      popular: false,
    },
    {
      id: "annual_launch",
      name: "Pro Annual - Launch",
      price: "$72",
      period: "/ yr",
      description: "",
      features: [
        "Unlimited lecture uploads per month",
        "Max 300 MB per lecture",
        "Unlimited chat usage",
        "Early access to new features",
      ],
      popular: true,
    },
    {
      id: "monthly_launch",
      name: "Pro Monthly - Launch",
      price: "$10",
      period: "/ mo",
      description: "",
      features: [
        "Unlimited lecture uploads per month",
        "Max 300 MB per lecture",
        "Unlimited chat usage",
        "Early access to new features",
      ],
      popular: false,
    },
  ];

  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const buttonConfig = getButtonConfig(plan.id, isCurrentPlan);

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                isCurrentPlan ? "ring-primary ring-2" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-gradient-to-r from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                  Popular
                </span>
              )}

              {isCurrentPlan && (
                <span className="bg-primary text-primary-foreground absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium">
                  Current Plan
                </span>
              )}

              <CardHeader>
                <CardTitle className="font-medium">{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.description && (
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                {buttonConfig.type === "upgrade" ? (
                  <div className="w-full">
                    <UpgradeButton
                      plan={buttonConfig.plan}
                      variant={buttonConfig.variant}
                    />
                  </div>
                ) : buttonConfig.type === "disabled" ? (
                  <Button disabled className="w-full" size="sm">
                    {buttonConfig.text}
                  </Button>
                ) : (
                  <ManageBillingButton
                    text={buttonConfig.text}
                    variant={buttonConfig.variant}
                    disabled={buttonConfig.disabled}
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
