import { useEffect, useState } from "react";
import { loadPageContent, PageContent as PageContentType } from "@/lib/page";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StrandingService } from "@/lib/stranding";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PageContentProps {
  pageFile: string;
}

// Get grid classes from section or use defaults
function getGridClasses(section: any): string {
  return section.layout?.grid || "col-span-12"; // Default to full width if no layout specified
}

export default function PageContent({ pageFile }: PageContentProps) {
  const [content, setContent] = useState<PageContentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setContent(null);
    setError(null);

    const fetchContent = async () => {
      try {
        const pageContent = await loadPageContent(pageFile);
        if (!pageContent) {
          throw new Error(`Failed to load content for page ${pageFile}`);
        }
        setContent(pageContent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pageFile) {
      fetchContent();
    }
  }, [pageFile]);

  if (loading) {
    return <div>Loading page content...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!content) {
    return <div>No content available</div>;
  }

  return (
    <div className="relative min-h-full">
      {content.background && (
        <div className="fixed inset-0 w-full h-full">
          {content.background.type === "image" && (
            <img
              src={content.background.url}
              alt="Background"
              className="object-cover w-full h-full"
            />
          )}
          {content.background.type === "video" && (
            <video autoPlay loop muted className="object-cover w-full h-full">
              <source src={content.background.url} type="video/mp4" />
            </video>
          )}
          {content.background.overlay && (
            <div className="absolute inset-0 bg-background/90" />
          )}
        </div>
      )}
      <ScrollArea className="h-full pr-4 relative z-10">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-12 gap-6">
            {/* Title spans full width */}
            <div className="col-span-12 text-center mb-8">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {content.title}
              </h1>
            </div>

            {/* Sections Grid */}
            {content.content.sections.map((section, index) => (
              <div key={index} className={`${getGridClasses(section)} mb-6`}>
                <Card className="shadow-sm">
                  <CardContent className="pt-6 space-y-4">
                    {section.title && (
                      <CardTitle className="text-2xl font-semibold tracking-tight">
                        {section.title}
                      </CardTitle>
                    )}

                    {section.type === "text" && (
                      <div className="space-y-4">
                        {Array.isArray(section.content) ? (
                          section.content.map((paragraph, i) => (
                            <p key={i} className="leading-7">
                              {paragraph}
                            </p>
                          ))
                        ) : (
                          <p className="leading-7">{section.content}</p>
                        )}
                      </div>
                    )}

                    {section.type === "list" && section.items && (
                      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="text-base">
                            {typeof item === "string"
                              ? item
                              : JSON.stringify(item)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.type === "checklist" && section.items && (
                      <div className="space-y-4">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`checklist-${i}`} />
                            <Label
                              htmlFor={`checklist-${i}`}
                              className="text-base"
                            >
                              {typeof item === "string"
                                ? item
                                : JSON.stringify(item)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "note" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{section.content}</AlertDescription>
                      </Alert>
                    )}

                    {section.type === "quiz" && section.questions && (
                      <Accordion type="single" collapsible className="w-full">
                        {section.questions.map((q, i) => (
                          <AccordionItem key={i} value={`question-${i}`}>
                            <AccordionTrigger className="text-left">
                              {q.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <RadioGroup className="space-y-3">
                                {q.options.map((option, j) => (
                                  <div
                                    key={j}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={j.toString()}
                                      id={`q${i}-option${j}`}
                                    />
                                    <Label htmlFor={`q${i}-option${j}`}>
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <Button className="mt-4" variant="outline">
                                Check Answer
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}

                    {section.type === "demo" && section.content && (
                      <div className="space-y-4">
                        {section.content.map((demo: any, i: number) => (
                          <div key={i} className="flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                switch (demo.action) {
                                  case "setSingleStrand":
                                  case "setMultipleStrands":
                                    if (demo.strand) {
                                      StrandingService.setStrand(
                                        demo.strand.key,
                                        demo.strand.value,
                                      );
                                    }
                                    break;
                                  case "clearStrands":
                                    StrandingService.clearStrands();
                                    break;
                                }
                              }}
                              variant="outline"
                            >
                              {demo.title}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              {demo.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "timeline" && section.items && (
                      <div className="space-y-4">
                        {section.items.map((item: any, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 text-sm font-medium">
                              Week {item.week}
                            </div>
                            <div className="flex-1 p-3 rounded-md bg-accent">
                              {item.topic}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Progress card spans full width */}
            <div className="col-span-12">
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                    <div className="flex justify-between text-sm text-muted-foreground mt-4">
                      Duration: {content.metadata.duration} • Difficulty:{" "}
                      {content.metadata.difficulty}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
