"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getLecture } from "@/app/actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { components } from "@/types/api";
import { Separator } from "@/components/ui/separator";
type UserCourseResponseDTO =
  components["schemas"]["app_internal_api_v1_dto.UserCourseResponseDTO"];

export interface NavCourse extends Omit<UserCourseResponseDTO, "course_id"> {
  courseId: string; // Keep courseId for existing code compatibility
  url: string;
}

interface DynamicBreadcrumbProps {
  navCourses: NavCourse[];
}

export function DynamicBreadcrumb({ navCourses }: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Don't render breadcrumb on root path
  if (pathname === "/") {
    return null;
  }

  const { courseId, lectureId } = useParams() as {
    courseId?: string;
    lectureId?: string;
  };

  // only track lecture info (title + associated course_id)
  const [lecture, setLecture] = useState<{
    title: string;
    course_id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // whenever lectureId changes, clear old state
    setLecture(null);
    setError(null);

    if (!lectureId) {
      // on course page, no loading
      setLoading(false);
      return;
    }

    // on a lecture page, fetch its data
    setLoading(true);
    getLecture(lectureId).then(({ data, error }) => {
      if (error) {
        setError(error);
      } else if (data) {
        setLecture({
          title: data.title ?? "Untitled Lecture",
          course_id: data.course_id!,
        });
      }
      setLoading(false);
    });
  }, [lectureId]);

  // pick the “active” courseId: fetched lecture.course_id overrides URL
  const activeCourseId = lecture?.course_id || courseId;
  const course = navCourses.find((c) => c.courseId === activeCourseId); // Using courseId since we kept it in NavCourse

  // label logic:
  //  • if loading → “Loading…”
  //  • else if error → show error
  //  • else if lectureId but no lecture (rare) → title fallback
  //  • else if no lectureId → “New”
  let crumbContent: React.ReactNode;
  if (loading) {
    crumbContent = "Loading…";
  } else if (error) {
    crumbContent = `Error: ${error}`;
  } else if (lecture) {
    crumbContent = lecture.title;
  } else {
    crumbContent = lectureId ? "Untitled Lecture" : "New";
  }

  return (
    <>
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {course && (
            <BreadcrumbItem>
              <BreadcrumbLink href={course.url}>{course.title}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="text-black">{crumbContent}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
