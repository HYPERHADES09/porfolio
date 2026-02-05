"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
    return (
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<img src="/src/assets/s1.png" alt="Logo" className="h-8 w-8 object-contain" />}
                title="Password Cracking & Hash Analysis Tool"
                description="Identifies common hash types like MD5, SHA-1, and bcrypt, then performs dictionary and brute-force attacks."
            />
            <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<img src="/src/assets/r1.png" alt="Logo" className="h-8 w-8 object-contain" />}
                title="Smart Billing & Inventory Management System"
                description="Manages products with add, update, and delete operations while automatically generating bills."
            />
            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<img src="/src/assets/p1.png" alt="Logo" className="h-8 w-8 object-contain" />}
                title="IoT-Based Smart Security System"
                description="Detects motion using a PIR sensor and instantly sends alerts to a mobile device or email.
                "
            />
            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<img src="/src/assets/q2.png" alt="Logo" className="h-8 w-8 object-contain" />}
                title="Web Application Vulnerability Scanner"
                description="Scans a target website for common vulnerabilities like SQL Injection, XSS, open ports, weak headers."
            />
            <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<img src="/favicon.png" alt="Logo" className="h-8 w-8 object-contain" />}
                title="Coming soon on Github Profile"
                description="I'm writing the code as I record this, no shit."
            />
        </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border-[0.75px] border-border bg-background p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                                {title}
                            </h3>
                            <div className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                                {description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
