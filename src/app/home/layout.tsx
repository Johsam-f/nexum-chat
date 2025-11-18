import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { redirect } from "next/navigation"
import { getToken } from "@/lib/auth-server"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const token = await getToken()
    
    if (!token) {
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