"use client";

// react
import * as React from "react";

// next
import { useParams } from "next/navigation";

// components
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfViewer from "@/app/(dashboard)/(app)/lecture/[lectureId]/_components/pdf-viewer";
import LottieAnimation from "./_components/lottie-animation";
import { MobileToggle } from "./_components/mobile-toggle";
import { ChatComponent } from "@/components/elements/chat";
import { Card } from "@/components/ui/card";

// lib
import { cn } from "@/lib/utils";

// icons
import { SquareCheckBig } from "lucide-react";

// hooks
import { useIsMobile } from "@/hooks/use-mobile";
import { useLecturePdf } from "@/hooks/use-lecture-pdf";
import { useLectureStatus } from "@/hooks/use-lecture-status";
import { useLectureChats } from "@/hooks/use-lecture-chats";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };

  // Mobile detection
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = React.useState<"pdf" | "tools">("pdf");

  // PDF viewer state
  const [pageNumber, setPageNumber] = React.useState(1);

  // Custom hooks for lecture data
  const { pdfUrl, setTotalPageCount } = useLecturePdf(lectureId);
  const { lectureStatus } = useLectureStatus(lectureId);
  const {
    currentChatId,
    chats,
    chatMessages,
    isLoadingChats,
    isLoadingMessages,
    handleChatChange,
    handleChatsChange,
  } = useLectureChats(lectureId);

  const handlePdfPageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  if (isMobile === undefined) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center rounded-lg border">
        <LottieAnimation />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full flex-col overflow-hidden">
        {isMobile && (
          <MobileToggle mobileView={mobileView} onViewChange={setMobileView} />
        )}
        <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
          <ResizablePanel
            className={cn(
              "h-full min-h-0 overflow-auto",
              !isMobile && "pr-6",
              isMobile && mobileView !== "pdf" && "hidden",
            )}
          >
            {pdfUrl ? (
              <PdfViewer
                fileUrl={pdfUrl}
                pageNumber={pageNumber}
                onPageChange={handlePdfPageChange}
                onDocumentLoad={setTotalPageCount}
              />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center rounded-lg border">
                <LottieAnimation />
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle className={cn(isMobile && "hidden")} />
          <ResizablePanel
            className={cn(
              "flex min-h-0 flex-col",
              !isMobile && "pl-6",
              isMobile && mobileView !== "tools" && "hidden",
            )}
          >
            <Tabs
              defaultValue="chat"
              className="flex min-h-0 flex-1 flex-col gap-1"
            >
              <TabsList className="w-full flex-shrink-0">
                <TabsTrigger value="chat" className="hover:cursor-pointer">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="quiz" className="hover:cursor-pointer">
                  Quiz
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="chat"
                className="mt-3 flex min-h-0 flex-1 flex-col"
              >
                <ChatComponent
                  chatId={currentChatId}
                  chats={chats}
                  initialMessages={
                    currentChatId ? chatMessages[currentChatId] || [] : []
                  }
                  isLoadingChats={isLoadingChats}
                  lectureId={lectureId}
                  onChatChange={handleChatChange}
                  onChatsChange={handleChatsChange}
                  lectureStatus={lectureStatus}
                  disabled={
                    isLoadingChats ||
                    isLoadingMessages ||
                    lectureStatus !== "complete"
                  }
                />
              </TabsContent>

              <TabsContent
                value="quiz"
                className="mt-3 flex min-h-0 flex-1 flex-col"
              >
                <Card className="flex flex-1 flex-col items-center justify-center rounded-lg border p-8 text-center shadow-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className="mb-3 flex items-center gap-2 rounded-full bg-amber-100 p-4">
                      <SquareCheckBig className="h-8 w-8" />
                    </div>
                    <h2 className="text-foreground text-xl font-medium">
                      Quiz Feature Coming Soon
                    </h2>
                    <p className="text-muted-foreground max-w-sm text-sm">
                      We&apos;re building an MCQ quiz generator for you to test
                      your knowledge on this lecture. Stay tuned!
                    </p>
                  </div>
                </Card>
              </TabsContent>

              {/* DEPRECATED: Explanation and summary tabs content */}
              {/* <TabsContent
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
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center rounded-lg border">
                    <LottieAnimation />
                  </div>
                ) : (
                  <Card className="markdown-content flex h-full w-full overflow-y-auto rounded-lg py-6 shadow-none sm:py-8">
                    <CardContent className="px-6 sm:px-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {summary}
                      </ReactMarkdown>
                    </CardContent>
                  </Card>
                )}
              </TabsContent> */}
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
