import pptxgen from "pptxgenjs";
import { CampaignData } from "../types";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Helper to create a clean text from HTML content
const cleanText = (text: string) => {
  return text.replace(/<[^>]*>/g, '');
};

// Helper to format dates consistently
const formatDate = (date: string) => {
  return format(new Date(date), "PPP");
};

// Helper to get response data for a question
const getQuestionResponses = async (campaignId: string, questionName: string, instanceId?: string) => {
  const query = supabase
    .from("survey_responses")
    .select(`
      response_data,
      assignment:survey_assignments!inner(
        campaign_id
      )
    `)
    .eq("assignment.campaign_id", campaignId);

  if (instanceId) {
    query.eq("campaign_instance_id", instanceId);
  }

  const { data: responses } = await query;
  return responses?.map(r => r.response_data[questionName]) || [];
};

// Helper to process boolean responses for charts
const processBooleanResponses = (responses: any[]) => {
  const counts = responses.reduce((acc: { [key: string]: number }, value) => {
    acc[value ? "Yes" : "No"] = (acc[value ? "Yes" : "No"] || 0) + 1;
    return acc;
  }, {});

  return [
    { name: "Yes", value: counts["Yes"] || 0 },
    { name: "No", value: counts["No"] || 0 }
  ];
};

// Helper to process rating responses for charts
const processRatingResponses = (responses: any[], maxRating: number = 5) => {
  const counts = responses.reduce((acc: { [key: string]: number }, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Array.from({ length: maxRating }, (_, i) => ({
    name: `${i + 1}`,
    value: counts[i + 1] || 0
  }));
};

export const exportToPptx = async (campaign: CampaignData) => {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = "Survey System";
  pptx.company = "Your Company";
  pptx.revision = "1";
  pptx.subject = campaign.name;
  pptx.title = campaign.name;

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: "FFFFFF" };
  titleSlide.addText(campaign.name, {
    x: 0.5,
    y: 0.5,
    w: "90%",
    fontSize: 44,
    bold: true,
    color: "363636",
  });
  
  if (campaign.description) {
    titleSlide.addText(campaign.description, {
      x: 0.5,
      y: 2,
      w: "90%",
      fontSize: 20,
      color: "666666",
    });
  }

  titleSlide.addText([
    { text: "Period: ", options: { bold: true } },
    { text: `${formatDate(campaign.starts_at)} - ${formatDate(campaign.ends_at)}` },
    { text: "\nCompletion Rate: ", options: { bold: true } },
    { text: `${campaign.completion_rate?.toFixed(1)}%` },
  ], {
    x: 0.5,
    y: 4,
    w: "90%",
    fontSize: 16,
    color: "666666",
  });

  // Completion Rate Slide with Donut Chart
  const completionSlide = pptx.addSlide();
  completionSlide.background = { color: "FFFFFF" };
  completionSlide.addText("Campaign Completion", {
    x: 0.5,
    y: 0.5,
    fontSize: 32,
    bold: true,
    color: "363636",
  });

  completionSlide.addChart(pptx.ChartType.doughnut, [
    [{
      name: "Completed",
      labels: ["Completed", "Pending"],
      values: [campaign.completion_rate || 0, 100 - (campaign.completion_rate || 0)],
    }]
  ], {
    x: 1,
    y: 1.5,
    w: 8,
    h: 5,
    chartColors: ['#22c55e', '#ef4444'],
    showLegend: true,
    legendPos: 'b',
  });

  // For each question in the survey, create a slide with appropriate chart
  const surveyQuestions = (campaign.survey.json_data.pages || []).flatMap(
    (page) => page.elements || []
  );

  for (const question of surveyQuestions) {
    const responses = await getQuestionResponses(campaign.id, question.name, campaign.instance?.id);
    const questionSlide = pptx.addSlide();
    questionSlide.background = { color: "FFFFFF" };
    
    // Add question title
    questionSlide.addText(cleanText(question.title), {
      x: 0.5,
      y: 0.5,
      w: "90%",
      fontSize: 28,
      bold: true,
      color: "363636",
      wrap: true,
    });

    // Add appropriate chart based on question type
    if (question.type === "boolean") {
      const data = processBooleanResponses(responses);
      questionSlide.addChart(pptx.ChartType.bar, [
        {
          name: "Responses",
          labels: data.map(d => d.name),
          values: data.map(d => d.value),
        }
      ], {
        x: 1,
        y: 1.5,
        w: 8,
        h: 5,
        chartColors: ['#8884d8'],
        showValue: true,
      });
    } else if (question.type === "rating") {
      const data = processRatingResponses(responses, question.rateCount || 5);
      questionSlide.addChart(pptx.ChartType.column, [
        {
          name: "Responses",
          labels: data.map(d => d.name),
          values: data.map(d => d.value),
        }
      ], {
        x: 1,
        y: 1.5,
        w: 8,
        h: 5,
        chartColors: ['#8884d8'],
        showValue: true,
      });
    }
    // For text/comment questions, we might want to add a word cloud or just list responses
  }

  // Save the presentation
  const fileName = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
  await pptx.writeFile({ fileName });
};
