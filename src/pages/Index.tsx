import { useMemo } from "react";
import { ScrollDotsNav, type DotSection } from "@/components/ScrollDotsNav";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { SplineHero } from "@/components/SplineHero";
import { cn } from "@/lib/utils";
import { AboutSection } from "@/components/sections/AboutSection";
import { WavePath } from "@/components/ui/wave-path";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { ScrambleHover } from "@/components/ui/scramble-hover";
import { SocialIcons } from "@/components/ui/social-icons";
import { useCursorSuppression } from "@/components/cursor/CursorSuppressionContext";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { Reveal } from "@/components/ui/reveal";
import { RatingInteraction } from "@/components/ui/emoji-rating";

export default function Index() {
  const { setSuppressed } = useCursorSuppression();

  const sections = useMemo<DotSection[]>(
    () => [
      { id: "top", label: "Hero" },
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const skillsMarquee = useMemo(
    () => [
      "SecureSystems",
      "Pentest",
      "BurpSuite",
      "Nmap",
      "Linux",
      "PythonAuto",
      "Bash",
      "OSINT",
      "Wireshark",
      "RiskAssess",
    ],
    []
  );

  // Repeat enough times so the marquee track is always wider than the viewport
  // (prevents visible gaps / pauses between loops).
  const skillsTrack = useMemo(() => {
    const repeats = 6;
    return Array.from({ length: repeats }).flatMap(() => skillsMarquee);
  }, [skillsMarquee]);

  return (
    <div className="min-h-screen">
      <ParallaxBackdrop />
      <ScrollDotsNav sections={sections} />

      <header
        id="top"
        className="relative cursor-none"
        onPointerEnter={() => setSuppressed(true)}
        onPointerLeave={() => setSuppressed(false)}
      >
        <SplineHero url="https://prod.spline.design/V4AM4ZAy448lbHiS/scene.splinecode" />
      </header>

      {/* kinetic typography divider (between hero + about) */}
      <div className="group edge-fade-x edge-glow-hover relative overflow-hidden border-y border-border bg-glass">
        {/* Two identical, width-driven tracks (w-max) for a seamless, gapless loop */}
        <div className="flex w-max animate-marquee [animation-duration:63s] group-hover:[animation-play-state:paused]">
          {[...skillsTrack, ...skillsTrack].map((skill, i) => (
            <p
              key={`${skill}-${i}`}
              className="whitespace-nowrap py-3 pr-10 font-mono text-xs tracking-tight text-foreground/55 transition-colors duration-200 group-hover:text-foreground/35 hover:text-foreground"
            >
              {skill}
            </p>
          ))}
        </div>
      </div>

      <main
        className={cn(
          "mx-auto w-full max-w-6xl px-6 md:px-10",
          "scroll-smooth"
        )}
      >
        <Reveal>
          <AboutSection />
        </Reveal>

        <WavePath
          className="edge-fade-x my-2 md:my-4"
          style={{ opacity: 0.85 }}
        />

        <Reveal>
          <section id="projects" className="py-14 md:py-20 scroll-mt-20">
          <div className="mb-8 md:mb-10">
            <p className="font-mono text-xs tracking-tight text-foreground/60">Projects</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
              <ScrambleHover
                text="Selected work, in motion."
                scrambleSpeed={35}
                maxIterations={14}
                className=""
                scrambledClassName="text-foreground/55"
              />
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
              <ScrambleHover
                text="A curated rotation of security-focused builds, experiments, and practical implementations."
                scrambleSpeed={28}
                maxIterations={18}
                scrambledClassName="text-foreground/45"
              />
            </p>
          </div>
          <StaggerTestimonials />
          </section>
        </Reveal>

        <Reveal>
          <section
            id="contact"
            className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] py-14 md:py-20 scroll-mt-20"
          >
          <div className="relative overflow-hidden bg-glass">
            <div className="relative min-h-[70svh]">
              <AnimatedGradientBackground
                Breathing
                startingGap={140}
                breathingRange={7}
                animationSpeed={0.03}
                topOffset={10}
                containerClassName="opacity-90"
              />

              <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center px-6 md:px-10">
                <RatingInteraction className="w-full max-w-sm" />
              </div>

              <div className="relative z-10">
                <div className="mx-auto w-full max-w-6xl px-6 md:px-10 py-6 md:py-10">
                  <p className="font-mono text-xs tracking-tight text-foreground/60">Contact</p>
                  <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                    Contact.
                  </h2>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
                    Ongoing engagements, research threads, and hardening work.
                  </p>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-background/30"
              />
            </div>
          </div>
          </section>
        </Reveal>

      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-glass border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
            <p className="font-mono text-xs tracking-tight text-foreground/60">© {new Date().getFullYear()} HYPERHADES</p>
              <SocialIcons />
          </div>
        </div>
      </footer>
    </div>
  );
}
