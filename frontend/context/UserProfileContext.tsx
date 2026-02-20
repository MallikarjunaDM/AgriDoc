"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
    name: string;               // e.g. "Ramu Kumar"
    locationName: string;       // Human-readable, e.g. "Bellary"
    lat: number;
    lon: number;
    soilType: string;           // e.g. "Black Cotton", "Red Loam", etc.
}

const DEFAULT_PROFILE: UserProfile = {
    name: "",
    locationName: "",
    lat: 15.1394,
    lon: 76.9214,
    soilType: "",
};

interface UserProfileContextType {
    profile: UserProfile;
    setProfile: (p: UserProfile) => void;
    geocodeLocation: (name: string) => Promise<{ lat: number; lon: number; display: string } | null>;
}

const UserProfileContext = createContext<UserProfileContextType>({
    profile: DEFAULT_PROFILE,
    setProfile: () => { },
    geocodeLocation: async () => null,
});

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);

    // Load from localStorage on mount
    useEffect(() => {
        const load = () => {
            try {
                const saved = localStorage.getItem("userProfile");
                if (saved) setProfileState(JSON.parse(saved));
            } catch { }
        };

        load(); // initial load

        // Re-read when another tab/page writes to localStorage
        window.addEventListener("storage", load);
        // Also re-read when the window regains focus (e.g. after login page)
        window.addEventListener("focus", load);

        return () => {
            window.removeEventListener("storage", load);
            window.removeEventListener("focus", load);
        };
    }, []);

    const setProfile = (p: UserProfile) => {
        setProfileState(p);
        localStorage.setItem("userProfile", JSON.stringify(p));
    };

    // Geocode a location name to lat/lon using Open-Meteo's geocoding API (free, no key needed)
    const geocodeLocation = async (name: string): Promise<{ lat: number; lon: number; display: string } | null> => {
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
            );
            const data = await res.json();
            if (!data.results || data.results.length === 0) return null;
            const r = data.results[0];
            return {
                lat: r.latitude,
                lon: r.longitude,
                display: r.name + (r.admin1 ? `, ${r.admin1}` : "") + (r.country ? `, ${r.country}` : ""),
            };
        } catch {
            return null;
        }
    };

    return (
        <UserProfileContext.Provider value={{ profile, setProfile, geocodeLocation }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    return useContext(UserProfileContext);
}

export const SOIL_TYPES = [
    "Black Cotton (Vertisol)",
    "Red Loamy",
    "Alluvial",
    "Laterite",
    "Sandy Loam",
    "Clay Loam",
    "Silty Clay",
    "Saline / Alkaline",
    "Peaty / Organic",
];
