"use client";

import { type ComponentProps, memo, type ReactNode } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&_code]:break-words [&_code]:whitespace-pre-wrap [&_pre]:max-w-full [&_pre]:overflow-x-auto [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
      components={
        {
          t: ({ children }: { children: ReactNode }) => (
            <span className="text-muted-foreground italic">{children}</span>
          ),
          thought: ({ children }: { children: ReactNode }) => (
            <span className="text-muted-foreground italic">{children}</span>
          ),
          thinking: ({ children }: { children: ReactNode }) => (
            <span className="text-muted-foreground italic">{children}</span>
          ),
        } as unknown as NonNullable<ResponseProps["components"]>
      }
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = "Response";
