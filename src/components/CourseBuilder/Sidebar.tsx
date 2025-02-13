import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ComponentData {
  name: string;
  category: string;
}

export default function Sidebar() {
  const uiComponents = [
    { name: "Accordion", category: "Layout" },
    { name: "Alert", category: "Feedback" },
    { name: "Alert Dialog", category: "Feedback" },
    { name: "Aspect Ratio", category: "Layout" },
    { name: "Avatar", category: "Data Display" },
    { name: "Badge", category: "Data Display" },
    { name: "Button", category: "Inputs" },
    { name: "Calendar", category: "Data Display" },
    { name: "Card", category: "Layout" },
    { name: "Carousel", category: "Data Display" },
    { name: "Checkbox", category: "Inputs" },
    { name: "Collapsible", category: "Layout" },
    { name: "Command", category: "Navigation" },
    { name: "Context Menu", category: "Navigation" },
    { name: "Dialog", category: "Feedback" },
    { name: "Drawer", category: "Layout" },
    { name: "Dropdown Menu", category: "Navigation" },
    { name: "Hover Card", category: "Data Display" },
    { name: "Input", category: "Inputs" },
    { name: "Label", category: "Data Display" },
    { name: "Menubar", category: "Navigation" },
    { name: "Navigation Menu", category: "Navigation" },
    { name: "Pagination", category: "Navigation" },
    { name: "Popover", category: "Overlay" },
    { name: "Progress", category: "Feedback" },
    { name: "Radio Group", category: "Inputs" },
    { name: "Resizable", category: "Layout" },
    { name: "Scroll Area", category: "Layout" },
    { name: "Select", category: "Inputs" },
    { name: "Separator", category: "Data Display" },
    { name: "Sheet", category: "Layout" },
    { name: "Skeleton", category: "Feedback" },
    { name: "Slider", category: "Inputs" },
    { name: "Switch", category: "Inputs" },
    { name: "Table", category: "Data Display" },
    { name: "Tabs", category: "Navigation" },
    { name: "Textarea", category: "Inputs" },
    { name: "Toast", category: "Feedback" },
    { name: "Toggle", category: "Inputs" },
    { name: "Tooltip", category: "Overlay" },
  ];

  // Group components by category
  const groupedComponents = uiComponents.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, typeof uiComponents>,
  );

  const handleDragStart = (e: React.DragEvent, component: ComponentData) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-80 border-r bg-background h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">UI Components</h2>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(groupedComponents).map(([category, components]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-sm">
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {components.map((component) => (
                      <div
                        key={component.name}
                        className="p-2 text-sm rounded-md cursor-move hover:bg-accent"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                      >
                        {component.name}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
