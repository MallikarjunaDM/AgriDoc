"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, CheckCircle } from "lucide-react";

export interface Scheme {
    id: number;
    name: string;
    hindi_name: string;
    ministry: string;
    description: string;
    benefits: string[];
    category: string;
    link: string;
    last_updated: string;
    is_new: boolean;
    is_updated: boolean;
}

interface SchemeProps {
    scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeProps) {
    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className="text-xs font-normal text-slate-500 border border-slate-200 rounded-full px-2 py-0.5">
                                {scheme.category}
                            </span>
                            {scheme.is_new && (
                                <span className="bg-blue-100 text-blue-700 rounded-full text-xs font-medium px-2 py-0.5">New</span>
                            )}
                            {scheme.is_updated && (
                                <span className="bg-amber-100 text-amber-700 rounded-full text-xs font-medium px-2 py-0.5">Updated</span>
                            )}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{scheme.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">{scheme.hindi_name}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 pt-2 flex-1">
                <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                    {scheme.ministry}
                </p>
                <p className="text-sm text-slate-700 mb-4 line-clamp-3">
                    {scheme.description}
                </p>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">Key Benefits:</p>
                    <ul className="space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 mt-auto border-t bg-slate-50 pt-3 flex justify-between items-center">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Updated: {scheme.last_updated}
                </p>
                <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-2 bg-green-700 hover:bg-green-800">
                        Apply Now <ExternalLink className="h-3 w-3" />
                    </Button>
                </a>
            </CardFooter>
        </Card>
    );
}
