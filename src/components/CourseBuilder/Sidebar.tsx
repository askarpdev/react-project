import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

export default function Sidebar() {
  const contentBlocks = [
    { type: "text", label: "Text Block" },
    { type: "video", label: "Video" },
    { type: "quiz", label: "Quiz" },
    { type: "assignment", label: "Assignment" },
  ];

  return (
    <div className="w-80 border-r bg-background h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Content Blocks</h2>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-2">
          {contentBlocks.map((block) => (
            <div
              key={block.type}
              className="p-3 border rounded-md cursor-move hover:bg-accent"
              draggable
            >
              {block.label}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
