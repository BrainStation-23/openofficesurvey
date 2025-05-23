
import { CompletionRateCard } from "../CompletionRateCard";
import { SBUResponseRates } from "../SBUResponseRates";
import { CompletionTrends } from "../CompletionTrends";
import { TopPerformingSBUsChart } from "./TopPerformingSBUsChart";

type StatisticsSectionProps = {
  instanceStats?: {
    completionRate: number;
    totalAssignments: number;
    completedResponses: number;
  } | null;
  campaignId: string;
  selectedInstanceId?: string;
};

export function StatisticsSection({ 
  instanceStats, 
  campaignId, 
  selectedInstanceId 
}: StatisticsSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <CompletionRateCard completionRate={instanceStats?.completionRate} />
         <CompletionTrends 
          campaignId={campaignId} 
          instanceId={selectedInstanceId} 
          />
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        <SBUResponseRates 
          campaignId={campaignId} 
          instanceId={selectedInstanceId} 
        />
      </div>
    </>
  );
}
