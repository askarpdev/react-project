import GridSystem, { GridItem } from ".";

export default {
  title: "GridSystem",
  component: GridSystem,
};

export const Default = () => (
  <div className="h-[600px] border rounded-lg overflow-hidden">
    <GridSystem>
      <GridItem
        id="item1"
        className="w-[200px] h-[150px] bg-primary/10 rounded-lg p-4"
        gridSize={{ rows: 6, columns: 6 }}
      >
        <h3 className="font-medium">Draggable Item 1</h3>
        <p className="text-sm text-muted-foreground">Drag me around!</p>
      </GridItem>

      <GridItem
        id="item2"
        className="w-[200px] h-[150px] bg-secondary/10 rounded-lg p-4"
        gridSize={{ rows: 6, columns: 6 }}
      >
        <h3 className="font-medium">Draggable Item 2</h3>
        <p className="text-sm text-muted-foreground">I snap to the grid!</p>
      </GridItem>
    </GridSystem>
  </div>
);
