"use client";

// react
import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";

// third-party
import { toast } from "sonner";

// actions
import { setModelPreference } from "@/app/(dashboard)/_actions/user-actions";
import type { components } from "@/types/api";

// components
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

// icons
import { ChevronDown, Cpu } from "lucide-react";

// code
import {
  providerDisplayNames,
  providerLogos,
} from "@/app/(dashboard)/(settings)/settings/api-key/_components/provider-constants";

type ProviderKey =
  components["schemas"]["app_internal_api_v1_dto.ModelPreferenceRequestDTO"]["provider"];

type ProviderModels = {
  provider: ProviderKey;
  models: { id: string; name: string; enabled: boolean }[];
};

type ModelsListProps = {
  providers: ProviderModels[];
};

export function ModelsList({ providers }: ModelsListProps) {
  const [state, setState] = useState<ProviderModels[]>(providers);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasProviders = state.length > 0;

  const handleToggle = useCallback(
    (provider: ProviderKey, modelId: string, nextEnabled: boolean) => {
      const pendingId = `${provider}:${modelId}`;
      setPendingKey(pendingId);

      // Find model name for toast message
      const providerData = state.find((p) => p.provider === provider);
      const model = providerData?.models.find((m) => m.id === modelId);
      const modelName = model?.name ?? modelId;

      // optimistic update
      setState((prev) =>
        prev.map((p) =>
          p.provider === provider
            ? {
                ...p,
                models: p.models.map((m) =>
                  m.id === modelId ? { ...m, enabled: nextEnabled } : m,
                ),
              }
            : p,
        ),
      );

      startTransition(async () => {
        const { error } = await setModelPreference(
          provider,
          modelId,
          nextEnabled,
        );
        setPendingKey(null);
        if (error) {
          // revert on error
          setState((prev) =>
            prev.map((p) =>
              p.provider === provider
                ? {
                    ...p,
                    models: p.models.map((m) =>
                      m.id === modelId ? { ...m, enabled: !nextEnabled } : m,
                    ),
                  }
                : p,
            ),
          );
          toast.error(error);
        } else {
          toast.success(`${modelName} ${nextEnabled ? "enabled" : "disabled"}`);
        }
      });
    },
    [state, startTransition],
  );

  const providerCards = useMemo(
    () =>
      state.map((provider) => {
        const displayName =
          providerDisplayNames[
            provider.provider as keyof typeof providerDisplayNames
          ] ?? provider.provider;
        const logo = providerLogos[
          provider.provider as keyof typeof providerLogos
        ] ?? <Cpu className="h-4 w-4" />;

        const activeCount = provider.models.filter((m) => m.enabled).length;
        const totalCount = provider.models.length;
        const hasActiveModels = activeCount > 0;

        return (
          <Collapsible
            key={provider.provider}
            className="bg-card border-border/60 hover:border-border/80 rounded-lg border p-4 transition-colors"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between px-0 py-0 text-left"
              >
                <span className="flex items-center gap-3">
                  {logo}
                  <span className="font-medium">{displayName}</span>
                </span>
                <span
                  className={`flex items-center gap-2 text-sm ${
                    hasActiveModels ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {activeCount} of {totalCount} active
                  <ChevronDown className="h-4 w-4" />
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              {provider.models.map((model) => {
                const toggleId = `${provider.provider}:${model.id}`;
                const disabled = isPending && pendingKey === toggleId;
                return (
                  <div
                    key={model.id}
                    className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-0.5"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm leading-none font-medium">
                        {model.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {model.id}
                      </p>
                    </div>
                    <Switch
                      checked={model.enabled}
                      onCheckedChange={(checked) =>
                        handleToggle(provider.provider, model.id, checked)
                      }
                      disabled={disabled}
                    />
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      }),
    [state, isPending, pendingKey, handleToggle],
  );

  if (!hasProviders) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm font-medium">No providers available</p>
        <p className="text-muted-foreground text-sm">
          Add an API key in the <Link href="/settings/api-key">API Keys</Link>{" "}
          section to enable models here.
        </p>
      </div>
    );
  }

  return <div className="space-y-3">{providerCards}</div>;
}
