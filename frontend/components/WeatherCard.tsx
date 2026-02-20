"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    CloudSun,
    CloudRain,
    Wind,
    Loader2,
    MapPin,
    Sun,
    Cloud,
    CloudSnow,
    CloudLightning,
    Cloudy,
} from "lucide-react";
import { useUserProfile } from "@/context/UserProfileContext";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface WeatherData {
    current: {
        temperature: number;
        humidity: number;
        precipitation: number;
        wind_speed: number;
        weather_code: number;
    };
    daily: {
        max_temp: number;
        min_temp: number;
        total_precip: number;
    };
    units: {
        temperature_2m: string;
        precipitation: string;
        wind_speed_10m: string;
    };
}

function weatherDescription(code: number): string {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 9) return "Foggy";
    if (code <= 19) return "Drizzle";
    if (code <= 29) return "Rain";
    if (code <= 39) return "Snow / Sleet";
    if (code <= 49) return "Foggy";
    if (code <= 59) return "Drizzle";
    if (code <= 69) return "Rain";
    if (code <= 79) return "Snow";
    if (code <= 84) return "Rain Showers";
    if (code <= 94) return "Thunderstorm";
    return "Severe Thunderstorm";
}

function WeatherIcon({ code, className }: { code: number; className?: string }) {
    if (code === 0) return <Sun className={className} />;
    if (code <= 3) return <CloudSun className={className} />;
    if (code <= 69) return <CloudRain className={className} />;
    if (code <= 79) return <CloudSnow className={className} />;
    if (code <= 84) return <CloudRain className={className} />;
    if (code <= 99) return <CloudLightning className={className} />;
    return <Cloudy className={className} />;
}

export function WeatherCard() {
    const { profile } = useUserProfile();
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/api/weather?lat=${profile.lat}&lon=${profile.lon}`
                );
                if (!response.ok) throw new Error("Weather service unavailable");
                const weatherData = await response.json();
                setData(weatherData);
            } catch (err) {
                console.error(err);
                setError("Unable to load weather");
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [profile.lat, profile.lon]);

    if (loading) {
        return (
            <Card className="h-full">
                <CardContent className="p-6 flex items-center justify-center h-full min-h-[160px]">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full bg-red-50">
                <CardContent className="p-6 flex items-center justify-center h-full">
                    <p className="text-red-500 text-sm">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const locDisplay = profile.locationName || "Your Location";
    const code = data.current.weather_code ?? 1;

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
            <Card className="h-full bg-gradient-to-br from-blue-50 to-white border-blue-100 overflow-hidden relative z-10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <WeatherIcon code={code} className="h-32 w-32 text-blue-600" />
                </div>

                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10 box-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {locDisplay}
                            </p>
                            <h3 className="text-4xl font-bold mt-2 text-slate-800">
                                {Math.round(data.current.temperature)}°
                            </h3>
                            <p className="text-sm text-slate-600 font-medium mt-1">
                                {weatherDescription(code)}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                            <WeatherIcon code={code} className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-blue-500" />
                            <div>
                                <p className="text-xs text-slate-500">Rain</p>
                                <p className="font-semibold text-sm">
                                    {data.current.precipitation} {data.units.precipitation}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-500">Wind</p>
                                <p className="font-semibold text-sm">
                                    {data.current.wind_speed} {data.units.wind_speed_10m}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
