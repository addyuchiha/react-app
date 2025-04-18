import Navbar from "../components/Navbar";
import Hero from "../components/Hero/Hero";
import HowToUse from "../components/HowToUse/HowToUse";
import Features from "../components/Features/Features";

const HomePage = () => {
  return (
    <div className="bg-bgLight px-16">
      <Navbar />
      <Hero />
      <HowToUse />
      <Features />
    </div>
  );
};

export default HomePage;
