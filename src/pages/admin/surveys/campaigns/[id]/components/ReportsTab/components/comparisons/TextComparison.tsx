
import { Card } from "@/components/ui/card";
import { ProcessedResponse } from "../../hooks/useResponseProcessing";
import { ComparisonDimension } from "../../types/comparison";
import { WordCloud } from "../../charts/WordCloud";

interface TextComparisonProps {
  responses: ProcessedResponse[];
  questionName: string;
  dimension: ComparisonDimension;
  layout?: 'grid' | 'vertical';
}

export function TextComparison({
  responses,
  questionName,
  dimension,
  layout = 'vertical'
}: TextComparisonProps) {
  const processData = () => {
    const groupedData: Record<string, Record<string, number>> = {};

    responses.forEach((response) => {
      const answer = response.answers[questionName]?.answer;
      let groupKey = "Unknown";

      switch (dimension) {
        case "sbu":
          groupKey = response.respondent.sbu?.name || "No SBU";
          break;
        case "gender":
          groupKey = response.respondent.gender || "Not Specified";
          break;
        case "location":
          groupKey = response.respondent.location?.name || "No Location";
          break;
        case "employment_type":
          groupKey = response.respondent.employment_type?.name || "Not Specified";
          break;
        case "level":
          groupKey = response.respondent.level?.name || "Not Specified";
          break;
        case "employee_type":
          groupKey = response.respondent.employee_type?.name || "Not Specified";
          break;
        case "employee_role":
          groupKey = response.respondent.employee_role?.name || "Not Specified";
          break;
        default:
          groupKey = "All Responses";
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {};
      }

      if (typeof answer === "string") {
        const words = answer
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 2);

        words.forEach((word) => {
          groupedData[groupKey][word] = (groupedData[groupKey][word] || 0) + 1;
        });
      }
    });

    return Object.entries(groupedData)
      .filter(([_, wordFreq]) => Object.keys(wordFreq).length > 0)
      .map(([group, wordFreq]) => ({
        group,
        words: Object.entries(wordFreq)
          .map(([text, value]) => ({ text, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 30),
      }));
  };

  const groupedWords = processData();

  if (groupedWords.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No text responses available for comparison
        </div>
      </Card>
    );
  }

  return (
    <div className={
      layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
        : 'space-y-4'
    }>
      {groupedWords.map(({ group, words }) => (
        <Card key={group} className="p-6">
          <h3 className="mb-4 text-lg font-semibold">{group}</h3>
          {words.length > 0 ? (
            <div className="h-[280px]">
              <WordCloud words={words} />
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No responses in this group
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
