import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-cyan-50/30 to-violet-50/30 dark:via-cyan-950/10 dark:to-violet-950/10">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/nexum_logo.svg"
              alt="Nexum Chat"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-bold text-xl bg-linear-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">Nexum</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hover:text-cyan-600">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-linear-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/30 text-sm">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-cyan-700 dark:text-cyan-300 font-medium">Connect with friends in real-time</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Stay Connected with{" "}
            <span className="bg-linear-to-r from-cyan-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Nexum Chat
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-muted-foreground">
            Experience seamless communication with friends and communities. 
            Chat instantly, share moments, and build lasting connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-12 bg-linear-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 shadow-lg shadow-cyan-500/30">
                Start Chatting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12 border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-cyan-700 dark:hover:bg-cyan-950">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to stay connected
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make communication effortless and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="border-2 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Instant Messaging</h3>
              <p className="text-muted-foreground">
                Send messages instantly with real-time delivery. Stay in the conversation with typing indicators and read receipts.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-2 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Group Chats</h3>
              <p className="text-muted-foreground">
                Create groups for your teams, friends, or communities. Collaborate and share ideas seamlessly.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-2 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built for speed with modern technology. Experience blazing-fast performance on any device.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-2 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your conversations are protected with industry-standard security. Your privacy is our priority.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="border-2 hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Beautiful Design</h3>
              <p className="text-muted-foreground">
                Enjoy a clean, modern interface with dark mode support. Designed for the best user experience.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="border-2 hover:border-rose-500/50 transition-all hover:shadow-lg hover:shadow-rose-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Rich Media</h3>
              <p className="text-muted-foreground">
                Share photos, videos, and files effortlessly. Express yourself with emojis and reactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-linear-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 border-2 border-cyan-200 dark:border-cyan-800 shadow-xl">
          <CardContent className="py-16 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Ready to start chatting?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users already connecting on Nexum Chat. 
              Sign up now and start your first conversation today.
            </p>
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-12 bg-linear-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 shadow-lg shadow-cyan-500/30">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/nexum_logo.svg"
                alt="Nexum Chat"
                width={48}
                height={48}
                className="dark:invert"
              />
              <span className="font-semibold">Nexum Chat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Nexum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
