"use client";

import { useState } from "react";
import { useUserProfile, SOIL_TYPES } from "@/context/UserProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, X, Wheat } from "lucide-react";

export function LocationSetupModal({ onClose }: { onClose: () => void }) {
    const { profile, setProfile, geocodeLocation } = useUserProfile();
    const [locationInput, setLocationInput] = useState(profile.locationName);
    const [soilType, setSoilType] = useState(profile.soilType);
    const [geocoding, setGeocoding] = useState(false);
    const [suggestion, setSuggestion] = useState<{ lat: number; lon: number; display: string } | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!locationInput.trim()) return;
        setGeocoding(true);
        setError("");
        const result = await geocodeLocation(locationInput);
        setGeocoding(false);
        if (!result) {
            setError("Location not found. Try a more specific name.");
        } else {
            setSuggestion(result);
        }
    };

    const handleSave = () => {
        if (!suggestion && !profile.locationName) {
            setError("Please search and confirm your location first.");
            return;
        }
        const loc = suggestion ?? { lat: profile.lat, lon: profile.lon, display: profile.locationName };
        setProfile({
            ...profile,          // preserves name and other fields
            locationName: loc.display,
            lat: loc.lat,
            lon: loc.lon,
            soilType: soilType,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <Card className="w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Set Your Farm Location</h2>
                            <p className="text-sm text-slate-500 mt-0.5">This personalises your weather, climate & soil data</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Location Input */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" /> Village / City / District
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={locationInput}
                                onChange={(e) => { setLocationInput(e.target.value); setSuggestion(null); }}
                                placeholder="e.g. Bellary, Pune, Varanasi..."
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="flex-1"
                            />
                            <Button onClick={handleSearch} disabled={geocoding} className="bg-green-600 hover:bg-green-700 shrink-0">
                                {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                            </Button>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                        {/* Geocoded suggestion confirmation */}
                        {suggestion && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">✓ Found: {suggestion.display}</p>
                                    <p className="text-xs text-green-600">Lat: {suggestion.lat.toFixed(4)}, Lon: {suggestion.lon.toFixed(4)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Soil Type Select */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Wheat className="h-4 w-4 inline mr-1" /> Soil Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {SOIL_TYPES.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSoilType(s)}
                                    className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${soilType === s
                                        ? "bg-green-600 text-white border-green-600 font-semibold"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save */}
                    <Button
                        onClick={handleSave}
                        className="w-full bg-green-700 hover:bg-green-800"
                        disabled={!suggestion && !profile.locationName}
                    >
                        Save & Update Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
