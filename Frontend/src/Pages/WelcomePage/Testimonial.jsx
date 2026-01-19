import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    title: "Successfully Started My Career at Myntra",
    text: "Graphura guided me throughout my preparation. From resume improvements to mock interviews, helped me gain confidence and finally secure a role at Myntra.",
    img: "/9.webp",
    name: "Mohan Singh",
    role: "Software Associate, Myntra",
  },
  {
    title: "Cracked Amazon Interview with Confidence",
    text: "The structured interview preparation and practical guidance from Graphura made a huge difference. I felt well-prepared and calm during my Amazon interview process.",
    img: "/12.webp",
    name: "Riya Verma",
    role: "Operations Analyst, Amazon",
  },
  {
    title: "Placed at TCS After Focused Training",
    text: "Graphura’s learning modules and practice sessions helped me understand real interview expectations. Their mentorship played a key role in my selection at TCS.",
    img: "/16.webp",
    name: "Karan Patel",
    role: "Graduate Trainee, TCS",
  },
  {
    title: "Cleared Wipro Interviews Successfully",
    text: "I struggled with interviews earlier, but Graphura helped me improve communication skills and technical clarity. I’m grateful for their support in getting placed at Wipro.",
    img: "/5.webp",
    name: "Simran Kaur",
    role: "Project Engineer, Wipro",
  },
  {
    title: "From Doubt to Placement at Myntra",
    text: "I wasn’t sure about my skills initially, but Graphura’s consistent guidance and real-world interview tips helped me turn things around and get placed at Myntra.",
    img: "/4.webp",
    name: "Yogesh Singh",
    role: "Business Operations Executive, Myntra",
  },
  {
    title: "Amazon Offer Through Proper Guidance",
    text: "Graphura’s resume review and interview simulations prepared me perfectly. The experience boosted my confidence and helped me receive an offer from Amazon.",
    img: "/3.webp",
    name: "Shruti Kumari",
    role: "Customer Experience Specialist, Amazon",
  },
  {
    title: "Achieved My Goal of Joining TCS",
    text: "The training approach at Graphura is practical and easy to follow. Their interview-focused preparation helped me clear all rounds and join TCS successfully.",
    img: "/2.webp",
    name: "Karan Patel",
    role: "System Engineer, TCS",
  },
  {
    title: "Wipro Made Possible with Graphura",
    text: "Graphura helped me polish my skills, improve confidence, and understand interview patterns. This support played a major role in my placement at Wipro.",
    img: "/1.webp",
    name: "Priya Kumari",
    role: "Associate Consultant, Wipro",
  },
];


export default function Testimonials() {
  return (
    <section className="relative bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC] py-16 px-10 ">
      <span className="h-8 w-[3px] bg-[#1C7EAC] rounded-full" />
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-left mb-10">
        550+ of Our Old Aspirants – Now it’s your turn
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-40"
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
            <div className="pb-10">

            <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl p-5 min-h-[200px] flex flex-col justify-between">

              
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
                {t.title}
              </h3>

              
              <p className="text-gray-700 text-sm leading-snug mb-4">
                {t.text}
              </p>

             
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
        </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
