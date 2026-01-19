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
import PdfViewer from "@/app/(dashboard)/(app)/lecture/[lectureId]/_components/pdf-viewer";
import LottieAnimation from "./_components/lottie-animation";
import { MobileToggle } from "./_components/mobile-toggle";
import { ChatComponent } from "@/components/elements/chat";
import { CheckCircle2 } from "lucide-react";

// lib
import { cn } from "@/lib/utils";

// hooks
import { useIsMobile } from "@/hooks/use-mobile";
import { useLecturePdf } from "@/hooks/use-lecture-pdf";
import { useLectureStatus } from "@/hooks/use-lecture-status";
import { useLectureChats } from "@/hooks/use-lecture-chats";

// actions
import { getUser } from "@/app/(dashboard)/_actions/user-actions";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };

  // Mobile detection
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = React.useState<"pdf" | "chat">("chat");

  // User state for Gemini key check
  const [hasGeminiKey, setHasGeminiKey] = React.useState<boolean | null>(null);

  // PDF viewer state
  const [pageNumber, setPageNumber] = React.useState(1);

  // Custom hooks for lecture data
  const { pdfUrl, setTotalPageCount } = useLecturePdf(lectureId);
  const { lectureStatus, lectureTitle, errorDetails } =
    useLectureStatus(lectureId);
  const {
    currentChatId,
    chats,
    chatMessages,
    isLoadingChats,
    isLoadingMessages,
    handleChatChange,
    handleChatsChange,
  } = useLectureChats(lectureId);

  React.useEffect(() => {
    getUser().then(({ data }) => {
      setHasGeminiKey(data?.api_keys_provided?.gemini ?? false);
    });
  }, []);

  const handlePdfPageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const isSetupLecture = lectureTitle === "How to add Gemini API Key";
  const showSuccessMessage = isSetupLecture && hasGeminiKey;

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
              isMobile && mobileView !== "chat" && "hidden",
            )}
          >
            {showSuccessMessage ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm" />
                  <div className="relative flex items-center justify-center rounded-full bg-emerald-50 shadow-sm ring-1 ring-black/5 dark:bg-emerald-950/20 dark:ring-white/10">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                </div>

                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Gemini API Key successfully added!
                </h2>

                <p className="mb-8 max-w-[480px] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  You&apos;re now ready to start using MiniClue with your own
                  lectures. You may delete this guide from the sidebar and
                  upload your own PDFs to begin.
                </p>
              </div>
            ) : (
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
                errorDetails={errorDetails ?? undefined}
                pageNumber={pageNumber}
                disabled={
                  isLoadingChats ||
                  isLoadingMessages ||
                  lectureStatus !== "complete"
                }
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
