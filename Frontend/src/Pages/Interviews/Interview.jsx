import { Link } from "react-router-dom";
import Hero from "./Hero";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";
import FeaturesBar from "../Course/FeaturesBar";
import InterviewAnalitics from "./InterviewAnalitics"
import Pricing from "./Pricing";
import Modules from "./Modules";
import Testimonials from "../WelcomePage/Testimonial";



function Interview() {

  return (
    <>
     
      <div className=" bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 overflow-auto">
            <Navbar />
            <Hero />
            <FeaturesBar />
            <InterviewAnalitics />
            <Pricing />
            <Modules />
            <Testimonials />
            <Footer />

        </div>

    
    </>
  );
}

export default Interview;