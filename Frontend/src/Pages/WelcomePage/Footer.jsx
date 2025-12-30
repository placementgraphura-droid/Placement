import React from 'react'
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div>
        <footer className="w-full bg-[#09435f] text-white pt-16 pb-10 relative overflow-y-auto pb-safe">


      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-25  relative z-10">

       
        <div>
          <img
            src="/logoWhite.png"
            alt="Graphura"
            className="w-44 mb-4"
          />

          <p className="text-gray-200 leading-relaxed w-64">
            Early take-off offers valuable learning prospects in high-end growth
            sectors.
          </p>

          {/* Contact buttons */}
          <div className="mt-6 space-y-3">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm flex items-center gap-3">
              📞 Call us anytime  
              <span className="font-semibold ml-auto">91 - 7378021327</span>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm flex items-center gap-3">
              ✉️ Email us anytime  
              <span className="font-semibold ml-auto">official@graphura.in</span>
            </div>
          </div>
        </div>

  
     
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>

          <p className="text-gray-200 mb-4">
            Early take-off offers valuable learning prospects in high-end growth
            sectors.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl text-white mt-5 ml-3">
            <a href="https://www.linkedin.com/company/graphura-india-private-limited/"><FaLinkedin /></a>
            <a href="https://www.instagram.com/graphura.in/"><FaInstagram /></a>
            <a href="https://www.facebook.com/Graphura.in/"><FaFacebook /></a>
            <a href="https://x.com/Graphura"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* -------- Bottom Line -------- */}
      <div className="text-center text-gray-300 text-sm mt-10">
        © {new Date().getFullYear()} Graphura India Private Limited. All Rights Reserved.
      </div>
    </footer>
    </div>
  )
}

export default Footer