"use client";

// styles
import "katex/dist/katex.min.css";

// react
import * as React from "react";

// next
import { useParams } from "next/navigation";

// third-party
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// components
import { Card, CardContent } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfViewer from "@/app/(dashboard)/lecture/[lectureId]/_components/pdf-viewer";
import { ExplainerCarousel } from "./_components/carousel";
import LottieAnimation from "./_components/lottie-animation";

// lib
import { createClient } from "@/lib/supabase/client";

// code
import {
  getExplanations,
  getSignedPdfUrl,
  getSummary,
  getLecture,
} from "@/app/(dashboard)/_actions/lecture-actions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };
  const [supabase] = React.useState(() => createClient());
  const channelRef = React.useRef<
    ReturnType<typeof supabase.channel> | undefined
  >(undefined);
  const [pdfUrl, setPdfUrl] = React.useState<string>("");
  const [explanations, setExplanations] = React.useState<
    Record<number, string>
  >({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalPageCount, setTotalPageCount] = React.useState(0);
  const [scrollSource, setScrollSource] = React.useState<
    "pdf" | "carousel" | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<string>("explanation");
  const [summary, setSummary] = React.useState<string | undefined>(undefined);
  const [summaryLoading, setSummaryLoading] = React.useState<boolean>(false);
  const [lectureStatus, setLectureStatus] = React.useState<string | undefined>(
    undefined,
  );
  const statusChannelRef = React.useRef<
    ReturnType<typeof supabase.channel> | undefined
  >(undefined);
  const summaryChannelRef = React.useRef<
    ReturnType<typeof supabase.channel> | undefined
  >(undefined);

  React.useEffect(() => {
    setLoading(true);
    const pdfPromise = getSignedPdfUrl(lectureId);
    const explanationsPromise = getExplanations(lectureId);

    pdfPromise.then(({ data, error }) => {
      if (data?.url) {
        setPdfUrl(data.url);
      } else if (error) {
        console.error("Failed to fetch signed PDF URL:", error);
      }
    });

    explanationsPromise.then(({ data, error }) => {
      if (data) {
        const map: Record<number, string> = {};
        data.forEach((ex) => {
          if (ex.slide_number != null && ex.content) {
            map[ex.slide_number] = ex.content;
          }
        });
        setExplanations(map);
      } else if (error) {
        console.error("Failed to fetch explanations:", error);
      }
    });

    Promise.allSettled([pdfPromise, explanationsPromise]).finally(() => {
      setLoading(false);
    });
  }, [lectureId]);

  // Effect 1: Subscribe to the channel when the component is ready.
  // We disable the lint rule because we intentionally want this effect to run only
  // once when loading is finished, not every time `explanations` changes.
  React.useEffect(() => {
    // Don't run if we're still loading initial data or don't know the page count.
    if (loading || totalPageCount === 0) {
      return;
    }

    // Don't subscribe if we already have all explanations or an active channel.
    const explanationsCount = Object.keys(explanations).length;
    if (explanationsCount >= totalPageCount || channelRef.current) {
      return;
    }

    console.log("Subscribing to explanations channel");
    channelRef.current = supabase
      .channel(`realtime:explanations:${lectureId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "explanations",
          filter: `lecture_id=eq.${lectureId}`,
        },
        ({ new: row }) => {
          console.log("New explanation:", row);
          setExplanations((prev) => ({
            ...prev,
            [row.slide_number]: row.content,
          }));
        },
      )
      .subscribe((status, err) => {
        console.log("Explanations subscription status:", status);
        if (err) {
          console.error("Subscription error:", err);
        }
      });

    // On unmount, we clean up the channel.
    return () => {
      if (channelRef.current) {
        console.log("Unsubscribing from explanations channel on unmount");
        supabase.removeChannel(channelRef.current);
        channelRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, totalPageCount, lectureId, supabase]);

  // Effect 2: Unsubscribe when all explanations have been received.
  React.useEffect(() => {
    const explanationsCount = Object.keys(explanations).length;
    if (
      totalPageCount > 0 &&
      explanationsCount >= totalPageCount &&
      channelRef.current
    ) {
      console.log("All explanations received, unsubscribing.");
      supabase.removeChannel(channelRef.current);
      channelRef.current = undefined;
    }
  }, [explanations, totalPageCount, supabase]);

  React.useEffect(() => {
    if (
      lectureStatus === undefined ||
      lectureStatus === "complete" ||
      lectureStatus === "failed"
    ) {
      return;
    }

    console.log("Subscribing to status channel");
    statusChannelRef.current = supabase
      .channel(`realtime:status:${lectureId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lectures",
          filter: `id=eq.${lectureId}`,
        },
        ({ new: row }) => {
          console.log("New status row:", row);
          if (row.status) {
            console.log("Realtime status update:", row.status);
            setLectureStatus(row.status);
            toast.info(
              row.status
                .split("_")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1),
                )
                .join(" "),
            );
          }
          if (row.status === "complete" || row.status === "failed") {
            console.log(
              `Status ${row.status} reached, unsubscribing status channel`,
            );
            if (row.status === "complete") {
              toast.success("Success");
            } else if (row.status === "failed") {
              toast.error("Error");
            }
            if (statusChannelRef.current) {
              supabase.removeChannel(statusChannelRef.current);
              statusChannelRef.current = undefined;
            }
          }
        },
      )
      .subscribe((status, err) => {
        console.log("Status subscription status:", status);
        if (err) {
          console.error("Status subscription error:", err);
        }
      });

    return () => {
      console.log("Unsubscribing from status channel on unmount");
      if (statusChannelRef.current) {
        supabase.removeChannel(statusChannelRef.current);
        statusChannelRef.current = undefined;
      }
    };
  }, [lectureStatus, lectureId, supabase]);

  // Initial fetch of summary on mount
  React.useEffect(() => {
    setSummaryLoading(true);
    getSummary(lectureId)
      .then(({ data }) => {
        if (data?.content) {
          setSummary(data.content);
        }
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  }, [lectureId]);

  // Subscribe to INSERT events on summaries for live updates
  React.useEffect(() => {
    if (summaryChannelRef.current || summary !== undefined) {
      return;
    }
    console.log("Subscribing to summaries channel");
    summaryChannelRef.current = supabase
      .channel(`realtime:summaries:${lectureId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "summaries",
          filter: `lecture_id=eq.${lectureId}`,
        },
        ({ new: row }) => {
          console.log("New summary row:", row);
          setSummary(row.content);
          if (summaryChannelRef.current) {
            supabase.removeChannel(summaryChannelRef.current);
            summaryChannelRef.current = undefined;
          }
        },
      )
      .subscribe((status, err) => {
        console.log("Summary subscription status:", status);
        if (err) console.error("Summary subscription error:", err);
      });
    return () => {
      if (summaryChannelRef.current) {
        console.log("Unsubscribing from summary channel on unmount");
        supabase.removeChannel(summaryChannelRef.current);
        summaryChannelRef.current = undefined;
      }
    };
  }, [lectureId, summary, supabase]);

  const handlePdfPageChange = (newPage: number) => {
    setScrollSource("pdf");
    setPageNumber(newPage);
  };

  const handleCarouselPageChange = (newPage: number) => {
    setScrollSource("carousel");
    setPageNumber(newPage);
  };

  return (
    <>
      {lectureStatus !== "complete" && lectureStatus !== "failed" && (
        <Toaster />
      )}
      <div className="mx-auto h-[calc(100vh-6rem)] w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="h-full pr-6">
            {pdfUrl ? (
              <PdfViewer
                fileUrl={pdfUrl}
                pageNumber={pageNumber}
                onPageChange={handlePdfPageChange}
                onDocumentLoad={setTotalPageCount}
                scrollSource={scrollSource}
              />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center rounded-lg border">
                <LottieAnimation />
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="flex flex-col pl-6">
            <Tabs
              defaultValue="explanation"
              onValueChange={(value) => setActiveTab(value)}
              className="flex min-h-0 flex-col"
            >
              <TabsList className="w-full flex-shrink-0">
                <TabsTrigger
                  value="explanation"
                  className="hover:cursor-pointer"
                >
                  Explanation
                </TabsTrigger>
                <TabsTrigger value="summary" className="hover:cursor-pointer">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="chat" className="hover:cursor-pointer">
                  Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="explanation"
                className="mt-3 flex min-h-0 flex-1 flex-col"
              >
                <ExplainerCarousel
                  pageNumber={pageNumber}
                  onPageChange={handleCarouselPageChange}
                  totalPageCount={totalPageCount}
                  scrollSource={scrollSource}
                  explanations={explanations}
                />
              </TabsContent>
              <TabsContent
                value="summary"
                className="mt-3 flex min-h-0 flex-1 flex-col"
              >
                {summary === undefined || summaryLoading || summary === "" ? (
                  <div className="text-muted-foreground flex h-[calc(100vh-9.5rem)] flex-col items-center justify-center rounded-lg border">
                    <LottieAnimation />
                  </div>
                ) : (
                  <Card className="markdown-content h-[calc(100vh-9.5rem)] w-full overflow-y-auto rounded-lg py-8 shadow-none">
                    <CardContent className="px-10">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {summary}
                      </ReactMarkdown>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="chat" className="mt-3 flex-1">
                <div className="text-muted-foreground flex h-[calc(100vh-9.5rem)] flex-col items-center justify-center rounded-lg border">
                  <LottieAnimation />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
