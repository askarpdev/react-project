import { useEffect, useState } from "react";
import PageContent from "./PageContent";
import { loadCourseStructure } from "@/lib/course";
import { CourseStructure } from "@/types/course";
import PreviewNavigation from "./PreviewNavigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BookmarkModal from "./BookmarkModal";

export default function PreviewWindow() {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [error, setError] = useState<string | null>(null);
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset page to 1 if it's greater than total pages
    if (
      courseStructure &&
      currentPage > courseStructure.topics.flatMap((t) => t.pages).length
    ) {
      setCurrentPage(1);
      localStorage.setItem("currentPage", "1");
    }
  }, [courseStructure]);

  const handleRestart = () => {
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
    setShowBookmarkModal(false);
  };

  const handleContinue = () => {
    setShowBookmarkModal(false);
  };

  useEffect(() => {
    if (initialLoad) {
      const savedPage = localStorage.getItem("currentPage");
      if (savedPage && parseInt(savedPage) > 1) {
        setShowBookmarkModal(true);
      }
      setInitialLoad(false);
    }
  }, [initialLoad]);

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
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      localStorage.setItem("currentPage", nextPage.toString());
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      localStorage.setItem("currentPage", prevPage.toString());
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
      <BookmarkModal
        isOpen={showBookmarkModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
        savedPage={currentPage}
        totalPages={pages.length}
      />
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
