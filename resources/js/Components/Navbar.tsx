import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Academies", href: window.location.pathname === "/" ? "/#academies" : "/academies" },
    { name: "Events", href: window.location.pathname === "/" ? "/#events" : "/events" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-soft py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <span className="font-display text-xl md:text-2xl font-semibold text-foreground">
            <img src="/images/logo_notext.png" alt="ABAP Logo" className="h-20"/>
          </span>          
          <span className="font-display text-lg md:text-xl font-semibold text-foreground">
            <span className="border-b border-b-solid border-black">Association of Ballet Academies of the Philippines (ABAP), Inc.</span><br />
            <span className="block w-full text-center justify-between">INTEGRITY. SERVICE. LEADERSHIP IN DANCE.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-body font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
            >
              {link.name}
            </a>
          ))}
          {/* <Button variant="default" size="sm">
            Join ABAP
          </Button> */}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card/98 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-body font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button variant="default" size="sm" className="w-full mt-2">
              Join ABAP
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
