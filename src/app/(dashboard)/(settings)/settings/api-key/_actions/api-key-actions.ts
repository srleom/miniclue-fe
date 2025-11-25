"use server";

// next
import { revalidateTag, revalidatePath } from "next/cache";

// types
import type { components } from "@/types/api";

// lib
import {
  ActionResponse,
  createAuthenticatedApi,
} from "@/lib/api/authenticated-api";
import { logger } from "@/lib/logger";

/**
 * Stores the user's API key securely.
 * @param {"openai" | "gemini"} provider - The API provider
 * @param {string} apiKey - The API key to store
 * @returns {Promise<ActionResponse<components["schemas"]["app_internal_api_v1_dto.APIKeyResponseDTO"]>>}
 */
export async function storeAPIKey(
  provider: "openai" | "gemini",
  apiKey: string,
): Promise<
  ActionResponse<
    components["schemas"]["app_internal_api_v1_dto.APIKeyResponseDTO"]
  >
> {
  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { data, error: fetchError } = await api.POST("/users/me/api-key", {
    body: {
      provider: provider as "openai" | "gemini",
      api_key: apiKey,
    },
  });

  if (fetchError) {
    logger.error("Store API key error:", fetchError);
    return { error: fetchError };
  }

  // Revalidate user profile cache to reflect the updated API key status
  revalidateTag("user-profile");
  // Also revalidate the API key settings page to ensure it shows updated status
  revalidatePath("/settings/api-key");

  return { data, error: undefined };
}

/**
 * Gets the user's API key status for a specific provider.
 * @param {"openai" | "gemini"} provider - The API provider
 * @returns {Promise<ActionResponse<components["schemas"]["app_internal_api_v1_dto.APIKeyResponseDTO"]>>}
 */
export async function getAPIKeyStatus(
  provider: "openai" | "gemini" = "openai",
): Promise<
  ActionResponse<
    components["schemas"]["app_internal_api_v1_dto.APIKeyResponseDTO"]
  >
> {
  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { data, error: fetchError } = await api.GET("/users/me/api-key", {
    params: {
      query: {
        provider: provider as "openai" | "gemini",
      },
    },
  });

  if (fetchError) {
    logger.error("Get API key status error:", fetchError);
    return { error: fetchError };
  }

  return { data, error: undefined };
}
