import React from "react";
import Navbar from "./WelcomePage/Navbar";
import Footer from "./WelcomePage/Footer";

const RefundPolicy = () => {
  return (
    <div>
      <Navbar />
    <section className="min-h-screen bg-[#81C2E3] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full mt-15 bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-8 border-[#09435F]">
        
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#09435F] mb-6">
          Refund Policy
        </h1>

        {/* Divider */}
        <div className="h-1 w-24 bg-[#81C2E3] rounded-full mb-8"></div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
          <p>
            Please read the subscription terms and conditions carefully before
            subscribing to any of our online subscription plans.
          </p>

          <p>
            Once you have subscribed to a plan and completed the required
            payment, the subscription becomes <span className="font-semibold text-[#09435F]">final</span>.
          </p>

          <p>
            Subscriptions <span className="font-semibold">cannot be changed, cancelled, or modified</span>
            after purchase. We strongly recommend reviewing all plan details
            before proceeding with payment.
          </p>

          <p>
            As our services are delivered digitally and provide immediate access
            to premium content and features, <span className="font-semibold text-[#09435F]">no refunds</span> will be
            issued under any circumstances once the payment is successfully
            processed.
          </p>

          <p>
            By subscribing to our services, you acknowledge and agree to this
            Refund Policy in full.
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-10 p-4 bg-[#81C2E3]/20 border-l-4 border-[#81C2E3] rounded-md">
          <p className="text-sm text-[#09435F] font-medium">
            If you have any questions regarding this policy, please contact our
            support team before making a purchase.
          </p>
        </div>
      </div>
    </section>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
