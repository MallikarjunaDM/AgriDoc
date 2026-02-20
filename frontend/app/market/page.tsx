"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Search, Filter, Star, Check, CheckCircle2, X } from "lucide-react";

const PRODUCTS = [
    { id: 1, name: "Urea Fertilizer 46%", price: 290, unit: "45kg", category: "Fertilizer", image: "/products/urea_fertilizer.jpg", recommended: false },
    { id: 2, name: "DAP (Di-Ammonium Phosphate)", price: 1350, unit: "50kg", category: "Fertilizer", image: "/products/dap_fertilizer.jpg", recommended: false },
    { id: 3, name: "Mancozeb 75% WP", price: 450, unit: "1kg", category: "Fungicide", image: "/products/mancozeb_fungicide.jpg", recommended: true },
    { id: 4, name: "Neem Oil Extract", price: 180, unit: "500ml", category: "Pesticide", image: "/products/neem_oil.jpg", recommended: true },
    { id: 5, name: "Tomato Seeds (Hybrid)", price: 850, unit: "10g", category: "Seeds", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=400", recommended: false },
    { id: 6, name: "Knapsack Sprayer 16L", price: 1200, unit: "1 Unit", category: "Equipment", image: "/products/knapsack_sprayer.jpg", recommended: false },
    { id: 7, name: "NPK 19:19:19 Fertilizer", price: 620, unit: "1kg", category: "Fertilizer", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400", recommended: true },
    { id: 8, name: "Copper Oxychloride 50% WP", price: 280, unit: "500g", category: "Fungicide", image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=400", recommended: false },
];

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

// ─── Waitlist Modal ───────────────────────────────────────────────────────────
function WaitlistModal({ onClose }: { onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: "", phone: "", state: "", crop: "", harvest: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-y-auto max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {!submitted ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-3">🌾</div>
                            <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Be a Founding Seller
                            </h2>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                Get early access, zero commission during beta, and a verified seller badge.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                                <Input
                                    required
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                                <Input
                                    required
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">State</label>
                                <select
                                    required
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option value="">Select your state</option>
                                    {INDIAN_STATES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Primary Crop</label>
                                <Input
                                    required
                                    placeholder="e.g. Tomatoes, Wheat, Rice"
                                    value={form.crop}
                                    onChange={(e) => setForm({ ...form, crop: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Average Harvest</label>
                                <select
                                    required
                                    value={form.harvest}
                                    onChange={(e) => setForm({ ...form, harvest: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option value="">Select range</option>
                                    <option>Less than 1 ton</option>
                                    <option>1–5 tons</option>
                                    <option>5–20 tons</option>
                                    <option>20+ tons</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-base font-bold mt-2"
                            >
                                Join Waitlist →
                            </Button>
                        </form>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            🔒 Your information is private and never shared
                        </p>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            You&apos;re #1,247 on the waitlist!
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            We&apos;ll WhatsApp you when Farmer Direct goes live in your region.
                        </p>
                        <a
                            href="https://wa.me/?text=Hi%2C%20I%20joined%20the%20Farmer%20Direct%20waitlist%20on%20AgriDoc!%20Please%20notify%20me%20when%20it%20goes%20live."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Get Updates on WhatsApp
                        </a>
                        <div className="mt-6">
                            <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 underline">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketPage() {
    const [cart, setCart] = useState<number[]>([]);
    const [filter, setFilter] = useState("All");
    const [showWaitlist, setShowWaitlist] = useState(false);

    const addToCart = (id: number) => {
        setCart([...cart, id]);
    };

    const filteredProducts = filter === "All"
        ? PRODUCTS
        : filter === "Recommended"
            ? PRODUCTS.filter(p => p.recommended)
            : PRODUCTS.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="font-bold text-slate-900">AgriMarket</h1>
                </div>
                <div className="relative">
                    <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-6 w-6 text-slate-700" />
                    </Button>
                    {cart.length > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </div>
            </header>

            {/* ── Filter Tabs ─────────────────────────────────────────────── */}
            <div className="sticky top-[60px] bg-white z-10 px-4 py-2 border-b overflow-x-auto">
                <div className="flex gap-2">
                    {["All", "Recommended", "Fertilizer", "Fungicide", "Pesticide", "Seeds"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {cat === "Recommended" && <Star className="h-3 w-3 inline mr-1 mb-0.5" />}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Product Grid ─────────────────────────────────────────────── */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-slate-100 relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            {product.recommended && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                    AI RECOMMENDED
                                </div>
                            )}
                        </div>
                        <CardContent className="p-3">
                            <div className="text-xs text-slate-500 mb-1">{product.category}</div>
                            <h3 className="font-medium text-slate-900 line-clamp-2 h-10 leading-tight">{product.name}</h3>
                            <div className="flex items-end justify-between mt-2">
                                <div className="font-bold text-lg">₹{product.price}</div>
                                <div className="text-xs text-slate-400">/ {product.unit}</div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                            {cart.includes(product.id) ? (
                                <Button className="w-full bg-green-100 text-green-700 hover:bg-green-200" disabled>
                                    <Check className="h-4 w-4 mr-2" /> Added
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => addToCart(product.id)}
                                    className="w-full bg-slate-900 hover:bg-slate-800"
                                >
                                    Add to Cart
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                FARMER DIRECT MARKET — COMING SOON
            ═══════════════════════════════════════════════════════════════ */}

            {/* ── Section Divider ──────────────────────────────────────────── */}
            <div className="relative my-10 mx-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-slate-50 px-5 py-1.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-500 shadow-sm">
                        🌾 More from Agriculture Doctor
                    </span>
                </div>
            </div>

            {/* ── Hero Banner ──────────────────────────────────────────────── */}
            <div className="mx-4 mb-10">
                {/* Import Playfair Display */}
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>

                <div
                    className="rounded-2xl overflow-hidden relative"
                    style={{
                        background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
                        padding: "48px 40px",
                    }}
                >
                    {/* Decorative blobs */}
                    <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-green-300/10 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 right-1/3 h-32 w-32 rounded-full bg-lime-300/10 blur-3xl pointer-events-none" />

                    {/* Grain texture overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                            backgroundSize: "200px 200px",
                            opacity: 0.04,
                        }}
                    />

                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                        {/* LEFT — Text content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                                🚀 Coming Soon
                            </div>

                            {/* Heading */}
                            <h2
                                className="text-5xl font-black leading-tight mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                <span className="text-white block">Sell Directly.</span>
                                <span className="block" style={{ color: "#6ee7b7" }}>Earn More.</span>
                            </h2>

                            {/* Subtitle */}
                            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.72)", maxWidth: "480px" }}>
                                Skip the middlemen. List your harvest and sell directly to buyers — households, vendors,
                                restaurant owners, food businesses, and fellow farmers in your region.
                            </p>

                            {/* Feature list */}
                            <ul className="space-y-2.5 mb-8">
                                {[
                                    "Sell to households, vendors & businesses",
                                    "Set your own price — no commission in beta",
                                    "Verified buyer network across India",
                                    "Instant payment to your UPI ID",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.82)" }}>
                                        <span className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-400/30 shrink-0">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                                        </span>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowWaitlist(true)}
                                    className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                                    style={{ background: "white", color: "#14532d" }}
                                >
                                    Join Seller Waitlist
                                </button>
                                <a
                                    href="#buyer-types"
                                    className="px-6 py-3 rounded-xl font-bold text-sm border border-white/50 text-white hover:bg-white/10 transition-all"
                                >
                                    Learn More ↓
                                </a>
                            </div>
                        </div>

                        {/* RIGHT — Listing Preview Card */}
                        <div className="flex justify-center md:justify-end">
                            <div className="relative w-full max-w-xs">
                                {/* DEMO watermark */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                                    style={{ transform: "rotate(-20deg)" }}
                                >
                                    <span className="text-4xl font-black" style={{ color: "rgba(0,0,0,0.07)", userSelect: "none" }}>
                                        DEMO
                                    </span>
                                </div>

                                <div
                                    className="bg-white rounded-2xl shadow-2xl p-5 relative"
                                    style={{ transform: "rotate(2deg)" }}
                                >
                                    {/* Badge */}
                                    <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-emerald-100 text-emerald-700 mb-3">
                                        🟢 Live Listing Preview
                                    </div>

                                    {/* Crop photo placeholder */}
                                    <div
                                        className="w-full h-36 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
                                    >
                                        <span className="text-5xl">🍅</span>
                                    </div>

                                    {/* Farmer row */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-7 w-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            RS
                                        </div>
                                        <span className="text-xs text-gray-500">Ramu Singh · Karnataka</span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-base mb-2">Fresh Tomatoes</h3>

                                    {/* Price row */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-emerald-700 text-lg">₹28 / kg</span>
                                        <span className="text-xs text-gray-400">Min. 10 kg</span>
                                    </div>

                                    {/* Chips */}
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-full">🌿 Organic</span>
                                        <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full">📦 500 kg available</span>
                                    </div>

                                    {/* CTA */}
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-bold transition-colors">
                                        Contact Seller
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Buyer Type Cards ─────────────────────────────────────────── */}
            <div id="buyer-types" className="mx-4 mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Who buys on Farmer Direct?
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            emoji: "🏠",
                            bg: "bg-green-100",
                            title: "Households",
                            desc: "Fresh produce delivered directly from farm to your kitchen. No supermarket markup.",
                        },
                        {
                            emoji: "🏪",
                            bg: "bg-blue-100",
                            title: "Vendors & Mandis",
                            desc: "Bulk purchase at farm-gate prices. Build direct relationships with verified farmers.",
                        },
                        {
                            emoji: "🍽️",
                            bg: "bg-orange-100",
                            title: "Restaurants & Businesses",
                            desc: "Consistent supply of quality produce. Custom orders, invoicing, and repeat deliveries.",
                        },
                        {
                            emoji: "🤝",
                            bg: "bg-purple-100",
                            title: "Fellow Farmers",
                            desc: "Buy seeds, seedlings, and surplus produce from neighbouring farms at fair rates.",
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-emerald-200 transition-all group"
                        >
                            <div className={`h-12 w-12 rounded-full ${card.bg} flex items-center justify-center text-2xl mb-4`}>
                                {card.emoji}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Waitlist Modal ─────────────────────────────────────────── */}
            {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
        </div>
    );
}
