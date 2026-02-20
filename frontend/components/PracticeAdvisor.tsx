"use client";

import { useState } from "react";
import { Search, ChevronRight, CheckCircle, AlertTriangle, Info, Sprout, Droplets, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

// Types matching backend response
interface Phase {
    phase: number;
    title: string;
    duration: string;
    steps: string[];
    cost_this_phase: string;
    what_you_need: string[];
}

interface PracticePlan {
    practice_name: string;
    one_liner: string;
    why_it_works: string;
    compatibility: "High" | "Medium" | "Low";
    compatibility_reason: string;
    estimated_cost: { min: number; max: number; unit: string };
    time_to_see_results: string;
    phases: Phase[];
    common_mistakes: string[];
    government_schemes: string[];
    youtube_search: string;
}

const SUGGESTIONS = [
    { name: "Drip Irrigation", icon: <Droplets className="h-4 w-4" /> },
    { name: "Mulching", icon: <Leaf className="h-4 w-4" /> },
    { name: "Vermicomposting", icon: <Sprout className="h-4 w-4" /> },
    { name: "SRI Rice Method", icon: <Sprout className="h-4 w-4" /> },
    { name: "Hydroponics", icon: <Droplets className="h-4 w-4" /> },
    { name: "Organic Farming", icon: <Leaf className="h-4 w-4" /> }
];

export default function PracticeAdvisor() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<PracticePlan | null>(null);

    const handleSearch = async (term: string) => {
        if (!term.trim()) return;
        setSearch(term);
        setLoading(true);
        setPlan(null); // Reset current plan

        try {
            // Mock farmer profile - in real app, fetch from context/storage
            const farmerProfile = {
                state: "Karnataka",
                crop_type: "Tomato",
                acreage: "2 acres"
            };

            const res = await axios.post("http://localhost:8000/api/advisor/plan", {
                practice_name: term,
                farmer_profile: farmerProfile
            });
            setPlan(res.data);
        } catch (error) {
            console.error("Failed to fetch plan:", error);
            // Handle error (toast or alert)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full gap-4 p-4">
            {/* LEFT PANEL: Search & Discovery */}
            <div className={`flex flex-col gap-4 w-full md:w-1/3 transition-all ${plan ? 'hidden md:flex' : 'flex'}`}>
                <Card className="bg-white shadow-sm border-green-100">
                    <CardHeader className="bg-green-50 border-b border-green-100 pb-4">
                        <CardTitle className="text-xl text-green-800">Explore Practices</CardTitle>
                        <p className="text-sm text-green-600">Discover new farming methods tailored to your farm.</p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="e.g. Drip Irrigation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                                className="pl-10 border-green-200 focus:border-green-500 rounded-xl py-6"
                            />
                            <Button
                                className="absolute right-1 top-1 bg-green-600 hover:bg-green-700 rounded-lg h-10 w-10 p-0"
                                onClick={() => handleSearch(search)}
                                disabled={loading}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Popular Practices</h3>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => handleSearch(s.name)}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-green-50 text-slate-700 hover:text-green-700 rounded-full text-sm border hover:border-green-200 transition-colors"
                                    >
                                        {s.icon} {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT PANEL: AI Plan */}
            <div className={`flex-1 overflow-y-auto ${!plan && 'hidden md:block'} ${!plan && 'md:opacity-50 md:pointer-events-none'}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-green-600 gap-4">
                        <div className="animate-spin h-8 w-8 border-4 border-green-200 border-t-green-600 rounded-full"></div>
                        <p className="animate-pulse">Building your implementation plan...</p>
                    </div>
                ) : plan ? (
                    <div className="space-y-6 pb-20">
                        {/* Header Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                            <div className="absolute top-6 right-6 flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50">Save Plan</Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50">Share</Button>
                            </div>
                            <div className="flex justify-between items-start mb-2 pr-24">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">{plan.practice_name}</h1>
                                    <p className="text-slate-500 mt-1">{plan.one_liner}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className={`
                                    ${plan.compatibility === 'High' ? 'bg-green-100 text-green-700' :
                                        plan.compatibility === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'} 
                                    text-sm px-3 py-1 rounded-full border-0
                                `}>
                                    {plan.compatibility} Compatibility
                                </Badge>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mt-4 border border-slate-100">
                                <span className="font-semibold text-slate-800">Why it works:</span> {plan.why_it_works}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">Estimated Cost</p>
                                    <p className="text-xl font-bold text-blue-900">₹{plan.estimated_cost.min.toLocaleString()} - ₹{plan.estimated_cost.max.toLocaleString()}</p>
                                    <p className="text-xs text-blue-500">{plan.estimated_cost.unit}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <p className="text-xs font-bold text-purple-600 uppercase mb-1">Time to Visual Results</p>
                                    <p className="text-xl font-bold text-purple-900">{plan.time_to_see_results}</p>
                                    <p className="text-xs text-purple-500">Typical duration</p>
                                </div>
                            </div>
                        </div>

                        {/* Implementation Phases */}
                        <h2 className="text-lg font-bold text-slate-800 px-1">Implementation Steps</h2>
                        <Accordion type="single" collapsible className="space-y-3" defaultValue="phase-1">
                            {plan.phases.map((phase) => (
                                <AccordionItem key={phase.phase} value={`phase-${phase.phase}`} className="bg-white border rounded-xl px-2">
                                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-green-100 text-green-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                                {phase.phase}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{phase.title}</div>
                                                <div className="text-xs text-slate-500">{phase.duration} · Est. {phase.cost_this_phase}</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 pt-1 px-14">
                                        <div className="space-y-3">
                                            {/* Checklist */}
                                            <ul className="space-y-2">
                                                {phase.steps.map((step, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                        <div className="h-5 w-5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer peer-checked:bg-green-600">
                                                            <div className="h-3 w-3 bg-slate-100 rounded-sm"></div>
                                                        </div>
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Resources */}
                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed">
                                                {phase.what_you_need.map((item, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {/* Warnings & Schemes */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-red-50 border-red-100 shadow-none">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" /> Common Mistakes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                        {plan.common_mistakes.map((m, i) => <li key={i}>{m}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-blue-50 border-blue-100 shadow-none">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-blue-700 flex items-center gap-2">
                                        <Info className="h-4 w-4" /> Govt. Schemes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                                        {plan.government_schemes.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Follow-up Chat */}
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">Ask about this plan</h3>
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {["Can I do this myself?", "Is there a cheaper alternative?", "Which brand is best?", "How much water will I save?"].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => { /* setInput(q) */ }}
                                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-green-100 border border-green-100"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input placeholder="Ask follow-up questions..." className="rounded-full" />
                                <Button size="icon" className="rounded-full bg-green-600 hover:bg-green-700"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <Sprout className="h-16 w-16 mb-4 text-slate-300" />
                        <p className="text-lg font-medium">Select a practice to see the plan</p>
                        <p className="text-sm">Detailed steps, costs, and timeline will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
