/**
 * DEPRECATED: Explanation fetching has been removed from this hook.
 * This hook now only fetches the PDF URL for viewing.
 * Explanations are no longer generated (Step 5 in data flow removed).
 */
import * as React from "react";
import { logger } from "@/lib/logger";
import { getSignedPdfUrl } from "@/app/(dashboard)/(app)/_actions/lecture-actions";

export function useLecturePdf(lectureId: string) {
  const [pdfUrl, setPdfUrl] = React.useState<string>("");
  const [totalPageCount, setTotalPageCount] = React.useState(0);

  // Fetch initial PDF URL only
  React.useEffect(() => {
    const pdfPromise = getSignedPdfUrl(lectureId);

    pdfPromise.then(({ data, error }) => {
      if (data?.url) {
        setPdfUrl(data.url);
      } else if (error) {
        logger.error("Failed to fetch signed PDF URL:", error);
      }
    });
  }, [lectureId]);

  return {
    pdfUrl,
    totalPageCount,
    setTotalPageCount,
  };
}
