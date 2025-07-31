// components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/app/(dashboard)/(app)/_components/layout/nav-user";

// code
import { getCourseDetails } from "@/app/(dashboard)/_actions/course-actions";
import { getUser } from "@/app/(dashboard)/_actions/user-actions";
import { handleLogout } from "@/app/auth/actions";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const courseRes = await getCourseDetails(courseId);
  if (!courseRes.data) {
    return <p>Course not found</p>;
  }
  const { title: courseTitle } = courseRes.data;
  let user = { name: "", email: "", avatar: "" };
  const userRes = await getUser();
  if (userRes.data) {
    user = {
      name: userRes.data.name ?? "",
      email: userRes.data.email ?? "",
      avatar: userRes.data.avatar_url ?? "",
    };
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 hover:cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/course/${courseId}`}>
                  {courseTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <NavUser user={user} handleLogout={handleLogout} />
        </div>
      </header>
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 pb-20">
        {children}
      </div>
    </>
  );
}
