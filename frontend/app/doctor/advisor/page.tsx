"use client";

import PracticeAdvisor from "@/components/PracticeAdvisor";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function PracticeAdvisorPage() {
    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/doctor">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                            <Stethoscope className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900">Farming Practice Advisor</h1>
                            <p className="text-xs text-green-600">Expert Implementation Plans</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <PracticeAdvisor />
            </div>
        </div>
    );
}
