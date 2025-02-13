import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Grid, RotateCcw } from "lucide-react";

interface GridControlsProps {
  rows: number;
  columns: number;
  showGrid: boolean;
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
  onToggleGrid: () => void;
  onReset: () => void;
}

export default function GridControls({
  rows,
  columns,
  showGrid,
  onRowsChange,
  onColumnsChange,
  onToggleGrid,
  onReset,
}: GridControlsProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="show-grid"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Grid className="h-4 w-4" />
            Show Grid
          </Label>
          <Switch
            id="show-grid"
            checked={showGrid}
            onCheckedChange={onToggleGrid}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) => onRowsChange(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              min={1}
              max={12}
              value={columns}
              onChange={(e) => onColumnsChange(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="gap-2" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
