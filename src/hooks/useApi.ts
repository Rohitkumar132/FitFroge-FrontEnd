import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ApiResponse,
  Blog,
  Category,
  Challenge,
  CommunityPost,
  DashboardData,
  DietPlan,
  HomeData,
  Subscription,
  Trainer,
  Workout,
  WorkoutVideo,
} from "@/types";

const qs = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "" && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

export const useHomeData = () =>
  useQuery({
    queryKey: ["home"],
    queryFn: () => api.get<ApiResponse<HomeData>>("/home"),
  });

export const useWorkouts = (filters: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ["workouts", filters],
    queryFn: () => api.get<ApiResponse<Workout[]>>(`/workouts?${qs(filters)}`),
    placeholderData: previous => previous,
  });

export const useWorkout = (slug = "") =>
  useQuery({
    queryKey: ["workout", slug],
    queryFn: () => api.get<ApiResponse<Workout>>(`/workouts/${slug}`),
    enabled: !!slug,
  });

export const useVideos = (filters: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ["videos", filters],
    queryFn: () => api.get<ApiResponse<WorkoutVideo[]>>(`/videos?${qs(filters)}`),
  });

export const useDietPlans = (filters: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ["dietPlans", filters],
    queryFn: () => api.get<ApiResponse<DietPlan[]>>(`/diet-plans?${qs(filters)}`),
  });

export const useTrainers = () =>
  useQuery({
    queryKey: ["trainers"],
    queryFn: () => api.get<ApiResponse<Trainer[]>>("/trainers"),
  });

export const useCategories = (type?: string) =>
  useQuery({
    queryKey: ["categories", type],
    queryFn: () => api.get<ApiResponse<Category[]>>(`/categories${type ? `?type=${type}` : ""}`),
  });

export const useBlogs = (filters: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ["blogs", filters],
    queryFn: () => api.get<ApiResponse<Blog[]>>(`/blogs?${qs(filters)}`),
  });

export const useBlog = (slug = "") =>
  useQuery({
    queryKey: ["blog", slug],
    queryFn: () => api.get<ApiResponse<Blog>>(`/blogs/${slug}`),
    enabled: !!slug,
  });

export const useCommunity = (type?: string) =>
  useQuery({
    queryKey: ["community", type],
    queryFn: () => api.get<ApiResponse<CommunityPost[]>>(`/community${type ? `?type=${type}` : ""}`),
  });

export const useChallenges = () =>
  useQuery({
    queryKey: ["challenges"],
    queryFn: () => api.get<ApiResponse<Challenge[]>>("/challenges"),
  });

export const useSubscriptions = () =>
  useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => api.get<ApiResponse<Subscription[]>>("/subscriptions"),
  });

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<ApiResponse<DashboardData>>("/dashboard"),
  });

export const useCompleteWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => api.post("/progress/complete", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });
};

export const useCreateBMI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => api.post("/bmi", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });
};

export const useFoodLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => api.post("/food-logs", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });
};

export const useAiRecommendations = () =>
  useMutation({
    mutationFn: (payload: unknown) => api.post<ApiResponse<{ summary: string; workouts: Workout[]; dietPlans: DietPlan[] }>>("/ai/recommendations", payload),
  });

export const useAdminAnalytics = () =>
  useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: () => api.get<ApiResponse<Record<string, number>>>("/admin/analytics"),
  });
