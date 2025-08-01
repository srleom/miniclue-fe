// components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// lib
import { formatDate } from "@/lib/utils";

// components
import { ManageBillingButton } from "./manage-billing-button";

// types
import type { components } from "@/types/api";

type SubscriptionData =
  components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"];

function getStatusBadgeVariant(
  status?: string,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "cancelled":
      return "secondary";
    case "past_due":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusDisplayName(status?: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "cancelled":
      return "Cancelled";
    case "past_due":
      return "Past Due";
    default:
      return "Unknown";
  }
}

interface SubscriptionInfoProps {
  subscription: SubscriptionData;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const statusDisplayName = getStatusDisplayName(subscription.status);
  const statusVariant = getStatusBadgeVariant(subscription.status);

  return (
    <Card>
      <CardContent>
        {/* Subscription Information Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Current Plan */}
            <div className="border-border flex items-center justify-between gap-4 border-b pb-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Plan</label>
                <p className="text-muted-foreground text-xs">
                  Your current subscription plan
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-end text-sm break-all">
                  {subscription.name || "Free"}
                </span>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="border-border flex items-center justify-between gap-4 border-b pb-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Status</label>
                <p className="text-muted-foreground text-xs">
                  Your current subscription status
                </p>
              </div>
              <div className="flex items-center">
                <Badge variant={statusVariant} className="text-xs">
                  {statusDisplayName}
                </Badge>
              </div>
            </div>

            {/* Billing Period */}
            {subscription.starts_at && subscription.ends_at && (
              <div className="border-border flex items-center justify-between gap-4 border-b pb-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Billing period</label>
                  <p className="text-muted-foreground text-xs">
                    Your current billing cycle
                  </p>
                </div>
                <div className="flex flex-col items-end text-end text-sm">
                  <span className="block break-all sm:hidden">
                    {formatDate(subscription.starts_at)} - <br />
                    {formatDate(subscription.ends_at)}
                  </span>
                  <span className="hidden break-all sm:block">
                    {`${formatDate(subscription.starts_at)} - ${formatDate(subscription.ends_at)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Actions</label>
                <p className="text-muted-foreground text-xs">
                  Manage your subscription
                </p>
              </div>
              <div className="flex items-center">
                {subscription.stripe_subscription_id ? (
                  <ManageBillingButton
                    text={
                      subscription.status === "past_due"
                        ? "Update Payment"
                        : subscription.status === "cancelled"
                          ? "Resubscribe"
                          : "Manage billing"
                    }
                    variant={
                      subscription.status === "past_due"
                        ? "destructive"
                        : subscription.status === "cancelled"
                          ? "outline"
                          : "outline"
                    }
                  />
                ) : (
                  <ManageBillingButton disabled />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
