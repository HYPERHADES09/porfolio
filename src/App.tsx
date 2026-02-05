import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PixelCursorTrail } from "@/components/ui/pixel-trail";
import {
  CursorSuppressionProvider,
  useCursorSuppression,
} from "@/components/cursor/CursorSuppressionContext";
import { SoftCursor } from "@/components/cursor/SoftCursor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function CursorLayer() {
  // ... (keep usage)
  const { suppressed } = useCursorSuppression();
  return (
    <div className="cursor-none">
      <SoftCursor hidden={suppressed} />
      <PixelCursorTrail />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CursorSuppressionProvider>
        <CursorLayer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/home" element={<Index />} />
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CursorSuppressionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
