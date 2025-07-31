"use client";

// react
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// third-party
import { toast } from "sonner";

export function PaymentToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "success") {
      toast.success(
        "Payment successful! Your subscription has been activated.",
      );
    } else if (status === "cancel") {
      toast.info("Payment was cancelled. You can try again anytime.");
    }
  }, [searchParams]);

  return null;
}
