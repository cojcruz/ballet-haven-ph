import { Button } from "@/Components/ui/button";
import heroImage from "@/assets/hero-ballet.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ballet dancer in elegant pose"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold-light font-body text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-up opacity-0">
            Established 1995
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-medium leading-tight mb-6 animate-fade-up opacity-0 animation-delay-200">
            Association of Ballet Academies
            <span className="block italic text-gold-light mt-2">of the Philippines</span> (ABAP), Inc.
          </h1>
          <p className="font-body text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0 animation-delay-400">
            Uniting the nation's premier ballet institutions to nurture artistic excellence and preserve the timeless art of classical dance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 animation-delay-600">
            <a href="#academies"><Button variant="gold" size="xl">
              Discover Our Academies
            </Button></a>
            <a href="#events"><Button variant="heroOutline" size="xl">
              Upcoming Events
            </Button></a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-gentle-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
