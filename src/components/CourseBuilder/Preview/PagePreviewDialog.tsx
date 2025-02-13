import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useState } from "react";
import PageContent from "./PageContent";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageFile: string;
}

type ViewMode = "desktop" | "tablet" | "mobile";

export default function PagePreviewDialog({
  isOpen,
  onClose,
  pageFile,
}: PagePreviewDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  const viewModes = [
    { id: "desktop", icon: Monitor, width: "100%" },
    { id: "tablet", icon: Tablet, width: "768px" },
    { id: "mobile", icon: Smartphone, width: "375px" },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-11/12 h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b p-2 bg-background sticky top-0 z-50">
            <div className="flex gap-1">
              {viewModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode(mode.id)}
                >
                  <mode.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-[calc(90vh-4rem)]">
              <div className="p-4">
                <div
                  className="mx-auto bg-background transition-all duration-200 relative"
                  style={{
                    width: viewModes.find((m) => m.id === viewMode)?.width,
                  }}
                >
                  <PageContent pageFile={pageFile} />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
