"use client";

// react
import { useState } from "react";

// components
import { BYOKTransitionDialog } from "./byok-transition-dialog";
import { Info } from "lucide-react";

export function APIKeyHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-muted-foreground mt-2">
          Bring your own keys (BYOK) from LLM providers.{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setDialogOpen(true);
            }}
            className="text-primary ml-1 inline-flex items-center gap-1 hover:underline"
          >
            <Info className="h-3 w-3" />
            Learn why we&apos;re transitioning to a BYOK model.
          </button>
        </p>
      </div>
      <BYOKTransitionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
