import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatMapChart } from "../../charts/HeatMapChart";
import { NpsChart } from "../../charts/NpsChart";
import type { ProcessedResponse } from "../../hooks/useResponseProcessing";

interface NpsComparisonProps {
  responses: ProcessedResponse[];
  questionName: string;
  dimension: "sbu" | "gender" | "location" | "employment_type" | "none";
  isNps: boolean;
  layout?: 'grid' | 'vertical';
}

export function NpsComparison({
  responses,
  questionName,
  dimension,
  isNps,
  layout = 'vertical'
}: NpsComparisonProps) {
  const processResponses = () => {
    const groupedData = new Map();

    responses.forEach((response) => {
      const questionData = response.answers[questionName];
      if (!questionData || typeof questionData.answer !== "number") return;

      const answer = questionData.answer;

      let dimensionValue = "Unknown";
      switch (dimension) {
        case "sbu":
          dimensionValue = response.respondent.sbu?.name || "Unknown";
          break;
        case "gender":
          dimensionValue = response.respondent.gender || "Unknown";
          break;
        case "location":
          dimensionValue = response.respondent.location?.name || "Unknown";
          break;
        case "employment_type":
          dimensionValue = response.respondent.employment_type?.name || "Unknown";
          break;
      }

      if (!groupedData.has(dimensionValue)) {
        groupedData.set(dimensionValue, {
          dimension: dimensionValue,
          unsatisfied: 0,
          neutral: 0,
          satisfied: 0,
          total: 0,
          ratings: [],
          isNps: isNps
        });
      }

      const group = groupedData.get(dimensionValue);
      group.total += 1;
      group.ratings.push(answer);

      if (!isNps) {
        if (answer <= 3) {
          group.unsatisfied += 1;
        } else if (answer === 4) {
          group.neutral += 1;
        } else {
          group.satisfied += 1;
        }
      }
    });

    return Array.from(groupedData.values());
  };

  const data = processResponses();
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
      {data.map((groupData) => (
        <Card key={groupData.dimension}>
          <CardHeader>
            <CardTitle className="text-lg">{groupData.dimension}</CardTitle>
          </CardHeader>
          <CardContent>
            {isNps ? (
              <div className="h-[300px]">
                <NpsChart 
                  data={groupData.ratings.map(rating => ({ 
                    rating, 
                    count: 1,
                    group: groupData.dimension 
                  }))} 
                />
              </div>
            ) : (
              <div className="h-[300px]">
                <HeatMapChart data={[groupData]} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}