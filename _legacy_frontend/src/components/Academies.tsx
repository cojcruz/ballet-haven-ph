import { MapPin } from "lucide-react";

const academies = [
  {
    name: "Philippine Ballet Theatre Academy",
    location: "Quezon City, Metro Manila",
    specialty: "Classical & Contemporary",
    founded: "1987",
  },
  {
    name: "Manila Dance Company School",
    location: "Makati City, Metro Manila",
    specialty: "Russian Method",
    founded: "1992",
  },
  {
    name: "Cebu Ballet Centre",
    location: "Cebu City, Cebu",
    specialty: "Vaganova Technique",
    founded: "1999",
  },
  {
    name: "Davao Ballet Academy",
    location: "Davao City, Mindanao",
    specialty: "RAD Syllabus",
    founded: "2005",
  },
  {
    name: "Iloilo Dance Conservatory",
    location: "Iloilo City, Panay",
    specialty: "Classical Ballet",
    founded: "2001",
  },
  {
    name: "Baguio Arts & Ballet School",
    location: "Baguio City, Benguet",
    specialty: "Cecchetti Method",
    founded: "1998",
  },
];

const Academies = () => {
  return (
    <section id="academies" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-4">
            Our Network
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-medium mb-6">
            Member Academies
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            Our association brings together the Philippines' most distinguished ballet academies, each upholding the highest standards of dance education.
          </p>
        </div>

        {/* Academy Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {academies.map((academy, index) => (
            <div
              key={index}
              className="group bg-card rounded-lg p-8 shadow-soft hover:shadow-elegant transition-all duration-500 border border-border hover:border-gold/30"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-rose-light/50 text-primary text-xs font-body font-medium rounded-full tracking-wide">
                  Est. {academy.founded}
                </span>
              </div>
              <h3 className="font-display text-xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors">
                {academy.name}
              </h3>
              <p className="font-body text-accent text-sm font-medium mb-4">
                {academy.specialty}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span className="font-body text-sm">{academy.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="font-body text-muted-foreground mb-4">
            Is your academy interested in joining ABAP?
          </p>
          <a
            href="#contact"
            className="inline-block font-body text-primary hover:text-burgundy-dark font-medium underline underline-offset-4 transition-colors"
          >
            Learn about membership →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Academies;
