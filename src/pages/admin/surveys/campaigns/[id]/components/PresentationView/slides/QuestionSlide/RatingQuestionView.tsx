import { NpsChart } from "../../../ReportsTab/charts/NpsChart";
import { SatisfactionDonutChart } from "../../../ReportsTab/charts/SatisfactionDonutChart";
import { RatingResponseData, SatisfactionData } from "../../types/responses";

interface RatingQuestionViewProps {
  data: RatingResponseData | SatisfactionData;
  isNps: boolean;
}

export function RatingQuestionView({ data, isNps }: RatingQuestionViewProps) {
  return (
    <div className="w-full max-w-4xl">
      {isNps ? (
        <NpsChart data={data as RatingResponseData} />
      ) : (
        <SatisfactionDonutChart data={data as SatisfactionData} />
      )}
    </div>
  );
}