"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
    ImageIcon,
    Paperclip,
    SendIcon,
    XIcon,
    LoaderIcon,
    Leaf,
    Stethoscope,
    CloudRain,
    ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import axios from "axios";

/* ─── Auto-resize hook ─────────────────────────────────────────── */
function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const el = textareaRef.current;
            if (!el) return;
            el.style.height = `${minHeight}px`;
            if (!reset)
                el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight ?? Infinity))}px`;
        },
        [minHeight, maxHeight]
    );
    useEffect(() => {
        if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
    }, [minHeight]);
    return { textareaRef, adjustHeight };
}

/* ─── Types ────────────────────────────────────────────────────── */
interface Message {
    role: "user" | "ai";
    content: string;
    image?: string;
    diagnosis?: { issue: string; confidence: string; treatment: string[] };
}

/* ─── Data ─────────────────────────────────────────────────────── */
const QUICK_PROMPTS = [
    { icon: <Leaf className="w-4 h-4" />, label: "Diagnose crop issue", text: "My crop leaves are turning yellow with brown spots. What disease is this?" },
    { icon: <Stethoscope className="w-4 h-4" />, label: "Treatment advice", text: "What treatment do you recommend for fungal infections in wheat?" },
    { icon: <CloudRain className="w-4 h-4" />, label: "Weather impact", text: "How does excess rain affect my paddy crop and what should I do?" },
    { icon: <ShoppingCart className="w-4 h-4" />, label: "Buy medicine", text: "Which pesticide should I buy for aphid infestation on my tomatoes?" },
];

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "te", label: "తెలుగు" },
    { code: "ta", label: "தமிழ்" },
];

/* ─── Typing dots ──────────────────────────────────────────────── */
function TypingDots() {
    return (
        <div className="flex items-center gap-1 ml-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

/* ─── Main export ──────────────────────────────────────────────── */
export function AnimatedAIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content:
                "Hello! 🌾 I'm your personal AI agronomist. Describe your crop problem or upload a photo and I'll diagnose it for you.",
        },
    ]);
    const [value, setValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [selectedLang, setSelectedLang] = useState("en");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImage(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const handleSend = async (overrideText?: string) => {
        const text = overrideText ?? value;
        if (!text.trim() && !selectedImage) return;

        const userMsg: Message = {
            role: "user",
            content: text || "I've uploaded a crop photo. Please diagnose it.",
            image: selectedImage ?? undefined,
        };
        setMessages((p) => [...p, userMsg]);
        const img = selectedImage;
        setValue("");
        setSelectedImage(null);
        adjustHeight(true);
        setLoading(true);

        const langLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label ?? "English";
        try {
            const res = await axios.post("http://localhost:8000/api/doctor/diagnose", {
                message: img ? `[Image attached] ${text || "Diagnose this crop image."}` : text,
                chat_history: messages.map((m) => ({ role: m.role, content: m.content })),
                language: selectedLang,
                language_name: langLabel,
                image_base64: img ?? null,
            });
            const d = res.data;
            setMessages((p) => [
                ...p,
                {
                    role: "ai",
                    content: d.diagnosis ?? "I've analyzed your request.",
                    diagnosis: {
                        issue: d.diagnosis ?? "",
                        confidence: d.confidence ?? "Medium",
                        treatment: d.treatment ?? [],
                    },
                },
            ]);
        } catch {
            setMessages((p) => [
                ...p,
                { role: "ai", content: "⚠️ Unable to connect to the server. Please ensure the backend is running and try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const inputBorderColor = inputFocused ? "rgba(0,230,118,0.55)" : "rgba(0,230,118,0.2)";
    const inputShadow = inputFocused ? "0 0 22px rgba(0,230,118,0.18)" : "none";

    return (
        <div className="flex flex-col h-full w-full relative" style={{ background: "#0a0f0d" }}>
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] animate-pulse" />
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/8 rounded-full filter blur-[120px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
            </div>

            {/* Header */}
            <div
                className="relative z-10 flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: "rgba(0,230,118,0.12)", background: "rgba(10,15,13,0.9)", backdropFilter: "blur(12px)" }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.3)" }}
                    >
                        <Stethoscope className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="font-black text-white text-xl" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                            AI Doctor
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-emerald-400 text-xs font-semibold">Online</span>
                        </div>
                    </div>
                </div>

                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="text-sm font-semibold rounded-lg px-3 py-2 cursor-pointer focus:outline-none"
                    style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)", color: "#00E676" }}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                            {l.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chat messages */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-5">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "ai" && (
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center mr-3 shrink-0 mt-1"
                                    style={{ background: "rgba(0,230,118,0.2)", border: "1px solid rgba(0,230,118,0.35)" }}
                                >
                                    <Leaf className="w-4 h-4 text-emerald-400" />
                                </div>
                            )}
                            <div
                                className="max-w-[80%] rounded-2xl px-5 py-4 text-base leading-relaxed font-medium"
                                style={
                                    msg.role === "user"
                                        ? { background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", borderRadius: "1rem 1rem 0.25rem 1rem" }
                                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,230,118,0.15)", color: "rgba(255,255,255,0.9)", borderRadius: "0.25rem 1rem 1rem 1rem" }
                                }
                            >
                                {msg.image && (
                                    <div className="mb-3 rounded-xl overflow-hidden">
                                        <img src={msg.image} alt="Crop" className="max-w-full max-h-52 object-contain rounded-xl" />
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{msg.content}</p>

                                {/* Diagnosis card */}
                                {msg.diagnosis && msg.diagnosis.treatment.length > 0 && (
                                    <div
                                        className="mt-4 p-4 rounded-xl"
                                        style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)" }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-emerald-300 text-sm">Diagnosis</span>
                                            <span
                                                className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                                                style={{ background: "#00E676", color: "#071E14" }}
                                            >
                                                {msg.diagnosis.confidence}
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5 text-sm text-emerald-100">
                                            {msg.diagnosis.treatment.map((t, j) => (
                                                <li key={j} className="flex gap-2">
                                                    <span className="text-emerald-400 shrink-0">•</span>
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading dot */}
                {loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "rgba(0,230,118,0.2)" }}
                        >
                            <Leaf className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div
                            className="flex items-center gap-2 px-5 py-4 rounded-2xl rounded-bl-none text-white/70 text-base"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,230,118,0.15)" }}
                        >
                            <span className="font-medium">Analyzing</span>
                            <TypingDots />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts – only before first user message */}
            {messages.length <= 1 && (
                <div className="relative z-10 px-6 pb-3 shrink-0">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {QUICK_PROMPTS.map((p, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => handleSend(p.text)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                                style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", color: "#7CFFB2" }}
                            >
                                {p.icon} {p.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Image preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative z-10 px-6 py-3 flex items-center gap-3 shrink-0"
                        style={{ background: "rgba(0,230,118,0.05)", borderTop: "1px solid rgba(0,230,118,0.12)" }}
                    >
                        <div className="relative">
                            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-xl" />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white"
                            >
                                <XIcon className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-sm text-white/50 font-medium">Image attached · type a message or send now</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input area */}
            <div
                className="relative z-10 p-5 shrink-0"
                style={{ background: "rgba(10,15,13,0.95)", borderTop: "1px solid rgba(0,230,118,0.12)" }}
            >
                <div
                    className="relative rounded-2xl overflow-hidden transition-shadow duration-300"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${inputBorderColor}`,
                        boxShadow: inputShadow,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder="Describe your crop issue… (Enter to send, Shift+Enter for newline)"
                        className="w-full bg-transparent px-5 pt-4 pb-2 text-white/90 placeholder-white/25 text-base font-medium resize-none focus:outline-none"
                        style={{ minHeight: "60px", maxHeight: "200px" }}
                    />
                    <div className="flex items-center justify-between px-4 pb-3 pt-1">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 rounded-xl transition-colors hover:bg-white/10"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                                title="Attach crop photo"
                            >
                                <Paperclip className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 rounded-xl transition-colors hover:bg-white/10"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                                title="Upload image"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <motion.button
                            onClick={() => handleSend()}
                            disabled={loading || (!value.trim() && !selectedImage)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                            style={{
                                background: value.trim() || selectedImage ? "#00E676" : "rgba(255,255,255,0.08)",
                                color: value.trim() || selectedImage ? "#071E14" : "rgba(255,255,255,0.4)",
                            }}
                        >
                            {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                            Send
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
