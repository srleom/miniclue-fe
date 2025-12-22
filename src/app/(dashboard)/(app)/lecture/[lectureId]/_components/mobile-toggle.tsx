import { Button } from "@/components/ui/button";
import { FileText, Wrench } from "lucide-react";

type MobileToggleProps = {
  mobileView: "pdf" | "tools";
  onViewChange: (view: "pdf" | "tools") => void;
};

export function MobileToggle({ mobileView, onViewChange }: MobileToggleProps) {
  return (
    <div className="flex w-full justify-center gap-2 p-4 pt-0">
      <Button
        variant={mobileView === "pdf" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("pdf")}
        className="flex items-center gap-2"
        type="button"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant={mobileView === "tools" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("tools")}
        className="flex items-center gap-2"
        type="button"
      >
        <Wrench className="h-4 w-4" />
        Tools
      </Button>
    </div>
  );
}
