import PublicLayout from "@/Layouts/PublicLayout";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  name: string;
  details: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  featured_image: string | null;
  registration_link: string | null;
  featured: boolean;
  published: boolean;
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getImageUrl = (path: string | null) => {
    return path ? `/storage/${path}` : null;
  };

  return (
    <PublicLayout title="Events">
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-4">
              What's Happening
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground font-medium mb-6">
              Upcoming Events
            </h1>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              Join us for performances, workshops, and celebrations of ballet excellence across the Philippines.
            </p>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const imageUrl = getImageUrl(event.featured_image);
                return (
                  <div
                    key={event.id}
                    className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 border border-border hover:border-gold/30"
                  >
                    {imageUrl && (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-rose-light/50 text-primary text-xs font-body font-medium rounded-full tracking-wide">
                          <Calendar size={12} className="inline mr-1" />
                          {formatDate(event.start_date)}
                        </span>
                        {event.featured && (
                          <span className="inline-block px-3 py-1 bg-gold/20 text-accent text-xs font-body font-medium rounded-full tracking-wide">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>

                      {event.details && (
                        <p className="font-body text-muted-foreground text-sm mb-4 line-clamp-3">
                          {event.details}
                        </p>
                      )}

                      <div className="space-y-2">
                        {event.start_time && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={16} className="text-primary" />
                            <span className="font-body text-sm">
                              {event.start_time}
                              {event.end_time && ` - ${event.end_time}`}
                            </span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} className="text-primary" />
                            <span className="font-body text-sm">{event.location}</span>
                          </div>
                        )}

                        {event.registration_link && (
                          <div className="mt-4">
                            <a
                              href={event.registration_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-body text-sm font-medium"
                            >
                              Register Now
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default Events;
