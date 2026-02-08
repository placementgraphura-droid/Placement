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
import { Helmet } from "react-helmet-async";

function WelcomePage() {

  return (
    <>
      <Helmet>
        <title>
          Resume Building Courses Graphura | Interview Courses | Graphura India
        </title>
        <meta
          name="description"
          content="Boost your career with Resume Building courses Graphura and interview courses by Graphura India Private Limited. Join Graphura Placement Drives and get job ready faster."
        />
        <meta
          name="keywords"
          content="Resume Building courses graphura interview courses graphura placement drives career success training"
        />
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@graph": [

    {
      "@type": "Organization",
      "name": "Graphura India Private Limited",
      "url": "https://graphura.shop",
      "logo": "https://graphura.shop/logo.png",
      "description": "Graphura India Private Limited offers Resume Building courses Graphura interview courses Graphura and Graphura Placement Drives.",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "availableLanguage": "English"
      }
    },

    {
      "@type": "FAQPage",
      "mainEntity": [

        {
          "@type": "Question",
          "name": "What does Graphura India Private Limited offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Graphura India Private Limited offers Resume Building courses Graphura interview courses Graphura and Graphura Placement Drives for career preparation."
          }
        },

        {
          "@type": "Question",
          "name": "Who can join Graphura courses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students freshers and working professionals can join Graphura courses to improve resumes interview skills and job readiness."
          }
        },

        {
          "@type": "Question",
          "name": "Does Graphura provide placement support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes Graphura provides placement support through Graphura Placement Drives after relevant course preparation."
          }
        }

      ]
    }

  ]
}`}
        </script>
      </Helmet>

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