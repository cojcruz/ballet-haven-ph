import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import performanceImage from "@/assets/performance.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

type Event = {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  details: string | null;
  location: string | null;
  registration_link: string | null;
  featured_image: string | null;
  featured: boolean;
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    if (endDate && endDate !== startDate) {
      const end = new Date(endDate);
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
    return start.toLocaleDateString('en-US', options);
  };

  const formatTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    const formatT = (t: string) => {
      const [h, m] = t.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    };
    if (endTime) {
      return `${formatT(startTime)} - ${formatT(endTime)}`;
    }
    return formatT(startTime);
  };

  const featuredEvent = events.find(e => e.featured) || events[0];
  const otherEvents = events.filter(e => e.id !== featuredEvent?.id);

  if (loading) {
    return (
      <section id="events" className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events" className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-medium mb-6">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground">No upcoming events at this time. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-4">
            What's Happening
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-medium mb-6">
            Upcoming Events
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            Join us for performances, competitions, and workshops that celebrate the beauty of ballet.
          </p>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <div className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden shadow-elegant border border-border">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredEvent.featured_image ? `/storage/${featuredEvent.featured_image}` : performanceImage}
                  alt={featuredEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-xs font-body font-semibold rounded-full tracking-wide uppercase">
                    Featured Event
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="font-display text-2xl md:text-3xl text-foreground font-medium mb-4">
                  {featuredEvent.name}
                </h3>
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  {featuredEvent.details}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span className="font-body">{formatDate(featuredEvent.start_date, featuredEvent.end_date)}</span>
                  </div>
                  {formatTime(featuredEvent.start_time, featuredEvent.end_time) && (
                    <div className="flex items-center gap-3 text-foreground">
                      <Clock size={18} className="text-primary" />
                      <span className="font-body">{formatTime(featuredEvent.start_time, featuredEvent.end_time)}</span>
                    </div>
                  )}
                  {featuredEvent.location && (
                    <div className="flex items-center gap-3 text-foreground">
                      <MapPin size={18} className="text-primary" />
                      <span className="font-body">{featuredEvent.location}</span>
                    </div>
                  )}
                </div>
                {featuredEvent.registration_link ? (
                  <a href={featuredEvent.registration_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="default" size="lg" className="w-fit">
                      Register Now
                    </Button>
                  </a>
                ) : (
                  <Button variant="default" size="lg" className="w-fit" disabled>
                    Registration Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other Events */}
        {otherEvents.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {otherEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-lg p-8 shadow-soft border border-border hover:shadow-elegant hover:border-gold/30 transition-all duration-500"
              >
                <h3 className="font-display text-xl text-foreground font-medium mb-3">
                  {event.name}
                </h3>
                <p className="font-body text-muted-foreground mb-6 text-sm leading-relaxed">
                  {event.details}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-foreground text-sm">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-body">{formatDate(event.start_date, event.end_date)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-3 text-foreground text-sm">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-body">{event.location}</span>
                    </div>
                  )}
                </div>
                {event.registration_link ? (
                  <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Register
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Details Coming Soon
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
