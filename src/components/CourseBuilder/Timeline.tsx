import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { loadCourseStructure } from "@/lib/course";
import { CourseStructure } from "@/types/course";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Timeline() {
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const prevStructureRef = useRef<string>("");

  const fetchCourseStructure = async () => {
    try {
      const structure = await loadCourseStructure();
      if (!structure) {
        throw new Error("Failed to load course structure");
      }

      const newStructureStr = JSON.stringify(structure);
      if (newStructureStr !== prevStructureRef.current) {
        prevStructureRef.current = newStructureStr;
        setCourseStructure(structure);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseStructure();
    const intervalId = setInterval(fetchCourseStructure, 2000);
    return () => clearInterval(intervalId);
  }, []);

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

  if (loading && !courseStructure) {
    return <div className="p-4">Loading course structure...</div>;
  }

  return (
    <div className="flex-1 bg-background h-full">
      <ScrollArea className="h-full p-4">
        {courseStructure?.topics.map((topic, index) => (
          <div key={topic.id || index} className="mb-6 border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{topic.name}</h3>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 pl-4">
              {topic.pages.map((page, pageIndex) => (
                <div
                  key={`${topic.id}-${pageIndex}`}
                  className="p-2 border rounded bg-card hover:bg-accent cursor-pointer"
                >
                  {page.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
