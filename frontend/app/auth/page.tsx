"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useUserProfile } from "@/context/UserProfileContext";

export default function AuthPage() {
    const router = useRouter();
    const { profile, setProfile } = useUserProfile();
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [loginName, setLoginName] = useState("");
    const [signupName, setSignupName] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const name = loginName.trim();
        if (name) {
            // 1. Write directly to localStorage — synchronous, guaranteed to persist
            try {
                const existing = localStorage.getItem("userProfile");
                const parsed = existing ? JSON.parse(existing) : {};
                localStorage.setItem("userProfile", JSON.stringify({ ...parsed, name }));
            } catch { }
            // 2. Also update React context state so same-tab navigation picks it up
            setProfile({ ...profile, name });
        }
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const name = signupName.trim();
        if (name) {
            try {
                const existing = localStorage.getItem("userProfile");
                const parsed = existing ? JSON.parse(existing) : {};
                localStorage.setItem("userProfile", JSON.stringify({ ...parsed, name }));
            } catch { }
            setProfile({ ...profile, name });
        }
        setTimeout(() => {
            setLoading(false);
            router.push("/onboarding");
        }, 1500);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column: Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="mx-auto w-full max-w-[350px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <Link href="/" className="mx-auto flex items-center gap-2 mb-4">
                            <Leaf className="h-8 w-8 text-green-600" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {activeTab === "login" ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {activeTab === "login"
                                ? "Enter your credentials to access your farm dashboard"
                                : "Join thousands of farmers improving their yield"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg text-sm font-medium">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`p-2 rounded-md transition-all ${activeTab === "login" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("signup")}
                            className={`p-2 rounded-md transition-all ${activeTab === "signup" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {activeTab === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-name">Your Name</Label>
                                <Input
                                    id="login-name"
                                    placeholder="e.g. Ramu Kumar"
                                    value={loginName}
                                    onChange={(e) => setLoginName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Phone Number or Email</Label>
                                <Input id="email" placeholder="+91 98765 43210" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-xs text-green-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                {loading ? "Logging in..." : "Login to Dashboard"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    placeholder="e.g. Ramu Kumar"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Phone Number</Label>
                                <Input id="signup-email" placeholder="+91 98765 43210" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">State</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                    <option value="">Select State</option>
                                    <option value="karnataka">Karnataka</option>
                                    <option value="maharashtra">Maharashtra</option>
                                    <option value="punjab">Punjab</option>
                                    <option value="tamilnadu">Tamil Nadu</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" required minLength={8} />
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                            <p className="px-8 text-center text-xs text-muted-foreground">
                                By clicking continue, you agree to our{" "}
                                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </form>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" type="button">
                        Google (Demo)
                    </Button>

                </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-green-900" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop')" }}
                />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Leaf className="mr-2 h-6 w-6" />
                    AgriDoc
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "This platform saved my tomato crop from early blight. The collective alerts warned me 3 days before symptoms appeared."
                        </p>
                        <footer className="text-sm">Ramesh Kumar, Bellary</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
