import { Link } from "react-router-dom";
import Hero from "./Hero";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";
import InterviewAnalitics from "./InterviewAnalitics"
import Pricing from "./Pricing";
import Modules from "./Modules";
import FeaturesBar from "./FeaturesBar";
import Testimonials from "../WelcomePage/Testimonial";
import { Helmet } from "react-helmet";

// import SEO from "../../components/Seo";
//
// const schema = {
//   "@context": "https://schema.org",
//   "@graph": [
//
//     {
//       "@type": "Course",
//       "name": "Interview Courses Graphura",
//       "description":
//         "Interview courses Graphura focus on HR interviews technical interviews communication skills and mock interview practice.",
//       "provider": {
//         "@type": "Organization",
//         "name": "Graphura India Private Limited",
//         "url": "https://graphura.shop"
//       }
//     },
//
//     {
//       "@type": "FAQPage",
//       "mainEntity": [
//         {
//           "@type": "Question",
//           "name": "What are interview courses Graphura?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Interview courses Graphura train candidates in HR interviews technical interviews communication skills and confidence building."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Do interview courses include mock interviews?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Yes interview courses Graphura include mock interview practice and feedback sessions."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Can working professionals join interview preparation courses?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Yes working professionals can join interview courses Graphura to prepare for job switches and promotions."
//           }
//         }
//       ]
//     }
//
//   ]
// };

function Interview() {

  return (
    <>
{/*        <SEO */}
{/*          title="Interview Courses Graphura | Crack HR and Technical Interviews" */}
{/*          description="Crack interviews with confidence using interview courses Graphura. Practice HR and technical interviews improve communication and get placement ready." */}
{/*          keywords="interview courses graphura, interview preparation training, mock interviews graphura india private limited courses" */}
{/*          schema={schema} */}
{/*     /> */}

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