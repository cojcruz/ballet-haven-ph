import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import performanceImage from "@/assets/performance.jpg";

const events = [
  {
    title: "ABAP National Ballet Competition 2025",
    date: "March 15-18, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Cultural Center of the Philippines, Manila",
    description: "Annual competition showcasing the finest young ballet talents from member academies.",
    featured: true,
  },
  {
    title: "Spring Gala Performance",
    date: "April 12, 2025",
    time: "7:00 PM",
    location: "Manila Metropolitan Theater",
    description: "A celebration of Filipino ballet featuring guest artists and emerging stars.",
    featured: false,
  },
  {
    title: "Master Class Series: International Guest Artists",
    date: "May 5-7, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Various Member Academies",
    description: "Exclusive workshops with internationally acclaimed ballet masters.",
    featured: false,
  },
];

const Events = () => {
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
        <div className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8 bg-card rounded-lg overflow-hidden shadow-elegant border border-border">
            <div className="relative h-64 lg:h-auto">
              <img
                src={performanceImage}
                alt="Ballet performance"
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
                {events[0].title}
              </h3>
              <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                {events[0].description}
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar size={18} className="text-primary" />
                  <span className="font-body">{events[0].date}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Clock size={18} className="text-primary" />
                  <span className="font-body">{events[0].time}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-body">{events[0].location}</span>
                </div>
              </div>
              <Button variant="default" size="lg" className="w-fit">
                Register Now
              </Button>
            </div>
          </div>
        </div>

        {/* Other Events */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.slice(1).map((event, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-8 shadow-soft border border-border hover:shadow-elegant hover:border-gold/30 transition-all duration-500"
            >
              <h3 className="font-display text-xl text-foreground font-medium mb-3">
                {event.title}
              </h3>
              <p className="font-body text-muted-foreground mb-6 text-sm leading-relaxed">
                {event.description}
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-foreground text-sm">
                  <Calendar size={16} className="text-primary" />
                  <span className="font-body">{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span className="font-body">{event.location}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
