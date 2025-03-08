
import jsPDF from 'jspdf';
import { CampaignData } from "../../types";
import { ProcessedData } from "../../types/responses";
import { THEME } from "../pptx/theme";
import { formatDate } from "../pptx/helpers";
import { addQuestionChart } from "./charts";

export function createTitleSlide(pdf: jsPDF, campaign: CampaignData) {
  pdf.setFontSize(44);
  pdf.text(campaign.name, 150, 200);

  if (campaign.description) {
    pdf.setFontSize(20);
    pdf.setTextColor(THEME.text.secondary);
    pdf.text(campaign.description, 150, 300, { maxWidth: 1600 });
  }

  const startDate = campaign.instance?.starts_at || campaign.starts_at;
  const endDate = campaign.instance?.ends_at || campaign.ends_at;
  const completionRate = campaign.instance?.completion_rate ?? campaign.completion_rate;

  pdf.setFontSize(16);
  pdf.setTextColor(THEME.text.light);
  pdf.text(`Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, 150, 400);
  pdf.text(`Completion Rate: ${completionRate?.toFixed(1)}%`, 150, 440);
}

export function createCompletionSlide(pdf: jsPDF, campaign: CampaignData) {
  pdf.addPage();
  
  pdf.setFontSize(32);
  pdf.setTextColor(THEME.text.primary);
  pdf.text("Campaign Completion", 150, 100);

  // Add completion rate donut chart
  const completionRate = campaign.completion_rate || 0;
  const centerX = 960;
  const centerY = 540;
  const radius = 200;

  // Draw donut chart
  pdf.setFillColor(THEME.primary);
  pdf.circle(centerX, centerY, radius, 'F');
  
  pdf.setFillColor('#ffffff');
  pdf.circle(centerX, centerY, radius * 0.6, 'F');

  // Add completion rate text
  pdf.setFontSize(48);
  pdf.setTextColor(THEME.text.primary);
  pdf.text(`${completionRate}%`, centerX - 50, centerY + 20);
}

export async function createQuestionSlides(
  pdf: jsPDF, 
  campaign: CampaignData, 
  processedData: ProcessedData,
  onProgress?: (progress: number) => void
) {
  const { questions } = processedData;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    pdf.addPage();
    
    // Add question title
    pdf.setFontSize(28);
    pdf.setTextColor(THEME.text.primary);
    pdf.text(question.title, 150, 100, { maxWidth: 1600 });

    // Add chart based on question type
    await addQuestionChart(pdf, question, processedData);
    
    onProgress?.((i + 1) / questions.length);
  }
}
