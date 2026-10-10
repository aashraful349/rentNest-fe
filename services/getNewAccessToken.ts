"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async (token?: string) => {
  let refreshToken = token;

  if (!refreshToken) {
    const cookieStore = await cookies();
    refreshToken = cookieStore.get("refreshToken")?.value;
  }

  if (!refreshToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `refreshToken=${refreshToken}`,
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-cache",
      },
    );

    const result = await res.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to refresh access token",
    };
  }
};
