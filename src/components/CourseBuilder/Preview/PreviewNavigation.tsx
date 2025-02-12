import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewNavigationProps {
  currentPage: number;
  totalPages: number;
  pageId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function PreviewNavigation({
  currentPage,
  totalPages,
  pageId,
  onNext,
  onBack,
}: PreviewNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
      <div className="container flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentPage === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col items-center text-sm text-muted-foreground">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div>ID: {pageId}</div>
        </div>

        <Button
          variant="outline"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
