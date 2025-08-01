// third-party
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { components } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isPaidUser(
  subscription?: components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"],
): boolean {
  return !!(
    subscription?.plan_id &&
    subscription.plan_id !== "free" &&
    subscription.plan_id !== "beta" &&
    subscription.status === "active"
  );
}

export function getPlanDisplayName(
  subscription?: components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"],
): string {
  if (!subscription?.plan_id) {
    return "Free";
  }

  // If it's a paid plan, show "Pro"
  if (isPaidUser(subscription)) {
    return "Pro";
  }

  // For non-paid plans, show the plan name with first letter capitalized
  return (
    subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1)
  );
}

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
