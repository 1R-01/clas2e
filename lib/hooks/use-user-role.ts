"use client"

import { useUser } from "./use-user"

export function useUserRole() {
  const { user, loading } = useUser()

  const isAdmin = user?.role === "admin"
  const isStaff = user?.role === "staff"
  const isTeacher = user?.role === "teacher"
  const isStudent = user?.role === "student"

  return {
    user,
    loading,
    isAdmin,
    isStaff,
    isTeacher,
    isStudent,
    canAccessDashboard: isAdmin || isStaff,
  }
}
