import Navbar from "../components/Navbar";
import Hero from "../components/Hero/Hero";
import HowToUse from "../components/HowToUse/HowToUse";

const HomePage = () => {
  return (
    <div className="bg-bgLight px-16">
      <Navbar />
      <Hero />
      <HowToUse />
    </div>
  );
};

export default HomePage;
