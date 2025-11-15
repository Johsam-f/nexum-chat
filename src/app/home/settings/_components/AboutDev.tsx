"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export function AboutDev() {
  const handleSendEmail = () => {
    window.location.href = "mailto:johsam.web@gmail.com?subject=Nexum Chat Feedback";
  };

  return (
    <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          About the Developer
        </CardTitle>
        <CardDescription>
          Built with passion by Johsam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Nexum Chat is a modern social networking platform built with Next.js. This project showcases real-time features, 
            secure authentication, and a beautiful user interface.
          </p>
          <p className="text-sm text-muted-foreground   ">
            {`Nexum means "connection" in Latin, reflecting the platform's mission to 
            connect people through meaningful interactions and shared experiences.`}
          </p>
          <p className="text-sm text-muted-foreground">
            Nexum is developed by Johsam, a passionate developer dedicated to 
            creating seamless and engaging web experiences. Connect with me 
            through the links below!
          </p>
          <h3>The Goal of Nexum series</h3>
          <p className="text-sm text-muted-foreground">
            {`The goal of the Nexum series is to explore the potential of social networking 
            through innovative features and user-centric design. Each iteration aims to 
            enhance connectivity and foster a sense of community among users.`}
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you for using Nexum Chat! Your feedback is invaluable in helping
            me improve and grow. And don&apos;t forget to give my GitHub a star!
          </p>
        </div>

        <section className="flex flex-col gap-3 pt-2">
          {/* Email Contact */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSendEmail}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Feedback via Email
          </Button>

          {/* GitHub */}
          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
          >
            <a 
              href="https://github.com/Johsam-f" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaGithub className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>

          {/* LinkedIn (Optional) */}
          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
          >
            <Link 
              href="https://linkedin.com/in/john-sambani-406b0b33b" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin className="h-4 w-4 mr-2" />
              Connect on LinkedIn
            </Link>
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
