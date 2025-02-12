import { useEffect, useState } from "react";
import PageContent from "./PageContent";
import { loadCourseStructure } from "@/lib/course";
import { CourseStructure } from "@/types/course";
import PreviewNavigation from "./PreviewNavigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PreviewWindow() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseStructure = async () => {
      try {
        const structure = await loadCourseStructure();
        if (!structure) {
          throw new Error("Failed to load course structure");
        }
        setCourseStructure(structure);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseStructure();
  }, []);

  const pages =
    courseStructure?.topics.flatMap((topic) =>
      topic.pages.map((page) => ({
        id: page.file,
        content: page["chapter-readable"],
        label: page.label,
        file: page.file,
      })),
    ) || [];

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
  }, [pages.length, currentPage]);

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentPageFile = pages[currentPage - 1]?.file || "welcome";

  return (
    <div className="h-full bg-background">
      <div className="h-[calc(100%-80px)] p-4">
        <div className="h-full overflow-auto">
          {loading ? (
            <div>Loading course content...</div>
          ) : pages.length > 0 ? (
            <PageContent key={currentPageFile} pageFile={currentPageFile} />
          ) : (
            <div>No course content available</div>
          )}
        </div>
      </div>
      <PreviewNavigation
        currentPage={currentPage}
        totalPages={pages.length}
        pageId={pages[currentPage - 1]?.id || ""}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
}
