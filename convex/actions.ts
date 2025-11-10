"use server";

// has an error

import { fetchMutation } from "convex/nextjs";
import { api } from "../convex/_generated/api";
import { getToken } from "../src/lib/auth-server";

// Authenticated mutation via server function
export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const token = await getToken();
  await fetchMutation(
    api.users.updatePassword,
    { currentPassword, newPassword },
    { token }
  );
}