import React, { useState, useEffect } from "react";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";

const sections = [
  { id: "introduction", title: "Introduction", letter: "" },
  { id: "prohibited", title: "1. Guidelines for Acts and Content that are Prohibited", letter: "1" },
  { id: "reporting", title: "2. Reporting Tools", letter: "2" },
  { id: "tips", title: "Tips on Do's & Don'ts", letter: "3" },
  { id: "safety", title: "A. Keeping Yourself and Your Account Safe", letter: "A" },
  { id: "reporting-content", title: "B. Reporting Content", letter: "B" },
  { id: "posting", title: "C. Posting Content", letter: "C" },
];

const SectionHeader = ({ letter, title, sectionId }) => (
  <div className="scroll-mt-24" id={sectionId}>
    {letter && (
      <div className="inline-block px-4 py-1.5 bg-sky-50 rounded-full mb-4">
        <span className="text-sky-700 text-xs font-semibold uppercase tracking-wide">
          Section {letter}
        </span>
      </div>
    )}
    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
      {letter && <span className="text-sky-600">{letter}.</span>} {title}
    </h2>
  </div>
);

const InfoBox = ({ children, type = "info" }) => {
  const styles = {
    info: "bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500",
    success: "bg-emerald-50 border-l-4 border-emerald-500",
    warning: "bg-amber-50 border-l-4 border-amber-500",
    danger: "bg-red-50 border-l-4 border-red-500",
  };
  
  return (
    <div className={`${styles[type]} p-5 rounded-r-lg my-6`}>
      {children}
    </div>
  );
};

