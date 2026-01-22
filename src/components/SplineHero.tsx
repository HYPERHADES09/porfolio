import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        "loading-anim-type"?: string;
      };
    }
  }
}

export function SplineHero({ url }: { url: string }) {
  useEffect(() => {
    const id = "spline-viewer-script";
    if (document.getElementById(id)) return;

    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.id = id;
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.12.39/build/spline-viewer.js";
      document.body.appendChild(script);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <spline-viewer
        url={url}
        loading-anim-type="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Watermark cover */}
      <div className="absolute bottom-4 right-4 h-16 w-40 bg-[#050505] z-40 pointer-events-none" />
    </div>
  );
}
