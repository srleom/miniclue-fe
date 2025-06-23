import { getUserData } from "@/app/(dashboard)/sidebar-actions";
import { NavUser } from "@/components/app/layout/nav-user";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCourseDetails } from "./utils";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = await params;
  const course = await getCourseDetails(courseId);
  let user = { name: "", email: "", avatar: "" };
  const userRes = await getUserData();
  if (userRes.data) {
    user = userRes.data;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 hover:cursor-pointer" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* <DynamicBreadcrumb navCourses={navCourses} /> */}
        </div>
        <div className="flex items-center gap-2 px-4">
          <NavUser user={user} />
        </div>
      </header>
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 p-4 pt-0">
        {children}
      </div>
    </>
  );
}
