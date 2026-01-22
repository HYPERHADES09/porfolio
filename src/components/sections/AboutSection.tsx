import { BGPattern } from "@/components/ui/bg-pattern";
import { LinkPreview } from "@/components/ui/link-preview";
import focusImg from "@/assets/about-focus.jpg";
import enduranceImg from "@/assets/about-endurance.jpg";
import guyImg from "@/assets/about-this-guy.jpg";
import movieImg from "@/assets/about-movie.jpg";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 md:py-36 scroll-mt-20 animate-fade-in"
    >
      <BGPattern
        aria-hidden="true"
        variant="diagonal-stripes"
        mask="fade-y"
        size={26}
        className="pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl">About</h2>

        <p className="mt-8 max-w-4xl text-3xl leading-[1.2] tracking-tight text-foreground/80 md:text-4xl">
          My{" "}
          <LinkPreview
            url="https://owasp.org"
            isStatic
            imageSrc={focusImg}
            className="neon-hover font-display"
          >
            <strong>FOCUS</strong>
          </LinkPreview>{" "}
          is on secure, reliable system built with intent. I admire stories that value{" "}
          <LinkPreview
            url="https://en.wikipedia.org/wiki/Resilience"
            isStatic
            imageSrc={enduranceImg}
            className="neon-hover font-display"
          >
            <strong>ENDURENCE</strong>
          </LinkPreview>
          , hope, and long-term thinking. I value calm execution, thoughtful decisions, and steady
          progress. And I like{" "}
          <LinkPreview
            url="https://www.imdb.com"
            isStatic
            imageSrc={guyImg}
            className="neon-hover font-display"
          >
            <strong>THIS GUY'S</strong>
          </LinkPreview>{" "}
          Acting and love this{" "}
          <LinkPreview
            url="https://www.imdb.com"
            isStatic
            imageSrc={movieImg}
            className="neon-hover font-display"
          >
            <strong>MOVIE</strong>
          </LinkPreview>
          .
        </p>
      </div>
    </section>
  );
}
