import * as React from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    className?: string;
}

function ButtonCta({ label = "Get Access", className, ...props }: ButtonCtaProps) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative h-12 px-8 rounded-full overflow-hidden transition-all duration-300",
                "bg-white/10 hover:bg-white/20",
                "backdrop-blur-md border border-white/20 border-b-white/10",
                "shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.3)]",
                "text-white font-medium text-lg tracking-wide",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute -inset-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] transition-transform duration-700 ease-out group-hover:translate-x-[150%] pointer-events-none" />
            <span className="relative z-10 drop-shadow-md">{label}</span>
        </Button>
    );
}

export { ButtonCta }
