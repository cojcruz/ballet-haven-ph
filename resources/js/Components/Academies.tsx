import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

type Academy = {
  id: number;
  name: string;
  location: string | null;
  specialty: string | null;
  founded: string | null;
  logo_url: string | null;
  description: string | null;
};

const Academies = () => {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academies')
      .then(response => response.json())
      .then(data => {
        setAcademies(data.academies);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching academies:', error);
        setLoading(false);
      });
  }, []);
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
        {loading ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Loading academies...</p>
          </div>
        ) : academies.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">No academies available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academies.map((academy) => (
              <div
                key={academy.id}
                className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 border border-border hover:border-gold/30"
              >
                {academy.logo_url && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={academy.logo_url}
                      alt={academy.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  {academy.founded && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-rose-light/50 text-primary text-xs font-body font-medium rounded-full tracking-wide">
                        Est. {academy.founded}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors">
                    {academy.name}
                  </h3>
                  {academy.specialty && (
                    <p className="font-body text-accent text-sm font-medium mb-4">
                      {academy.specialty}
                    </p>
                  )}
                  {academy.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-body text-sm">{academy.location}</span>
                    </div>
                  )}
                  {academy.description && (
                    <p className="font-body text-sm text-muted-foreground mt-4">
                      {academy.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="/academies" className="inline-block font-body text-primary hover:text-burgundy-dark font-medium underline underline-offset-4 transition-colors">
            View All Academies →
          </a>
          {/* <p className="font-body text-muted-foreground mb-4">
            Is your academy interested in joining ABAP?
          </p>
          <a
            href="#contact"
            className="inline-block font-body text-primary hover:text-burgundy-dark font-medium underline underline-offset-4 transition-colors"
          >
            Learn about membership →
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default Academies;
