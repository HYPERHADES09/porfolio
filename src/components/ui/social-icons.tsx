import { useState } from "react";
import { Github, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Social = {
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const socials: Social[] = [
  { name: "GitHub", href: "https://github.com/HYPERHADES", Icon: Github },
  {
    name: "Discord",
    href: "https://discord.gg/Gn9kKGaEtQ",
    Icon: MessageCircle,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hyperhades",
    Icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jasleen.singh04_",
    Icon: Instagram,
  },
];

export function SocialIcons({ className }: { className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socials.map((social, index) => {
        const isHovered = hoveredIndex === index;
        const descId = `social-pill-desc-${index}`;

        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onKeyDown={(e) => {
              // Space doesn't activate <a> by default like it does for <button>.
              if (e.key === " ") {
                e.preventDefault();
                (e.currentTarget as HTMLAnchorElement).click();
              }
            }}
            aria-label={social.name}
            aria-describedby={descId}
            className={cn(
              "group relative inline-flex items-center",
              "rounded-full bg-surface hairline px-3 py-2",
              "transition-transform duration-200 motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "hover:-translate-y-0.5"
            )}
          >
            <span id={descId} className="sr-only">
              Opens {social.name} in a new tab.
            </span>

            <span
              className={cn(
                "grid h-4 w-4 place-items-center text-foreground/70",
                "transition-colors duration-200",
                "group-hover:text-foreground"
              )}
            >
              <social.Icon className="h-4 w-4" />
            </span>

            <span
              className={cn(
                "overflow-hidden",
                "max-w-0 opacity-0",
                "transition-[max-width,opacity,margin-left] duration-200",
                isHovered && "ml-2 max-w-40 opacity-100"
              )}
            >
              <span className="font-mono text-xs tracking-tight text-foreground/75">
                {social.name}
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
