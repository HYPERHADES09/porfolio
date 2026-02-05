import { AnimatedText } from "@/components/ui/animated-underline-text-one";

function AnimatedTextDemo() {
    return (
        <AnimatedText
            text="Thank you for taking the time to visit."
            textClassName="text-3xl md:text-5xl font-bold font-mono text-foreground"
            underlineDuration={1.5}
            viewBox="0 0 900 20"
            underlinePath="M 0,10 Q 225,0 450,10 Q 675,20 900,10"
            underlineHoverPath="M 0,10 Q 225,20 450,10 Q 675,0 900,10"
        />
    );
}

export { AnimatedTextDemo };
