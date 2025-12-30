import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const successSlides = [
  {
    img: "/Boy.png",
    name: "Kabhi Bhatt",
    text: "I took the course and applied from Graphura in Lenskart and I cracked it, Woohooo....",
    companyLogo: "/logos/lenskart.png",
  },
  {
    img: "/Boy.png",
    name: "Aarav Sharma",
    text: "The placement preparation was amazing. I cracked interviews confidently!",
    companyLogo: "/logos/geeks.png",
  },
  {
    img: "/Boy.png",
    name: "Riya Verma",
    text: "Graphura boosted my confidence and skill-set. I got the job!",
    companyLogo: "/logos/bajaj.png",
  },
];

export default function JobSuccessSlider() {
  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-r from-[#0E5C7E] via-[#4FB0DA] to-[#0E5C7E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          className="pb-10"
        >
          {successSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              {/* Capsule Card */}
              <div
                className="
    relative
    bg-gradient-to-r from-[#0E5C7E] to-[#7EC9E8]
    rounded-[40px]
    px-6 sm:px-10 py-8 sm:py-10
    shadow-2xl
    min-h-[260px]
  "
              >
                {/* Image */}
                <img
                  src={slide.img}
                  alt={slide.name}
                  className="
      hidden md:block
      absolute bottom-0 left-6
      md:w-[230px] lg:w-[260px]
      object-contain
      drop-shadow-2xl
    "
                />

                {/* Content */}
                <div className="flex-1 w-full text-center md:text-left md:pl-[260px]">

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0A2E40] mb-4">
                    I GOT THE JOB, GUYS!!!
                  </h2>

                  {/* Testimonial Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">

                    {/* Speech Bubble */}
                    <div
                      className="
                        bg-white/30 backdrop-blur-md
                        border border-white/40
                        rounded-2xl
                        px-6 py-6
                        shadow-lg
                        max-w-xl
                      "
                    >
                      <p className="font-bold text-[#0A2E40] text-sm sm:text-base">
                        {slide.name}
                      </p>
                      <p className="text-[#0A2E40] text-sm mt-1">
                        {slide.text}
                      </p>
                    </div>

                    {/* Company Logo */}
                    <div
                      className="
                        bg-white/40 backdrop-blur-xl
                        border border-white/50
                        rounded-xl
                        p-4
                        shadow-md
                      "
                    >
                      <img
                        src={slide.companyLogo}
                        alt="company"
                        className="h-20 w-20 object-contain"
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-5 flex justify-center md:justify-start">
                    <a href="/intern-login">
                      <button
                        className="
                        px-6 py-2.5
                        bg-[#EAF6FC]
                        text-[#0A2E40]
                        font-semibold
                        rounded-xl
                        shadow-md
                        hover:bg-white
                        transition
                        cursor-pointer
                      "
                      >
                        Enroll Now
                      </button>
                    </a>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
