"use client";

import { useEffect, useState } from "react";
import { museumData } from "@/data/museum-data";

interface MinimapProps {
  visitedExhibits: Set<string>;
  unlockedRooms: Set<number>;
}

export default function Minimap({
  visitedExhibits,
  unlockedRooms,
}: MinimapProps) {
  const [playerPos, setPlayerPos] = useState({ x: 150, y: 600 });

  useEffect(() => {
    const handlePlayerMove = (event: Event) => {
      const customEvent = event as CustomEvent<{ x: number; y: number }>;
      setPlayerPos(customEvent.detail);
    };

    window.addEventListener("playerMove", handlePlayerMove);
    return () => window.removeEventListener("playerMove", handlePlayerMove);
  }, []);

  const scaleX = 480 / 4320;
  const scaleY = 110 / 960;

  return (
    <div className="fixed top-20 right-4 bg-[#16213e]/90 border-2 border-[#0f3460] rounded-lg p-3 backdrop-blur-sm max-w-[520px]">
      <h3 className="text-xs font-semibold text-[#e8e8e8] mb-2 text-center">
        Bản đồ bảo tàng (3 phòng)
      </h3>
      <div className="relative w-[480px] h-[110px] bg-[#1a1a2e] rounded border border-[#0f3460]">
        <div className="absolute inset-1 border border-[#374151] rounded" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-2 bottom-2 w-0.5"
            style={{
              left: `${i * 160}px`,
              backgroundColor: unlockedRooms.has(i + 1) ? "#374151" : "#7f1d1d",
            }}
          />
        ))}

        {museumData.map((exhibit) => {
          const isVisited = visitedExhibits.has(exhibit.id);
          const isLocked = !unlockedRooms.has(exhibit.roomNumber);
          const colors = [
            "#3b82f6",
            "#8b5cf6",
            "#06b6d4",
            "#3b82f6",
            "#ef4444",
            "#f97316",
            "#dc2626",
            "#f59e0b",
            "#10b981",
            "#14b8a6",
            "#f59e0b",
            "#6366f1",
            "#8b5cf6",
            "#06b6d4",
            "#6366f1",
            "#ec4899",
            "#f43f5e",
            "#db2777",
            "#ec4899",
            "#14b8a6",
            "#06b6d4",
            "#0891b2",
            "#14b8a6",
            "#a855f7",
            "#9333ea",
            "#7c3aed",
            "#64748b",
            "#475569",
          ];

          return (
            <div
              key={exhibit.id}
              className="absolute rounded-sm transition-all"
              style={{
                left: `${exhibit.position.x * scaleX - 3}px`,
                top: `${exhibit.position.y * scaleY - 3}px`,
                width: "6px",
                height: "6px",
                backgroundColor: isLocked
                  ? "#64748b"
                  : colors[museumData.indexOf(exhibit)],
                opacity: isLocked ? 0.3 : isVisited ? 1 : 0.5,
                boxShadow:
                  isVisited && !isLocked
                    ? `0 0 8px ${colors[museumData.indexOf(exhibit)]}`
                    : "none",
              }}
            />
          );
        })}

        {/* Player position */}
        <div
          className="absolute w-2 h-2 bg-[#4ade80] rounded-full transition-all duration-100"
          style={{
            left: `${playerPos.x * scaleX - 4}px`,
            top: `${playerPos.y * scaleY - 4}px`,
            boxShadow: "0 0 8px #4ade80",
          }}
        />
      </div>

      <div className="mt-2 text-xs text-[#94a3b8] space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#4ade80] rounded-full" />
          <span>Vị trí của bạn</span>
        </div>
        <div className="text-[10px] mt-2 space-y-0.5 max-h-32 overflow-y-auto">
          <div
            className={`font-semibold ${
              unlockedRooms.has(1) ? "text-[#3b82f6]" : "text-[#64748b]"
            }`}
          >
            3.1. Dân chủ xã hội chủ nghĩa ở Việt Nam{" "}
            {unlockedRooms.has(1) ? "✓" : "🔒"}
          </div>
          <div
            className={`font-semibold ${
              unlockedRooms.has(2) ? "text-[#ef4444]" : "text-[#64748b]"
            }`}
          >
            3.2. Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam{" "}
            {unlockedRooms.has(2) ? "✓" : "🔒"}
          </div>
          <div
            className={`font-semibold ${
              unlockedRooms.has(3) ? "text-[#f59e0b]" : "text-[#64748b]"
            }`}
          >
            3.3. Phát huy dân chủ xã hội chủ nghĩa, xây dựng Nhà nước pháp quyền
            xã hội chủ nghĩa ở Việt Nam hiện nay{" "}
            {unlockedRooms.has(3) ? "✓" : "🔒"}
          </div>
        </div>
      </div>
    </div>
  );
}
