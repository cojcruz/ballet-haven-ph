import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
  title: string;
};

const PublicLayout = ({ children, title }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Head title={title} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
