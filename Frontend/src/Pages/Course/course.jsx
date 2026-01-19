import Footer from "../WelcomePage/Footer";
import Navbar from "../WelcomePage/Navbar";
import Testimonials from "../WelcomePage/Testimonial";
import CompetitiveAnalysisCard from "./CompetitiveAnalysisCard";
import Hero from "./Cvhero";
import FeaturesBar from "./FeaturesBar";
import ModulesAccordion from "./ModulesAccordion";
import PricingCard from "./PricingCard";


function Course() {
  return (
    <div className="overflow-x-hidden overflow-y-auto">
      <Navbar />
      <Hero />
      <FeaturesBar />
      <CompetitiveAnalysisCard />
      <PricingCard />
      <ModulesAccordion/>
      <Testimonials/>
      <Footer />

    </div>
  );
}

export default Course;
