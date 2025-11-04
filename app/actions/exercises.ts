"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { awardXP } from "@/lib/actions/gamification"

export async function submitExerciseComment(exerciseId: string, content: string) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("exercise_comments")
    .insert({
      exercise_id: exerciseId,
      user_id: session.user.id,
      content,
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  await awardXP(session.user.id, 5, "Commento su esercizio")

  revalidatePath("/esercizi")
  return { success: true, comment: data[0] }
}

export async function likeExercise(exerciseId: string) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data, error } = await supabase
    .from("exercises")
    .update({ likes_count: supabase.raw("likes_count + 1") })
    .eq("id", exerciseId)
    .select()

  if (error) {
    return { error: error.message }
  }

  if (session?.user) {
    await awardXP(session.user.id, 2, "Like su esercizio")
  }

  revalidatePath("/esercizi")
  return { success: true }
}
