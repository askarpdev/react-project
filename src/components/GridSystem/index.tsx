import { useState } from "react";
import GridOverlay from "./GridOverlay";
import GridControls from "./GridControls";
import GridItem from "./GridItem";

interface GridSystemProps {
  children?: React.ReactNode;
  defaultRows?: number;
  defaultColumns?: number;
}

export default function GridSystem({
  children,
  defaultRows = 6,
  defaultColumns = 6,
}: GridSystemProps) {
  const [rows, setRows] = useState(defaultRows);
  const [columns, setColumns] = useState(defaultColumns);
  const [showGrid, setShowGrid] = useState(true);

  const handleReset = () => {
    setRows(defaultRows);
    setColumns(defaultColumns);
    setShowGrid(true);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <GridControls
        rows={rows}
        columns={columns}
        showGrid={showGrid}
        onRowsChange={setRows}
        onColumnsChange={setColumns}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onReset={handleReset}
      />

      <div className="flex-1 relative overflow-hidden">
        <GridOverlay rows={rows} columns={columns} visible={showGrid} />

        {children}
      </div>
    </div>
  );
}

export { GridItem };
