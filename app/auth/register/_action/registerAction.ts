"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type RegisterState = {
  success?: boolean
  statusCode?: number
  message?: string
  data?: any
} | false

export const registerAction = async (prevState: RegisterState, formData: FormData) => {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = (formData.get("phone") as string) || undefined
  const roleInput = (formData.get("role") as string)?.toUpperCase() || "TENANT"
  const role = roleInput === "LANDLORD" ? "LANDLORD" : "TENANT"

  if (!name || !email || !password) {
    return {
      success: false,
      message: "Name, email, and password are required",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long",
    }
  }

  const payload: Record<string, any> = {
    name,
    email,
    password,
    role,
  }

  if (phone) {
    payload.phone = phone
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (!result.success) {
      return result
    }

    const loginRes = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const loginResult = await loginRes.json()

    if (loginResult?.success && loginResult?.data?.accessToken) {
      const cookieStore = await cookies()

      cookieStore.set("accessToken", loginResult.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      })

      cookieStore.set("refreshToken", loginResult.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      })

      redirect("/dashboard")
    }

    redirect("/auth/login")
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return {
      success: false,
      message: error.message || "An error occurred during registration",
    }
  }
}
