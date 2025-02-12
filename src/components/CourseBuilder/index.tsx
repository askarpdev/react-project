import { useState } from "react";
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function CourseBuilder() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-end p-4 border-b">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open("/preview.html", "_blank")}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <Timeline />
      </div>
    </div>
  );
}
