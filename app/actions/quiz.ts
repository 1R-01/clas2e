"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string>,
  score: number,
  percentage: number,
) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      user_id: session.user.id,
      answers,
      score,
      percentage,
      completed_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  // Award XP based on score
  const xpGained = Math.floor(percentage * 10)
  await supabase
    .from("users")
    .update({ xp_points: supabase.raw(`xp_points + ${xpGained}`) })
    .eq("id", session.user.id)

  revalidatePath("/quiz")
  return { success: true, xpGained }
}
