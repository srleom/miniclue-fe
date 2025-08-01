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
    formData: FormData,
  ) => Promise<
    ActionResponse<
      components["schemas"]["app_internal_api_v1_dto.LectureUploadResponseDTO"][]
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
      toast.error("Course ID is missing. Cannot upload files.");
      return;
    }

    if (files.length === 0) {
      toast.info("No files to upload.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const toastId = toast.loading(
      `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`,
    );

    let result;
    try {
      result = await uploadLectures(courseId, formData);
      setFiles([]);
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.data) {
      let firstLectureId: string | null = null;
      let hasSuccessfulUpload = false;

      result.data.forEach((res) => {
        if (res.lecture_id) {
          // If we have a lecture_id, the upload was successful
          if (!firstLectureId) {
            firstLectureId = res.lecture_id;
          }
          hasSuccessfulUpload = true;
          toast.success(`Successfully uploaded ${res.filename}`);
        } else if (res.status === "upload_limit_exceeded") {
          toast.error(
            `Could not upload ${res.filename}. You have exceeded your monthly upload limit.`,
            {
              action: {
                label: "Upgrade Plan",
                onClick: () => router.push("/settings/subscription"),
              },
              actionButtonStyle: {
                backgroundColor: "#fff",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              },
            },
          );
        } else {
          toast.error(
            `An unexpected error occurred while uploading ${res.filename}.`,
          );
        }
      });

      // Only redirect if we have at least one successful upload
      if (firstLectureId && hasSuccessfulUpload) {
        router.push(`/lecture/${firstLectureId}`);
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
