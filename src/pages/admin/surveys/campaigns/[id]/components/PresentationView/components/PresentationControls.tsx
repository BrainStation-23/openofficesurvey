
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize, Minimize } from "lucide-react";
import { exportToPptx } from "../utils/pptxExport";
import { CampaignData } from "../types";
import { usePresentationResponses } from "../hooks/usePresentationResponses";
import { useToast } from "@/hooks/use-toast";

interface PresentationControlsProps {
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFullscreen: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  isFullscreen: boolean;
  currentSlide: number;
  totalSlides: number;
  campaign: CampaignData;
}

export function PresentationControls({
  onBack,
  onPrevious,
  onNext,
  onFullscreen,
  isFirstSlide,
  isLastSlide,
  isFullscreen,
  currentSlide,
  totalSlides,
  campaign,
}: PresentationControlsProps) {
  const { toast } = useToast();
  const { data: processedData } = usePresentationResponses(campaign.id, campaign.instance?.id);

  const handleDownload = async () => {
    try {
      if (!processedData) {
        toast({
          title: "Cannot export presentation",
          description: "Please wait for the data to load",
          variant: "destructive",
        });
        return;
      }
      await exportToPptx(campaign, processedData);
      toast({
        title: "Success",
        description: "Presentation has been exported successfully",
      });
    } catch (error) {
      console.error("Error exporting presentation:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the presentation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-black hover:bg-black/20 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Campaign
      </Button>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="text-black hover:bg-black/20 hover:text-black"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={isFirstSlide}
          className="text-black hover:bg-black/20 hover:text-black"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium text-black">
          {currentSlide + 1} / {totalSlides}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={isLastSlide}
          className="text-black hover:bg-black/20 hover:text-black"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onFullscreen}
          className="text-black hover:bg-black/20 hover:text-black"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
