"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Lock } from "lucide-react";

const FEATURES = [
    { id: "expert", icon: "👨‍⚕️", label: "Expert Consult", angle: 0 },
    { id: "price", icon: "📈", label: "Price Prediction", angle: 60 },
    { id: "equip", icon: "🚜", label: "Equipment Lending", angle: 120 },
    { id: "waste", icon: "♻️", label: "Waste Market", angle: 180 },
    { id: "weather", icon: "🌦️", label: "Weather Stations", angle: 240 },
    { id: "soil", icon: "🔬", label: "Soil Sensors", angle: 300 },
];

const ROADMAP = [
    { q: "Q3 2025", items: ["Cattle Farming AI", "Expert Marketplace"] },
    { q: "Q4 2025", items: ["Price Predictions", "Drone Integration"] },
    { q: "2026", items: ["Govt Scheme Integration", "Global Export Hub"] },
];

const RADIUS = 220; // orbit radius in px

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="font-bold text-slate-900">Coming Soon</h1>
            </header>

            <div className="p-8 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
                <h2 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                    The Future of AgriDoc
                </h2>
                <p className="text-slate-500 mb-16 text-lg max-w-xl">
                    We are working hard to bring these features to you. Join the waitlist to get early access.
                </p>

                {/* ── Orbital ring (clockwise) ──────────────────────────────── */}
                <div
                    className="relative mx-auto mb-20"
                    style={{ width: RADIUS * 2 + 130, height: RADIUS * 2 + 130 }}
                >
                    {/* Dashed orbit path */}
                    <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            top: 65, left: 65,
                            width: RADIUS * 2,
                            height: RADIUS * 2,
                            border: "1.5px dashed rgba(22,163,74,0.2)",
                        }}
                    />
                    {/* Centre medallion */}
                    <div
                        className="absolute flex flex-col items-center justify-center rounded-full text-center bg-white shadow-lg"
                        style={{
                            top: "50%", left: "50%",
                            transform: "translate(-50%,-50%)",
                            width: 130, height: 130,
                            border: "2px solid rgba(22,163,74,0.25)",
                        }}
                    >
                        <span className="text-4xl">🌾</span>
                        <span className="text-xs font-bold text-emerald-700 mt-1 leading-tight">AgriDoc<br />2025+</span>
                    </div>

                    {/* Clockwise rotating ring */}
                    <div
                        className="absolute inset-0"
                        style={{ animation: "orbit-clockwise 30s linear infinite", transformOrigin: "50% 50%" }}
                    >
                        {FEATURES.map((feat) => {
                            const angleRad = ((feat.angle - 90) * Math.PI) / 180;
                            const cx = RADIUS * Math.cos(angleRad);
                            const cy = RADIUS * Math.sin(angleRad);
                            const cardW = 120;
                            const cardH = 110;
                            return (
                                <div
                                    key={feat.id}
                                    style={{
                                        position: "absolute",
                                        top: `calc(50% + ${cy}px - ${cardH / 2}px)`,
                                        left: `calc(50% + ${cx}px - ${cardW / 2}px)`,
                                        width: cardW,
                                        height: cardH,
                                        animation: "orbit-counter 30s linear infinite",
                                        transformOrigin: "50% 50%",
                                    }}
                                >
                                    <div
                                        className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-white shadow-md cursor-not-allowed"
                                        style={{ border: "1.5px solid rgba(22,163,74,0.18)" }}
                                    >
                                        {/* Lock badge */}
                                        <span
                                            className="absolute -top-3 text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: "#374151", color: "#fff" }}
                                        >
                                            🔒 Soon
                                        </span>
                                        <span className="text-3xl grayscale opacity-60">{feat.icon}</span>
                                        <p className="text-xs font-semibold text-slate-500 text-center leading-tight px-2">
                                            {feat.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Roadmap ───────────────────────────────────────────── */}
                <div className="w-full bg-white rounded-2xl p-8 shadow-sm border mb-12">
                    <h3 className="font-black text-xl mb-6 text-slate-900">Roadmap</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {ROADMAP.map((phase, i) => (
                            <div key={i}>
                                <div className="text-green-600 font-bold mb-3 flex items-center justify-center gap-2">
                                    <Calendar className="h-4 w-4" /> {phase.q}
                                </div>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    {phase.items.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Waitlist ──────────────────────────────────────────── */}
                <div className="flex max-w-sm mx-auto gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "#e5e7eb" }}
                    />
                    <Button className="bg-green-600 hover:bg-green-700 px-6 rounded-xl">Notify Me</Button>
                </div>
            </div>
        </div>
    );
}
