"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [acres, setAcres] = useState(5);

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            router.push("/dashboard");
        }
    };

    const skip = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                            <Leaf className="h-5 w-5" /> Setup Farm Profile
                        </div>
                        <span className="text-xs text-muted-foreground">Step {step} of {totalSteps}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </CardHeader>
                <CardContent className="pt-6 min-h-[300px] flex flex-col justify-center">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold">What is your primary crop?</h2>
                            <p className="text-muted-foreground">This helps us personalize disease alerts and doctor advice.</p>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {['Wheat', 'Rice', 'Cotton', 'Maize', 'Tomato', 'Potato'].map((crop) => (
                                    <button key={crop} className="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 text-left focus:ring-2 focus:ring-green-500 focus:outline-none">
                                        {crop}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold">How much land do you farm?</h2>
                            <Label>Acres: <span className="font-bold text-lg text-green-700">{acres.toFixed(1)}</span></Label>
                            <input
                                type="range"
                                min="0.5"
                                max="100"
                                step="0.5"
                                value={acres}
                                onChange={(e) => setAcres(Number(e.target.value))}
                                className="w-full accent-green-600"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0.5 Acre</span>
                                <span>100+ Acres</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold">What challenges do you face?</h2>
                            <p className="text-muted-foreground">Select all that apply.</p>
                            <div className="flex flex-wrap gap-2">
                                {['Pests', 'Fungal Diseases', 'Water Shortage', 'Soil Quality', 'Market Prices', 'Labor'].map((issue) => (
                                    <button key={issue} className="px-3 py-2 rounded-full border hover:bg-green-50 hover:border-green-500 text-sm">
                                        {issue}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
                            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold">All Set!</h2>
                            <p className="text-muted-foreground">Your personal AI agronomist is ready to help.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                        {step === totalSteps ? "Go to Dashboard" : "Continue"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
