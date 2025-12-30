"use client";

import { useEditor, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { CHAT_SHORTCUTS, type Shortcut } from "@/lib/chat/shortcuts";
import type { MessagePart } from "@/types/chat";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { MentionListRef } from "@/components/elements/mention-list";

interface UseChatInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (message: { role: "user"; parts: MessagePart[] }) => void;
  pageNumber?: number;
  className?: string;
}

export function useChatInput({
  input,
  setInput,
  sendMessage,
  pageNumber,
  className,
}: UseChatInputProps) {
  const [suggestionData, setSuggestionData] = useState<{
    items: Shortcut[];
    command: (props: { id: string; label: string }) => void;
    clientRect: (() => DOMRect | null) | null | undefined;
  } | null>(null);

  const componentRef = useRef<MentionListRef>(null);

  // Refs for closure stability in Tiptap callbacks
  const sendMessageRef = useRef(sendMessage);
  const pageNumberRef = useRef(pageNumber);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
    pageNumberRef.current = pageNumber;
  }, [sendMessage, pageNumber]);

  const extractMessageParts = useCallback(
    (editorInstance: Editor | JSONContent): MessagePart[] => {
      const json =
        "getJSON" in editorInstance
          ? (editorInstance.getJSON() as JSONContent)
          : editorInstance;
      const parts: MessagePart[] = [];
      let textContent = "";
      let refCount = 0;

      const traverse = (node: JSONContent) => {
        if (node.type === "text") {
          textContent += node.text || "";
        } else if (node.type === "mention") {
          const shortcutId = node.attrs?.id;
          if (
            shortcutId === "current-slide" &&
            pageNumberRef.current !== undefined &&
            pageNumberRef.current !== null
          ) {
            refCount++;
            const refId = `REF_${refCount}`;
            parts.push({
              type: "data-reference",
              data: {
                type: "reference",
                text: refId,
                reference: {
                  type: "slide",
                  id: String(pageNumberRef.current),
                  metadata: {
                    label: node.attrs?.label,
                  },
                },
              },
            });
            textContent += refId;
          } else {
            textContent += (node.attrs?.label as string) || "";
          }
        }

        if (node.content) {
          node.content.forEach(traverse);
        }
      };

      traverse(json);

      if (textContent) {
        parts.push({
          type: "text",
          text: textContent,
        });
      }

      if (parts.length === 0) {
        parts.push({
          type: "text",
          text: "Explain this slide.",
        });
      }

      return parts;
    },
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Send a message..." }),
      Mention.configure({
        HTMLAttributes: {
          class:
            "group inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-md px-2 py-0.5 mx-0.5 text-xs font-medium",
        },
        suggestion: {
          items: ({ query }) => {
            return CHAT_SHORTCUTS.filter((item) =>
              item.label.toLowerCase().startsWith(query.toLowerCase()),
            );
          },
          command: ({ editor, range, props }) => {
            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: "mention",
                  attrs: props,
                },
                {
                  type: "text",
                  text: " ",
                },
              ])
              .run();
          },
          render: () => {
            return {
              onStart: (props) => {
                setSuggestionData({
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                });
              },
              onUpdate: (props) => {
                setSuggestionData({
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                });
              },
              onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                  setSuggestionData(null);
                  return true;
                }
                return componentRef.current?.onKeyDown(props) || false;
              },
              onExit: () => {
                setSuggestionData(null);
              },
            };
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: className || "",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Backspace" && view.state.selection.empty) {
          const { state, dispatch } = view;
          const { $from } = state.selection;
          const nodeBefore = $from.nodeBefore;

          if (nodeBefore && nodeBefore.type.name === "mention") {
            event.preventDefault();
            const tr = state.tr.delete(
              $from.pos - nodeBefore.nodeSize,
              $from.pos,
            );
            dispatch(tr);
            return true;
          }
        }

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const parts = extractMessageParts(
            view.state.doc.toJSON() as JSONContent,
          );
          if (parts.length > 0) {
            sendMessageRef.current({
              role: "user",
              parts,
            });

            const tr = view.state.tr.delete(0, view.state.doc.content.size);
            view.dispatch(tr);
          }
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text !== input) {
        setInput(text);
      }
    },
  });

  // Handle send message logic when called from outside the editor (e.g. Button click)
  useEffect(() => {
    if (input === "" && editor && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [input, editor]);

  const handleSendMessage = useCallback(() => {
    if (!editor) return;
    const parts = extractMessageParts(editor);
    if (parts.length > 0) {
      sendMessageRef.current({
        role: "user",
        parts,
      });
      editor.commands.clearContent();
    }
  }, [extractMessageParts, editor]);

  const menuStyle: CSSProperties = (() => {
    if (suggestionData?.clientRect) {
      const rect = suggestionData.clientRect();
      if (rect) {
        return {
          position: "fixed",
          top: `${rect.top - 8}px`,
          left: `${rect.left}px`,
          transform: "translateY(-100%)",
          zIndex: 50,
        };
      }
    }
    return {};
  })();

  return {
    editor,
    suggestionData,
    componentRef,
    menuStyle,
    handleSendMessage,
  };
}
