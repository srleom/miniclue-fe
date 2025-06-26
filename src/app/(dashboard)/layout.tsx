import { AppSidebar } from "@/app/(dashboard)/_components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import {
  getUserRecents,
  getUserCourses,
} from "@/app/(dashboard)/_actions/sidebar-actions";
import {
  createUntitledCourse,
  deleteCourse,
  getCourseLectures,
} from "@/app/(dashboard)/_actions/course-actions";
import { handleUpdateLectureAccessedAt } from "@/app/(dashboard)/_actions/lecture-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  const sidebarOpen = sidebarCookie === "true";

  let navRecents: { name: string; lectureId: string; url: string }[] = [];
  let navCourses: {
    title: string;
    url: string;
    courseId: string;
    isDefault: boolean;
  }[] = [];

  const recentsRes = await getUserRecents();
  if (recentsRes.data) {
    navRecents = recentsRes.data;
  }

  const coursesRes = await getUserCourses();
  if (coursesRes.data) {
    navCourses = coursesRes.data;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar
          navCourses={navCourses}
          navRecents={navRecents}
          createUntitledCourse={createUntitledCourse}
          deleteCourse={deleteCourse}
          getCourseLectures={getCourseLectures}
          handleUpdateLectureAccessedAt={handleUpdateLectureAccessedAt}
        />
        <SidebarInset className="flex min-h-0 flex-1 flex-col">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
