import trainingImage from "@/assets/academy-training.jpg";

const About = () => {
  const stats = [
    { number: "25+", label: "Member Academies" },
    { number: "3,000+", label: "Students Nationwide" },
    { number: "30", label: "Years of Excellence" },
    { number: "100+", label: "Annual Performances" },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-elegant">
              <img
                src={trainingImage}
                alt="Ballet training session"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-gold/30 rounded-lg -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-rose-light/50 rounded-lg -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-4">
              Our Story
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground font-medium mb-6 leading-tight">
              Championing Ballet Excellence in the Philippines
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              The Association of Ballet Academies of the Philippines (ABAP) was founded in 1995 with a singular vision: to unite the country's finest ballet institutions under one prestigious organization.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-10">
              For three decades, we have been at the forefront of nurturing Filipino ballet talent, establishing rigorous training standards, and showcasing the artistry of our dancers on both national and international stages. Our member academies share a commitment to technical precision, artistic expression, and the preservation of classical ballet traditions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="font-display text-3xl md:text-4xl text-primary font-semibold mb-1">
                    {stat.number}
                  </div>
                  <div className="font-body text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
