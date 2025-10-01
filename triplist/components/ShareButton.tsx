'use client';

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard!', {
        description: 'You can now share this packing list with others',
      });
    } catch (err) {
      toast.error('Failed to copy link', {
        description: 'Please try again',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share List</span>
    </Button>
  );
}
