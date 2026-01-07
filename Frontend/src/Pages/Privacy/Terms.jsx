import React, { useState, useEffect } from "react";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";

const sections = [
  { id: "about", title: "A. About Graphura and the Platform", letter: "A" },
  { id: "services", title: "B. Platform Services", letter: "B" },
  { id: "access", title: "C. Right to Access and Account Creation", letter: "C" },
  { id: "subscription", title: "D. Subscription Terms", letter: "D" },
  { id: "pricing", title: "E. Pricing, Payments and Refund", letter: "E" },
  { id: "use", title: "F. Use of the Platform", letter: "F" },
  { id: "content", title: "G. Content and Conduct", letter: "G" },
  { id: "communications", title: "H. Communications", letter: "H" },
  { id: "processing", title: "I. Processing of Personal Information", letter: "I" },
  { id: "intellectual", title: "J. Intellectual Property and License to User-generated Content", letter: "J" },
  { id: "feedback", title: "K. Feedback", letter: "K" },
  { id: "copyright", title: "L. Copyright, Trademarks and other Intellectual Property Rights", letter: "L" },
  { id: "claims", title: "M. Claims Against User-generated Content", letter: "M" },
  { id: "rights", title: "N. Graphura's Rights", letter: "N" },
  { id: "availability", title: "O. Platform Availability", letter: "O" },
  { id: "deletion", title: "P. Deletion of Account", letter: "P" },
  { id: "disclaimer", title: "Q. Disclaimer", letter: "Q" },
  { id: "limitation", title: "R. Limitation of Liability", letter: "R" },
  { id: "indemnity", title: "S. Indemnity and Release", letter: "S" },
  { id: "ofac", title: "T. OFAC (Office of Foreign Asset Control)", letter: "T" },
  { id: "california", title: "U. California Civil Code Section 1789.3", letter: "U" },
  { id: "jurisdiction", title: "V. Applicable Law and Jurisdiction", letter: "V" },
  { id: "general", title: "W. General Provisions", letter: "W" },
  { id: "support", title: "X. Contact for User Support/Queries", letter: "X" },
  { id: "grievance", title: "Y. Consumer Grievance", letter: "Y" },
  { id: "contact", title: "Z. Contact Us", letter: "Z" },
];

const SectionHeader = ({ letter, title, sectionId }) => (
  <div className="scroll-mt-24" id={sectionId}>
    <div className="inline-block px-4 py-1.5 bg-sky-50 rounded-full mb-4">
      <span className="text-sky-700 text-xs font-semibold uppercase tracking-wide">
        Section {letter}
      </span>
    </div>
    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
      <span className="text-sky-600">{letter}.</span> {title}
    </h2>
  </div>
);

