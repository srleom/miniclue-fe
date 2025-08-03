"use client";

// react
import * as React from "react";

// third-party
import { toast } from "sonner";

// types
import { ActionResponse } from "@/lib/api/authenticated-api";
import { components } from "@/types/api";

// components
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from "@/components/ui/dropzone";
import {
  FileList,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListSize,
} from "@/components/ui/file-list";
import { useRouter } from "next/navigation";

// lib
import { isSubscriptionPastDue } from "@/lib/utils";
import { logger } from "@/lib/logger";

type UserUsageData =
  components["schemas"]["app_internal_api_v1_dto.UserUsageResponseDTO"];

type SubscriptionData =
  components["schemas"]["app_internal_api_v1_dto.SubscriptionResponseDTO"];

export function DropzoneComponent({
  isCoursePage = false,
  courseId,
  uploadLectures,
  userUsage,
  subscription,
}: {
  isCoursePage?: boolean;
  courseId?: string;
  uploadLectures: (
    courseId: string,
    files: File[],
  ) => Promise<
    ActionResponse<
      components["schemas"]["app_internal_api_v1_dto.LectureUploadCompleteResponseDTO"][]
    >
  >;
  userUsage?: UserUsageData;
  subscription?: SubscriptionData;
}) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    // Check if subscription is past due before allowing uploads
    if (isSubscriptionPastDue(subscription)) {
      logger.warn("Upload blocked due to past due subscription");
      toast.error(
        "Your last payment failed. Please update your payment method to continue using MiniClue.",
        {
          action: {
            label: "Update Payment",
            onClick: () => router.push("/settings/subscription"),
          },
          actionButtonStyle: {
            backgroundColor: "#fff",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
          },
        },
      );
      return;
    }

    if (!isCoursePage || !courseId) {
      logger.error("Upload failed: Course ID is missing", {
        isCoursePage,
        courseId,
      });
      toast.error("Course ID is missing. Cannot upload files.");
      return;
    }

    if (files.length === 0) {
      logger.info("Upload attempted with no files");
      toast.info("No files to upload.");
      return;
    }

    setIsLoading(true);

    const toastId = toast.loading(
      `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`,
    );

    let result;
    try {
      logger.info("Starting file upload", {
        fileCount: files.length,
        courseId,
      });
      result = await uploadLectures(courseId, files);
      setFiles([]);
    } catch (error) {
      logger.error("Upload failed with exception", { error, courseId });
      throw error;
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }

    if (result?.error) {
      logger.error("Upload API returned error", { error: result.error });
      toast.error(result.error);
      return;
    }

    if (result?.data) {
      let firstLectureId: string | null = null;
      let hasSuccessfulUpload = false;
      let successCount = 0;
      let errorCount = 0;

      result.data.forEach((res, index) => {
        if (
          (res.status === "success" || res.status === "pending_processing") &&
          res.lecture_id
        ) {
          // If we have a lecture_id and status is success or pending_processing, the upload was successful
          if (!firstLectureId) {
            firstLectureId = res.lecture_id;
          }
          hasSuccessfulUpload = true;
          successCount++;
          toast.success(
            `Successfully uploaded ${files[index]?.name || "file"}`,
          );
        } else if (res.status === "error") {
          errorCount++;
          logger.error("File upload failed", {
            fileName: files[index]?.name,
            error: res.message,
            status: res.status,
          });
          toast.error(
            `Failed to upload ${files[index]?.name || "file"}: ${res.message || "Unknown error"}`,
          );
        }
      });

      logger.info("Upload processing complete", {
        successCount,
        errorCount,
        firstLectureId,
        hasSuccessfulUpload,
      });

      // Show summary toast
      if (successCount > 0 && errorCount > 0) {
        toast.info(
          `Upload complete: ${successCount} successful, ${errorCount} failed`,
        );
      } else if (successCount > 0) {
        toast.success(
          `Successfully uploaded ${successCount} file${successCount > 1 ? "s" : ""}`,
        );
      }

      // Only redirect if we have at least one successful upload
      if (firstLectureId && hasSuccessfulUpload) {
        logger.info("Redirecting to lecture page", {
          lectureId: firstLectureId,
        });
        router.push(`/lecture/${firstLectureId}`);
      } else {
        logger.warn("No redirect - no successful uploads", {
          firstLectureId,
          hasSuccessfulUpload,
        });
      }
    }
  };

  // Format file size limit for display
  const formatFileSizeLimit = (maxSizeMb: number) => {
    if (maxSizeMb >= 1024) {
      return `${(maxSizeMb / 1024).toFixed(1)}GB`;
    }
    return `${maxSizeMb}MB`;
  };

  // Get the file size limit from user usage or fallback to default
  const maxFileSizeMb = userUsage?.max_size_mb || 10;
  const fileSizeLimitText = formatFileSizeLimit(maxFileSizeMb);

  return (
    <Dropzone
      accept={{
        "application/pdf": [".pdf"],
      }}
      onDropAccepted={onDrop}
    >
      <div className="grid w-full gap-4">
        <DropzoneZone className="flex min-h-[14em] items-center justify-center md:min-h-[16em]">
          <DropzoneInput />
          <DropzoneGroup className="gap-4">
            <DropzoneUploadIcon />
            <DropzoneGroup>
              <DropzoneTitle>
                {isCoursePage
                  ? "Upload lectures here"
                  : "Drop files here or click to upload"}
              </DropzoneTitle>
              <DropzoneDescription className="text-center">
                {userUsage
                  ? `You can upload PDF files up to ${fileSizeLimitText} in size.`
                  : "You can upload PDF files up to 10MB in size."}
              </DropzoneDescription>
            </DropzoneGroup>
          </DropzoneGroup>
        </DropzoneZone>
        {files.length > 0 && (
          <FileList>
            {files.map((file) => (
              <FileListItem key={file.name}>
                <FileListHeader>
                  <FileListIcon />
                  <FileListInfo>
                    <FileListName>{file.name}</FileListName>
                    <FileListDescription>
                      <FileListSize>{file.size}</FileListSize>
                    </FileListDescription>
                  </FileListInfo>
                </FileListHeader>
              </FileListItem>
            ))}
          </FileList>
        )}
        {isCoursePage && files.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full hover:cursor-pointer sm:w-auto"
            >
              {isLoading
                ? "Uploading..."
                : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
            </Button>
          </div>
        )}
      </div>
    </Dropzone>
  );
}
