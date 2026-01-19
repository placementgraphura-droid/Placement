import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  FileText, 
  MessageCircle, 
  Award, 
  Users, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import Navbar from '../WelcomePage/Navbar';
import Footer from '../WelcomePage/Footer';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    // General FAQs
    {
      id: 1,
      question: "What is Graphura ?",
      answer: "Graphura India Private Limited is a professional training and skill-development platform offering CV Building Courses and Interview Preparation Courses designed to enhance employability skills.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "general"
    },
    {
      id: 2,
      question: "Who can enroll in Graphura courses?",
      answer: "Students, interns, job seekers, and working professionals aiming to improve interview skills, resume quality, and professional communication can enroll.",
      icon: <Users className="w-5 h-5" />,
      category: "general"
    },
    {
      id: 4,
      question: "How will I receive course updates and access?",
      answer: "Once enrolled, you will receive a confirmation email, login access, session schedule, and WhatsApp/email notifications.",
      icon: <Award className="w-5 h-5" />,
      category: "course"
    },

    // Course Related FAQs
    {
      id: 5,
      question: "What is included in the CV Building Course (₹799)?",
      answer: "The CV Building Course includes 5 sessions, ATS-friendly resume creation, cover letter training, professional formatting, and one-on-one resume review.",
      icon: <FileText className="w-5 h-5" />,
      category: "course"
    },
    {
      id: 6,
      question: "What is included in the Interview Preparation Course (₹1299)?",
      answer: "This course offers 10 sessions, HR round practice, technical round guidance, mock interviews, personality development, and communication skills training.",
      icon: <Briefcase className="w-5 h-5" />,
      category: "course"
    },
    {
      id: 7,
      question: "What do I get in the Combo Course (₹1299)?",
      answer: "You receive both courses at a discounted price: 5 CV Building sessions and 10 Interview Preparation sessions, total 15 sessions and bonus templates.",
      icon: <Award className="w-5 h-5" />,
      category: "course"
    },

    // Payment FAQs
    {
      id: 8,
      question: "What payment methods do you support?",
      answer: "We accept UPI, Credit/Debit Cards, Net Banking, and digital wallets.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "payment"
    },
    {
      id: 9,
      question: "Is my payment information secure?",
      answer: "Yes. Payments are processed using PCI-DSS compliant gateways. Graphura does not store card or bank details.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "payment"
    },
    {
      id: 10,
      question: "Will I get an invoice?",
      answer: "Yes. An invoice is emailed automatically after successful payment.",
      icon: <FileText className="w-5 h-5" />,
      category: "payment"
    },
    {
      id: 11,
      question: "What if my payment fails but money is deducted?",
      answer: "It usually auto-reverses within 2–5 business days. If not, contact our support team with transaction details.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "payment"
    },

    // Refund FAQs
    {
      id: 12,
      question: "Can I get a refund after purchase?",
      answer: "Refunds follow our Refund Policy. Courses already accessed or partially completed are not eligible.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "refund"
    },
    {
      id: 13,
      question: "Can I transfer my course to someone else?",
      answer: "No. Courses are non-transferable.",
      icon: <Users className="w-5 h-5" />,
      category: "refund"
    },
    {
      id: 14,
      question: "What if I miss a session?",
      answer: "You will receive recording (if available), notes/materials, and option to attend the next batch subject to availability.",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "refund"
    },

    // Account FAQs
    {
      id: 15,
      question: "I can’t log in. What should I do?",
      answer: "You can reset your password, contact support, clear cookies/cache, or try another browser.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "account"
    },
    {
      id: 16,
      question: "I am not receiving emails. Why?",
      answer: "Please check Spam folder, Promotions tab, and whether you entered the correct email ID.",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "account"
    },
    {
      id: 17,
      question: "How can I change my profile details?",
      answer: "Go to My Account → Edit Profile and update your information.",
      icon: <Users className="w-5 h-5" />,
      category: "account"
    },

    // Privacy FAQs
    {
      id: 18,
      question: "How does Graphura handle my data?",
      answer: "Your data is protected under our Privacy Policy and is not sold to third parties.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "privacy"
    },
    {
      id: 19,
      question: "Do you use cookies?",
      answer: "Yes, cookies are used for improving user experience, analytics, and saving login sessions. You can manage cookies through browser settings.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "privacy"
    },

    // Support FAQs
    {
      id: 20,
      question: "How do I contact Graphura support?",
      answer: "You can reach us via Email: support@graphura.in, contact form on Help Page, during office hours 10 AM – 7 PM (Mon–Sat).",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "support"
    },
    {
      id: 21,
      question: "Do you offer guidance after the course ends?",
      answer: "Yes. Students receive doubt resolution, resume improvement support, and career guidance related to interviews and professional growth.",
      icon: <Award className="w-5 h-5" />,
      category: "support"
    },
    {
      id: 22,
      question: "Can I request personalized mentorship?",
      answer: "Yes, personalized mentorship is available on request for an additional fee.",
      icon: <Users className="w-5 h-5" />,
      category: "support"
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-[#D3E4ED] to-white p-4 md:p-8">
        <Navbar />

        <div className="max-w-6xl mt-20 mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#09435F] mb-4">
              Graphura Platform FAQ
            </h1>
            <p className="text-lg text-[#09435F]">
              Find answers to all your queries about Graphura courses and placement support
            </p>
          </header>

          {/* <div className="mb-8">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full p-4 border border-[#3188B1] rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={faq.id} className="rounded-xl shadow-md overflow-hidden">
                <button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-xl font-semibold text-[#09435F]">
                    {faq.question}
                  </h3>

                  {activeIndex === index ? <ChevronUp /> : <ChevronDown />}
                </button>

                {activeIndex === index && (
                  <div className="p-6 border-t border-[#3188B1]">
                    <p className="text-[#09435F]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="mt-12 text-center">
            <a href="mailto:support@graphura.in" className="text-[#3188B1] font-bold">
              Contact Support
            </a>
          </footer>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
