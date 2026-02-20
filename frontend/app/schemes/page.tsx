"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Loader2, BookOpen } from "lucide-react";
import { SchemeCard, Scheme } from "@/components/SchemeCard";
import { useLanguage } from "@/context/LanguageContext";
import { t as translations } from "@/lib/translations";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function SchemesPage() {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState<string[]>([]);
    const { lang } = useLanguage();
    const t = translations[lang];

    // Fetch Schemes
    useEffect(() => {
        const fetchSchemes = async () => {
            setLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (selectedCategory !== "All") params.append("category", selectedCategory);

                const res = await fetch(`http://localhost:8000/api/schemes?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setSchemes(data);
                }
            } catch (error) {
                console.error("Failed to fetch schemes", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchSchemes();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/schemes/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(["All", ...data]);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-100 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-amber-700" />
                        </div>
                        <h1 className="font-bold text-slate-900">{t.schemesTitle}</h1>
                    </div>
                    <LanguageSelector />
                </div>
            </header>



            <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Search & Filter Section */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t.searchSchemes}
                                className="pl-9 bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="hidden md:flex gap-2">
                            <Filter className="h-4 w-4" /> {t.filter}
                        </Button>
                    </div>

                    {/* Categories Scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedCategory === cat
                                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Schemes Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                    </div>
                ) : schemes.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        {t.noSchemes}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.map(scheme => (
                            <div key={scheme.id} className="h-full">
                                <SchemeCard scheme={scheme} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
