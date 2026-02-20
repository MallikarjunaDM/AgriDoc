"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, AlertTriangle, Info, MapPin } from "lucide-react";
import { useUserProfile } from "@/context/UserProfileContext";

// Dynamic import for Leaflet map to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">Loading Map...</div>
});

export default function CollectivePage() {
    const { profile } = useUserProfile();
    const locationLabel = profile.locationName ? `${profile.locationName} Area` : "Your District";
    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-slate-900">Collective Intelligence</h1>
                        <p className="text-xs text-slate-500">{locationLabel} • 1,240 Active Farms</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-green-700 border-green-200 bg-green-50">
                    <Shield className="h-4 w-4" /> Privacy Protected
                </Button>
            </header>

            {/* Map Container */}
            <div className="flex-1 relative z-0">
                <MapWithNoSSR />

                {/* Overlay Stats */}
                <div className="absolute top-4 right-4 z-[400] w-64 space-y-2 pointer-events-none">
                    <Card className="bg-white/90 backdrop-blur pointer-events-auto border-red-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <span className="font-bold text-red-700">Warning: Aphids</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2">
                                High concentration of aphid reports near {locationLabel}. Spread rate is rising.
                            </p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                <div className="bg-red-500 h-1.5 rounded-full w-[70%]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Low Risk</span>
                                <span>Severe</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/90 backdrop-blur pointer-events-auto border-orange-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <span className="font-bold text-orange-700">Caution: Rust</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2">
                                Moderate reports of Yellow Rust near Hampi region.
                            </p>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                <div className="bg-orange-500 h-1.5 rounded-full w-[40%]"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-md pointer-events-auto">
                    <Card className="bg-slate-900 text-white border-green-500/30 shadow-2xl">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-green-400">Contribute Data</p>
                                <p className="text-xs text-slate-400">Report an issue to help neighbors.</p>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">
                                <MapPin className="h-4 w-4 mr-2" /> Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
