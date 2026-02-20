"use client";

import { useLanguage, LANG_LABELS, Lang } from "@/context/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function LanguageSelector() {
    const { lang, setLang } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const langs = Object.keys(LANG_LABELS) as Lang[];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="bg-white border rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
                {LANG_LABELS[lang]}
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {langs.map((l) => (
                        <button
                            key={l}
                            onClick={() => { setLang(l); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${lang === l ? "bg-green-50 text-green-700 font-semibold" : "text-slate-700"
                                }`}
                        >
                            {LANG_LABELS[l]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
