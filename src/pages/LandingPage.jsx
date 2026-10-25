import "../features/landing/landing.css";
import Navbar from "../features/landing/components/Navbar";
import Hero from "../features/landing/components/Hero";
import Features, {
  BenefitsStrip,
} from "../features/landing/components/Features";
import Roles from "../features/landing/components/Roles";
import ProductDemo from "../features/landing/components/ProductDemo";
import HowItWorks from "../features/landing/components/HowItWorks";
import WhyChoose from "../features/landing/components/WhyChoose";
import FinalCta from "../features/landing/components/FinalCta";
import Footer from "../features/landing/components/Footer";

const LandingPage = () => {
  return (
    <div className="ssl">
      <a href="#main" className="ssl-skip">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <BenefitsStrip />
        <Features />
        <Roles />
        <ProductDemo />
        <HowItWorks />
        <WhyChoose />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
