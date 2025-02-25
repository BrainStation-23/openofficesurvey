
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlayCircle, RotateCcw } from "lucide-react";
import { SessionStatus } from "../../../types";

interface QuestionControlsProps {
  onFilterChange: (filter: "all" | "pending" | "active" | "completed") => void;
  currentFilter: "all" | "pending" | "active" | "completed";
  sessionStatus: SessionStatus;
  questionCounts?: {
    all: number;
    pending: number;
    active: number;
    completed: number;
  };
  onEnableNext: () => void;
  onResetAll: () => void;
}

export function QuestionControls({ 
  onFilterChange, 
  currentFilter,
  sessionStatus,
  questionCounts = { all: 0, pending: 0, active: 0, completed: 0 },
  onEnableNext,
  onResetAll
}: QuestionControlsProps) {
  const isSessionActive = sessionStatus === "active";

  const filters = [
    { key: "all" as const, label: "All", count: questionCounts.all },
    { key: "pending" as const, label: "Pending", count: questionCounts.pending },
    { key: "active" as const, label: "Active", count: questionCounts.active },
    { key: "completed" as const, label: "Completed", count: questionCounts.completed },
  ];

  return (
    <Card className="border-b rounded-t-lg rounded-b-none">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Filter Questions</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.key}
                variant={currentFilter === filter.key ? "default" : "outline"}
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => onFilterChange(filter.key)}
              >
                {filter.label} ({filter.count})
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isSessionActive || questionCounts.pending === 0}
                  onClick={onEnableNext}
                  className="flex items-center gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  Enable Next
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!isSessionActive ? 
                  "Session must be active to enable questions" : 
                  questionCounts.pending === 0 ? 
                  "No pending questions available" :
                  "Enable next pending question"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isSessionActive || questionCounts.active + questionCounts.completed === 0}
                  onClick={onResetAll}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!isSessionActive ? 
                  "Session must be active to reset questions" : 
                  questionCounts.active + questionCounts.completed === 0 ?
                  "No questions to reset" :
                  "Reset all questions to pending"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
