import { config } from "./config";
import { CourseStructure } from "@/types/course";

export async function loadCourseStructure(): Promise<CourseStructure | null> {
  try {
    // Load from public directory
    const response = await fetch(
      `/content/${config.projectName}/content/cms/topics.json?_=${Date.now()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load course structure");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading course structure:", error);
    return null;
  }
}

export async function createProjectStructure() {
  const directories = [
    `/content/${config.projectName}`,
    `/content/${config.projectName}/content`,
    `/content/${config.projectName}/content/cms`,
  ];

  try {
    for (const dir of directories) {
      const response = await fetch(`/api/create-directory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: dir }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create directory: ${dir}`);
      }
    }

    // Create initial topics.json if it doesn't exist
    const initialStructure: CourseStructure = {
      topics: [],
    };

    await fetch(`/api/write-file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: `/content/${config.projectName}/content/cms/topics.json`,
        content: JSON.stringify(initialStructure, null, 2),
      }),
    });
  } catch (error) {
    console.error("Error creating project structure:", error);
    throw error;
  }
}
