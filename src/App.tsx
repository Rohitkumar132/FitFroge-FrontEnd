import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import LanguageProvider from "@/i18n/LanguageProvider";
import HomePage from "@/pages/HomePage";
import WorkoutsPage from "@/pages/WorkoutsPage";
import WorkoutDetailPage from "@/pages/WorkoutDetailPage";
import VideosPage from "@/pages/VideosPage";
import DietPlansPage from "@/pages/DietPlansPage";
import BMICalculatorPage from "@/pages/BMICalculatorPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import CommunityPage from "@/pages/CommunityPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import TrainersPage from "@/pages/TrainersPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 1000 },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/:slug" element={<WorkoutDetailPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/diet" element={<DietPlansPage />} />
              <Route path="/bmi" element={<BMICalculatorPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
