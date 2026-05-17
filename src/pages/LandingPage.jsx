import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ProblemsSection from "../components/sections/ProblemsSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import UserRolesSection from "../components/sections/UserRolesSection";
import ContactSection from "../components/sections/ContactSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="w-full pt-16">
        <HeroSection />
        <AboutSection />
        <ProblemsSection />
        <FeaturesSection />
        <UserRolesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
