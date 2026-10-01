import React from "react";
import { Home, LayoutDashboard, Loader2 } from "lucide-react";

interface GlobalLoadingProps {
  message?: string;
}

const GlobalLoading = ({ message = "Finding your next home..." }: GlobalLoadingProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative flex flex-col items-center gap-4">

        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <LayoutDashboard className="h-7 w-7 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground tracking-wide">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Rent<span className="text-primary">Nest</span></span>
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;