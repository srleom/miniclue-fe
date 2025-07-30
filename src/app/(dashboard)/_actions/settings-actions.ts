"use server";

// next
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// types
import { components } from "@/types/api";

// lib
import {
  ActionResponse,
  createAuthenticatedApi,
} from "@/lib/api/authenticated-api";
import { createAdminClient } from "@/lib/supabase/server";

export async function getUserProfile(): Promise<
  ActionResponse<
    components["schemas"]["app_internal_api_v1_dto.UserResponseDTO"]
  >
> {
  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { data, error: fetchError } = await api.GET("/users/me", {
    next: { tags: ["user-profile"], revalidate: 300 },
  });

  if (fetchError) {
    console.error("Get user profile error:", fetchError);
    return { error: fetchError };
  }

  return { data, error: undefined };
}

export async function deleteUserAccount(): Promise<ActionResponse<void>> {
  try {
    // First get the current user's profile to get their ID
    const { data: user, error: profileError } = await getUserProfile();

    if (profileError || !user) {
      return { error: "Failed to get user profile" };
    }

    // Create Supabase client with service role key for admin operations
    const supabase = await createAdminClient();

    // Delete the user using Supabase admin API
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.user_id!,
      false, // shouldSoftDelete: false
    );

    if (deleteError) {
      console.error("Delete user error:", deleteError);
      return { error: deleteError.message };
    }

    // Revalidate any cached user data
    revalidateTag("user-profile");

    // Redirect to login page after successful deletion
    // This will throw NEXT_REDIRECT which is expected behavior
    redirect("/auth/login");
  } catch (error) {
    // Check if this is a Next.js redirect (expected behavior)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is expected, let it propagate
      throw error;
    }

    console.error("Delete user account error:", error);
    return { error: "Failed to delete user account" };
  }
}
