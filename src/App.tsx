
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TourProvider } from "./components/onboarding/TourContext";
import { Tour } from "./components/onboarding/Tour";
import MainLayout from "./components/layouts/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/auth/AuthCallback";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./components/layouts/AdminLayout";
import UserLayout from "./components/layouts/UserLayout";

import PublicSurveyPage from "./pages/public/Survey";
import ThankYouPage from "./pages/public/ThankYou";
import LiveEntryPage from "./pages/live/LiveEntryPage";
import PublicLiveSession from "./pages/live/PublicLiveSession";
import JoinLiveSession from "./pages/live/JoinLiveSession";
import Presentation from "./pages/public/Presentation";

import ProfilePage from "./pages/common/Profile";
import MyTeamPage from "./pages/common/MyTeam";

import UserDashboard from "./pages/user/Dashboard";
import UserSettings from "./pages/user/Settings";
import UserMySurveys from "./pages/user/my-surveys";
import UserSurveyResponse from "./pages/user/my-surveys/[id]";
import UserAchievementsPage from "./pages/user/achievements";
import UserIssueBoards from "./pages/user/issue-boards";
import UserIssueBoardView from "./pages/user/issue-boards/[id]";
import FeedbackDashboardPage from "./pages/user/feedback";
import ReporteeFeedbackPage from "./pages/user/feedback/reportee";
import FeedbackTrendPage from "./pages/user/feedback/trend";


import AdminDashboard from "./pages/admin/Dashboard";
import AdminConfig from "./pages/admin/Config";
import AdminSettings from "./pages/admin/Settings";
import SystemInfo from "./pages/admin/settings/SystemInfo";
import Users from "./pages/admin/users";
import EditUserPage from "./pages/admin/users/[id]/edit";
import MySurveysPage from "./pages/admin/my-surveys";
import SurveyResponsePage from "./pages/admin/my-surveys/[id]";
import SurveysPage from "./pages/admin/surveys";
import SurveyFormPage from "./pages/admin/surveys/SurveyFormPage";
import PreviewSurveyPage from "./pages/admin/surveys/[id]/preview";
import CampaignsPage from "./pages/admin/surveys/campaigns";
import CampaignFormPage from "./pages/admin/surveys/campaigns/CampaignFormPage";
import CampaignDetailsPage from "./pages/admin/surveys/campaigns/[id]";
import CampaignInstancesPage from "./pages/admin/surveys/campaigns/[id]/instances";
import CampaignPerformance from "./pages/admin/surveys/campaigns/[id]/components/CampaignPerformance";
import LiveSurveyPage from "./pages/admin/surveys/live";
import LiveSessionControlPage from "./pages/admin/surveys/live/[sessionId]";
import AdminIssueBoards from "./pages/admin/surveys/issue-boards";
import AdminIssueBoardView from "./pages/admin/surveys/issue-boards/[id]";
import PlatformConfigLayout from "./components/layouts/PlatformConfigLayout";
import SBUsConfig from "./pages/admin/config/sbus";
import SBUDetails from "./pages/admin/config/sbus/[id]";
import EmailConfig from "./pages/admin/config/email";
import LevelConfig from "./pages/admin/config/level";
import LocationConfig from "./pages/admin/config/location";
import EmploymentTypeConfig from "./pages/admin/config/employment-type";
import EmployeeTypeConfig from "./pages/admin/config/employee-type";
import EmployeeRoleConfig from "./pages/admin/config/employee-role";
import AIPromptsConfig from "./pages/admin/config/ai-prompts";
import AchievementsPage from "./pages/admin/achievements";
import AchievementFormPage from "./pages/admin/achievements/AchievementFormPage";
import CreateIssueBoard from "./pages/admin/surveys/issue-boards/CreateIssueBoard";
import EditIssueBoard from "./pages/admin/surveys/issue-boards/EditIssueBoard";


import { TokenInputForm } from "./pages/public/presentation/TokenInputForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <TourProvider>
          <Tour />
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            <Route path="/live" element={<LiveEntryPage />} />
            <Route path="/live/:joinCode" element={<PublicLiveSession />} />
            <Route path="/live/:joinCode/join" element={<JoinLiveSession />} />
            
            <Route path="/public/survey/:token" element={<PublicSurveyPage />} />
            <Route path="/public/survey/:token/thank-you" element={<ThankYouPage />} />
            <Route path="/presentation" element={<TokenInputForm />} />
            <Route path="/presentation/:token" element={<Presentation />} />
            
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="my-surveys" element={<UserMySurveys />} />
              <Route path="my-surveys/:assignmentId/:instanceId" element={<UserSurveyResponse />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-team" element={<MyTeamPage />} />
              <Route path="feedback" element={<FeedbackDashboardPage />} />
              <Route path="feedback/reportee" element={<ReporteeFeedbackPage />} />
              <Route path="feedback/trend" element={<FeedbackTrendPage />} />
              <Route path="achievements" element={<UserAchievementsPage />} />
              <Route path="issue-boards" element={<UserIssueBoards />} />
              <Route path="issue-boards/:id" element={<UserIssueBoardView />} />
            </Route>
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-team" element={<MyTeamPage />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id/edit" element={<EditUserPage />} />
              <Route path="my-surveys" element={<MySurveysPage />} />
              <Route path="my-surveys/:assignmentId/:instanceId" element={<SurveyResponsePage />} />
              <Route path="surveys" element={<SurveysPage />} />
              <Route path="surveys/create" element={<SurveyFormPage />} />
              <Route path="surveys/:id/edit" element={<SurveyFormPage />} />
              <Route path="surveys/:id/preview" element={<PreviewSurveyPage />} />
              <Route path="surveys/campaigns" element={<CampaignsPage />} />
              <Route path="surveys/campaigns/create" element={<CampaignFormPage />} />
              <Route path="surveys/campaigns/:id" element={<CampaignDetailsPage />} />
              <Route path="surveys/campaigns/:id/performance" element={<CampaignPerformance />} />
              <Route path="surveys/campaigns/:id/instances" element={<CampaignInstancesPage />} />
              <Route path="surveys/live" element={<LiveSurveyPage />} />
              <Route path="surveys/live/:sessionId" element={<LiveSessionControlPage />} />
              
              <Route path="surveys/issue-boards" element={<AdminIssueBoards />} />
              <Route path="surveys/issue-boards/create" element={<CreateIssueBoard />} />
              <Route path="surveys/issue-boards/:id" element={<EditIssueBoard />} />
              <Route path="surveys/issue-boards/:id/view" element={<AdminIssueBoardView />} />
                   
              <Route path="config" element={<PlatformConfigLayout />}>
                <Route index element={<AdminConfig />} />
                <Route path="sbus" element={<SBUsConfig />} />
                <Route path="sbus/:id" element={<SBUDetails />} />
                <Route path="email" element={<EmailConfig />} />
                <Route path="level" element={<LevelConfig />} />
                <Route path="location" element={<LocationConfig />} />
                <Route path="employment-type" element={<EmploymentTypeConfig />} />
                <Route path="employee-type" element={<EmployeeTypeConfig />} />
                <Route path="employee-role" element={<EmployeeRoleConfig />} />
                <Route path="ai-prompts" element={<AIPromptsConfig />} />
              </Route>
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="achievements/create" element={<AchievementFormPage />} />
              <Route path="achievements/:id/edit" element={<AchievementFormPage />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="settings/system-info" element={<SystemInfo />} />
              <Route path="surveys/campaigns/:id/performance" element={<CampaignPerformance />} />
            </Route>
          </Routes>
        </TourProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
