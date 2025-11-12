'use server';
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "../../lib/auth-server";


export default async function HomePage () {
    const token = await getToken();
  // Better-auth exposes a helper query `getCurrentUser` in `convex/auth.ts`.
  // The generated api exposes it under `api.auth.getCurrentUser`.
  // Call it on the server and redirect if no user is returned.
//   try {
//     const currentUser = await fetchQuery(
//       api.auth.getCurrentUser,
//       undefined,
//       { token }
//     );

//     if (!currentUser) {
//       // Not authenticated — server-side redirect (no client flicker)
//       redirect('/login');
//     }
//   } catch (err) {
//     // If the query errors (for example invalid token), treat as unauthenticated.
//     console.error('Error fetching current user:', err);
//     redirect('/login');
//   }


  return (
    <main className='m-5'>HomePage</main>
  )
}

