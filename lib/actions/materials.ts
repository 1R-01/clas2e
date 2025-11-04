"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { awardXP } from "./gamification"

export async function getMaterials(subjectId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("materials")
    .select(`
      *,
      subjects:subjects(id, name, color),
      users:users!materials_uploaded_by_fkey(id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })

  if (subjectId) {
    query = query.eq("subject_id", subjectId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching materials:", error)
    return []
  }

  return data || []
}

export async function createMaterial(formData: {
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  subject_id: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autenticato")

  const { data, error } = await supabase
    .from("materials")
    .insert({
      ...formData,
      uploaded_by: user.id,
      version: 1,
    })
    .select()
    .single()

  if (error) throw error

  await awardXP(user.id, 20, "Caricamento appunto")

  revalidatePath("/appunti")
  return data
}

export async function incrementMaterialDownloads(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.rpc("increment_material_downloads", {
    material_id: id,
  })

  if (error) console.error("Error incrementing downloads:", error)

  if (user) {
    await awardXP(user.id, 3, "Download appunto")
  }
}

export async function incrementMaterialViews(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc("increment_material_views", {
    material_id: id,
  })

  if (error) console.error("Error incrementing views:", error)
}
