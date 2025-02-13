import { config } from "./config";

export interface PageContent {
  title: string;
  background?: {
    type: "image" | "video";
    url: string;
    overlay?: boolean;
  };
  content: {
    sections: Array<{
      type: string;
      layout?: {
        grid?: string;
      };
      title?: string;
      content?: string | string[];
      items?: string[] | Array<{ [key: string]: any }>;
      questions?: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
    }>;
  };
  metadata: {
    duration: string;
    difficulty: string;
  };
}

export async function loadPageContent(
  pageFile: string,
): Promise<PageContent | null> {
  try {
    const response = await fetch(
      `/content/${config.projectName}/content/cms/pages/${pageFile}.json?_=${Date.now()}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to load page content for ${pageFile}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading page content for ${pageFile}:`, error);
    return null;
  }
}
