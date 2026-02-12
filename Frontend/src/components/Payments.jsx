import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [activeCategory, setActiveCategory] = useState('job');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPlans, setCurrentPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobCredits, setJobCredits] = useState(0);
  const [learningAccess, setLearningAccess] = useState({
    hasCVCourse: false,
    hasInterviewCourse: false,
    hasCombo: false
  });

  // Job Packages configuration with original prices for visual discount strategy
  const jobPlans = [
    {
      id: 'silver',
      name: 'SILVER',
      price: 1,
      originalPrice: 199,
      discountPercentage: 99,
      duration: 'One-time purchase',
      packageType: 'Silver',
      category: 'JOB_PACKAGE',
      maxPackageLPA: 5,
      creditsGiven: 2,
      features: [
        '2 job application credits',
        'Apply for jobs up to 5 LPA',
        'Basic job search access',
        'Email support'
      ],
      popular: false,
      tag: 'LIMITED TIME OFFER'
    },
    {
      id: 'non_blue',
      name: 'NON-BLUE',
      price: 2199,
      originalPrice: 2999,
      discountPercentage: 27,
      duration: 'One-time purchase',
      packageType: 'NON_BLUE',
      category: 'JOB_PACKAGE',
      maxPackageLPA: 5,
      creditsGiven: 4,
      features: [
        '4 job application credits',
        'Apply for 5 LPA salary package',
        'Priority job notifications',
        'Resume analytics',
        'Email & chat support'
      ],
      popular: true,
      tag: 'MOST POPULAR'
    },
    {
      id: 'blue',
      name: 'BLUE',
      price: 2999,
      originalPrice: 3999,
      discountPercentage: 25,
      duration: 'One-time purchase',
      packageType: 'BLUE',
      category: 'JOB_PACKAGE',
      maxPackageLPA: 10,
      creditsGiven: 6,
      features: [
        '6 job application credits',
        'Apply for 10 LPA salary package',
        'Early access to job postings',
        'Career counseling session',
        'Priority support'
      ],
      popular: false,
      tag: 'BEST VALUE'
    },
    {
      id: 'super_blue',
      name: 'SUPER BLUE',
      price: 3999,
      originalPrice: 5999,
      discountPercentage: 33,
      duration: 'One-time purchase',
      packageType: 'SUPER_BLUE',
      category: 'JOB_PACKAGE',
      maxPackageLPA: 50,
      creditsGiven: 8,
      features: [
        '8 job application credits',
        'Apply for any salary package',
        'Guaranteed interview calls',
        'Personal career mentor',
        '24/7 priority support',
        'Mock interview sessions'
      ],
      popular: false,
      tag: 'PREMIUM'
    }
  ];

  // Learning Courses configuration with original prices
  const learningPlans = [
    {
      id: 'cv_building',
      name: 'Resume Building Masterclass',
      price: 499,
      originalPrice: 999,
      discountPercentage: 50,
      duration: 'Lifetime Access',
      courseType: 'Resume_BUILDING',
      category: 'COURSE',
      totalSessions: 5,
      liveSessions: 2,
      recordedSessions: 3,
      features: [
        'Professional Resume Template',
        'ATS Optimization Guide',
        "5 Modules",
        "Personalize Feedback",
        'LinkedIn Profile Review',
      ],
      popular: false,
      tag: 'BEGINNER FRIENDLY'
    },
    {
      id: 'interview_prep',
      name: 'Interview Prep Pro',
      price: 999,
      originalPrice: 1999,
      discountPercentage: 50,
      duration: 'Lifetime Access',
      courseType: 'INTERVIEW_PREP',
      category: 'COURSE',
      totalSessions: 10,
      liveSessions: 5,
      recordedSessions: 5,
      features: [
        '50+ Common Interview Questions',
        '5 Live Mock Interview Sessions',
        'Company-Specific Interview Guides',
        'Technical Assessment Practice',
        'Body Language & Communication Tips',
        'Negotiation Strategy Guide'
      ],
      popular: true,
      tag: 'MOST POPULAR'
    },
    {
      id: 'combo',
      name: 'Career Launchpad (COMBO)',
      price: 1299,
      originalPrice: 2999,
      discountPercentage: 57,
      duration: 'Lifetime Access',
      courseType: 'COMBO',
      category: 'COURSE',
      totalSessions: 15,
      liveSessions: 7,
      recordedSessions: 8,
      features: [
        'Everything in Resume Building',
        'Everything in Interview Prep',
        'Personal Career Roadmap',
        'Q&A Sessions',
        'Job Referral Program',
        'Priority Placement Support'
      ],
      popular: false,
      tag: 'ULTIMATE BUNDLE'
    }
  ];

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    fetchPaymentHistory();
    fetchUserStatus();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.get('/api/payments/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPaymentHistory(response.data.paymentHistory);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.get('/api/payments/current-plan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const { jobCredits, purchasedCourses, activePlans } = response.data;
        setJobCredits(jobCredits || 0);

        const hasCVCourse = purchasedCourses?.some(course =>
          course.courseType === 'Resume_BUILDING'
        );
        const hasInterviewCourse = purchasedCourses?.some(course =>
          course.courseType === 'INTERVIEW_PREP'
        );
        const hasCombo = purchasedCourses?.some(course =>
          course.courseType === 'COMBO'
        );

        setLearningAccess({
          hasCVCourse,
          hasInterviewCourse,
          hasCombo
        });

        setCurrentPlans(activePlans || []);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const latestJobPackage = React.useMemo(() => {
    const jobPackages = currentPlans
      .filter(p => p.purchaseCategory === 'JOB_PACKAGE' && p.paymentStatus === 'SUCCESS')
      .sort((a, b) => new Date(a.purchasedAt) - new Date(b.purchasedAt));
    return jobPackages.length > 0
      ? jobPackages[jobPackages.length - 1]
      : null;
  }, [currentPlans]);

  const latestCourse = React.useMemo(() => {
    const courses = currentPlans
      .filter(p => p.purchaseCategory === 'COURSE' && p.paymentStatus === 'SUCCESS')
      .sort((a, b) => new Date(a.purchasedAt) - new Date(b.purchasedAt));
    return courses.length > 0
      ? courses[courses.length - 1]
      : null;
  }, [currentPlans]);

  const handlePurchase = async (plan) => {
    try {
      setLoading(true);
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        return;
      }

      const token = localStorage.getItem('interToken');
      const paymentData = {
        planId: plan.id,
        purchaseCategory: plan.category,
        amount: plan.price * 100,
      };

      if (plan.category === 'JOB_PACKAGE') {
        paymentData.packageType = plan.packageType;
        paymentData.creditsGiven = plan.creditsGiven;
        paymentData.maxPackageLPA = plan.maxPackageLPA;
      } else if (plan.category === 'COURSE') {
        paymentData.courseType = plan.courseType;
        paymentData.totalSessions = plan.totalSessions;
        paymentData.liveSessions = plan.liveSessions;
        paymentData.recordedSessions = plan.recordedSessions;
      }

      const { data } = await axios.post("/api/payments/purchase",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        alert(data.message || "Failed to create payment order");
        return;
      }

      let description = '';
      if (plan.category === 'JOB_PACKAGE') {
        description = `${plan.name} Package - ${plan.creditsGiven} Job Credits`;
      } else {
        description = `${plan.name} - ${plan.totalSessions} Sessions`;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Graphura",
        description: description,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: data.orderData
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.success) {
              let successMessage = '';
              if (plan.category === 'JOB_PACKAGE') {
                successMessage = `Payment successful! ${plan.creditsGiven} job credits added to your account.`;
                if (latestJobPackage?.jobPackageDetails?.packageType === plan.packageType) {
                  successMessage += ' This is now your current package.';
                } else {
                  successMessage += ' This is now your current package (replacing previous one).';
                }
              } else {
                successMessage = `Payment successful! You now have access to ${plan.name}.`;
              }

              alert(successMessage);
              fetchUserStatus();
              fetchPaymentHistory();
            } else {
              alert(verifyRes.data.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Error verifying payment. Please contact support.");
          }
        },
        prefill: {
          name: data.userName || "",
          email: data.userEmail || "",
          contact: data.userPhone || ""
        },
        theme: {
          color: "#0E5C7E",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Purchase error:", error);
      alert(`Error purchasing: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'SUCCESS': { color: 'green', text: 'Success' },
      'PENDING': { color: 'yellow', text: 'Pending' },
      'FAILED': { color: 'red', text: 'Failed' }
    };
    const config = statusConfig[status] || { color: 'gray', text: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 border border-${config.color}-200`}>
        {config.text}
      </span>
    );
  };

  const getPurchaseTypeBadge = (category) => {
    const config = {
      'JOB_PACKAGE': { color: 'blue', text: 'Job Package' },
      'COURSE': { color: 'purple', text: 'Course' }
    };
    const categoryConfig = config[category] || { color: 'gray', text: category };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${categoryConfig.color}-100 text-${categoryConfig.color}-800 border border-${categoryConfig.color}-200`}>
        {categoryConfig.text}
      </span>
    );
  };

  const isCoursePurchased = (courseType) => {
    if (courseType === 'RESUME_BUILDING') return learningAccess.hasCVCourse;
    if (courseType === 'INTERVIEW_PREP') return learningAccess.hasInterviewCourse;
    if (courseType === 'COMBO') return learningAccess.hasCombo;
    return false;
  };

  const renderCurrentStatus = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Job Package Status */}
        <div className="bg-white p-6 rounded-xl border border-[#7EC9E8]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0A2E40]">Current Job Package</h3>
            {latestJobPackage && (
              <span className="text-2xl font-bold text-[#0E5C7E]">
                {latestJobPackage.jobPackageDetails?.creditsRemaining || 0}
              </span>
            )}
          </div>
          
          {latestJobPackage ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] text-white">
                  {latestJobPackage.jobPackageDetails?.packageType}
                </span>
                <span className="ml-2 text-xs text-[#0E5C7E]/80">
                  Purchased {formatDate(latestJobPackage.purchasedAt)}
                </span>
              </div>

              <div className="text-sm text-[#0A2E40] space-y-1">
                <p className="flex items-center">
                  <span className="w-24 font-medium">Salary Limit:</span>
                  <span>{latestJobPackage.jobPackageDetails?.maxPackageLPA || 'Unlimited'} LPA</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24 font-medium">Credits Given:</span>
                  <span>{latestJobPackage.jobPackageDetails?.creditsGiven || 0}</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24 font-medium">Credits Left:</span>
                  <span className="font-semibold">{latestJobPackage.jobPackageDetails?.creditsRemaining || 0}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#000000]">No active job package</p>
              <p className="text-sm text-[#0E5C7E]/70 mt-1">Purchase a package to get started</p>
            </div>
          )}
        </div>

        {/* Learning Courses Status */}
        <div className="bg-white p-6 rounded-xl border border-[#7EC9E8]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0A2E40]">Learning Access</h3>
            <span className="text-2xl font-bold text-[#4FB0DA]">
              {Object.values(learningAccess).filter(Boolean).length}
            </span>
          </div>
          
          <div className="space-y-3">
            {latestCourse ? (
              <div>
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#4FB0DA]/20 to-[#7EC9E8]/20 text-[#0E5C7E] border border-[#4FB0DA]/30">
                    {latestCourse.courseDetails?.courseType === 'RESUME_BUILDING' ? 'Resume Building' :
                     latestCourse.courseDetails?.courseType === 'INTERVIEW_PREP' ? 'Interview Prep' :
                     'Career Launchpad'}
                  </span>
                  <span className="ml-2 text-xs text-[#0E5C7E]/80">
                    Purchased {formatDate(latestCourse.purchasedAt)}
                  </span>
                </div>
                <p className="text-sm text-[#0E5C7E]">
                  {latestCourse.courseDetails?.totalSessions || 0} sessions • 
                  {latestCourse.courseDetails?.liveSessions || 0} live
                </p>
              </div>
            ) : (
              <p className="text-[#0E5C7E]">No active courses</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {learningAccess.hasCVCourse && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Resume Building
                </span>
              )}
              {learningAccess.hasInterviewCourse && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#4FB0DA]/20 to-[#7EC9E8]/20 text-[#0E5C7E] border border-[#4FB0DA]/30">
                  Interview Prep
                </span>
              )}
              {learningAccess.hasCombo && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  COMBO Package
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlansTab = () => {
    const plans = activeCategory === 'job' ? jobPlans : learningPlans;

    return (
      <div>
       {/* CATEGORY TOGGLE (PURPLE) */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex rounded-xl border border-purple-300/40 p-1 bg-purple-50/40">
                  <button
                    onClick={() => setActiveCategory('job')}
                    className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition ${
                      activeCategory === 'job'
                        ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow'
                        : 'text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Job Packages
                  </button>

          <button
                     onClick={() => setActiveCategory('learning')}
                     className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition ${
                       activeCategory === 'learning'
                         ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow'
                         : 'text-purple-700 hover:bg-purple-100'
                     }`}
                   >
                     Learning Courses
                   </button>
                 </div>
               </div>


        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0A2E40] mb-2">
            {activeCategory === 'job' ? 'Choose Your Job Package' : 'Select Learning Course'}
          </h2>
          <p className="text-[#0E5C7E]">
            {activeCategory === 'job'
              ? 'Purchase credits to apply for internships and jobs. Latest purchase becomes current package.'
              : 'Enroll in courses to enhance your skills and career prospects'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          {plans.map((plan) => {
            const isCurrentPlan = activeCategory === 'job' 
              ? latestJobPackage?.jobPackageDetails?.packageType === plan.packageType
              : latestCourse?.courseDetails?.courseType === plan.courseType;
            
            const isCoursePurchasedCheck = activeCategory === 'learning' 
              ? isCoursePurchased(plan.courseType)
              : false;

             return (
                        <div
                          key={plan.id}
                          className={`relative rounded-3xl p-6 pt-10 transition-all duration-300 flex flex-col ${

                            plan.popular
                              ? 'bg-gradient-to-b from-purple-600 to-violet-600 text-white shadow-2xl scale-105'
                              : 'bg-white border border-purple-100 shadow-md hover:shadow-xl'
                          }`}
                        >

                {/* TAG */}
                              {/* TOP LABEL */}
                            {/* TOP LABEL */}
                            {plan.tag && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                <span
                                  className={`px-5 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap
                                    ${
                                      plan.popular
                                        ? 'bg-white text-purple-600'
                                        : 'bg-gradient-to-r from-purple-600 to-violet-500 text-white'
                                    }`}
                                >
                                  {plan.tag}
                                </span>
                              </div>
                            )}



                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-3 transform">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
                      ✓ Current
                    </span>
                  </div>
                )}

                {/* Course Purchased Badge */}
                {activeCategory === 'learning' && isCoursePurchasedCheck && !isCurrentPlan && (
                  <div className="absolute -top-3 right-3 transform">
                    <span className="bg-gradient-to-r from-[#4FB0DA] to-[#7EC9E8] text-white px-3 py-1 rounded-full text-xs font-medium shadow">
                      ✓ Purchased
                    </span>
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                   <h3 className={`text-xl font-bold text-center mb-4 ${
                                    plan.popular ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {plan.name}
                                  </h3>
                  
                  {/* Pricing with Discount */}
                      <div className="text-center mb-5">
                                   <div className={`text-4xl font-bold ${
                                     plan.popular ? 'text-white' : 'text-gray-900'
                                   }`}>
                                     {formatCurrency(plan.price)}
                                   </div>

                                   <div className="flex justify-center items-center gap-2 mt-1">
                                     <span className={`text-sm line-through ${
                                       plan.popular ? 'text-white/70' : 'text-gray-400'
                                     }`}>
                                       {formatCurrency(plan.originalPrice)}
                                     </span>

                                     <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                       {plan.discountPercentage}% OFF
                                     </span>
                                   </div>
                                 </div>

                  {activeCategory === 'job' ? (
                     <div className={`text-center font-semibold mb-6 ${
                                      plan.popular ? 'text-white' : 'text-purple-700'
                                    }`}>
                      {plan.creditsGiven} Job Credits
                      {plan.maxPackageLPA && (
                        <div className="text-sm opacity-80">
                          Up to {plan.maxPackageLPA} LPA
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[#000000] font-semibold">
                      {plan.totalSessions} Total Sessions
                    </div>
                  )}
                </div>

                  <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                       <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                                              plan.popular
                                                ? 'bg-white text-purple-600'
                                                : 'bg-purple-100 text-purple-600'
                                            }`}>
                                              ✓
                                            </span>
                       <span className={`text-sm ${
                                             plan.popular ? 'text-white' : 'text-gray-700'
                                           }`}>
                                             {feature}
                                           </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={loading}
                  className={`mt-auto w-full py-3 px-4 rounded-xl font-semibold transition-all shadow-md

                    ${loading
                      ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600'
                      : isCurrentPlan
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : plan.packageType === 'Silver'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                          : plan.packageType === 'NON_BLUE'
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#0A2E40] hover:from-yellow-500 hover:to-yellow-400'
                            : plan.packageType === 'BLUE'
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                              : plan.packageType === 'SUPER_BLUE'
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'


                    }`}
                >
                  {loading
                    ? 'Processing...'
                    : isCurrentPlan
                      ? 'Current Package'
                      : 'Purchase Now'}
                </button>

              </div>
            );
          })}
        </div>

