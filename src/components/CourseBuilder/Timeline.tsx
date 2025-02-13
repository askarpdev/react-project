import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { loadCourseStructure } from "@/lib/course";
import { CourseStructure } from "@/types/course";
import { useStranding } from "@/lib/hooks/useStranding";
import { StrandingService } from "@/lib/stranding";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Timeline() {
  const [selectedStrands, setSelectedStrands] = useState<string[]>(() => {
    const roleStrand = StrandingService.getStrand("role");
    return roleStrand?.value
      ? Array.isArray(roleStrand.value)
        ? roleStrand.value
        : [roleStrand.value]
      : [];
  });
  const availableStrands = ["A", "B", "C", "D"];
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

  // Apply stranding logic to filter visible pages
  const filteredTopics = useStranding(courseStructure?.topics || [], {
    userStrands: selectedStrands,
  });

  if (loading && !courseStructure) {
    return <div className="p-4">Loading course structure...</div>;
  }

  return (
    <div className="flex-1 bg-background h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Active Strands:</span>
          <Select
            value={selectedStrands.join(",")}
            onValueChange={(value) => {
              const newStrands = value === "none" ? [] : value.split(",");
              setSelectedStrands(newStrands);
              StrandingService.setStrand("role", newStrands);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select strands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availableStrands.map((strand) => (
                <SelectItem key={strand} value={strand}>
                  {strand}
                </SelectItem>
              ))}
              <SelectItem value={availableStrands.join(",")}>All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="h-full p-4">
        {filteredTopics.map((topic, index) => (
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
