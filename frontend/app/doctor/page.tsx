"use client";

import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";

export default function DoctorPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#0a0f0d" }}>
            {/* Top nav */}
            <header
                className="flex items-center justify-between px-5 py-3 shrink-0"
                style={{ background: "rgba(10,15,13,0.96)", borderBottom: "1px solid rgba(0,230,118,0.12)", backdropFilter: "blur(12px)", zIndex: 20 }}
            >
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/doctor/advisor">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex gap-2 font-semibold"
                        style={{ borderColor: "rgba(0,230,118,0.3)", color: "#00E676", background: "rgba(0,230,118,0.08)" }}
                    >
                        <Sprout className="h-4 w-4" />
                        New Practice Advisor
                    </Button>
                </Link>
            </header>

            {/* Full-screen animated chat — takes all remaining height */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatedAIChat />
            </div>
        </div>
    );
}
