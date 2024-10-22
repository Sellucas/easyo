import { AlertTriangle, Check, Info } from "lucide-react";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AnalysisItemProps {
  label: string;
  isPositive: boolean;
  tooltipContent: string;
}

export const AnalysisItem = ({
  label,
  isPositive,
  tooltipContent,
}: AnalysisItemProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-2">
        {isPositive ? (
          <Check className="size-6 text-green-700" />
        ) : (
          <AlertTriangle className="size-5 text-yellow-600" />
        )}
        <Label>{label}</Label>
      </div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Info className="size-3 text-gray-500" />
          </TooltipTrigger>
          <TooltipContent className="max-w-48">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
