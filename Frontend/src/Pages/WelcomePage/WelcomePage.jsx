import { Link } from "react-router-dom";
import JobsSlider from "./JobsSlider";
import Navbar from "./Navbar";
import Testimonials from "./Testimonial";
import Opening from "./Opening";
import JobSuccessSlider from "./JobSuccessSlider";
import Partners from "./Partners";
import Footer from "./Footer";
import Hero2 from "./Hero2";
import Coursess from "./Courses";
// import SEO from "../../components/Seo";
//
// const schema = {
//   "@context": "https://schema.org",
//   "@graph": [
//
//     {
//       "@type": "Organization",
//       "name": "Graphura India Private Limited",
//       "url": "https://graphura.shop",
//       "logo": "https://graphura.shop/logo.png",
//       "description":
//         "Graphura India Private Limited offers Resume Building courses Graphura interview courses Graphura and Graphura Placement Drives.",
//       "sameAs": [],
//       "contactPoint": {
//         "@type": "ContactPoint",
//         "contactType": "customer support",
//         "availableLanguage": "English"
//       }
//     },
//
//     {
//       "@type": "FAQPage",
//       "mainEntity": [
//         {
//           "@type": "Question",
//           "name": "What does Graphura India Private Limited offer?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Graphura India Private Limited offers Resume Building courses Graphura interview courses Graphura and Graphura Placement Drives for career preparation."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Who can join Graphura courses?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Students freshers and working professionals can join Graphura courses to improve resumes interview skills and job readiness."
//           }
//         },
//         {
//           "@type": "Question",
//           "name": "Does Graphura provide placement support?",
//           "acceptedAnswer": {
//             "@type": "Answer",
//             "text":
//               "Yes Graphura provides placement support through Graphura Placement Drives after relevant course preparation."
//           }
//         }
//       ]
//     }
//
//   ]
// };

function WelcomePage() {

  return (
    <>
{/*       <SEO */}
{/*         title="Resume Building Courses Graphura | Interview Courses | Graphura India" */}
{/*         description="Boost your career with Resume Building courses Graphura and interview courses by Graphura India Private Limited. Join Graphura Placement Drives and get job ready faster." */}
{/*         keywords="Resume Building courses graphura interview courses graphura placement drives career success training" */}
{/*         schema={schema} */}
{/*       /> */}


      <div className=" bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 overflow-auto">
        <Hero2 />
        <Navbar />
        {/* <Hero /> */}
        <Opening />
        <Coursess />
        <JobsSlider />
        <JobSuccessSlider />
        <Testimonials />
        <Partners />
        <Footer />
      </div>
    </>
  );
}

export default WelcomePage;