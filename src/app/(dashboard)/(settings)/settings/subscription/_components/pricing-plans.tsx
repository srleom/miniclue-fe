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

export function PricingPlans({ currentSubscription }: PricingPlansProps) {
  // Map the Stripe price ID back to frontend plan ID
  const currentPlanId = currentSubscription.plan_id
    ? STRIPE_TO_FRONTEND_MAPPING[currentSubscription.plan_id] ||
      currentSubscription.plan_id
    : "free";

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
      name: "Pro Annual",
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
      name: "Pro Monthly",
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
                {isCurrentPlan ? (
                  <Button disabled className="w-full" size="sm">
                    Current Plan
                  </Button>
                ) : currentPlanId === "beta" && plan.id === "free" ? (
                  <Button disabled className="w-full" size="sm">
                    Not available
                  </Button>
                ) : currentPlanId === "beta" &&
                  (plan.id === "monthly_launch" ||
                    plan.id === "annual_launch") ? (
                  <div className="w-full">
                    <UpgradeButton
                      plan={plan.id as "monthly_launch" | "annual_launch"}
                      variant={plan.popular ? "default" : "outline"}
                    />
                  </div>
                ) : currentPlanId === "free" &&
                  (plan.id === "monthly_launch" ||
                    plan.id === "annual_launch") ? (
                  <div className="w-full">
                    <UpgradeButton
                      plan={plan.id as "monthly_launch" | "annual_launch"}
                      variant={plan.popular ? "default" : "outline"}
                    />
                  </div>
                ) : (currentPlanId === "monthly_launch" ||
                    currentPlanId === "annual_launch") &&
                  plan.id === "free" ? (
                  <ManageBillingButton text="Downgrade to Free" />
                ) : (currentPlanId === "monthly_launch" ||
                    currentPlanId === "annual_launch") &&
                  (plan.id === "monthly_launch" ||
                    plan.id === "annual_launch") &&
                  plan.id !== currentPlanId ? (
                  <ManageBillingButton text="Change plan" />
                ) : (
                  <ManageBillingButton text="Manage billing" disabled />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
