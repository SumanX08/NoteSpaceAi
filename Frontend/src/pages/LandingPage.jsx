import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductPreview from "@/components/landing/ProductPreview";
import Features from "@/components/landing/Features";
import KnowledgeSources from "@/components/landing/KnowledgeSources";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Architecture from "@/components/landing/Architecture";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030405] text-white">
      <Navbar />

      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <KnowledgeSources />
        
        <Architecture/>
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;