const InfoBox = ({ children, type = "info" }) => {
  const styles = {
    info: "bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500",
    success: "bg-emerald-50 border-l-4 border-emerald-500",
    warning: "bg-amber-50 border-l-4 border-amber-500",
  };
  
  return (
    <div className={`${styles[type]} p-5 rounded-r-lg my-6`}>
      {children}
    </div>
  );
};

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC]">
        
      {/* Enhanced Header */}
      <div className="relative text-center py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-600/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(56,189,248,0.1),transparent)]"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 bg-sky-500/10 backdrop-blur-sm border border-sky-500/20 rounded-full mb-4">
            <span className="text-sky-300 text-sm font-medium">Legal Document</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-blue-900 max-w-2xl mx-auto text-lg leading-relaxed">
            Please read these Terms and Conditions carefully before using the Graphura Platform.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-900">
              Last Updated: <span className="text-blue-900 font-medium">02 January 2026</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Enhanced Sticky TOC */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full"></div>
              <h2 className="text-lg font-semibold text-indigo-900">Contents</h2>
            </div>
            <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-sky-500/20 text-indigo-900 font-medium border-l-2 border-sky-400"
                      : "text-slate-700 hover:text-white hover:bg-slate-700/30"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Enhanced Content */}
        <section className="lg:col-span-3 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-16">
            
            {/* Introduction */}
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="mb-4">
                Welcome to Graphura! We hope that you have a great experience using our Platform.
              </p>
              <p className="mb-4">
                These Terms and Conditions ("Terms and Conditions") set out the terms and conditions for use of https://graphura.shop/ (the "Site"), the mobile application(s) (the "Application") and any features, subdomains, content (except as specified hereunder), functionality, products, services (including the Services), media, applications, or solutions offered on or through the Site and/or the Application and/or through any modes, medium, platform or format, including through Secure Digital ('SD') cards, tablets or other storage/transmitting device (hereinafter collectively referred to as the "Platform"/ "Graphura Platform").
              </p>
            </div>

            {/* Section A: About Graphura */}
            <div>
              <SectionHeader letter="A" title="About Graphura and the Platform" sectionId="about" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  In India, the Platform is owned, managed, operated and offered by Sorting Graphura India Private Limited, a company incorporated under the (Indian) Companies Act, 2013, having its registered office at near RSF, Pataudi, Gurgaon, Haryana 122503, India ("Graphura India"). In any jurisdiction other than India, wherever Services are rendered through the Platform, the same is offered by Graphura India and / or its affiliates (as relevant pursuant to appropriate intra group contractual arrangements).
                </p>
              </div>
            </div>

            {/* Section B: Platform Services */}
            <div>
              <SectionHeader letter="B" title="Platform Services" sectionId="services" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Graphura Platform is an online service platform enabling Content Providers to create and offer content in various formats including without limitation audiovisuals, audio, pre-recorded audiovisuals, live audiovisuals and/or in written form in a diverse range of categories through various modes and means ("Content Provider Content") and publish and make available such Content Provider Content to the Learners. Graphura acts as an intermediary between the Content Providers and Learners [in accordance with the Information Technology Act, 2000, or the Digital Millennium Copyright Act (as amended from time to time)] or other equivalent / similar legislations and makes available the Content Provider Content to the Learners, including through subscription offerings.
                </p>
              </div>
            </div>

            {/* Section C: Right to Access and Account Creation - AGE SECTION */}
            <div>
              <SectionHeader letter="C" title="Right to Access and Account Creation" sectionId="access" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                
                {/* Age Requirements Section - Matching Privacy Policy Style */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl border-l-4 border-sky-500">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Age Requirements to register and use on the Platform ("Age Requirements"):</h3>
                  
                  <ol className="list-decimal ml-6 space-y-4">
                    <li>
                      If you are a resident of India or any other country (except USA, UK or EU countries), then you must have attained at least <strong>18 (eighteen) years of age</strong> to register and use the Graphura Platform;
                    </li>
                    <li>
                      If you are a resident of the European Union (EU) country and have attained at least <strong>16 (sixteen) years of age</strong>, then you are permitted to register and use the Graphura Platform; and
                    </li>
                    <li>
                      If you are a resident of the United States of America (USA) or United Kingdom (UK) and have attained at least <strong>13 (thirteen) years of age</strong>, then you can register and use the Graphura Platform.
                    </li>
                  </ol>
                </div>

                <InfoBox type="warning">
                  <p className="text-slate-800">
                    <strong>Important:</strong> If you are a resident of the US, UK or EU countries and are between the ages 13 and 18/ 16 and 18 respectively or if you are resident of any other country and are considered to be of any age determined for use of internet services but are less than the contractual age determined by the applicable laws of such country, then by using the Platform, you confirm to us that your use of the Platform is with the permission of your Parent(s), and your Parent has read, agreed and accepted to the Agreement; and in the event of any dispute between you and Graphura pursuant to your Agreement with us, the terms of our Agreement shall be applicable to and enforceable against your Parent.
                  </p>
                </InfoBox>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">For Minors/Children:</h3>
                  <p>
                    A Learner who does not fulfill the Age Requirements mentioned above (as may be revised as per applicable laws from time to time) and is desirous of registering on the Platform i.e., if a Learner is a "Minor"/ "Child", then the Learner may use the Platform with the consent of, and under the supervision of, their parent or legal guardian ("Parent"). Accordingly, in such a case, the Parent must agree to the Platform Terms at the time of their registration on the Platform. Please note that minors/children are not by themselves eligible to register on the Platform. When a Minor/Child uses the Platform, we assume that the Parent of such Minor/Child has enabled the Minor/Child's usage of the Platform by agreeing to the Platform Terms and that such usage is under the supervision of their Parent.
                  </p>
                </div>

                <p>
                  Graphura reserves the right to terminate your Subscription and / or restrict your access to the Platform, if it is discovered that you do not meet the Age Requirements and/or the consent to register and use the Platform is not obtained as above. You acknowledge that Graphura does not have the responsibility to ensure that You conform to the aforesaid Age Requirements. It shall be Your sole responsibility to ensure that the required qualifications are met.
                </p>

                <p>
                  If you are a Content Provider, your access and use of the Platform may additionally be subject to separate agreement(s) with Graphura and shall be collectively governed by the terms of such agreement, the Terms and Conditions, other Platform Terms, and such other terms as may be communicated or agreed with the Content Provider from time to time.
                </p>
              </div>
            </div>

            {/* Section D: Subscription Terms */}
            <div>
              <SectionHeader letter="D" title="Subscription Terms" sectionId="subscription" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  For Learners, Graphura does not charge any fee for registration and account creation. However, certain Services offered by Graphura may be chargeable. Accordingly, access to certain Services and features is offered by Graphura through a multi-tiered paid subscription plan(s) or purchases; the details of the Services and applicable features along with their corresponding prices can be found on our Site and/or Application ("Subscription"/ "Subscription Service").
                </p>
              </div>
            </div>

            {/* Section E: Pricing, Payments and Refund */}
            <div>
              <SectionHeader letter="E" title="Pricing, Payments and Refunds" sectionId="pricing" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  You can purchase a Subscription Service of your choice for any category(ies) of content by following instructions on the Platform and making the payment applicable for the Subscription you intend to purchase.
                </p>
              </div>
            </div>

            {/* Section F: Use of the Platform */}
            <div>
              <SectionHeader letter="F" title="Use of the Platform" sectionId="use" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Subject to the Platform Terms, Graphura hereby grants you a non-exclusive, non-transferable, non-sublicensable, limited license to access and use the Graphura Platform for your own personal, non-commercial and private use on an 'as is' basis in accordance with these Terms and Conditions and other Platform Terms.
                </p>
              </div>
            </div>

            {/* Section G: Content and Conduct */}
            <div>
              <SectionHeader letter="G" title="Content and Conduct" sectionId="content" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  As a User, you may submit User-generated Content on the Platform. However, you must understand that Graphura does not guarantee any confidentiality with respect to any User-generated Content you submit.
                </p>
              </div>
            </div>

            {/* Section H: Communications */}
            <div>
              <SectionHeader letter="H" title="Communications" sectionId="communications" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  When you visit the Platform, you are communicating with us electronically. You may be required to provide a valid phone number while creating any account with us or while enrolling or purchasing any Subscription Service. We may communicate with you by e-mail, SMS, phone call, WhatsApp or by posting notices on the Platform or by any other mode of communication.
                </p>
              </div>
            </div>

            {/* Section I: Processing of Personal Information */}
            <div>
              <SectionHeader letter="I" title="Processing of Personal Information" sectionId="processing" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  All our collection, processing, sharing and storing of any Personal Information collected from you shall be in accordance with our Privacy Policy. Kindly read the same to understand the security measured undertaken by Graphura to safeguard your Personal Information.
                </p>
              </div>
            </div>

            {/* Section J: Intellectual Property */}
            <div>
              <SectionHeader letter="J" title="Intellectual Property and License to User-generated Content" sectionId="intellectual" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  User-generated Content: You shall remain the sole owner of any content uploaded or published or submitted or posted by you on the Platform, including without limitation, the content published by you as a Content Provider and/or any text, image, media, written statements or other content posted or published by a User anywhere on the Platform including without limitations in the comments section ("User-generated Content") and Graphura does not claim any ownership over any User-generated Content uploaded/published by any User on the Platform.
                </p>
              </div>
            </div>

            {/* Section K: Feedback */}
            <div>
              <SectionHeader letter="K" title="Feedback" sectionId="feedback" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  If any User(s) submits suggestions, ideas, comments, or questions containing product feedback about the Platform or any of the Services, either through the Platform or otherwise ("Feedback"), then such User(s) grants Graphura and its affiliates a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable right to use (and full right to sublicense), reproduce, modify, adapt, publish, translate, create derivative works from, distribute, transmit, and display such Feedback in any form.
                </p>
              </div>
            </div>

            {/* Section L: Copyright, Trademarks */}
            <div>
              <SectionHeader letter="L" title="Copyright, Trademarks, and other Intellectual Property Rights" sectionId="copyright" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  At Graphura, we respect the intellectual property of others just as much ours and, hence, if you believe that your intellectual property rights have been used in a way that gives rise to concerns of infringement of your intellectual property (including your copyrights and trademarks), then kindly write to us at official@graphura.in.
                </p>
              </div>
            </div>

            {/* Section M: Claims Against User-generated Content */}
            <div>
              <SectionHeader letter="M" title="Claims Against User-generated Content" sectionId="claims" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Graphura does not monitor or have any control over or does not warrant, and makes no claim or representation regarding the accuracy, completeness, or usefulness of any User-generated Content provided on the Platform by its Users and accepts no responsibility for reviewing changes or updates to, or the quality, content, policies, nature or reliability of, such User-generated Content.
                </p>
              </div>
            </div>

            {/* Section N: Graphura's Rights */}
            <div>
              <SectionHeader letter="N" title="Graphura's Rights" sectionId="rights" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  In respect of the entire Platform, Graphura reserves the following rights:
                </p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>Graphura reserves the right to put on-hold or reject or suspend or terminate your registration on the Platform for the purpose of complying with the legal and regulatory requirements.</li>
                  <li>Graphura reserves the right to remove you and/or the User-generated Content without notice if you violate any provisions of the Platform Terms.</li>
                  <li>Graphura may modify, terminate, or refuse to provide Services at any time for any reason, without notice.</li>
                </ol>
              </div>
            </div>

            {/* Section O: Platform Availability */}
            <div>
              <SectionHeader letter="O" title="Platform Availability" sectionId="availability" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Your access to the Platform may occasionally be suspended or restricted to allow for repairs, maintenance, or due to the introduction of new facilities or services at any time without prior notice. We will attempt to limit the frequency and duration of any such suspension or restriction. You agree that Graphura will not be liable for any losses that may be incurred by you if for any reason all or part of the Platform is unavailable at any time or for any period for use.
                </p>
              </div>
            </div>

            {/* Section P: Deletion of Account */}
            <div>
              <SectionHeader letter="P" title="Deletion of Account" sectionId="deletion" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  As a Learner, you may delete your account at any time by either writing to us at the email address provided under 'Contact for User Support/Queries' section below or by using the delete option provided within your account on the Platform (if available). If your account is deleted (regardless of the reason), you will no longer has access to your account on the Platform and your User-generated Content may no longer be available; any deletion once processed is irrecoverable.
                </p>
              </div>
            </div>

            {/* Section Q: Disclaimer */}
            <div>
              <SectionHeader letter="Q" title="Disclaimer" sectionId="disclaimer" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  YOU AGREE THAT THE PLATFORM, CONTENT, AND ALL MATERIALS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS AND YOUR USE OF THE PLATFORM SHALL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, Graphura, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS DISCLAIM AND EXCLUDE ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE PLATFORM AND YOUR USE THEREOF.
                </p>
              </div>
            </div>

            {/* Section R: Limitation of Liability */}
            <div>
              <SectionHeader letter="R" title="Limitation of Liability" sectionId="limitation" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL Graphura, ITS AFFILIATES, THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, LOSSES OR EXPENSES OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF USER-GENERATED CONTENT OR ANY OTHER CONTENT AVAILABLE AT Graphura...
                </p>
              </div>
            </div>

            {/* Section S: Indemnity and Release */}
            <div>
              <SectionHeader letter="S" title="Indemnity and Release" sectionId="indemnity" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  To the extent permitted by applicable law, you agree to defend, indemnify and hold harmless Graphura, its affiliates, their respective officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Graphura Platform; (ii) your violation of any term of the Platform Terms...
                </p>
              </div>
            </div>

            {/* Section T: OFAC */}
            <div>
              <SectionHeader letter="T" title="OFAC (Office of Foreign Asset Control)" sectionId="ofac" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  You represent and warrant that you are not, nor are you owned or controlled directly or indirectly by, any person, group, entity or nation named on any list issued by the Department of the Treasury's Office of Foreign Asset Control ("OFAC" ), or any similar list or by any law, order, rule or regulation or any Executive Order of the President of the United States...
                </p>
              </div>
            </div>

            {/* Section U: California Civil Code */}
            <div>
              <SectionHeader letter="U" title="California Civil Code Section 1789.3" sectionId="california" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Californian Users are entitled to know that they may file grievances and complaints with California Department of Consumer Affairs, 400 R Street, Suite 1080, Sacramento, CA 95814; or by phone at 916-445-1254 or 800-952-5210; or by email to dca@dca.ca.gov.
                </p>
              </div>
            </div>

            {/* Section V: Applicable Law and Jurisdiction */}
            <div>
              <SectionHeader letter="V" title="Applicable Law and Jurisdiction" sectionId="jurisdiction" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  The applicable law and jurisdiction is dependent upon which entity forming part of the Graphura group is offering you the Platform and the Services, which in turn is dependent upon the Subscription chosen by you. Illustratively, Services provisioned in respect of Subscriptions pertaining to India, Graphura India shall be the entity rendering the Services and, accordingly, the Agreement shall be governed by and construed in accordance with the laws of India; and you agree, as we do, to submit to the exclusive jurisdiction of the courts at Bangalore, Karnataka, India.
                </p>
              </div>
            </div>

            {/* Section W: General Provisions */}
            <div>
              <SectionHeader letter="W" title="General Provisions" sectionId="general" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Legal Notices: In the event of any other disputes or claims arising from the use of the Graphura Platform, please get in touch with us at official@graphura.in
                </p>
                <p>
                  Modification, Amendment or Termination: Graphura may, in its sole discretion, modify or revise the Agreement and policies at any time, and you agree to be bound by such modifications or revisions.
                </p>
              </div>
            </div>

            {/* Section X: Contact for User Support */}
            <div>
              <SectionHeader letter="X" title="Contact for User Support/Queries" sectionId="support" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  For queries relating to Services offered by Graphura, please write to us at team@graphura.online.
                </p>
              </div>
            </div>

            {/* Section Y: Consumer Grievance */}
            <div>
              <SectionHeader letter="Y" title="Consumer Grievance" sectionId="grievance" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Grievance Officer Details –
                </p>
                <div className="bg-slate-50 p-5 rounded-lg mt-3">
                  <p className="font-semibold text-slate-900">Name: Het Patel</p>
                  <p className="text-slate-700">Contact: het@graphura.online</p>
                </div>
              </div>
            </div>

            {/* Section Z: Contact Us */}
            <div>
              <SectionHeader letter="Z" title="Contact Us" sectionId="contact" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  If you have concerns or queries regarding the Platform Terms, you may write to us by email at official@graphura.in or by post to:
                </p>
                <div className="bg-slate-50 p-5 rounded-lg mt-3">
                  <p className="font-semibold text-slate-900">Sorting Graphura India Private Limited</p>
                  <p className="text-slate-700">Graphura</p>
                  <p className="text-slate-700">10/305, Near Anurag bhawan, Sector 1, Mansarovar, Jaipur, Rajasthan 302020, India</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="text-center text-slate-600">
                <p className="text-sm">
                  For any questions or concerns regarding these Terms and Conditions, please contact us at{" "}
                  <a href="mailto:official@graphura.in" className="text-sky-600 hover:text-sky-700 font-medium">
                    official@graphura.in
                  </a>
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  © 2026 Graphura All rights reserved.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Terms and Conditions – Version 1.0
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.7);
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
};

export default TermsAndConditions;