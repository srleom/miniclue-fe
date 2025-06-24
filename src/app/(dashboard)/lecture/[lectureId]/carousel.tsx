import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { placeholderMarkdown } from "./constants";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export function ExplainerCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        axis: "y",
      }}
      orientation="vertical"
      className="h-full w-full"
    >
      <CarouselContent className="-mt-0 h-full basis-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="h-full basis-full overflow-y-auto pt-0"
          >
            <Card className="markdown-content h-full w-full overflow-y-auto rounded-lg py-8">
              <CardContent className="px-10">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {placeholderMarkdown}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-6 bottom-6 flex space-x-2">
        <CarouselPrevious className="!static !translate-x-0 !rotate-0" />
        <CarouselNext className="!static !translate-x-0 !rotate-0" />
      </div>
    </Carousel>
  );
}
