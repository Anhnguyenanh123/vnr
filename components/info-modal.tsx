"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { ExhibitData } from "@/types/museum";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface InfoModalProps {
  exhibit: ExhibitData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({
  exhibit,
  isOpen,
  onClose,
}: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !exhibit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#16213e] border border-[#0f3460] rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#0f3460] to-[#16213e] px-6 py-4 flex items-center justify-between border-b border-[#1a1a2e] z-10">
          <div className="flex-1">
            <div className="text-xs text-[#4ade80] font-medium mb-1">
              Phòng {exhibit.roomNumber}
            </div>
            <h2 className="text-2xl font-bold text-[#e8e8e8]">
              {exhibit.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] no-scrollbar">
          <div className="p-6">
            {exhibit.image && (
              <div className="mb-6 rounded-lg overflow-hidden border-2 border-[#0f3460] shadow-lg">
                <Image
                  width={800}
                  height={400}
                  src={exhibit.image || "/placeholder.svg"}
                  alt={exhibit.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="markdown-content prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Headings
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-[#e8e8e8] mb-4 mt-8 pb-3 border-b-2 border-[#4ade80]"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-[#e8e8e8] mb-3 mt-6 pb-2 border-b border-[#0f3460]"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-semibold text-[#e8e8e8] mb-3 mt-5"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-lg font-semibold text-[#cbd5e1] mb-2 mt-4"
                      {...props}
                    />
                  ),
                  h5: ({ node, ...props }) => (
                    <h5
                      className="text-base font-semibold text-[#cbd5e1] mb-2 mt-3"
                      {...props}
                    />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6
                      className="text-sm font-semibold text-[#94a3b8] mb-2 mt-3"
                      {...props}
                    />
                  ),

                  // Paragraphs
                  p: ({ node, ...props }) => (
                    <p
                      className="text-base leading-relaxed mb-4 text-[#cbd5e1]"
                      {...props}
                    />
                  ),

                  // Text formatting
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-[#e8e8e8]" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-[#94a3b8]" {...props} />
                  ),

                  // Lists
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-none mb-5 space-y-2 text-[#cbd5e1] pl-0"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-none mb-5 space-y-2 text-[#cbd5e1] pl-0 counter-reset-list"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-base flex gap-3" {...props}>
                      <span className="marker text-[#4ade80] font-bold mt-0.5 shrink-0" />
                      <span className="flex-1">{props.children}</span>
                    </li>
                  ),

                  // Blockquote
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-[#4ade80] pl-4 py-3 my-5 bg-[#0f3460]/30 rounded-r-lg italic text-[#94a3b8]"
                      {...props}
                    />
                  ),

                  // Code
                  code: ({ node, inline, className, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return inline ? (
                      <code
                        className="bg-[#0f3460] px-2 py-0.5 rounded text-[#4ade80] text-sm font-mono"
                        {...props}
                      />
                    ) : (
                      <div className="my-5">
                        {match && (
                          <div className="bg-[#0a1929] px-4 py-2 rounded-t-lg text-xs text-[#94a3b8] font-semibold border-b border-[#0f3460]">
                            {match[1]}
                          </div>
                        )}
                        <code
                          className={`block bg-[#0f3460] p-4 ${
                            match ? "rounded-b-lg" : "rounded-lg"
                          } text-[#4ade80] text-sm overflow-x-auto font-mono leading-relaxed`}
                          {...props}
                        />
                      </div>
                    );
                  },

                  // Links
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#4ade80] hover:text-[#22c55e] underline decoration-2 underline-offset-2 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),

                  // Horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr
                      className="my-8 border-t-2 border-[#0f3460]"
                      {...props}
                    />
                  ),

                  // Tables
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-5">
                      <table
                        className="w-full border-collapse border border-[#0f3460] rounded-lg"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-[#0f3460]" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="bg-[#16213e]" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b border-[#0f3460]" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="px-4 py-3 text-left text-[#e8e8e8] font-semibold border border-[#0f3460]"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="px-4 py-3 text-[#cbd5e1] border border-[#0f3460]"
                      {...props}
                    />
                  ),

                  // Images
                  img: ({ node, ...props }) => (
                    <img
                      className="rounded-lg border-2 border-[#0f3460] my-5 max-w-full h-auto"
                      {...props}
                    />
                  ),
                }}
              >
                {exhibit.content}
              </ReactMarkdown>
            </div>

            {/* Examples Section */}
            {exhibit.examples && exhibit.examples.length > 0 && (
              <div className="mt-8 p-5 bg-linear-to-br from-[#0f3460] to-[#0a1929] rounded-lg border-2 border-[#4ade80]/30 shadow-lg">
                <h3 className="text-xl font-semibold text-[#4ade80] mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Dẫn chứng thực tiễn
                </h3>
                <ul className="space-y-3 text-[#cbd5e1]">
                  {exhibit.examples.map((example, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-[#4ade80] font-bold mt-1 shrink-0">
                        {index + 1}.
                      </span>
                      <span className="flex-1 leading-relaxed">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for list markers */}
      <style jsx global>{`
        .counter-reset-list {
          counter-reset: list-counter;
        }
        .markdown-content ol li {
          counter-increment: list-counter;
        }
        .markdown-content ol li .marker::before {
          content: counter(list-counter) ".";
        }
        .markdown-content ul li .marker::before {
          content: "•";
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
