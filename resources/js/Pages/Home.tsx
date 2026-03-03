import Navbar from "@/Components/Navbar";
import Hero from "@/Components/Hero";
import About from "@/Components/About";
import Academies from "@/Components/Academies";
import Events from "@/Components/Events";
import Contact from "@/Components/Contact";
import Footer from "@/Components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Academies />
      <Events />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
