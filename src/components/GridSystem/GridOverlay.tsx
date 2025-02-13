import { cn } from "@/lib/utils";

interface GridOverlayProps {
  rows: number;
  columns: number;
  visible: boolean;
}

export default function GridOverlay({
  rows,
  columns,
  visible,
}: GridOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        "border border-primary/20",
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * columns }).map((_, i) => (
        <div key={i} className="border border-primary/10" />
      ))}
    </div>
  );
}
