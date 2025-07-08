import { cn } from "@/lib/utils";
import React from "react";

export const Container = ({ children, className }) => {
    return (
        <div className={cn("mx-auto max-w-7xl px-4", className)}>
            {children}
        </div>
    );
};
