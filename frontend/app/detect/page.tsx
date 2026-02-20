"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload, Loader2, AlertTriangle } from "lucide-react";
import Webcam from "react-webcam";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { t as translations } from "@/lib/translations";

export default function DetectPage() {
    const [mode, setMode] = useState<"initial" | "camera" | "preview" | "analyzing" | "result">("initial");
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { lang } = useLanguage();
    const t = translations[lang];

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
            setMode("preview");
        }
    }, [webcamRef]);

    // ✅ Fixed: Upload Photo handler
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setMode("preview");
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!imageSrc) return;
        setMode("analyzing");

        try {
            const base64Response = await fetch(imageSrc);
            const blob = await base64Response.blob();
            const formData = new FormData();
            formData.append("file", blob, "scan.jpg");

            const res = await axios.post("http://localhost:8000/api/disease/detect", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log(res.data);
            setMode("result");
        } catch (error) {
            console.error("Detection failed", error);
            alert("Failed to analyze image. Please try again.");
            setMode("initial");
        }
    };

    const reset = () => {
        setImageSrc(null);
        setMode("initial");
    };

    return (
        <div className="min-h-screen flex flex-col" style={{
            background: "linear-gradient(135deg, #1a3d1a 0%, #2d6a2d 25%, #1e5c1e 50%, #3a7d44 75%, #2d5a1e 100%)"
        }}>
            {/* Decorative field pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 60px,
                    rgba(255,255,255,0.03) 60px,
                    rgba(255,255,255,0.03) 61px
                ), repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 100px,
                    rgba(255,255,255,0.02) 100px,
                    rgba(255,255,255,0.02) 101px
                )`,
            }} />

            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between text-white z-10 relative">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    <span className="font-bold text-lg tracking-wide">{t.diseaseScannerTitle}</span>
                </div>
                <div className="w-10" />
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col relative z-10">

                {mode === "initial" && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                        {/* Decorative floating leaves */}
                        <div className="absolute top-10 left-10 text-6xl opacity-20 pointer-events-none select-none rotate-12">🌾</div>
                        <div className="absolute top-20 right-8 text-5xl opacity-15 pointer-events-none select-none -rotate-12">🌱</div>
                        <div className="absolute bottom-20 left-6 text-5xl opacity-15 pointer-events-none select-none rotate-6">🍃</div>
                        <div className="absolute bottom-32 right-10 text-4xl opacity-20 pointer-events-none select-none -rotate-6">🌿</div>

                        {/* Title */}
                        <div className="text-center text-white mb-2">
                            <h1 className="text-2xl font-extrabold mb-1">{t.aiCropDetection}</h1>
                            <p className="text-green-200 text-sm">{t.identifyInstantly}</p>
                        </div>

                        {/* Main Card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 blur-3xl opacity-10 rounded-full" />
                            <div className="relative border-2 border-dashed border-green-400/40 rounded-2xl p-8 flex flex-col items-center text-center max-w-sm bg-black/30 backdrop-blur-md shadow-2xl">
                                <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center mb-5 border border-green-400/30">
                                    <Camera className="h-12 w-12 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">{t.scanLeaf}</h2>
                                <p className="text-green-200/80 mb-6 text-sm leading-relaxed">
                                    {t.scanLeafDesc}
                                </p>

                                <Button
                                    onClick={() => setMode("camera")}
                                    size="lg"
                                    className="w-full bg-green-500 hover:bg-green-400 text-white font-bold shadow-lg shadow-green-900/50 mb-3"
                                >
                                    <Camera className="mr-2 h-5 w-5" /> {t.openCamera}
                                </Button>

                                {/* ✅ Fixed Upload Photo button with hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUpload}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-green-400/50 text-green-100 hover:bg-green-800/50 hover:text-white bg-transparent"
                                >
                                    <Upload className="mr-2 h-5 w-5" /> {t.uploadPhoto}
                                </Button>
                            </div>
                        </div>

                        {/* Stats bar */}
                        <div className="flex gap-6 text-center mt-4">
                            {[
                                { label: t.diseasesDetected, value: "50+" },
                                { label: t.accuracy, value: "95%" },
                                { label: t.cropsSupported, value: "30+" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-white/80">
                                    <div className="font-bold text-lg text-green-300">{stat.value}</div>
                                    <div className="text-xs text-green-200/70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {mode === "camera" && (
                    <div className="flex-1 relative bg-black">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="absolute inset-0 w-full h-full object-cover"
                            videoConstraints={{ facingMode: "environment" }}
                        />
                        <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                        </div>
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                            <button
                                onClick={capture}
                                className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform"
                            >
                                <div className="h-16 w-16 bg-white rounded-full" />
                            </button>
                        </div>
                        <button
                            onClick={reset}
                            className="absolute top-4 right-4 text-white bg-black/50 rounded-full px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {mode === "preview" && imageSrc && (
                    <div className="flex-1 flex flex-col bg-black">
                        <div className="flex-1 relative">
                            <img src={imageSrc} alt="Captured" className="w-full h-full object-contain" />
                        </div>
                        <div className="p-6 bg-slate-900 flex gap-4">
                            <Button variant="outline" onClick={reset} className="flex-1 border-slate-600 text-white">
                                Retake
                            </Button>
                            <Button onClick={handleAnalyze} className="flex-1 bg-green-600 hover:bg-green-700">
                                Analyze Leaf
                            </Button>
                        </div>
                    </div>
                )}

                {mode === "analyzing" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-white p-6 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full" />
                            <Loader2 className="h-16 w-16 text-green-400 animate-spin relative z-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Analyzing Image...</h2>
                        <p className="text-green-200/80">Identifying potential diseases and pests</p>
                    </div>
                )}

                {mode === "result" && imageSrc && (
                    <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
                        <div className="h-64 relative shrink-0">
                            <img src={imageSrc} alt="Analyzed" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                                <span className="text-white font-mono text-xs opacity-80">ID: #SCAN-8292 • 94% CONFIDENCE</span>
                            </div>
                        </div>

                        <div className="flex-1 p-6 -mt-6 rounded-t-3xl bg-white relative z-10 shadow-xl space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    <span className="text-sm font-bold text-red-500 uppercase tracking-wider">Detection Found</span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900">Late Blight</h1>
                                <p className="text-slate-500">Phytophthora infestans</p>
                            </div>

                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <h3 className="font-bold text-red-900 mb-2">Severity: High</h3>
                                <p className="text-sm text-red-800">
                                    Immediate action required. Late blight can spread rapidly in humid conditions and destroy the entire crop within days.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg">Recommended Treatment</h3>
                                {[
                                    "Spray Metalaxyl + Mancozeb (2.5g/liter)",
                                    "Ensure proper drainage in the field",
                                    "Remove and burn infected leaves immediately"
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-green-700 font-bold text-xs">{i + 1}</span>
                                        </div>
                                        <p className="text-slate-700 text-sm">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold">
                                    Buy Fungicides
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={reset}>Scan Another</Button>
                                    <Button variant="outline">Share Report</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
