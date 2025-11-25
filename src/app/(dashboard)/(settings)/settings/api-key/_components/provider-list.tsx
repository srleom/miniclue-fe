"use client";

// react
import { useState } from "react";

// icons
import { Check, X, ChevronRight } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./api-key-dialog";

export type Provider = "openai" | "gemini";

interface ProviderInfo {
  id: Provider;
  name: string;
  logo: React.ReactNode;
}

const providers: ProviderInfo[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        className="h-6 w-6"
      >
        <path
          fill="currentColor"
          d="M20.562 10.188c.25-.688.313-1.376.25-2.063c-.062-.687-.312-1.375-.625-2c-.562-.937-1.375-1.687-2.312-2.125c-1-.437-2.063-.562-3.125-.312c-.5-.5-1.063-.938-1.688-1.25S11.687 2 11 2a5.17 5.17 0 0 0-3 .938c-.875.624-1.5 1.5-1.813 2.5c-.75.187-1.375.5-2 .875c-.562.437-1 1-1.375 1.562c-.562.938-.75 2-.625 3.063a5.44 5.44 0 0 0 1.25 2.874a4.7 4.7 0 0 0-.25 2.063c.063.688.313 1.375.625 2c.563.938 1.375 1.688 2.313 2.125c1 .438 2.062.563 3.125.313c.5.5 1.062.937 1.687 1.25S12.312 22 13 22a5.17 5.17 0 0 0 3-.937c.875-.625 1.5-1.5 1.812-2.5a4.54 4.54 0 0 0 1.938-.875c.562-.438 1.062-.938 1.375-1.563c.562-.937.75-2 .625-3.062c-.125-1.063-.5-2.063-1.188-2.876m-7.5 10.5c-1 0-1.75-.313-2.437-.875c0 0 .062-.063.125-.063l4-2.312a.5.5 0 0 0 .25-.25a.57.57 0 0 0 .062-.313V11.25l1.688 1v4.625a3.685 3.685 0 0 1-3.688 3.813M5 17.25c-.438-.75-.625-1.625-.438-2.5c0 0 .063.063.125.063l4 2.312a.56.56 0 0 0 .313.063c.125 0 .25 0 .312-.063l4.875-2.812v1.937l-4.062 2.375A3.7 3.7 0 0 1 7.312 19c-1-.25-1.812-.875-2.312-1.75M3.937 8.563a3.8 3.8 0 0 1 1.938-1.626v4.751c0 .124 0 .25.062.312a.5.5 0 0 0 .25.25l4.875 2.813l-1.687 1l-4-2.313a3.7 3.7 0 0 1-1.75-2.25c-.25-.937-.188-2.062.312-2.937M17.75 11.75l-4.875-2.812l1.687-1l4 2.312c.625.375 1.125.875 1.438 1.5s.5 1.313.437 2.063a3.7 3.7 0 0 1-.75 1.937c-.437.563-1 1-1.687 1.25v-4.75c0-.125 0-.25-.063-.312c0 0-.062-.126-.187-.188m1.687-2.5s-.062-.062-.125-.062l-4-2.313c-.125-.062-.187-.062-.312-.062s-.25 0-.313.062L9.812 9.688V7.75l4.063-2.375c.625-.375 1.312-.5 2.062-.5c.688 0 1.375.25 2 .688c.563.437 1.063 1 1.313 1.625s.312 1.375.187 2.062m-10.5 3.5l-1.687-1V7.063c0-.688.187-1.438.562-2C8.187 4.438 8.75 4 9.375 3.688a3.37 3.37 0 0 1 2.062-.313c.688.063 1.375.375 1.938.813c0 0-.063.062-.125.062l-4 2.313a.5.5 0 0 0-.25.25c-.063.125-.063.187-.063.312zm.875-2L12 9.5l2.187 1.25v2.5L12 14.5l-2.188-1.25z"
        />
      </svg>
    ),
  },
  {
    id: "gemini",
    name: "Google Gemini",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        className="h-6 w-6"
      >
        <path
          fill="currentColor"
          d="M12 11h8.533q.066.578.067 1.184c0 2.734-.98 5.036-2.678 6.6c-1.485 1.371-3.518 2.175-5.942 2.175A8.976 8.976 0 0 1 3 11.98A8.976 8.976 0 0 1 11.98 3c2.42 0 4.453.89 6.008 2.339L16.526 6.8C15.368 5.681 13.803 5 12 5a7 7 0 0 0 0 14c3.527 0 6.144-2.608 6.577-6H12z"
        />
      </svg>
    ),
  },
];

interface ProviderListProps {
  apiKeysStatus: Record<Provider, boolean>;
  onUpdate: (provider: Provider) => void;
}

export function ProviderList({ apiKeysStatus, onUpdate }: ProviderListProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProvider(null);
  };

  const handleSuccess = () => {
    handleDialogClose();
    if (selectedProvider) {
      onUpdate(selectedProvider);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {providers.map((provider) => {
          const hasKey = apiKeysStatus[provider.id] ?? false;
          return (
            <div
              key={provider.id}
              className="bg-card hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                {provider.logo}
                <div>
                  <div className="font-medium">{provider.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {hasKey ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <X className="h-4 w-4" />
                    <span>Not added</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleProviderClick(provider.id)}
                  className="gap-2"
                >
                  {hasKey ? "Edit" : "Add"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProvider && (
        <ApiKeyDialog
          provider={selectedProvider}
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleDialogClose();
            } else {
              setIsDialogOpen(true);
            }
          }}
          onSuccess={handleSuccess}
          hasKey={apiKeysStatus[selectedProvider] ?? false}
        />
      )}
    </>
  );
}
