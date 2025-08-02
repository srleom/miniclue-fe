"use client";

// next
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// icons
import { MoreHorizontal, Plus } from "lucide-react";

// types
import { NavRecentsItem } from "../../_types/types";
import { ActionResponse } from "@/lib/api/authenticated-api";

// components
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import NavLecture from "./nav-lecture";

// actions
import { getUserRecents } from "@/app/(dashboard)/_actions/user-actions";

export function NavRecents({
  items,
  handleUpdateLectureAccessedAt,
  deleteLecture,
}: {
  items: NavRecentsItem[];
  handleUpdateLectureAccessedAt: (
    lectureId: string,
  ) => Promise<ActionResponse<void>>;
  deleteLecture: (lectureId: string) => Promise<ActionResponse<void>>;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<NavRecentsItem[]>([]);

  const allItems = [...items, ...additionalItems];
  const hasMore = allItems.length < (allItems[0]?.totalCount ?? 0);

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleRenameSuccess = () => {
    // Refresh the page data to get updated recents
    router.refresh();
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const result = await getUserRecents(5, allItems.length);

      if (result.data && result.data.length > 0) {
        // Check for duplicates by comparing lecture IDs
        const existingIds = new Set(allItems.map((item) => item.lectureId));
        const newItems = result.data.filter(
          (item) => !existingIds.has(item.lectureId),
        );

        if (newItems.length > 0) {
          setAdditionalItems((prev) => [...prev, ...newItems]);
        }
      }
    } catch (error) {
      console.error("Failed to load more recents:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="group/recents hover:bg-sidebar-accent relative flex w-full items-center justify-between pr-1">
        <span>Recents</span>
        <SidebarGroupAction
          asChild
          className="hover:bg-sidebar-border absolute top-1.5 right-1 opacity-100 group-hover/recents:opacity-100 hover:cursor-pointer md:opacity-0 md:group-hover/recents:opacity-100"
        >
          <Link href="/" onClick={handleNavigation}>
            <Plus />
            <span className="sr-only">Add content</span>
          </Link>
        </SidebarGroupAction>
      </SidebarGroupLabel>
      <SidebarMenu>
        {allItems.map((item) => (
          <NavLecture
            key={item.lectureId}
            lecture={{ lecture_id: item.lectureId, title: item.name }}
            isMobile={isMobile}
            handleUpdateLectureAccessedAt={handleUpdateLectureAccessedAt}
            deleteLecture={deleteLecture}
            onRenameSuccess={handleRenameSuccess}
          />
        ))}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={isLoadingMore ? "cursor-not-allowed opacity-50" : ""}
            >
              <MoreHorizontal />
              <span>{isLoadingMore ? "Loading..." : "More"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
