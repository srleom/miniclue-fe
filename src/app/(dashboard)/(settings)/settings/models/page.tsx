// react
import { Suspense } from "react";

// actions
import { getUserModels } from "@/app/(dashboard)/_actions/user-actions";
import type { components } from "@/types/api";

// components
import { ModelsList } from "./_components/models-list";
import { ModelsHeader } from "./_components/models-header";

async function ModelsContent() {
  const { data, error } = await getUserModels();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Failed to load models</p>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  type ProviderKey =
    components["schemas"]["app_internal_api_v1_dto.ModelPreferenceRequestDTO"]["provider"];

  const providers =
    data?.providers
      ?.flatMap((p) => {
        if (!p?.provider) return [];
        const provider = p.provider as ProviderKey;
        const models =
          p.models
            ?.map((m) => ({
              id: m.id ?? "",
              name: m.name ?? m.id ?? "",
              enabled: Boolean(m.enabled),
            }))
            .filter((m) => m.id !== "") ?? [];
        return [{ provider, models }];
      })
      .filter((p) => p.models.length > 0) ?? [];

  return (
    <div className="mx-auto mt-4 flex w-full flex-col items-center md:mt-16 lg:w-3xl">
      <div className="flex w-full flex-col gap-12">
        <ModelsHeader />

        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-tighter uppercase">
            Available Models
          </h2>
          <ModelsList providers={providers} />
        </div>
      </div>
    </div>
  );
}

export default function ModelsSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-4 flex w-full flex-col items-center md:mt-16 lg:w-3xl">
          <div className="flex w-full flex-col gap-6">
            <ModelsHeader />
            <div className="flex items-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ModelsContent />
    </Suspense>
  );
}
