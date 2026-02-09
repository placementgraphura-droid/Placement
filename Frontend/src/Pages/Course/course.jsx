import Footer from "../WelcomePage/Footer";
import Navbar from "../WelcomePage/Navbar";
import Testimonials from "../WelcomePage/Testimonial";
import CompetitiveAnalysisCard from "./CompetitiveAnalysisCard";
import Hero from "./Cvhero";
import FeaturesBar from "./FeaturesBar";
import ModulesAccordion from "./ModulesAccordion";
import PricingCard from "./PricingCard";
// import SEO from "../../components/Seo";

// const schema = {
//   "@context": "https://schema.org",
//   "@graph": [

//     {
//       "@type": "Course",
//       "name": "Resume Building Courses Graphura",
//       "description":
//         "Resume Building courses Graphura help students and professionals create ATS optimized resumes and job ready CVs.",
//       "provider": {
//         "@type": "Organization",
//         "name": "Graphura India Private Limited",
//         "url": "https://graphura.shop"
//       }
//     },

//     {
//       "@type": "FAQPage",
//       "mainEntity": [
//         {
//           "@type": "Question",
//           "name": "What are Resume Building courses Graphura?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Resume Building courses Graphura help candidates create ATS optimized resumes and professional CVs for better interview shortlisting."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Are these resume courses suitable for freshers?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Yes Resume Building courses Graphura are suitable for freshers students and professionals at any career stage."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Will I get a ready resume after the course?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Yes participants receive guidance to create a complete professional resume by the end of the course."
//           }
//         }
//       ]
//     },

//     {
//       "@type": "Service",
//       "name": "Graphura Placement Drives",
//       "description":
//         "Graphura Placement Drives connect trained candidates with hiring companies through resume screening and interviews.",
//       "provider": {
//         "@type": "Organization",
//         "name": "Graphura India Private Limited",
//         "url": "https://graphura.shop"
//       },
//       "areaServed": {
//         "@type": "Country",
//         "name": "India"
//       }
//     }

//   ]
// };

function Course() {
  return (
    <>
      {/* <SEO
        title="Resume Building Courses Graphura | Job Ready CV Training"
        description="Create recruiter friendly resumes with Resume Building courses Graphura. Learn ATS optimized CV writing and stand out in interviews and placement drives."
        keywords="Resume Building courses graphura, CV preparation training, professional resume building graphura india private limited courses"
        schema={schema}
      /> */}

      <div className="overflow-x-hidden overflow-y-auto">
        <Navbar />
        <Hero />
        <FeaturesBar />
        <CompetitiveAnalysisCard />
        <PricingCard />
        <ModulesAccordion />
        <Testimonials />
        <Footer />

      </div>
    </>
  );
}

export default Course;
