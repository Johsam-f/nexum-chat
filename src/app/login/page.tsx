'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';


export default function LoginPage() {
    const [loading, setLoading] = useState<"google" | "github" | null>(null);

    const handleGoogleLogin = async () => {
        setLoading("google");   
        try {
            await authClient.signIn.social({ 
                provider: "google",
                callbackURL: "/home",
            });
            toast.success("Redirecting...");
            
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google login failed. Please try again.");
        } finally {
            setLoading(null);
        }
    };      

    const handleGithubLogin = async () => {
        setLoading("github");
        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/home",
            });
            toast.success("login in Successful! Redirecting...");
        } catch (error) {
            console.error("GitHub login error:", error);
            toast.error("GitHub login failed. Please try again.");
        } finally {
            setLoading(null);
        }
    };

  return (
    <main className="grid items-center justify-center w-screen h-screen">
        <div className="w-full sm:w-[50vw] max-w-md rounded-2xl mask-clip-border border-black dark:border-white border-2 p-8 flex flex-col gap-4">
            <Image src="/nexum_logo.svg" alt="Logo" width={200} height={100} className='mx-auto' />
            <h1 className="mb-6 text-center text-2xl font-bold text-black dark:text-white">
                Log In to 
                <span className="text-gray-700 text-3xl font-extrabold tracking-wide drop-shadow-lg ml-2">
                    Nexum Chat
                </span>

            </h1>
            <Button
                onClick={handleGoogleLogin}
                variant="secondary"
                className='bg-gray-700 text-white dark:bg-gray-300 dark:text-black'
                disabled={loading === "google"}
            >
                {loading === "google" ? (
                <Spinner />
                ) : (
                    <FaGoogle className="text-xl mr-2 text-white dark:text-black" />
                )}
                Continue with Google
            </Button>
            <Button
                onClick={handleGithubLogin}
                variant="secondary"
                className="mt-3 bg-gray-700 text-white dark:bg-gray-300 dark:text-black"
                disabled={loading === "github"}
            >
            {loading === "github" ? (
                <Spinner />
            ) : (
                <FaGithub className="text-xl mr-2 text-white dark:text-black" />
            )}
                Continue with GitHub
            </Button>
            
        </div>
    </main>
  )
}