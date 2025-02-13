import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";

interface BookmarkModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onRestart: () => void;
  savedPage: number;
  totalPages: number;
}

export default function BookmarkModal({
  isOpen,
  onContinue,
  onRestart,
  savedPage,
  totalPages,
}: BookmarkModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onContinue()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            Resume Progress
          </DialogTitle>
          <DialogDescription>
            You have a saved bookmark at page {savedPage} of {totalPages}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onRestart}>
            Restart
          </Button>
          <Button onClick={onContinue}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
