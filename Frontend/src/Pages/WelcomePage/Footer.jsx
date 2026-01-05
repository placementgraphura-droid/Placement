import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPaypal,
  FaAmazonPay,
  FaGooglePay,
} from "react-icons/fa";
import { SiPaytm } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="w-full bg-[#09435F] text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* ========== Brand Section ========== */}
        <div>
          <img src="/logoWhite.png" alt="Graphura" className="w-44 mb-4" />

          <p className="text-gray-200 leading-relaxed mb-6">
            Early take-off offers valuable learning prospects in high-end growth
            sectors.
          </p>

          <div className="space-y-3 text-sm">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex justify-between">
              <span>📞 Call us</span>
              <span className="font-semibold">+91 7378021327</span>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex justify-between">
              <span>✉️ Email</span>
              <span className="font-semibold">placement@graphura.in</span>
            </div>
          </div>
        </div>

        {/* ========== Quick Links ========== */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/courses" className="hover:text-white">Courses</a></li>
            <li><a href="/Interviews" className="hover:text-white">Interviews</a></li>
            <li><a href="/FAQ" className="hover:text-white">FAQ</a></li>
            <li><a href="/guidelines" className="hover:text-white">Guidelines</a></li>
          </ul>
        </div>

        {/* ========== Security & Legal ========== */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Security & Legal</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="/terms-of-service" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refund-policy" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* ========== Payments & Social ========== */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Payments Accepted</h4>

          <div className="flex gap-4 text-3xl mb-6">
            <FaPaypal />
            <FaAmazonPay />
            <FaGooglePay />
            <SiPaytm />
          </div>

          <p className="text-gray-200 mb-4">
            Secure and trusted payment gateways.
          </p>

          <div className="flex gap-4 text-xl mt-4">
            <a href="https://www.linkedin.com/company/graphura-india-private-limited/" target="_blank"><FaLinkedin /></a>
            <a href="https://www.instagram.com/graphura.in/" target="_blank"><FaInstagram /></a>
            <a href="https://www.facebook.com/Graphura.in/" target="_blank"><FaFacebook /></a>
            <a href="https://x.com/Graphura" target="_blank"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* ========== Bottom Bar ========== */}
      <div className="text-center text-gray-300 text-sm mt-12 border-t border-white/10 pt-6">
        © {new Date().getFullYear()} Graphura India Private Limited. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
