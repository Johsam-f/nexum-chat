import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const session = cookieStore.get('better-auth.session_token')
    
    if (!session) {
        redirect('/login');
    }
    
    return (
        <SidebarProvider className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 mt-4">
            <SidebarTrigger size="lg" />
            {children}
            </main>
        </SidebarProvider>
    )
}