"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "@/components/WeatherCard";
import { ClimateCard } from "@/components/ClimateCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LocationSetupModal } from "@/components/LocationSetupModal";
import { useLanguage } from "@/context/LanguageContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { t as translations } from "@/lib/translations";
import AuroraBorealisShader from "@/components/ui/aurora-borealis-shader";
import {
    CloudSun,
    Thermometer,
    Droplets,
    Wind,
    Bell,
    Menu,
    Stethoscope,
    Leaf,
    Users,
    ShoppingCart,
    Search,
    ChevronRight,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
    X,
    CheckCircle2,
    Clock,
    Lightbulb,
    MapPin,
    Layers,
    LogOut
} from "lucide-react";

// Action Plan Modal
function ActionPlanModal({ onClose }: { onClose: () => void }) {
    const steps = [
        { step: 1, title: "Irrigate tonight before 9PM", detail: "Light irrigation (15–20 mm) will store heat in the soil and protect roots from thermal shock.", time: "Tonight", urgent: true },
        { step: 2, title: "Apply mulch layer if bare soil", detail: "A 5cm layer of dry straw or crop residue between rows will insulate root zone by up to 3°C.", time: "Tomorrow morning", urgent: false },
        { step: 3, title: "Avoid spraying fungicides tomorrow", detail: "Frost conditions reduce absorption and may cause phytotoxicity. Reschedule to after temperatures recover.", time: "Skip tomorrow", urgent: false },
        { step: 4, title: "Check stored grain moisture", detail: "Cold nights increase condensation. Verify moisture levels in stored wheat are below 12% to prevent mold.", time: "This week", urgent: false },
        { step: 5, title: "Monitor for frost burn symptoms", detail: "Check leaf tips for whitish/silver discoloration 24h after the cold event. Consult AI Doctor if found.", time: "Friday–Saturday", urgent: false },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4" onClick={onClose}>
            <div
                className="bg-white w-full md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-green-600 text-white p-6 rounded-t-3xl md:rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
                                <Lightbulb className="h-3.5 w-3.5" /> ACTION PLAN
                            </div>
                            <h2 className="text-xl font-bold">Temperature Drop — Friday</h2>
                            <p className="text-green-100 text-sm mt-1">Drop to 12°C expected · Wheat at growing stage · Bellary, Karnataka</p>
                        </div>
                        <button onClick={onClose} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Summary pills */}
                    <div className="flex gap-3 mt-4 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-red-500/30 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" /> 1 Urgent Action
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-full">
                            <Clock className="h-3.5 w-3.5" /> 5 Steps Total
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-full">
                            🌡️ Est. Crop Risk: Medium
                        </span>
                    </div>
                </div>

                {/* Steps */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">What to do</p>
                    {steps.map((s) => (
                        <div
                            key={s.step}
                            className={`rounded-xl p-4 border ${s.urgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${s.urgent ? 'bg-red-500 text-white' : 'bg-green-100 text-green-700'}`}>
                                    {s.step}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <h3 className={`font-bold ${s.urgent ? 'text-red-800' : 'text-slate-800'}`}>{s.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${s.urgent ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {s.time}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 ${s.urgent ? 'text-red-700' : 'text-slate-600'}`}>{s.detail}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Link href="/doctor" className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                            <Stethoscope className="h-4 w-4" /> Ask AI Doctor More
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={onClose} className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showActionPlan, setShowActionPlan] = useState(false);
    const [showLocationSetup, setShowLocationSetup] = useState(false);
    const { lang } = useLanguage();
    const t = translations[lang];
    const { profile } = useUserProfile();

    // Auto-show setup if no location saved yet
    useEffect(() => {
        if (!profile.locationName) setShowLocationSetup(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Action Plan Modal */}
            {showActionPlan && <ActionPlanModal onClose={() => setShowActionPlan(false)} />}

            {/* Location Setup Modal */}
            {showLocationSetup && <LocationSetupModal onClose={() => setShowLocationSetup(false)} />}

            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-green-800">
                    <Leaf className="h-5 w-5" /> AgriDoc
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-slate-500" />
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="h-6 w-6 text-slate-700" />
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-green-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-green-800">
                    <Leaf className="h-6 w-6" /> {t.appName}
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-green-800 rounded-lg text-white font-medium">
                        <div className="h-5 w-5" /> {t.dashboard}
                    </Link>
                    <Link href="/doctor" className="flex items-center gap-3 px-4 py-3 text-green-100 hover:bg-green-800 rounded-lg transition-colors">
                        <Stethoscope className="h-5 w-5" /> {t.aiDoctor}
                    </Link>
                    <Link href="/detect" className="flex items-center gap-3 px-4 py-3 text-green-100 hover:bg-green-800 rounded-lg transition-colors">
                        <Leaf className="h-5 w-5" /> {t.diseaseDetection}
                    </Link>
                    <Link href="/collective" className="flex items-center gap-3 px-4 py-3 text-green-100 hover:bg-green-800 rounded-lg transition-colors">
                        <Users className="h-5 w-5" /> {t.collectiveIntel}
                    </Link>
                    <Link href="/market" className="flex items-center gap-3 px-4 py-3 text-green-100 hover:bg-green-800 rounded-lg transition-colors">
                        <ShoppingCart className="h-5 w-5" /> {t.marketplace}
                    </Link>
                    <Link href="/schemes" className="flex items-center gap-3 px-4 py-3 text-amber-100 hover:bg-green-800 rounded-lg transition-colors">
                        <div className="h-5 w-5 flex items-center justify-center font-serif font-bold text-amber-300">₹</div>
                        {t.govSchemes}
                    </Link>
                    <div className="pt-8 text-xs text-green-400 font-semibold uppercase tracking-wider px-4">{t.comingSoon}</div>
                    <Link href="/coming-soon" className="flex items-center gap-3 px-4 py-3 text-green-100/60 hover:text-green-100 hover:bg-green-800/50 rounded-lg transition-colors">
                        {t.expertConsult}
                    </Link>
                    <Link href="/coming-soon" className="flex items-center gap-3 px-4 py-3 text-green-100/60 hover:text-green-100 hover:bg-green-800/50 rounded-lg transition-colors">
                        {t.pricePrediction}
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full border-t border-green-800">
                    <div className="flex items-center gap-3 p-4 pb-2">
                        <div className="h-10 w-10 bg-green-700 rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile.name || "Farmer"}</p>
                            <p className="text-xs text-green-300 truncate">{profile.locationName || "Location not set"}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/40 hover:text-red-200 transition-colors text-sm font-semibold"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{t.greeting}, {profile.name || "Farmer"} 🌅</h1>
                        <button
                            onClick={() => setShowLocationSetup(true)}
                            className="flex items-center gap-1 text-slate-500 hover:text-green-700 text-sm mt-0.5 group transition-colors"
                        >
                            <MapPin className="h-3.5 w-3.5 group-hover:text-green-600" />
                            <span>{profile.locationName || "Set your location"}</span>
                            <span className="text-xs text-green-600 underline ml-1 opacity-0 group-hover:opacity-100 transition-opacity">change</span>
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => setShowLocationSetup(true)} className="gap-2 text-slate-600">
                            <MapPin className="h-4 w-4" />
                            {profile.locationName ? "Edit Location" : "Set Location"}
                        </Button>
                        <LanguageSelector />
                    </div>
                </header>

                {/* Farm Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="h-full"><WeatherCard /></div>
                    <div className="h-full"><ClimateCard /></div>

                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{t.seasonStage}</p>
                                <h3 className="text-2xl font-bold mt-1">{t.growing}</h3>
                                <p className="text-xs text-slate-500 mt-1">Wheat (Day 45)</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Leaf className="h-6 w-6 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Soil Type Card */}
                    <Card
                        className="cursor-pointer border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors"
                        onClick={() => setShowLocationSetup(true)}
                    >
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Soil Type</p>
                                {profile.soilType ? (
                                    <>
                                        <h3 className="text-lg font-bold mt-1 text-amber-800 leading-tight">{profile.soilType.split(" (")[0]}</h3>
                                        {profile.soilType.includes("(") && (
                                            <p className="text-xs text-amber-600 mt-0.5">{profile.soilType.match(/\(([^)]+)\)/)?.[1]}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-amber-600 font-medium mt-2">Tap to set soil type</p>
                                )}
                            </div>
                            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <Layers className="h-6 w-6 text-amber-700" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Insight of the Day */}
                <div className="mb-8">
                    <Card className="relative overflow-hidden border-none shadow-xl" style={{ background: 'linear-gradient(135deg,#065f46 0%,#047857 50%,#064e3b 100%)' }}>
                        {/* Aurora shader overlay */}
                        <AuroraBorealisShader className="rounded-xl" />
                        <CardContent className="relative z-10 p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#d1fae5' }}>
                                        💡 {t.insightTitle}
                                    </div>
                                    <h2 className="font-black mb-2" style={{ color: '#ecfdf5', fontSize: 'clamp(1.35rem,3vw,1.9rem)', textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{t.tempDrop}</h2>
                                    <p className="max-w-xl font-medium" style={{ color: '#a7f3d0', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>{t.tempDropDesc}</p>
                                </div>
                                <Button
                                    className="shrink-0 font-bold hover:scale-105 transition-transform"
                                    style={{ background: 'rgba(255,255,255,0.92)', color: '#065f46' }}
                                    onClick={() => setShowActionPlan(true)}
                                >
                                    {t.seeActionPlan}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Grid */}
                <h2 className="text-lg font-bold text-slate-800 mb-4">{t.quickActions}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link href="/doctor">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-green-200 bg-green-50/50">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                <div className="h-14 w-14 bg-white rounded-full shadow-sm flex items-center justify-center">
                                    <Stethoscope className="h-7 w-7 text-green-600" />
                                </div>
                                <h3 className="font-bold text-green-900">{t.consultAI}</h3>
                                <p className="text-xs text-green-700">{t.chatCrop}</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/detect">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Leaf className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-slate-800">{t.scanDisease}</h3>
                                <p className="text-xs text-slate-500">{t.photoDetection}</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/collective">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                <div className="h-14 w-14 bg-purple-50 rounded-full flex items-center justify-center">
                                    <Users className="h-7 w-7 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-slate-800">{t.communityMap}</h3>
                                <p className="text-xs text-slate-500">{t.viewLocalAlerts}</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/market">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                <div className="h-14 w-14 bg-orange-50 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="h-7 w-7 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-slate-800">{t.marketplace}</h3>
                                <p className="text-xs text-slate-500">{t.buyInputs}</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity Feed */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">{t.recentActivity}</h2>
                            <Button variant="link" className="text-green-600">{t.viewAll}</Button>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                {[
                                    { icon: Stethoscope, title: "Diagnosis: Yellow Rust", date: "Today, 10:30 AM", type: "Doctor" },
                                    { icon: Bell, title: "Alert: Aphids outbreak nearby", date: "Yesterday", type: "Alert" },
                                    { icon: ShoppingCart, title: "Order #4829 Placed", date: "3 days ago", type: "Order" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                                            <item.icon className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900">{item.title}</h4>
                                            <p className="text-xs text-slate-500">{item.date}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Collective Snapshot */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">{t.communityPulse}</h2>
                        <Card className="bg-slate-900 text-white border-none">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-medium text-slate-300 truncate">{profile.locationName ? `${profile.locationName} Area` : "Your District"}</h3>
                                    <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded shrink-0">{t.highAlert}</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Aphid Reports</span>
                                            <span className="font-bold text-red-400">High</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-[80%]"></div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">12 farms reported today</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Yellow Rust</span>
                                            <span className="font-bold text-yellow-400">Mod</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 w-[45%]"></div>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/collective">
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-200">
                                        {t.viewFullMap}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
