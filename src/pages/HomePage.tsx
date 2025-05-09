import Navbar from "../components/Navbar";
import Hero from "../components/Hero/Hero";
import HowToUse from "../components/HowToUse/HowToUse";
import Features from "../components/Features/Features";
import Pricing from "../components/Pricing/Pricing";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  return (
    <div className="bg-bgLight">
      <Navbar />
      <main className="md:px-16 px-5">
        <Hero />
        <HowToUse />
        <Features />
        <Pricing noTitle={false} />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
