"use server";

import { components } from "@/types/api";
import {
  createAuthenticatedApi,
  ActionResponse,
} from "@/lib/api/authenticated-api";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleUpdateLectureAccessedAt(
  lectureId: string,
): Promise<ActionResponse<void>> {
  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { error: lectureError } = await api.PUT("/lectures/{lectureId}", {
    params: { path: { lectureId } },
    body: {
      accessed_at: new Date().toISOString(),
    },
  });

  if (lectureError) {
    console.error("Update lecture error:", lectureError);
    return { error: lectureError };
  }

  return { error: undefined };
}

export async function uploadLectures(
  courseId: string,
  formData: FormData,
): Promise<
  ActionResponse<
    components["schemas"]["app_internal_api_v1_dto.LectureUploadResponseDTO"][]
  >
> {
  formData.append("course_id", courseId);

  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { data, error: uploadError } = await api.POST("/lectures", {
    // The type is set to `any` because `openapi-fetch` supports FormData directly,
    // but the auto-generated type from `openapi-typescript` is incorrect for file uploads.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: formData as any,
    bodySerializer: (body) => body,
  });

  if (uploadError) {
    console.error("Upload lectures error:", uploadError);
    return { error: uploadError };
  }

  revalidateTag(`lectures:${courseId}`);
  revalidateTag("recents");

  const firstLectureId = data?.[0]?.lecture_id;
  if (firstLectureId) {
    redirect(`/lecture/${firstLectureId}`);
  }

  return { data, error: undefined };
}

export async function getLecture(
  lectureId: string,
): Promise<
  ActionResponse<
    components["schemas"]["app_internal_api_v1_dto.LectureResponseDTO"]
  >
> {
  const { api, error } = await createAuthenticatedApi();
  if (error || !api) {
    return { error };
  }

  const { data, error: fetchError } = await api.GET("/lectures/{lectureId}", {
    params: { path: { lectureId } },
    next: { tags: [`lecture:${lectureId}`] },
  });

  if (fetchError) {
    console.error("Get lecture error:", fetchError);
    return { data: undefined, error: fetchError };
  }

  return { data: data ?? undefined, error: undefined };
}
