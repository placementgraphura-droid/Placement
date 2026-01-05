import React, { useState, useEffect } from "react";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";

const sections = [
  { id: "general", title: "A. General Privacy Terms", letter: "A" },
  { id: "applicability", title: "B. Applicability", letter: "B" },
  { id: "access", title: "C. Access", letter: "C" },
  { id: "children", title: "D. Use by Children", letter: "D" },
  { id: "controllers", title: "E. Controllers", letter: "E" },
  { id: "personal-info", title: "F. Personal Information", letter: "F" },
  { id: "info-collect", title: "G. Information We Collect", letter: "G" },
  { id: "basis", title: "H. Basis of Collection", letter: "H" },
  { id: "usage", title: "I. How We Use Information", letter: "I" },
  { id: "cross-border", title: "J. Cross-Border Transfer", letter: "J" },
  { id: "storage", title: "K. Storage Duration", letter: "K" },
  { id: "choices", title: "L. Your Choices", letter: "L" },
  { id: "rights", title: "M. Your Rights", letter: "M" },
  { id: "security", title: "N. Information Security", letter: "N" },
  { id: "promotion", title: "O. Promotional Communications", letter: "O" },
  { id: "ads", title: "P. Interest-Based Ads", letter: "P" },
  { id: "changes", title: "Q. Policy Modifications", letter: "Q" },
  { id: "grievance", title: "R. Privacy Grievances", letter: "R" },
  { id: "country", title: "S. Country-Specific Terms", letter: "S" },
  { id: "ccpa-t", title: "T. CCPA Notice", letter: "T" },
  { id: "ccpa-u", title: "U. CCPA Data Practices", letter: "U" },
  { id: "ccpa-v", title: "V. CCPA Consumer Rights", letter: "V" },
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

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-blue-900 max-w-2xl mx-auto text-lg leading-relaxed">
            Graphura respects your privacy and is committed to protecting it with industry-leading security practices.
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
            
            {/* Section A: General */}
            <div>
              <SectionHeader letter="A" title="General Privacy Terms" sectionId="general" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  In addition to our Terms and conditions Service, Graphura respects your privacy and is committed to protecting it. This Privacy Policy (the “Policy”) explains the types of information collected by Graphura when you use the Platform (as defined in Terms and conditions) that references this Policy, how we collect, use, share and store such information collected and also explains the rationale for collection of such information, the privacy rights and choices you have regarding your information submitted to us when you use the Services.
                </p>
                <p>
                  For ease of reference, use of the terms “Graphura”, “we”, “us, and/or “our” refer to Sorting Graphura India Private Limited – a company incorporated in India and all of its affiliates which have license to host the Platform and offer Services. Similarly, use of the terms “you”, “yours” and/or “User(s)” refer to all users of the Platform and includes all Learners and Content Providers (as more particularly defined under our Terms and conditions).
                </p>
                <p>
                  The Services are governed by this Policy, Terms and conditions, and any other rules, policies or guidelines published on the Platform as applicable to you. Please read this Policy carefully prior to accessing our Platform and using the Services. By accessing and using the Platform, providing your Personal Information (defined below), or by otherwise signalling your agreement when the option is presented to you, you consent to the collection, use, disclosure, sharing and storing of information described in this Policy, Terms of Service and any other rules, policies or guidelines published on the Platform as applicable to you (collectively referred to as the “Platform Terms”), and Graphura disclaims all the liabilities arising therefrom. If you have inadvertently submitted any Personal Information to Graphura prior to reading this Policy statements set out herein, or you do not agree with the way your Personal Information is collected, stored, or used, then you may access, modify and/or delete your Personal Information in accordance with this Policy (refer to the sections about Your Choices and Your Rights).

If any information you have provided or uploaded on the Platform violates the Platform Terms, Graphura may be required to delete such information upon informing you of the same and revoke your access to the Platform if required.

Capitalized terms used but not defined in this Policy can be found in our Terms and conditions.

                </p>
                <InfoBox type="info">
                  <p className="text-slate-800 font-medium">
                    Contact: <a href="mailto:support@graphura.in" className="text-sky-600 hover:text-sky-700">support@graphura.in</a>
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section B: Applicability */}
            <div>
              <SectionHeader letter="B" title="Applicability" sectionId="applicability" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>This Policy applies to all Users of the Platform.</p>
                <p className="mt-4">
    Graphura owns and/or manages several platforms (other than the Platform)
    that offer a range of services including services related to technology
    solutions in the space of education, either by itself or through its
    affiliates and subsidiaries (“Graphura Group Platforms”). Each of the
    Graphura Group Platforms have published their own privacy policies.
    Accordingly, this Policy does not apply to information collected through
    the Graphura Group Platforms and only applies to the collection of your
    information through the Platform. Please visit the relevant Graphura Group
    Platform to know the privacy practices undertaken by them.
  </p>

  <p className="mt-4">
    Graphura has taken reasonable precautions as per applicable laws and
    implemented industry standards to treat Personal Information as confidential
    and to protect it from unauthorized access, improper use or disclosure,
    modification and unlawful destruction or accidental loss of the Personal
    Information.
  </p>
              </div>
            </div>

            {/* Section C: Access */}
            <div>
              <SectionHeader letter="C" title="Access" sectionId="access" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
    You may be allowed to access and view the Platform as a guest and without
    creating an account on the Platform or providing any Personal Information;
    Graphura does not validate or takes no responsibility towards information,
    if any, provided by you as a guest, except as otherwise required under any
    law, regulation, or an order of competent authority.
  </p>

  <p className="mt-4">
    However, to have access to all the features and benefits on our Platform,
    you are required to first create an account on our Platform. To create an
    account, you are required to provide certain Personal Information as may be
    required during the time of registration and all other information requested
    on the registration page, including the ability to receive promotional
    offers from Graphura, is optional.
  </p>

  <p className="mt-4">
    Graphura may, in future, include other optional requests for information
    from you to help Graphura to customize the Platform to deliver personalized
    information to you.
  </p>

  <p className="mt-4">
    Graphura may keep records of telephone calls or emails received from or made
    by you for making enquiries, feedback, or other purposes for the purpose of
    rendering Services effectively and efficiently.
  </p>
              </div>
            </div>

            {/* Section D: Children */}
            <div>
              <SectionHeader letter="D" title="Use of the Platform/Services by Children" sectionId="children" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  As stated in our Terms and conditions, to register on the Platform you must meet the 'Age Requirements' (as 
                  defined in our Terms and conditions). If you are a "Minor" or "Child" i.e., an individual who does not meet 
                  the Age Requirements, then you may not register on the Platform, and only your Parent (defined below) can 
                  register on the Platform on your behalf, agree to all Platform Terms and enable access to you under their 
                  guidance and supervision.
                </p>
                <InfoBox type="warning">
                  <p className="text-slate-800">
                    While some of our Services may require collection of a Child's Personal Information, we do not knowingly 
                    collect such Personal Information from a Child and assume that information has been provided with consent 
                    of the Parent. If you are a Parent and you are aware that your Child has provided us with any Personal 
                    Information without your consent, please contact us at{" "}
                    <a href="mailto:support@graphura.in" className="text-amber-700 hover:text-amber-800 font-medium">
                      support@graphura.in
                    </a>.
                  </p>
                </InfoBox>
                <p>
                  The information in the relevant parts of this notice applies to Children as well as adults. If your Child 
                  faces any form of abuse or harassment while availing our Services, you must write to us at official@Graphura.in, 
                  so that necessary actions could be considered.
                </p>
              </div>
            </div>

            {/* Section E: Controllers */}
            <div>
              <SectionHeader letter="E" title="Controllers" sectionId="controllers" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Graphura is the controller of Personal Information that it collects and processes in connection with the use 
                  of the Platform and the provision of the Services on the Platform. The kind of Personal Information we collect 
                  in connection with such use is detailed below.
                </p>
              </div>
            </div>

            {/* Section F: Personal Information */}
            <div>
              <SectionHeader letter="F" title="Personal Information" sectionId="personal-info" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  "Personal Information" shall mean the information which identifies a User i.e., first and last name, 
                  identification number, email address, age, gender, location, photograph and/or phone number provided at 
                  the time of registration or any time thereafter on the Platform.
                </p>
                <InfoBox type="info">
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-900">Sensitive Personal Information includes:</p>
                    <ul className="list-disc ml-6 space-y-1 text-slate-700">
                      <li>Passwords and financial data (except the truncated last four digits of credit/debit card)</li>
                      <li>Health data</li>
                      <li>Official identifier (such as biometric data, aadhaar number, social security number, driver's license, passport, etc.)</li>
                      <li>Information about sexual life, sexual identifier, race, ethnicity, political or religious belief or affiliation</li>
                      <li>Account details and passwords</li>
                      <li>Other data categorized as 'sensitive personal data' or 'special categories of data' under Data Protection Laws</li>
                    </ul>
                  </div>
                </InfoBox>
                <p>
                  Usage of the term 'Personal Information' shall include 'Sensitive Personal Information' as may be applicable 
                  to the context of its usage.
                </p>
                <p>
                  We request you to not provide Graphura with any Personal Information unless specifically requested by us. In 
                  the event you share with Graphura any Personal Information without us having specifically requested for the 
                  same, then we bear no liability in respect of such Personal Information provided by you.
                </p>
              </div>
            </div>

            {/* Section G: Information We Collect */}
            <div>
              <SectionHeader letter="G" title="Information We Collect" sectionId="info-collect" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                <p>
                  We only collect information about you if we have a reason to do so — for example, to provide our Services on 
                  the Platform, to communicate with you, or to make our Services better.
                </p>

                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl border-l-4 border-sky-500">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Information we collect from You:</h3>
                  
                  <ol className="list-decimal ml-6 space-y-4">
                    <li>
                      <strong>Basic account information:</strong> In order to access certain features of the Platform, you will 
                      need to create an account and register with us. We ask for basic information which may include your name, 
                      an email address, state of residence country, and password, along with a username and phone/mobile number.
                    </li>
                    <li>
                      <strong>Know Your Customer ('KYC') information:</strong> If you are a Content Provider registered with us, 
                      then, we also collect the KYC information, which may include information pertaining to your PAN number, 
                      aadhaar number, driver's license, passport, your entity details such as name, MOU/AOA, certificate of 
                      incorporation, list of directors/partners, social security number etc., along with the relevant documents.
                    </li>
                    <li>
                      <strong>Public profile information:</strong> If you are a Content Provider, we may also collect certain 
                      additional information from you to enable creation of your public profile, if any, on the Platform to help 
                      Learners and other Users know you better.
                    </li>
                    <li>
                      <strong>Information when you communicate with us:</strong> When you write to us with a question or to ask 
                      for help, we will keep that correspondence, and the email address, for future reference.
                    </li>
                    <li>
                      <strong>Information related to location:</strong> You may also choose to provide location related information, 
                      including but not limited to access to GPS, which will enable us, with your consent, to offer customized 
                      offerings for specific services.
                    </li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500 mt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Information we collect automatically:</h3>
                  
                  <ol className="list-decimal ml-6 space-y-4">
                    <li>
                      <strong>Device and Log information:</strong> When you access our Platform, we collect information that web 
                      browsers, mobile devices, and servers typically make available, including the browser type, IP address, 
                      unique device identifiers, language preference, referring site, the date and time of access, operating 
                      system, and mobile network information.
                    </li>
                    <li>
                      <strong>Usage information:</strong> We collect information about your usage of our Platform. We also collect 
                      information about what happens when you use our Platform (e.g., page views, support document searches, 
                      features enabled for your account).
                    </li>
                    <li>
                      <strong>Location information:</strong> We may determine the approximate location of your Supported Device 
                      from your Internet Protocol (IP) address.
                    </li>
                    <li>
                      <strong>Information from cookies & other technologies:</strong> We may collect information about you through 
                      the use of cookies and other similar technologies. For more information on our use of cookies and similar 
                      technologies, please refer to our Cookie Policy.
                    </li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500 mt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Information we collect from other sources:</h3>
                  <p>
                    We might receive and collect information about you from other sources in the course of their services to us 
                    or from publicly available sources, as permitted by law, which we may combine with other information we 
                    receive from or about you. For example, we may receive information about you from a social media site or a 
                    Google service if you connect to the Services through that site or if you use the Google sign-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Section H: Basis of Collection */}
            <div>
              <SectionHeader letter="H" title="Basis of Collection and Processing of Your Personal Information" sectionId="basis" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <h3 className="text-lg font-semibold text-slate-900">Basis for collection:</h3>
                <p>
                  We collect and process your Personal Information based on the following legal parameters depending upon the 
                  nature of Personal Information and the purposes for which it is processed:
                </p>
                <ol className="list-decimal ml-6 space-y-3">
                  <li>
                    <strong>Consent:</strong> We rely on your consent to process your Personal Information in certain situations. 
                    If we require your consent to collect and process certain Personal Information, as per the requirements under 
                    the applicable Data Protection Laws, your consent is sought at the time of collection of your Personal 
                    Information.
                  </li>
                  <li>
                    <strong>Compliance with a legal obligation:</strong> Your Personal Information may be processed by us, to the 
                    extent that such processing is necessary to comply with a legal obligation.
                  </li>
                </ol>

                <h3 className="text-lg font-semibold text-slate-900 mt-6">Processing of your Personal Information:</h3>
                <p>
                  We may process your Personal Information in connection with any of the purposes and uses set out in this Policy 
                  on one or more of the following legal grounds:
                </p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>Because it is necessary to perform the Services you have requested or to comply with your instructions or other contractual obligations</li>
                  <li>To comply with our legal obligations as well as to keep records of our compliance processes</li>
                  <li>Because our legitimate interests make the processing necessary, provided those interests are not overridden by your interests or fundamental rights</li>
                  <li>Because you have chosen to publish or display your Personal Information on a public area of the Platform</li>
                  <li>Because it is necessary to protect your vital interests</li>
                  <li>Because it is necessary in the public interest</li>
                  <li>Because you have expressly given us your consent to process your Personal Information in a particular manner</li>
                </ol>

                <InfoBox type="info">
                  <p className="text-slate-800">
                    Where the processing of your Personal Information is based on your consent, you have the right to withdraw 
                    your consent at any point in time. You may withdraw consent by contacting us with a written request to the 
                    contact details provided in the 'Grievances' section below.
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section I: How We Use Information */}
            <div>
              <SectionHeader letter="I" title="How we Use and Share the Information Collected" sectionId="usage" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p className="font-semibold text-slate-900">We use/process your information in the following manner:</p>
                
                <ol className="list-decimal ml-6 space-y-4">
                  <li>
                    <strong>To provide Services on our Platform:</strong> We use your information as collected by us to allow 
                    you to access the Platform and the Services offered therein, including without limitation to set-up and 
                    maintain your account, provide customer service, fulfil purchases through the Platform, verify User 
                    information and to resolve any glitches with our Platform.
                  </li>
                  <li>
                    <strong>To improve our Platform and maintain safety:</strong> We use your information to improve and 
                    customize the Platform and Services offered by us, including providing automatic updates to newer versions 
                    of our Platform and creating new features based on the Platform usage analysis.
                  </li>
                  <li>
                    <strong>To market our Platform and communicate with You:</strong> We will use your information to develop 
                    a more targeted marketing of our Platform, to communicate with you about our offers, new products, services 
                    or even receive your feedback on the Platform.
                  </li>
                  <li>
                    <strong>To establish, exercise, or defend legal claims:</strong> We may process any Personal Information 
                    identified in this Policy when necessary for establishing, exercising, or defending legal claims.
                  </li>
                  <li>
                    <strong>To manage risk and obtain professional advice:</strong> We may process any of the Personal Information 
                    identified in this Policy to manage risk or obtain professional advice.
                  </li>
                  <li>
                    <strong>Consent:</strong> We may otherwise use your information with your consent or at your direction.
                  </li>
                  <li>
                    <strong>To Better Understand Our Users:</strong> We may use information we gather to determine which areas 
                    of the Services are most frequently visited to understand how to enhance the Services.
                  </li>
                </ol>

                <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-500 my-6">
                  <p className="font-semibold text-slate-900 mb-3">How we share information:</p>
                  <p>
                    We share the information collected as per terms of this Policy only in the manner specified hereinbelow. 
                    We do not sell or otherwise disclose Personal Information we collect about you for monetary or other valuable 
                    consideration.
                  </p>
                </div>

                <ol className="list-decimal ml-6 space-y-4">
                  <li>
                    <strong>Affiliates and Subsidiaries:</strong> We may disclose information about you to our affiliates, 
                    subsidiaries and other businesses under the same control and ownership.
                  </li>
                  <li>
                    <strong>Third-party vendors/service providers:</strong> We may share information with third-party vendors 
                    or service providers (including consultants, payment processors, and integrated services) who need the 
                    information to provide their services to us or you.
                  </li>
                  <li>
                    <strong>Third-party platforms to facilitate additional offerings:</strong> We may share information with 
                    third-party platforms to enable interactive forums between Content Providers and Learners.
                  </li>
                  <li>
                    <strong>Legal Disclosures:</strong> We may disclose information in response to a court order or governmental 
                    request, or where necessary to comply with law, protect rights, prevent fraud, or enforce Platform Terms.
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In the event of a merger, acquisition, asset sale, or insolvency, user 
                    information may be transferred and will remain subject to this Policy.
                  </li>
                  <li>
                    <strong>Advertising and Analytics Partners:</strong> We may share usage data with advertisers and analytics 
                    providers through cookies and similar technologies.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share information with your consent or at your direction.
                  </li>
                </ol>
              </div>
            </div>

            {/* Section J: Cross-Border Transfer */}
            <div>
              <SectionHeader letter="J" title="Cross-Border Data Transfer" sectionId="cross-border" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Your information including any Personal Information is stored, processed, and transferred in and to the Amazon 
                  Web Service (AWS) servers and databases located in Singapore, India and the USA. Graphura may also store, 
                  process, and transfer information in and to servers in other countries depending on the location of its 
                  affiliates and service providers.
                </p>
                <InfoBox type="warning">
                  <p className="text-slate-800">
                    Please note that these countries may have differing (and potentially less stringent) privacy laws and that 
                    Personal Information can become subject to the laws and disclosure requirements of such countries, including 
                    disclosure to governmental bodies, regulatory agencies, and private persons.
                  </p>
                </InfoBox>
                <p>
                  If you use our Platform from outside India, including in the USA, EU, EEA, and UK, your information may be 
                  transferred to, stored, and processed in India. By accessing our Platform or otherwise giving us information, 
                  you consent to the transfer of information to India and other countries outside your country of residence.
                </p>
                <p>
                  We rely on legal bases to transfer information outside the EU, EEA and UK, and any Personal Information that 
                  we transfer will be protected in accordance with this Policy as well as with adequate protections in place in 
                  compliance with applicable Data Protection Laws and regulations.
                </p>
              </div>
            </div>

            {/* Section K: Storage Duration */}
            <div>
              <SectionHeader letter="K" title="Duration for which your Information is Stored" sectionId="storage" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Mostly, when you delete any of the information provided by you or when you delete your account, on the Platform, 
                  the same will be deleted from our servers too. However, in certain cases, we will retain your information for 
                  as long as it is required for us to retain for the purposes stated hereinabove, including for the purpose of 
                  complying with legal obligation or business compliances.
                </p>
                <p>
                  Further, please note that we may not be able to delete all communications or photos, files, or other documents 
                  publicly made available by you on the Platform (for example: comments, feedback, etc.), however, we shall 
                  anonymize your Personal Information in such a way that you can no longer be identified as an individual in 
                  association with such information made available by you on the Platform.
                </p>
                <InfoBox type="info">
                  <p className="text-slate-800">
                    <strong>Note:</strong> If you wish to exercise any of your rights to access, modify and delete any or all 
                    information stored about you, then you may do so by using the options provided within the Platform. You can 
                    always write to us at{" "}
                    <a href="mailto:support@graphura.in" className="text-sky-600 hover:text-sky-700 font-medium">
                      support@graphura.in
                    </a>{" "}
                    for any clarifications needed.
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section L: Your Choices */}
            <div>
              <SectionHeader letter="L" title="Your Choices" sectionId="choices" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">Limit the information You provide:</h4>
                    <p>
                      You always have an option to choose the information you provide to us, including the option to update or 
                      delete your information. However, please note that lack of certain information may not allow you the access 
                      to the Platform or any of its features, in part or in full.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900">Limit the communications You receive from us:</h4>
                    <p>
                      Further, you will also have the option to choose what kind of communication you would like to receive from 
                      us and whether you would like to receive such communication at all or not. However, there may be certain 
                      communications that are required for legal or security purposes, including changes to various legal 
                      agreements, that you may not be able to limit.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900">Reject Cookies and other similar technologies:</h4>
                    <p>
                      You may reject or remove cookies from your web browser; you will always have the option to change the 
                      default settings on your web browser if the same is set to 'accept cookies'. However, please note that 
                      some Services offered on the Platform may not function or be available to you, when the cookies are 
                      rejected, removed, or disabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section M: Your Rights */}
            <div>
              <SectionHeader letter="M" title="Your Rights" sectionId="rights" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  In general, all Users have the rights specified herein this section. However, depending on where you are 
                  situated, you may have certain specific rights in respect of your Personal Information accorded by the laws 
                  of the country you are situated in. To understand Your rights, please refer to the Country Specific Additional 
                  Terms below.
                </p>

                <ol className="list-decimal ml-6 space-y-3 mt-4">
                  <li>
                    <strong>Right to Confirmation and Access:</strong> You have the right to get confirmation and access to 
                    your Personal Information that is with us along with other supporting information.
                  </li>
                  <li>
                    <strong>Right to Correction:</strong> You have the right to ask us to rectify your Personal Information 
                    that is with us that you think is inaccurate. You also have the right to ask us to update your Personal 
                    Information that you think is incomplete or out-of-date.
                  </li>
                  <li>
                    <strong>Right to be Forgotten:</strong> You have the right to restrict or prevent the continuing disclosure 
                    of your Personal Information under certain circumstances.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> If you wish to withdraw/remove your Personal Information from our 
                    Platform, you have the right to request erasure of your Personal Information from our Platform. However, 
                    please note that such erasure will remove all your Personal Information from our Platform (except as 
                    specifically stated in this Policy) and may result in deletion of your account on the Platform permanently.
                  </li>
                </ol>

                <InfoBox type="info">
                  <p className="text-slate-800">
                    Remember, you are entitled to exercise your rights as stated above only with respect to your information, 
                    including Personal Information, and not that of other Users. When we receive requests over email or physically, 
                    we may need to ask you a few additional information to verify your identity in association with the Platform.
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section N: Information Security */}
            <div>
              <SectionHeader letter="N" title="Information Security" sectionId="security" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  We work to protect the security of your information during transmission by using Transport Layer Security (TLS) 
                  or Secure Sockets Layer (SSL) software (depending on your browser/Supported Device), which encrypts information 
                  you input in addition to maintaining security of your information as required under applicable laws.
                </p>
                <p>
                  We maintain electronic, and procedural safeguards in connection with the collection, storage, and disclosure 
                  of Personal Information (including Sensitive Personal Information). Our security procedures mean that we may 
                  occasionally request proof of identity before we disclose Personal Information to you that belongs to you.
                </p>
                <InfoBox type="warning">
                  <p className="text-slate-800">
                    However, no form or method of data storage or transmission system is fully secure, and we cannot guarantee 
                    that security provided by such system(s) is absolute and that your information will not be accessed, disclosed, 
                    or destroyed in the event of a breach of any of our security measures.
                  </p>
                </InfoBox>
                <p>
                  It is important for you to protect your account against unauthorized access to or use of your password and to 
                  your computer. If you have any reason to believe that your password has become known to anyone else, or if the 
                  password is being, or is likely to be, used in an unauthorized manner, you must immediately change your password 
                  or inform us.
                </p>
                <p>
                  All KYC information collected in accordance with this Policy are fully encrypted and cannot be accessed by any 
                  person other than the designated authority in Graphura.
                </p>
              </div>
            </div>

            {/* Section O: Promotional Communications */}
            <div>
              <SectionHeader letter="O" title="Promotional Communications" sectionId="promotion" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  You will always have the option to opt out of receiving some or all of our promotional communications through 
                  the setting provided within the Platform upon your login, by using the unsubscribe link in any email 
                  communications sent to you or by emailing support@Graphura.in.
                </p>
                <p>
                  If you opt out of promotional communications, we may still send you transactional communications, such as 
                  service announcements, administrative and legal notices, and information about your account, without offering 
                  you the opportunity to opt out of these communications.
                </p>
                <InfoBox type="info">
                  <p className="text-slate-800">
                    Please note that opting out of promotional email communications only affects future communications from us. 
                    If we have already provided your information to a third party (as stated in this Policy) before you changed 
                    your preferences, you may have to change your preferences directly with that third party.
                  </p>
                </InfoBox>
                <p>
                  We do not sell your Personal Information to third parties, and we do not use your name or name of your company 
                  in marketing statements without your consent.
                </p>
              </div>
            </div>

            {/* Section P: Interest-Based Ads */}
            <div>
              <SectionHeader letter="P" title="Interest-Based Ads" sectionId="ads" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  On unaffiliated sites, Graphura may display interest-based advertising using information you make available 
                  to us when you interact with our Platform and Services. Interest-based ads, also sometimes referred to as 
                  personalised or targeted ads, are displayed to you based on information from activities such as registering 
                  with our Platform, visiting sites that contain Graphura content or ads.
                </p>
                <p>
                  In providing interest-based ads, we follow applicable laws, as well as the Code for Self-Regulation in 
                  Advertising by the Advertising Standards Council of India and the Self-Regulatory Principles for Online 
                  Behavioural Advertising developed by the Digital Advertising Alliance.
                </p>
                <p>
                  We do not provide any Personal Information to advertisers or to third party sites that display our 
                  interest-based ads. However, advertisers and other third-parties may assume that users who interact with or 
                  click on a personalised ad or content are part of the group that the ad or content is directed towards.
                </p>
              </div>
            </div>

            {/* Section Q: Policy Modifications */}
            <div>
              <SectionHeader letter="Q" title="Modification to Privacy Policy" sectionId="changes" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Our business changes constantly and our Policy may change from time to time. We may, at our discretion (unless 
                  required by applicable laws to mandatorily do so), email periodic reminders of our notices and conditions, 
                  unless you have instructed us not to, but we encourage you to check our Platform frequently to see the recent 
                  changes.
                </p>
                <p>
                  Unless stated otherwise, our current Policy applies to all information that we have about you and your account. 
                  We stand behind the promises we make, however, and will not materially change our policies and practices making 
                  them less protective of customer information collected in the past without your consent.
                </p>
              </div>
            </div>

            {/* Section R: Privacy Grievances */}
            <div>
              <SectionHeader letter="R" title="Privacy Grievances" sectionId="grievance" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  If you have any questions about this Policy, wish to exercise your rights, have concerns about privacy of 
                  your data or any privacy related grievances in respect of the Platform, then please register your complaint 
                  with a thorough description via email to support@graphura.in addressed to our grievance officer Mr. Tony 
                  Mathew (Associate General Counsel) or via a registered post to the below address-
                </p>
                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-slate-400 my-4">
                  <p className="font-semibold text-slate-900">Graphura India Private Limited</p>
                  <p className="text-slate-700">near RSF, Pataudi, Gurgaon,</p>
                  <p className="text-slate-700">Haryana 122503</p>
                </div>
              </div>
            </div>

            {/* Section S: Country-Specific Terms */}
            <div>
              <SectionHeader letter="S" title="Country Specific Additional Privacy Terms" sectionId="country" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                
                {/* Indian Residents */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-l-4 border-orange-400">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">1. TERMS APPLICABLE IF YOU ARE AN INDIAN RESIDENT</h3>
                  
                  <p className="font-semibold text-slate-900 mb-3">Your rights:</p>
                  <p>
                    If you are located in India, you may have the following rights under the Personal Data Protection Bill (PDPB) 
                    when it becomes a legislation. All requests can be made by using the option provided to you within the Platform 
                    upon your login.
                  </p>

                  <ol className="list-decimal ml-6 space-y-3 mt-4">
                    <li>
                      <strong>Right to Confirmation and Access:</strong> You have the right to get confirmation and access to 
                      your Personal Information that is with us along with other supporting information.
                    </li>
                    <li>
                      <strong>Right to Correction:</strong> You have the right to ask us to rectify your Personal Information 
                      that is with us that you think is inaccurate.
                    </li>
                    <li>
                      <strong>Right to Data Portability:</strong> You have the right to ask that we transfer the Personal 
                      Information you gave us to another organisation, or to you, under certain circumstances.
                    </li>
                    <li>
                      <strong>Right to be Forgotten:</strong> You have the right to restrict or prevent the continuing disclosure 
                      of your Personal Information under certain circumstances.
                    </li>
                    <li>
                      <strong>Right to Erasure:</strong> If you wish to withdraw/remove your Personal Information from our 
                      Platform, you have the right to request erasure of your Personal Information from our Platform.
                    </li>
                  </ol>
                </div>

                {/* UK/EU/EEA Residents */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400 mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    2. TERMS APPLICABLE IF YOU ARE A RESIDENT OF UNITED KINGDOM (UK), A EUROPEAN UNION (EU) COUNTRY OR EUROPEAN ECONOMIC AREA (EEA)
                  </h3>
                  
                  <p className="font-semibold text-slate-900 mb-3">Your rights:</p>
                  <p>
                    If you are located in the United Kingdom (UK) or European Union (EU) or European Economic Area (EEA), you 
                    have the following rights under the UK and EU General Data Protection Regulation (GDPR) respectively.
                  </p>

                  <ol className="list-decimal ml-6 space-y-3 mt-4">
                    <li>
                      <strong>Right to access Your Personal Information:</strong> You have the right to receive confirmation as 
                      to whether or not Personal Information concerning you is being processed.
                    </li>
                    <li>
                      <strong>Right to Rectification:</strong> Our goal is to keep your Personal Information accurate, current 
                      and complete.
                    </li>
                    <li>
                      <strong>Right to Erasure:</strong> In some cases, you have a legal right to request that we erase your 
                      Personal Information.
                    </li>
                    <li>
                      <strong>Right to object to Processing:</strong> You have the right to object to our processing of your 
                      Personal Information under certain conditions.
                    </li>
                    <li>
                      <strong>Right to restrict Processing:</strong> You have the right to request that we restrict the processing 
                      of your Personal Information, under certain conditions.
                    </li>
                    <li>
                      <strong>Right to Data Portability:</strong> You have the right to request that we transfer the data that 
                      we have collected to another organization, or directly to you, under certain conditions.
                    </li>
                    <li>
                      <strong>Right to make a complaint to a government supervisory authority:</strong> If you believe we have 
                      not processed your Personal Information in accordance with applicable provisions of the GDPR, we encourage 
                      you to contact us at support@graphura.in.
                    </li>
                    <li>
                      <strong>Right to not be subject to automated decision-making, including profiling:</strong> You have the 
                      right not to be subject to a decision based solely on automated processing.
                    </li>
                  </ol>
                </div>

                {/* California Residents */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400 mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">3. TERMS APPLICABLE IF YOU ARE A CALIFORNIA STATE RESIDENT</h3>
                  
                  <p>
                    If you are a California state resident, then you have the following rights to the extent, and in the manner, 
                    set out in the CCPA:
                  </p>

                  <ol className="list-decimal ml-6 space-y-3 mt-4">
                    <li>The right to access the Personal Information that we hold on you;</li>
                    <li>The right to know what Personal Information we intend on collecting from them before the point of collection;</li>
                    <li>The right to opt in or out of marketing, analytics, and other similar activities;</li>
                    <li>The right to equal services without discrimination; and</li>
                    <li>The right to request deletion of Personal Information.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Section T: CCPA Notice */}
            <div>
              <SectionHeader letter="T" title="CCPA Notice at Collection" sectionId="ccpa-t" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  For purposes of the CCPA, in collecting the information described above, we collect the categories of Personal 
                  Information listed below from you:
                </p>

                <div className="space-y-5 my-6">
                  <div className="bg-sky-50 p-5 rounded-xl border-l-4 border-sky-400">
                    <h4 className="font-semibold text-slate-900 mb-2">1. Identifiers</h4>
                    <p className="text-slate-700">
                      We may collect your name, email address, mobile number, username, unique personal identifier, and Internet 
                      Protocol (IP) address.
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-xl border-l-4 border-emerald-400">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      2. Characteristics of Personal Information described in the California Customer Records statute
                    </h4>
                    <p className="text-slate-700">
                      We may collect your name, email address, username, unique personal identifier, and gender.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-400">
                    <h4 className="font-semibold text-slate-900 mb-2">3. Internet or other electronic network activity information</h4>
                    <p className="text-slate-700">
                      We collect cookies as described in our Cookie Policy, browser information, IP address, domain server, 
                      browser type, access time, and data about which pages you visit on the Platform.
                    </p>
                  </div>

                  <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-400">
                    <h4 className="font-semibold text-slate-900 mb-2">4. Geolocation data</h4>
                    <p className="text-slate-700">
                      We may collect your IP address. We use Geolocation Data as set forth in the 'How We Use and Share the 
                      Information Collected' section of this Policy.
                    </p>
                  </div>

                  <div className="bg-rose-50 p-5 rounded-xl border-l-4 border-rose-400">
                    <h4 className="font-semibold text-slate-900 mb-2">5. Audio, electronic, visual or similar information</h4>
                    <p className="text-slate-700">
                      We may collect your profile picture or other audio or visual information uploaded as content to the Platform.
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-xl border-l-4 border-indigo-400">
                    <h4 className="font-semibold text-slate-900 mb-2">6. Inferences</h4>
                    <p className="text-slate-700">
                      We may make inferences based upon the Personal Information collected (such as likelihood of retention or attrition).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section U: CCPA Data Practices */}
            <div>
              <SectionHeader letter="U" title="CCPA Data Practices During the Last 12 Months" sectionId="ccpa-u" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-xl border border-sky-200">
                  <h4 className="font-semibold text-slate-900 mb-3">1. Personal Information collected:</h4>
                  <p className="mb-3">
                    As described in this Policy, we have collected the categories of Personal Information listed below during 
                    the preceding 12 months:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-slate-700">
                    <li>Identifiers</li>
                    <li>Characteristics of Personal Information described in the California Customer Records statute</li>
                    <li>Internet or other electronic network activity information</li>
                    <li>Geolocation data</li>
                    <li>Commercial information</li>
                    <li>Audio, electronic, visual, thermal, olfactory, or similar information</li>
                    <li>Inferences</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200 mt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">2. Categories of sources:</h4>
                  <p>
                    We have collected the Personal Information identified in this Policy from you and our payment processors.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">3. Business and commercial purposes for collecting Personal Information:</h4>
                  <ul className="list-disc ml-6 space-y-2 text-slate-700 mt-3">
                    <li>Operate the Platform</li>
                    <li>Provide our Services to you</li>
                    <li>Honor our Terms and Conditions and contracts</li>
                    <li>Ensure the privacy and security of our Platform and Services</li>
                    <li>Manage our relationships with you</li>
                    <li>Communicate with you</li>
                    <li>Analyze use of the Platform and our Services</li>
                    <li>Enhance your experience</li>
                    <li>Track visits to the Platform</li>
                    <li>Provide you with a more personal and interactive experience on the Platform</li>
                    <li>Usage analytics purposes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 mt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">4. Personal Information sold:</h4>
                  <p>We have not sold categories of Personal Information during the preceding 12 months.</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-xl border border-rose-200 mt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">5. Personal Information disclosed for a business purpose:</h4>
                  <p className="mb-3">
                    We have disclosed for a business purpose the categories of Personal Information listed below during the 
                    preceding 12 months:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-slate-700">
                    <li>Identifiers</li>
                    <li>Characteristics of Personal Information described in the California Customer Records statute</li>
                    <li>Internet or other electronic network activity information</li>
                    <li>Geolocation data</li>
                    <li>Commercial information</li>
                    <li>Audio, electronic, visual, thermal, olfactory, or similar information</li>
                    <li>Inferences</li>
                  </ul>
                </div>

                <InfoBox type="info">
                  <p className="text-slate-800">
                    We have disclosed each category of Personal Information to the following categories of third parties: 
                    (1) corporate parents, subsidiaries, and affiliates; (2) advisors (accountants, attorneys); (3) service 
                    providers (data analytics, data storage, mailing, marketing, website and platform administration, technical 
                    support); and (4) operating systems and platforms.
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section V: CCPA Consumer Rights */}
            <div>
              <SectionHeader letter="V" title="Consumer Rights and Requests Under the CCPA" sectionId="ccpa-v" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  The CCPA gives consumers the right to request that we (1) disclose what Personal Information we collect, use, 
                  disclose, and sell, and (2) delete certain Personal Information that we have collected or maintained. You may 
                  submit these requests to us as described below, and we honor these rights where they apply.
                </p>

                <div className="space-y-6 my-8">
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl border-l-4 border-sky-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">1. Request to Know</h4>
                    <p className="mb-3">As a California resident, you have the right to request:</p>
                    <ol className="list-decimal ml-6 space-y-2">
                      <li>the specific pieces of Personal Information we have collected about you;</li>
                      <li>the categories of Personal Information we have collected about you;</li>
                      <li>the categories of sources from which the Personal Information is collected;</li>
                      <li>the categories of Personal Information about you that we have sold and the categories of third parties to whom the Personal Information was sold;</li>
                      <li>the categories of Personal Information about you that we disclosed for a business purpose;</li>
                      <li>the business or commercial purpose for collecting, disclosing, or selling Personal Information; and</li>
                      <li>the categories of third parties with whom we share Personal Information.</li>
                    </ol>
                    <p className="mt-3 italic">Our response will cover the 12-month period preceding our receipt of a verifiable request.</p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">2. Request to Delete</h4>
                    <p>
                      As a California resident, you have a right to request the erasure/deletion of certain Personal Information 
                      collected or maintained by us. We will delete your Personal Information from our records and direct any 
                      service providers to delete your Personal Information from their records.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">3. Submitting a Request</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Submission of Instructions:</h5>
                        <p>
                          You may submit a request to know or to delete by email to{" "}
                          <a href="mailto:support@graphura.in" className="text-sky-600 hover:text-sky-700 font-medium">
                            support@graphura.in
                          </a>{" "}
                          or by submitting a request via mail to Graphura Inc., Vistra (Delaware) Ltd, 3500 South Dupont Hwy, 
                          Dover, Kent, DE 19901.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Verification Process:</h5>
                        <p>
                          We are required by law to verify the identities of those who submit requests to know or to delete. 
                          We will verify your identity by matching the identifying information provided by you in the request 
                          to the Personal Information that we already maintain about you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">4. Authorized Agents</h4>
                    <p>
                      Authorized agents may submit requests via the methods identified in this Policy. If you use an authorized 
                      agent to submit a request, we may require you to: (1) provide the authorized agent with signed permission; 
                      (2) verify your identity directly with us; and (3) directly confirm with us that you provided the authorized 
                      agent permission to submit the request.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-xl border-l-4 border-indigo-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">5. Excessive Requests</h4>
                    <p>
                      If requests from a User are manifestly unfounded or excessive, in particular because of their repetitive 
                      character, we may either (1) charge a reasonable fee, or (2) refuse to act on the request and notify the 
                      User of the reason for refusing the request.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">6. CCPA Non-Discrimination</h4>
                    <p>
                      You have the right not to receive discriminatory treatment by us due to your exercise of the rights 
                      provided by the CCPA. We do not offer financial incentives and price or service differences, and we do 
                      not discriminate against Users/consumers for exercising their rights under the CCPA.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="text-center text-slate-600">
              <p className="text-sm">
                For any questions or concerns regarding this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@graphura.in" className="text-sky-600 hover:text-sky-700 font-medium">
                  support@graphura.in
                </a>
              </p>
              <p className="mt-4 text-xs text-slate-500">
                © 2026 Graphura India Private Limited. All rights reserved.
              </p>
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

export default PrivacyPolicy;



