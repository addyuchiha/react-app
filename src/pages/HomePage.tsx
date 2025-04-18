import Navbar from "../components/Navbar";
import Hero from "../components/Hero/Hero";
import HowToUse from "../components/HowToUse/HowToUse";
import Features from "../components/Features/Features";
import Pricing from "../components/Pricing/Pricing";
import ContactUs from "../components/ContactUs";

const HomePage = () => {
  return (
    <div className="bg-bgLight px-16">
      <Navbar />
      <main>
        <Hero />
        <HowToUse />
        <Features />
        <Pricing />
        <ContactUs />
      </main>
    </div>
  );
};

export default HomePage;
