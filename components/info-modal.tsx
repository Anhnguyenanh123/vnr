"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ExhibitData } from "@/types/museum";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import HTMLFlipBook from "react-pageflip";

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
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const pages = useMemo(() => {
    const content = exhibit?.content ?? "";
    const words = content.split(" ");
    const chunkSize = 180;
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(" "));
    }
    return chunks;
  }, [exhibit?.content]);

  if (!isOpen || !exhibit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Container */}
      <div className="relative bg-[#16213e] border border-[#0f3460] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
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

        {/* Page Flip Book */}
        <div className="flex justify-center items-center p-4 bg-[#0f172a] h-[calc(90vh-120px)] overflow-hidden">
          <HTMLFlipBook
            width={600}
            height={700}
            size="stretch"
            minWidth={400}
            maxWidth={900}
            minHeight={500}
            maxHeight={1000}
            maxShadowOpacity={0.3}
            showCover={true}
            className="shadow-2xl rounded-lg overflow-hidden"
            ref={flipBookRef}
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            clickEventForward={false}
            useMouseEvents={true}
            disableFlipByClick={false}
            showPageCorners={true}
            mobileScrollSupport={true}
            swipeDistance={30}
            startZIndex={0}
            autoSize={true}
            onFlip={() => {}}
            onChangeOrientation={() => {}}
            onInit={() => {}}
            onUpdate={() => {}}
          >
            {/* Cover Page */}
            <div className="bg-[#0f3460] flex flex-col items-center justify-center text-center text-[#e8e8e8] px-8">
              {exhibit.image && (
                <div className="mb-4 rounded-lg overflow-hidden border-2 border-[#4ade80]/40">
                  <Image
                    width={500}
                    height={300}
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-[#4ade80] mb-3">
                {exhibit.title}
              </h1>
              <p className="text-[#cbd5e1] text-base">
                Lật sang trang để đọc nội dung chi tiết 📖
              </p>
            </div>

            {/* Each content page */}
            {pages.map((page, index) => (
              <div
                key={index}
                className="p-8 bg-[#16213e] text-[#cbd5e1] overflow-y-auto"
              >
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {page}
                  </ReactMarkdown>
                </div>
                <div className="text-sm text-[#94a3b8] text-right mt-4">
                  Trang {index + 1}
                </div>
              </div>
            ))}

            {/* Back Cover */}
            <div className="bg-[#0f3460] flex flex-col items-center justify-center text-center text-[#e8e8e8] p-8">
              <h2 className="text-2xl font-semibold mb-3 text-[#4ade80]">
                Kết thúc
              </h2>
              <p className="text-[#cbd5e1] mb-4">Cảm ơn bạn đã đọc! ✨</p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[#4ade80] text-[#0f172a] font-semibold hover:bg-[#22c55e] transition"
              >
                Đóng
              </button>
            </div>
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
}
