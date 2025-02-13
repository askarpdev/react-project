import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface GridItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onPositionChange?: (id: string, x: number, y: number) => void;
  gridSize: { rows: number; columns: number };
}

export default function GridItem({
  id,
  children,
  className,
  onPositionChange,
  gridSize,
}: GridItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    let startX: number;
    let startY: number;
    let originalX: number;
    let originalY: number;

    function handleDragStart(e: MouseEvent) {
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      originalX = rect.left;
      originalY = rect.top;

      element.style.cursor = "grabbing";
    }

    function handleDrag(e: MouseEvent) {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Calculate grid cell size
      const parentRect = element.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const cellWidth = parentRect.width / gridSize.columns;
      const cellHeight = parentRect.height / gridSize.rows;

      // Snap to grid
      const newX = Math.round((originalX + deltaX) / cellWidth) * cellWidth;
      const newY = Math.round((originalY + deltaY) / cellHeight) * cellHeight;

      element.style.transform = `translate(${newX - originalX}px, ${newY - originalY}px)`;

      if (onPositionChange) {
        onPositionChange(id, newX, newY);
      }
    }

    function handleDragEnd() {
      setIsDragging(false);
      element.style.cursor = "grab";
    }

    element.addEventListener("mousedown", handleDragStart);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      element.removeEventListener("mousedown", handleDragStart);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [id, isDragging, onPositionChange, gridSize]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "absolute cursor-grab select-none",
        isDragging && "cursor-grabbing",
        className,
      )}
    >
      {children}
    </div>
  );
}
