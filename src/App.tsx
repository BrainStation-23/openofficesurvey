import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/auth/AuthCallback";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./components/layouts/AdminLayout";
import UserLayout from "./components/layouts/UserLayout";
import Dashboard from "./pages/Dashboard";

import PublicSurveyPage from "./pages/public/Survey";
import ThankYouPage from "./pages/public/ThankYou";

// User pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserSettings from "./pages/user/Settings";
import UserMySurveys from "./pages/user/my-surveys";
import UserSurveyResponse from "./pages/user/my-surveys/[id]";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminConfig from "./pages/admin/Config";
import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";
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
import PresentationView from "./pages/admin/surveys/campaigns/[id]/components/PresentationView/index";
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
import SecurityPassword from "./pages/admin/security/password";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          {/* Public routes */}
          <Route path="/public/survey/:token" element={<PublicSurveyPage />} />
          <Route path="/public/survey/:token/thank-you" element={<ThankYouPage />} />
          
          {/* User routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="my-surveys" element={<UserMySurveys />} />
            <Route path="my-surveys/:id" element={<UserSurveyResponse />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/edit" element={<EditUserPage />} />
            <Route path="my-surveys" element={<MySurveysPage />} />
            <Route path="my-surveys/:id" element={<SurveyResponsePage />} />
            <Route path="surveys" element={<SurveysPage />} />
            <Route path="surveys/create" element={<SurveyFormPage />} />
            <Route path="surveys/:id/edit" element={<SurveyFormPage />} />
            <Route path="surveys/:id/preview" element={<PreviewSurveyPage />} />
            <Route path="surveys/campaigns" element={<CampaignsPage />} />
            <Route path="surveys/campaigns/create" element={<CampaignFormPage />} />
            <Route path="surveys/campaigns/:id" element={<CampaignDetailsPage />} />
            <Route path="surveys/campaigns/:id/present" element={<PresentationView />} />
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
            <Route path="security/password" element={<SecurityPassword />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
