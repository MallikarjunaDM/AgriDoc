"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    History,
    Loader2,
} from "lucide-react";
import { useUserProfile } from "@/context/UserProfileContext";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface ClimateData {
    comparison: {
        year_1990: number;
        year_2023: number;
        diff: number;
    };
    insight: string;
}

export function ClimateCard() {
    const { profile } = useUserProfile();
    const [data, setData] = useState<ClimateData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClimate = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8000/api/climate?lat=${profile.lat}&lon=${profile.lon}`
                );
                if (!response.ok) throw new Error("Climate service unavailable");
                const climateData = await response.json();
                setData(climateData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClimate();
    }, [profile.lat, profile.lon]);

    if (loading) {
        return (
            <Card className="h-full bg-slate-50 border-dashed">
                <CardContent className="p-6 flex items-center justify-center h-full min-h-[160px]">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    return (
        <div className="relative h-full rounded-xl">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-orange-100 relative z-10">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-orange-800 font-bold flex items-center gap-1 uppercase tracking-wider">
                                <History className="h-3 w-3" /> Climate Insight
                            </p>
                            <h3 className="text-xl font-bold mt-2 text-slate-800 leading-tight">
                                {data.comparison.diff > 0 ? "+" : ""}{data.comparison.diff}°C Warming
                            </h3>
                        </div>
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">1990 Avg</span>
                            <span className="font-semibold">{data.comparison.year_1990}°C</span>
                        </div>

                        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-orange-400 rounded-full"
                                style={{ width: '70%' }}
                            ></div>
                            <div
                                className="absolute top-0 left-0 h-full bg-slate-400/30 border-r border-white"
                                style={{ width: '60%' }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Today</span>
                            <span className="font-semibold text-orange-600">{data.comparison.year_2023}°C</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-2 bg-white/50 p-2 rounded border border-orange-100">
                            {data.insight}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
