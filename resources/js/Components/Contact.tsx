import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-4">
              Get in Touch
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground font-medium mb-6 leading-tight">
              Connect with ABAP
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-10">
              Whether you're interested in joining our association, partnering with us, or learning more about ballet in the Philippines, we'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium mb-1">
                    Email Us
                  </h4>
                  <p className="font-body text-muted-foreground">
                    info@abap.org.ph
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium mb-1">
                    Call Us
                  </h4>
                  <p className="font-body text-muted-foreground">
                    +63 (2) 8123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-foreground font-medium mb-1">
                    Visit Us
                  </h4>
                  <p className="font-body text-muted-foreground">
                    Cultural Center of the Philippines<br />
                    Roxas Boulevard, Pasay City<br />
                    Metro Manila, Philippines
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-lg p-8 md:p-10 shadow-elegant border border-border">
            <h3 className="font-display text-2xl text-foreground font-medium mb-6">
              Send us a Message
            </h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-foreground mb-2 block">
                    First Name
                  </label>
                  <Input placeholder="Maria" className="font-body" />
                </div>
                <div>
                  <label className="font-body text-sm text-foreground mb-2 block">
                    Last Name
                  </label>
                  <Input placeholder="Santos" className="font-body" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm text-foreground mb-2 block">
                  Email Address
                </label>
                <Input type="email" placeholder="maria@example.com" className="font-body" />
              </div>
              <div>
                <label className="font-body text-sm text-foreground mb-2 block">
                  Subject
                </label>
                <Input placeholder="How can we help?" className="font-body" />
              </div>
              <div>
                <label className="font-body text-sm text-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us about your inquiry..."
                  rows={5}
                  className="font-body resize-none"
                />
              </div>
              <Button variant="default" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
