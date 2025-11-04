export type User = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: "student" | "teacher" | "staff" | "admin"
  bio?: string
  xp_points: number
  level: number
  created_at: string
  is_active: boolean
}

export type Exercise = {
  id: string
  title: string
  description: string
  subject_id: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  answer: string
  hint?: string
  created_by: string
  views_count: number
  likes_count: number
  created_at: string
}

export type Quiz = {
  id: string
  title: string
  description?: string
  subject_id: string
  difficulty: "easy" | "medium" | "hard"
  time_limit?: number
  passing_score: number
  total_questions: number
  created_by: string
  created_at: string
}

export type QuizQuestion = {
  id: string
  quiz_id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation?: string
  order_index: number
}

export type QuizAttempt = {
  id: string
  quiz_id: string
  user_id: string
  score: number
  percentage: number
  answers: Record<string, string>
  completed_at?: string
  started_at: string
}

export type ForumDiscussion = {
  id: string
  title: string
  content: string
  subject_id: string
  category: string
  user_id: string
  views_count: number
  replies_count: number
  likes_count: number
  is_pinned: boolean
  created_at: string
}

export type ForumComment = {
  id: string
  discussion_id: string
  user_id: string
  content: string
  likes_count: number
  created_at: string
}

export type Project = {
  id: string
  title: string
  description?: string
  subject_id: string
  status: "planning" | "in_progress" | "completed"
  start_date?: string
  end_date?: string
  budget?: number
  spent: number
  progress_percentage: number
  created_by: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message?: string
  type: "comment" | "reply" | "achievement" | "mention"
  related_id?: string
  is_read: boolean
  created_at: string
}
