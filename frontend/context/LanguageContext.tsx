"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "hi" | "kn" | "te" | "ta" | "ml";

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "en",
    setLang: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    useEffect(() => {
        const saved = localStorage.getItem("appLang") as Lang | null;
        if (saved) setLangState(saved);
    }, []);

    const setLang = (l: Lang) => {
        setLangState(l);
        localStorage.setItem("appLang", l);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export const LANG_LABELS: Record<Lang, string> = {
    en: "English",
    hi: "हिन्दी",
    kn: "ಕನ್ನಡ",
    te: "తెలుగు",
    ta: "தமிழ்",
    ml: "മലയാളം",
};
