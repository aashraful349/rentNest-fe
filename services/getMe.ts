"use server"

import { cookies } from "next/headers"

export const getMe = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  })
  const currentUser = await res.json()
  return currentUser
}

