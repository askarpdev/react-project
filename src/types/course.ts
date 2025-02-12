export interface Page {
  "chapter-readable": string;
  chapter: number;
  file: string;
  "elf-page": number;
  label: string;
  menuLabel: string;
  params: string;
  strands: string;
  "stranding-description": string;
  exceptions: string[];
  strand: string[];
}

export interface Topic {
  name: string;
  id: string;
  isadaptive: boolean;
  pages: Page[];
}

export interface CourseStructure {
  topics: Topic[];
}
