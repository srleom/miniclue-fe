export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  return (
    <>
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 pb-20">
        {children}
      </div>
    </>
  );
}
