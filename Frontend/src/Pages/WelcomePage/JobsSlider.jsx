import React from "react";
import JobCard from "./JobCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const JobsSlider = () => {
const jobs = [
  {
    id: 1,
    badge: "Hiring",
    title: "Frontend Developer (React)",
    company: "Unacademy (Sorting Hat Technologies Pvt. Ltd.)",
    location: "Mumbai, Maharashtra",
    salary: "₹ 6,00,000 - 9,00,000",
    logo: "/logos/bajaj.png",
  },
  {
    id: 2,
    badge: "Hiring",
    title: "Backend Developer (Node.js)",
    company: "Swiggy",
    location: "Bangalore, Karnataka",
    salary: "₹ 8,00,000 - 12,00,000",
    logo: "/logos/realme.png",
  },
  {
    id: 3,
    badge: "Upcoming",
    title: "Business Development Associate",
    company: "Lenskart Solutions Limited",
    location: "Gurgaon, Haryana",
    salary: "₹ 7,00,000 - 10,00,000",
    logo: "/logos/lenskart.png",
  },
  {
    id: 4,
    badge: "Hiring",
    title: "UI/UX Designer",
    company: "Zomato",
    location: "New Delhi",
    salary: "₹ 5,50,000 - 8,50,000",
    logo: "/logos/myntra.png",
  },
  {
    id: 5,
    badge: "Hiring",
    title: "Full Stack Developer (MERN)",
    company: "Tata Digital",
    location: "Bangalore, Karnataka",
    salary: "₹ 10,00,000 - 15,00,000",
    logo: "/logos/geeks.png",
  },
  {
    id: 6,
    badge: "Upcoming",
    title: "Data Analyst",
    company: "Infosys",
    location: "Pune, Maharashtra",
    salary: "₹ 6,50,000 - 9,50,000",
    logo: "/logos/policy.png",
  },
  {
    id: 7,
    badge: "Hiring",
    title: "Software Engineer (Java)",
    company: "Accenture",
    location: "Hyderabad, Telangana",
    salary: "₹ 7,50,000 - 11,00,000",
    logo: "/logos/geeks.png",
  },
  {
    id: 8,
    badge: "Hiring",
    title: "Product Manager (Associate)",
    company: "Flipkart",
    location: "Bangalore, Karnataka",
    salary: "₹ 12,00,000 - 18,00,000",
    logo: "/logos/bajaj.png",
  },
];


  return (
    <div
      className="relative w-full overflow-hidden "
      style={{
        minHeight: "320px",
        backgroundImage: `url("/Capsule.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
     
      <div className="p-8 relative z-10">
        <h2 className="text-3xl font-semibold text-slate-900 pl-6 border-l-4 border-slate-900/30">
          Jobs for You
        </h2>
      </div>

      <div className="relative px-12 pb-15 z-20">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".jobs-next",
            prevEl: ".jobs-prev",
          }}
          
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
        >
          {jobs.map((job) => (
            <SwiperSlide key={job.id}>
              <JobCard job={job} />
            </SwiperSlide>
          ))}
        </Swiper>

        
        <button className="jobs-prev absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
          ❮
        </button>

        <button className="jobs-next absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
          ❯
        </button>
      </div>
    </div>
  );
};

export default JobsSlider;