const UserGuidelines = () => {
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
            <span className="text-sky-300 text-sm font-medium">Community Guidelines</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4 tracking-tight">
            User Guidelines
          </h1>
          <p className="mt-4 text-blue-900 max-w-2xl mx-auto text-lg leading-relaxed">
            Creating a safe and respectful learning environment for all Graphura users.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-900">
              Ensuring a positive experience for everyone
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
              <h2 className="text-lg font-semibold text-indigo-900">Guidelines</h2>
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
            <div>
              <SectionHeader title="Introduction" sectionId="introduction" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  We at Graphura strive to ensure that our Users have a conducive learning and teaching environment, which includes interactions between the Users to allow the flow of knowledge and exchange of ideas.
                </p>
                <p>
                  Keeping the interactive nature of the Platform in mind it is essential to ensure that the Platform is not misused in anyway that would warrant any User having a less than amazing experience and following the guidelines we have given below would be a great way to do that. You as a User may come cross content that you feel is inappropriate, and we have provided means by which you can report or flag such content, but do keep in mind that the reporting option should be used judiciously and if you have any doubts, i.e. if the content is inappropriate please go through the guidelines to make an informed decision.
                </p>
                <InfoBox type="info">
                  <p className="text-slate-800 font-medium">
                    These guidelines are to be read along with all the other policies on the Graphura platform including but not limited to our Terms and Conditions and Privacy Policy.
                  </p>
                </InfoBox>
              </div>
            </div>

            {/* Section 1: Guidelines for Prohibited Acts */}
            <div>
              <SectionHeader letter="1" title="Guidelines for Acts and Content that are Prohibited" sectionId="prohibited" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                
                <div className="space-y-6">
                  {/* Harmful or dangerous content */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Harmful or dangerous content:</h3>
                    <p>
                      We at Graphura believe the Platform is a safe space for learners and educators alike and would like your help in ensuring that it remains so. Keeping this in mind any content which incites or promotes violence that may cause physical or emotional harm or endanger the safety of any individual is expressly prohibited on the Platform.
                    </p>
                    <p className="mt-3">
                      Content that requires references to harmful or dangerous acts solely for educational purposes are allowed. The sale and promotion of any regulated or illegal goods is not allowed. The Platform is to be used only for the permitted uses as detailed under the Terms and Conditions.
                    </p>
                  </div>

                  {/* Hateful content */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Hateful content:</h3>
                    <p>
                      We realise that there may be instances when there are exchange of ideas and opinions which is essential in the learning process, while we agree that individuals have the right to voice their opinion, we do not encourage or tolerate any hate speech. Hate speech is any content where the sole objective is inciting hatred against specific individuals or groups with respect to but not limited to race or ethnic origin, country caste, religion, disability, gender, age, sexual orientation/gender identity etc.
                    </p>
                  </div>

                  {/* Violent and graphic content */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Violent and graphic content:</h3>
                    <p>
                      Graphura is an educational Platform and the content uploaded is restricted to educational content alone, content that is violent or graphic is prohibited. You are requested to ensure that if there are references being made to violent or graphic situations of instances, it should solely be for education purposes.
                    </p>
                    <p className="mt-3">
                      Content whose sole objective is to sensationalise, shock or disturb individuals is not allowed. Graphura does not allow any content related to terrorism, such as content that promotes terrorist acts or incites violence, is not to be uploaded on the Platform in any manner.
                    </p>
                  </div>

                  {/* Harassment and bullying */}
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-xl border-l-4 border-rose-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Harassment and bullying:</h3>
                    <p>
                      Graphura Platform is used by many users on a daily basis and it is important to be respectful and kind to your fellow users, we do not tolerate any form of harassment or bullying on the Platform and strive to keep the Platform a safe space to foster learning.
                    </p>
                    <p className="mt-3">
                      Harassment in this case would include but not be limited to abusive videos, comments, messages, revealing someone's personal information, including sensitive personally identifiable information of individuals, content or comments uploaded in order to humiliate someone, sexual harassment or sexual bullying in any form.
                    </p>
                  </div>

                  {/* Spam */}
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border-l-4 border-slate-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Spam:</h3>
                    <p>
                      Posting untargeted, unwanted and repetitive content in lessons, comments of messages with an intention to spam the Platform and to drive traffic from the Platform to other third-party sites is in direct violation of our Terms and Conditions. Posting links to external websites with malware and other prohibited sites is not allowed.
                    </p>
                    <p className="mt-3">
                      The use or launch of any automated system in any manner that sends more request messages to Graphura's servers in a given period of time that is more than a human can reasonably produce using a conventional on-line web browser is prohibited and you can take a look at our Terms and Conditions for more details on the same including exceptions to this prohibition to public search engines.
                    </p>
                  </div>

                  {/* Misleading metadata */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Misleading metadata:</h3>
                    <p>
                      Misuse of title, description, tags, thumbnail and bios and other features which constitutes the Metadata on the Platform is not allowed. Using these features to trick or circumvent our search algorithms is prohibited.
                    </p>
                  </div>

                  {/* Scams */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-400">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Scams:</h3>
                    <p>
                      Any content uploaded/posted in order to trick others for their own financial gain is not allowed and we at Graphura do not tolerate any practices of extortion or blackmail either.
                    </p>
                  </div>

                  {/* Copyright */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Copyright:</h3>
                    <p>
                      Please refer to our copyright policy provided in our Terms and Conditions to know more about proprietary information relating to User Content and Graphura Content.
                    </p>
                  </div>

                  {/* Privacy violation */}
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Privacy violation:</h3>
                    <p>
                      Kindly refer to our Privacy Policy given here to know how to protect your privacy and respect the privacy of other users. If you believe that your privacy has been violated is any manner where a user has knowingly or unknowingly disclosed any information on the Platform be sure to reach out to the User and if that is not possible, please feel free to approach us at anytime so we can take the necessary steps to remove the content.
                    </p>
                  </div>

                  {/* Impersonation */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border-l-4 border-violet-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Impersonation:</h3>
                    <p>
                      Impersonating another person is not permitted while using the Graphura Platform. In this case impersonation would mean the intention to cause confusion regarding who the real person is by pretending to be them. This can be done by means of using names, image, documents, certificates etc. not belonging to you or not used to identify you.
                    </p>
                    <p className="mt-3">
                      Pretending to be a company, institute, group etc.by using their logo, brand name or any distinguishing mark would also amount to impersonation and could also be a potential trademark infringement.
                    </p>
                  </div>

                  {/* Interaction with Graphura */}
                  <div className="bg-gradient-to-r from-cyan-50 to-sky-50 p-6 rounded-xl border-l-4 border-cyan-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Interaction with Graphura:</h3>
                    <p>
                      At Graphura offices we treat each other with respect and have a healthy and supportive work environment. We believe in hands on interaction with our users to help them navigate and gain the maximum benefit from the platform.
                    </p>
                    <p className="mt-3">
                      Should you find yourselves interacting with any person from Graphura please ensure that you maintain the same decorum you would while using this Platform. We do not encourage any communication with Graphura employee of staff that is hateful, abusive or sexually suggestive in any manner.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Reporting Tools */}
            <div>
              <SectionHeader letter="2" title="Reporting Tools" sectionId="reporting" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
                  <p>
                    We have reporting tools available on the platform where you can report any content that you believe falls under the ambit of any of the prohibited acts, violative of any intellectual property rights or spam. The report option is made available for the videos as well as the comments, please ensure that you are certain that there is an issue before you report and do not make false complaints or allegations.
                  </p>
                  <div className="mt-4 p-4 bg-white/50 rounded-lg">
                    <p className="font-semibold text-slate-900 mb-2">Contact for Additional Support:</p>
                    <a href="mailto:support@graphura.in" className="text-emerald-600 hover:text-emerald-700 font-medium">
                     support@graphura.in
                    </a>
                    <p className="mt-2 text-sm text-slate-600">
                      To ensure that the Platform remains a safe learning space we suggest you use the in-built reporting tools made available.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Tips on Do's & Don'ts */}
            <div>
              <SectionHeader letter="3" title="Tips on Do's & Don'ts" sectionId="tips" />
              <div className="prose prose-lg max-w-none space-y-4 text-slate-700">
                <p>
                  Here are a few tips from us on how to use the platform in a safe manner:
                </p>
              </div>
            </div>

            {/* Section A: Keeping Yourself Safe */}
            <div>
              <SectionHeader letter="A" title="Keeping Yourself and Your Account Safe" sectionId="safety" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                <InfoBox type="warning">
                  <p className="text-slate-800 font-medium">
                    Keep your log-in credentials a secret and do not reveal your password or ID to anyone.
                  </p>
                </InfoBox>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Create a strong password to ensure that your account is not compromised:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Your password should be at least eight characters in length, combine numbers and letters, and not include commonly used words.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Select a word or acronym and insert numbers between some of the letters.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Include Special characters.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Mix capital and lowercase letters.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p>Don't reuse passwords associated with any other type of account.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-slate-900">Log out of all devices</p>
                    <p className="mt-1">to ensure that your log-in credentials are secure.</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-slate-900">Register with our phone number</p>
                    <p className="mt-1">in order to ensure you have a back up in case you forget your login details.</p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-xl border-l-4 border-red-500">
                    <p className="font-semibold text-slate-900">Do not reveal any personal information</p>
                    <p className="mt-1">about yourself to anyone online, additionally do not meet someone you have a conversation with online in person, this could be a potentially dangerous act and you might be compromising your safety.</p>
                  </div>

                  <InfoBox type="danger">
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900">Age Restriction Notice:</p>
                      <p>
                        If you are below the age of 18, and want to use the platform, a parent or guardian can create an account on your behalf. Persons below the age of 18 are not allowed to have individual account without the consent of a parent or guardian.
                      </p>
                    </div>
                  </InfoBox>
                </div>
              </div>
            </div>

            {/* Section B: Reporting Content */}
            <div>
              <SectionHeader letter="B" title="Reporting Content" sectionId="reporting-content" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                
                <div className="space-y-6">
                  {/* Trademark Infringement */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-l-4 border-amber-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Trademark Infringement:</h3>
                    <p>
                      If you have content on your profile or video that would confuse persons as to who the video or content belongs to or leads users to believe that you have been endorsed or sponsored by another person, then the trademark of such person might have been infringed.
                    </p>
                    <p className="mt-3 font-semibold text-slate-900">
                      If we receive any complaints or reports regarding the same, we may remove the content, if supported with relevant evidence.
                    </p>
                  </div>

                  {/* Intellectual Property Rights */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-l-4 border-indigo-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Intellectual Property Rights:</h3>
                    <p>
                      If you are a trademark or copyright owner and believe that your intellectual property right is being infringed, please note that you have the option of reporting the same. However, Graphura is not at a position where they can mediate such disputes and we disclaim any liability for the same.
                    </p>
                    <p className="mt-3">
                      If we receive an infringement complaint that is genuine, we may remove the content in question and serve a warning to the alleged infringer. We also suggest that before reporting the issue, both parties try to solve the disputes directly with the user who posted the content.
                    </p>
                  </div>

                  {/* Inappropriate Content */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Inappropriate Content:</h3>
                    <p>
                      If you see any content that you feel is inappropriate and violates the guidelines given here, please report the content.
                    </p>
                  </div>

                  {/* Privacy Violation */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Privacy Violation:</h3>
                    <p>
                      If you encounter a video that you believe violates the privacy of an individual or violates your privacy, please report the same, we shall initiate action accordingly as we have a strict privacy policy. If you report any content for violation of privacy, the content will be removed only if the information, images or date is clearly identifiable.
                    </p>
                  </div>

                  {/* Harassment */}
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-xl border-l-4 border-rose-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Harassment:</h3>
                    <p>
                      In the event a fellow user harasses you or you believe that someone is being harassed on the platform you can report the user or content. You may even write to us at <a href="mailto:support@graphura.in" className="text-rose-600 hover:text-rose-700 font-medium">support@graphura.in</a> for any further help or assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Posting Content */}
            <div>
              <SectionHeader letter="C" title="Posting Content" sectionId="posting" />
              <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
                
                <div className="space-y-6">
                  {/* Content Accuracy */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border-l-4 border-emerald-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Content Accuracy and Ownership:</h3>
                    <p>
                      When posting videos or lessons on the platform always ensure that the information is correct, the content itself does not belong to a third party and that it is free from any of the prohibited acts in these guidelines.
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Protect Personal Information:</h3>
                    <p>
                      Always ensure that the personal information of a person or even your own personally identifiable information is not disclosed while posting any content on the platform, this would be in violation of our Privacy Policy.
                    </p>
                  </div>

                  {/* Personal Responsibility */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Personal Responsibility:</h3>
                    <p>
                      You will be personally held responsible for your actions on the Platform, thus please ensure that any content that you post including comments does not hurt the sentiments of any group or individual and cannot be construed as being harassment or bullying.
                    </p>
                  </div>
                </div>

                <InfoBox type="success">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-900 mb-2">Thank you for helping us keep Graphura safe!</p>
                    <p className="text-slate-700">
                      By following these guidelines, you contribute to creating a positive and respectful learning environment for all users.
                    </p>
                  </div>
                </InfoBox>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="text-center text-slate-600">
                <p className="text-sm">
                  For immediate assistance with any guideline violations, please contact us at{" "}
                  <a href="mailto:support@graphura.in" className="text-sky-600 hover:text-sky-700 font-medium">
                    support@graphura.in
                  </a>
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  © 2026 Graphura India Private Limited. All rights reserved.
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

export default UserGuidelines;