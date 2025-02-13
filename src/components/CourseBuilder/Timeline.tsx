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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PagePreviewDialog from "./Preview/PagePreviewDialog";

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
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

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

      <ScrollArea className="h-[calc(100%-65px)]">
        <div className="p-4">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{topic.name}</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Chapter</TableHead>
                      <TableHead>Strands</TableHead>
                      <TableHead>File</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topic.pages.map((page) => (
                      <TableRow
                        key={page.file}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => setSelectedPage(page.file)}
                      >
                        <TableCell className="font-medium">
                          {page["chapter-readable"]}
                        </TableCell>
                        <TableCell>{page.label}</TableCell>
                        <TableCell>{page.chapter}</TableCell>
                        <TableCell>{page.strand.join(", ")}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {page.file}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <PagePreviewDialog
        isOpen={!!selectedPage}
        onClose={() => setSelectedPage(null)}
        pageFile={selectedPage || ""}
      />
    </div>
  );
}
