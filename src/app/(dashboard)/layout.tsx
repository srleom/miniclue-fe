import { AppSidebar } from "@/components/app/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { getUserRecents, getUserCourses } from "./sidebar-actions";

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
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar navCourses={navCourses} navRecents={navRecents} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