{/* Important Instructions */}
<div className="p-5 bg-[#EEEFFF] rounded-xl">
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <span className="text-2xl"></span>
    </div>

    <div className="ml-4">
      <h3 className="text-lg font-bold text-[#0A2E40] mb-3">
        Important Instructions – Please Read Carefully
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-[#0A2E40]">

        {/* Package Info */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            Graphura offers <strong>3 main packages</strong>: Resume Building, Interview Preparation, and Job Packages.
          </span>
        </div>

        {/* Silver Package */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            The <strong>₹1 Silver Package</strong> can be purchased <strong>only once</strong> per user.
          </span>
        </div>

        {/* Package Replacement Rule */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            If you purchase a new package, the <strong>previous package becomes inactive</strong> and cannot be reused.
          </span>
        </div>

        {/* Recommendation */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            We strongly recommend <strong>completing your current package</strong> before purchasing a new one.
          </span>
        </div>

        {/* Course Access Rule */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            Course access depends on your purchase. Buying only the <strong>Resume course</strong> gives access to Resume content only.
          </span>
        </div>

        {/* Combo Course */}
        <div className="flex gap-2">
          <div className="w-2 h-2 mt-2 bg-[#0E5C7E] rounded-full" />
          <span>
            Purchasing the <strong>Combo Course</strong> unlocks access to <strong>both Resume Building and Interview Preparation</strong>.
          </span>
        </div>

      </div>
    </div>
  </div>
</div>

      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-[#000000] mb-6">Payment History</h2>

        <div className="bg-white rounded-xl border border-[#7EC9E8]/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#EEEFFF] to-[#F0F9FF]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#0A2E40]">Current</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => {
                  const isCurrentJob = payment.purchaseCategory === 'JOB_PACKAGE' && 
                    payment.jobPackageDetails?.packageType === latestJobPackage?.jobPackageDetails?.packageType;
                  
                  const isCurrentCourse = payment.purchaseCategory === 'COURSE' && 
                    payment.courseDetails?.courseType === latestCourse?.courseDetails?.courseType;
                  
                  const isCurrent = isCurrentJob || isCurrentCourse;

                  return (
                    <tr key={payment._id} className="border-b border-[#7EC9E8]/20 hover:bg-[#EAF6FC]/30">
                      <td className="py-3 px-4 text-sm text-[#0A2E40] whitespace-nowrap">
                        {formatDate(payment.purchasedAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getPurchaseTypeBadge(payment.purchaseCategory)}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#0A2E40]">
                        {payment.purchaseCategory === 'JOB_PACKAGE' ? (
                          <>
                            <div className="font-medium">{payment.jobPackageDetails?.packageType} Package</div>
                            <div className="text-xs text-[#0E5C7E]/80">
                              {payment.jobPackageDetails?.creditsGiven} credits •
                              {payment.jobPackageDetails?.maxPackageLPA ? ` Up to ${payment.jobPackageDetails.maxPackageLPA} LPA` : ' Unlimited LPA'}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium">
                              {payment.courseDetails?.courseType === 'RESUME_BUILDING' ? 'Resume Building Course' :
                                payment.courseDetails?.courseType === 'INTERVIEW_PREP' ? 'Interview Prep Course' :
                                  'Career Launchpad (COMBO)'}
                            </div>
                            <div className="text-xs text-[#0E5C7E]/80">
                              {payment.courseDetails?.totalSessions} sessions •
                              {payment.courseDetails?.liveSessions} live
                            </div>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#0A2E40] font-bold">
                        {formatCurrency(payment.amountPaid)}
                      </td>
                      <td className="py-3 px-4">
                        {getPaymentStatusBadge(payment.paymentStatus)}
                      </td>
                      <td className="py-3 px-4">
                        {isCurrent ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            ✓ Current
                          </span>
                        ) : (
                          <span className="text-[#0E5C7E]/50">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {paymentHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-[#7EC9E8]">💳</div>
            <h3 className="text-xl font-semibold text-[#000000] mb-2">No payment history</h3>
            <p className="text-[#000000] mb-6">Your payment history will appear here after you make your first purchase.</p>
            <button
              onClick={() => setActiveTab('plans')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#4A148C] to-[#6d1371] text-white rounded-xl hover:from-[#130719] hover:to-[#250d30] transition-all shadow"
            >
              Browse Plans
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EEEFFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2E40]">Payments & Subscriptions</h1>
          <p className="text-grey-100 mt-2">
            Manage your job credits and learning courses. Latest purchase becomes active package.
          </p>
        </div>

        {/* Current Status */}
        {renderCurrentStatus()}

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[#7EC9E8]/30 shadow-sm mb-6">
          <div className="border-b border-[#7EC9E8]/20">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-all ${activeTab === 'plans'
                    ? 'border-[#000000] text-[#000000] font-bold'
                    : 'border-transparent text-[#000000]/70 hover:text-[#0A2E40]'
                  }`}
              >
                Browse Plans
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-all ${activeTab === 'history'
                    ? 'border-[#000000] text-[#000000] font-bold'
                    : 'border-transparent text-[#000000]/70 hover:text-[#0A2E40]'
                  }`}
              >
                Payment History
              </button>
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'plans' ? renderPlansTab() : renderHistoryTab()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;