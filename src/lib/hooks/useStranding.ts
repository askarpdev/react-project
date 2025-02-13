import { useMemo } from "react";
import { Page, Topic } from "@/types/course";

interface UseStrandingOptions {
  userStrands?: string[];
}

export function useStranding(
  topics: Topic[],
  { userStrands = [] }: UseStrandingOptions = {},
) {
  return useMemo(() => {
    return topics
      .map((topic) => ({
        ...topic,
        pages: topic.pages.filter((page) => isPageVisible(page, userStrands)),
      }))
      .filter((topic) => topic.pages.length > 0);
  }, [topics, userStrands]);
}

export function isPageVisible(page: Page, userStrands: string[]): boolean {
  // If page has no strands defined, it's hidden by default
  if (!page.strand || page.strand.length === 0) {
    return false;
  }

  // Check if page is available to all (*) and not in exceptions
  if (page.strand.includes("*")) {
    // If there are no exceptions, show the page
    if (!page.exceptions || page.exceptions.length === 0) {
      return true;
    }
    // If user has strands and page has exceptions, check if user's strands are in exceptions
    return !userStrands.some((strand) => page.exceptions.includes(strand));
  }

  // Check if user has any of the required strands
  return userStrands.some((strand) => page.strand.includes(strand));
}
