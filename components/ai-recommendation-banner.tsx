"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

interface AIRecommendationBannerProps {
  recommendation: {
    id: string;
    name: string;
    objectCount: number;
  };
  onDismiss?: () => void;
  onExplore?: (recommendationId: string) => void;
}

export function AIRecommendationBanner({
  recommendation,
  onDismiss,
  onExplore,
}: AIRecommendationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleExplore = () => {
    onExplore?.(recommendation.id);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 mx-4 my-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <p className="text-xs text-blue-900">
            Smart suggestion: <span className="font-semibold">{recommendation.name}</span> in your catalog
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExplore}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 h-6 px-2 text-xs transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Explore
            <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-500 hover:text-blue-700 p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
