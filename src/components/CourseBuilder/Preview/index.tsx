import { useEffect, useState } from "react";
import { loadCourseStructure } from "@/lib/course";
import { CourseStructure } from "@/types/course";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PreviewNavigation from "./PreviewNavigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Preview({ open, onOpenChange }: PreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseStructure()
      .then((structure) => {
        if (!structure) {
          throw new Error("Failed to load course structure");
        }
        setCourseStructure(structure);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const pages =
    courseStructure?.topics.flatMap((topic) =>
      topic.pages.map((page) => ({
        id: page.file,
        content: page["chapter-readable"],
        label: page.label,
      })),
    ) || [];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="h-full pb-16">
          <div className="h-full overflow-auto p-4">
            {loading
              ? "Loading course content..."
              : pages[currentPage - 1]?.content || "No content available"}
          </div>
          <PreviewNavigation
            currentPage={currentPage}
            totalPages={pages.length}
            pageId={pages[currentPage - 1]?.id || ""}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
