// react
import { Suspense } from "react";

// actions
import { getUserSubscription } from "@/app/(dashboard)/_actions/user-actions";

// components
import { SubscriptionInfo } from "./_components/subscription-info";
import { PricingPlans } from "./_components/pricing-plans";
import { PaymentToastHandler } from "./_components/payment-toast-handler";

async function SubscriptionContent() {
  const { data: subscription, error } = await getUserSubscription();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Failed to load subscription</p>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  // If no subscription found, show free plan
  const subscriptionData = subscription || {
    plan_id: "free",
    status: "active",
    name: "Free Plan",
  };

  return (
    <div className="mx-auto mt-4 flex w-full flex-col items-center md:mt-16 lg:w-3xl">
      <PaymentToastHandler />
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-2xl font-medium">Subscription</h1>

        <SubscriptionInfo subscription={subscriptionData} />

        <div className="mt-18 flex w-full flex-col gap-6">
          <h2 className="text-lg font-medium">Pricing plans</h2>
          <PricingPlans currentSubscription={subscriptionData} />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-4 flex w-full flex-col items-center md:mt-16 lg:w-3xl">
          <div className="flex w-full flex-col gap-6">
            <h1 className="text-2xl font-medium">Subscription</h1>
            <div className="flex items-center">
              <p className="text-muted-foreground">Loading subscription...</p>
            </div>
          </div>
        </div>
      }
    >
      <SubscriptionContent />
    </Suspense>
  );
}
