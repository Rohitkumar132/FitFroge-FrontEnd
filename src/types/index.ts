export type Role = "user" | "trainer" | "admin";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  gender?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goal: string;
  fitnessLevel: Difficulty;
  preferredTraining: string[];
  equipmentAccess: string[];
  isEmailVerified: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  type: "workout" | "diet" | "blog" | "challenge";
  icon: string;
  image: string;
  description: string;
}

export interface Trainer {
  _id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
  specialties: string[];
  experienceYears: number;
  certifications: string[];
  rating: number;
  clientsCount: number;
}

export interface WorkoutVideo {
  _id: string;
  title: string;
  slug: string;
  provider: "youtube" | "cloudinary";
  url: string;
  thumbnail: string;
  category: string;
  durationMinutes: number;
  difficulty: Difficulty;
  tags: string[];
}

export interface Workout {
  _id: string;
  title: string;
  slug: string;
  category: string;
  goal: string;
  thumbnail: string;
  difficulty: Difficulty;
  durationMinutes: number;
  caloriesBurned: number;
  description: string;
  trainer?: Trainer;
  equipment: string[];
  targetMuscles: string[];
  exercises: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    steps: string[];
  }[];
  video?: WorkoutVideo;
  isFeatured: boolean;
  isPremium: boolean;
}

export interface DietPlan {
  _id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  goal: string;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: { name: string; time: string; calories: number; items: string[] }[];
  tips: string[];
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  authorName: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  readMinutes: number;
  views: number;
  isFeatured: boolean;
}

export interface Challenge {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  category: string;
  participants: string[];
  rewards: string[];
}

export interface CommunityPost {
  _id: string;
  type: "post" | "transformation";
  title: string;
  content: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  likes: string[];
  saves: string[];
  comments: { text: string; createdAt: string }[];
}

export interface Subscription {
  _id: string;
  name: string;
  slug: string;
  price: number;
  interval: string;
  features: string[];
  isPopular: boolean;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  metric: string;
}

export interface DashboardData {
  stats: {
    workoutsCompleted: number;
    caloriesBurned: number;
    streak: number;
    caloriesLogged: number;
  };
  progress: Array<{ _id: string; completedAt: string; durationMinutes: number; caloriesBurned: number; workout?: Workout }>;
  bmiRecords: Array<{ _id: string; bmi: number; status: string; weightKg: number; createdAt: string }>;
  foodLogs: Array<{ _id: string; foodName: string; calories: number; protein: number; carbs: number; fats: number; mealType: string; date: string }>;
  recommendations: Workout[];
}

export interface HomeData {
  workouts: Workout[];
  categories: Category[];
  trainers: Trainer[];
  dietPlans: DietPlan[];
  testimonials: Testimonial[];
  subscriptions: Subscription[];
  blogs: Blog[];
  challenges: Challenge[];
}
