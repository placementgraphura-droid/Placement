import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, FileText, MessageCircle, Briefcase, Award, Users, ShieldCheck, HelpCircle } from 'lucide-react';
import Navbar from '../WelcomePage/Navbar';
import Footer from '../WelcomePage/Footer';


const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      id: 1,
      question: "What are the Graphura Placement Modules?",
      answer: "The Graphura Placement Modules are structured career-preparation modules designed to make candidates job-ready through CV building, interview preparation, and access to verified placement opportunities.",
      icon: <Briefcase className="w-5 h-5" />,
      category: "general"
    },
    {
      id: 2,
      question: "Who can enroll in these placement modules?",
      answer: "The modules are open to college students, fresh graduates, working professionals, and individuals looking to transition into new roles with proper placement support.",
      icon: <Users className="w-5 h-5" />,
      category: "eligibility"
    },
    {
      id: 3,
      question: "What does the CV preparation module include?",
      answer: "The CV preparation module covers professional resume structuring, ATS-friendly formatting, role-specific content optimization, and personalized improvement suggestions.",
      icon: <FileText className="w-5 h-5" />,
      category: "modules"
    },
    {
      id: 4,
      question: "What is included in the interview preparation module?",
      answer: "This module focuses on technical interview guidance, HR round preparation, communication skills, mock interview practice, and real interview strategies used by companies.",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "modules"
    },
    {
      id: 5,
      question: "Can I enroll in multiple placement modules?",
      answer: "Yes, candidates can choose individual modules or enroll in multiple modules to get complete placement readiness support.",
      icon: <Users className="w-5 h-5" />,
      category: "enrollment"
    },
    {
      id: 6,
      question: "When do placement opportunities become available?",
      answer: "Placement opportunities are shared after completing the required preparation modules to ensure candidates are confident and interview-ready.",
      icon: <Award className="w-5 h-5" />,
      category: "placement"
    },
    {
      id: 7,
      question: "Are there any placement opportunities available without using credits?",
      answer: "Yes, a limited number of placement opportunities are available without using credits, and these are exclusively accessible to Graphura interns.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "placement"
    },
    {
      id: 8,
      question: "What are placement credits and how do they work?",
      answer: "Placement credits allow candidates to apply to a defined number of companies. Each application consumes one credit.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "credits"
    },
    {
      id: 9,
      question: "What types of companies are included in the placement modules?",
      answer: "Companies are categorized into non-blue, blue, and super blue companies based on role complexity, experience expectations, and career growth opportunities.",
      icon: <Briefcase className="w-5 h-5" />,
      category: "companies"
    },
    {
      id: 10,
      question: "Can candidates choose which companies to apply to?",
      answer: "Yes, candidates can select companies within their eligible category based on available placement credits.",
      icon: <Briefcase className="w-5 h-5" />,
      category: "companies"
    },
    {
      id: 11,
      question: "Do these placement modules guarantee a job?",
      answer: "The modules do not guarantee placement, but they significantly improve employability by providing strong preparation and access to genuine opportunities.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "general"
    },
    {
      id: 12,
      question: "Are the placement modules suitable for beginners?",
      answer: "Yes, the modules are designed to support beginners as well as candidates with prior experience.",
      icon: <Users className="w-5 h-5" />,
      category: "eligibility"
    },
    {
      id: 13,
      question: "How are Graphura Placement Modules different from other platforms?",
      answer: "Graphura focuses on structured preparation modules, credit-based applications, verified companies, and continuous candidate support.",
      icon: <ShieldCheck className="w-5 h-5" />,
      category: "general"
    },
    {
      id: 14,
      question: "Will I receive guidance during the placement process?",
      answer: "Yes, candidates receive ongoing guidance, updates on opportunities, and support throughout the application and interview journey.",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "support"
    },
    {
      id: 15,
      question: "Do Graphura interns receive special benefits?",
      answer: "Yes, Graphura interns receive exclusive benefits, including access to selected placement opportunities without using placement credits.",
      icon: <Award className="w-5 h-5" />,
      category: "interns"
    },
    {
      id: 16,
      question: "Are the Graphura Placement Modules free or paid?",
      answer: "The Graphura Placement Modules are paid learning modules that include structured preparation, professional guidance, and access to placement opportunities. Enrollment requires purchasing the selected module.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "general"
    }
  ];

  const [selectedCategory] = useState('all');

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    general: "bg-[#D3E4ED] text-[#09435F]",
    modules: "bg-[#3188B1] text-white",
    placement: "bg-[#09435F] text-white",
    credits: "bg-[#D3E4ED] text-[#09435F]",
    companies: "bg-[#3188B1] text-white",
    eligibility: "bg-[#09435F] text-white",
    enrollment: "bg-[#D3E4ED] text-[#09435F]",
    support: "bg-[#3188B1] text-white",
    interns: "bg-[#09435F] text-white"
  };

  return (



    <div>
    <div className="min-h-screen bg-gradient-to-b from-[#D3E4ED] to-white p-4 md:p-8">
            <Navbar />
      <div className="max-w-6xl mt-20 mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#09435F] mb-4">
            Graphura Placement Modules FAQ
          </h1>
          <p className="text-lg md:text-xl text-[#09435F] max-w-3xl mx-auto">
            Find answers to commonly asked questions about our structured career-preparation modules
          </p>
        </header>
        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-lg' : 'shadow-md'}`}
                style={{
                  backgroundColor: activeIndex === index ? '#FFFFFF' : '#D3E4ED',
                  border: activeIndex === index ? '2px solid #3188B1' : '2px solid transparent'
                }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${categoryColors[faq.category] || 'bg-[#3188B1] text-white'}`}>
                      {faq.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#09435F]">{faq.question}</h3>
                      <div className="mt-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColors[faq.category] || 'bg-[#3188B1] text-white'}`}>
                          {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {activeIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-[#3188B1]" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#3188B1]" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 ml-14 border-t border-[#3188B1] pt-4">
                    <p className="text-[#09435F] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <HelpCircle className="w-16 h-16 text-[#3188B1] mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-[#09435F] mb-2">No FAQs Found</h3>
              <p className="text-[#09435F]">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>


        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#3188B1] text-center">
          <p className="text-[#09435F]">
            Still have questions? <a href="mailto:support@graphura.com" className="text-[#3188B1] font-semibold hover:underline">Contact our support team</a>
          </p>
          <p className="text-sm text-[#09435F] mt-4">
            © {new Date().getFullYear()} Graphura Placement Modules. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
      <Footer />
      </div>
    
  );
};

export default FAQPage;