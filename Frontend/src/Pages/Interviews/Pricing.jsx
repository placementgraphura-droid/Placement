import React from "react";


const handleShare = async () => {
    const shareData = {
        title: "Graphura Course",
        text: "Check out this amazing course on Graphura that helped me boost my career 🚀",
        url: window.location.href, // current course URL
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert("Link copied to clipboard!");
        }
    } catch (error) {
        console.error("Share failed:", error);
    }
};


const PricingCard = () => {
    return (
        <div className="max-w-8xl w-full bg-white/40 backdrop-blur-xl shadow-xl  border border-white/40 p-6 md:p-8"
            style={{
                background: "radial-gradient(circle, #E3F9FF 0%, #AEE7F6 45%, #5FB2D4 100%)",
            }}
        >
            {/* Glass card */}
            <div className="relative bg-transparent backdrop-blur-2xl border border-white/40 rounded-3xl px-10 py-8 text-center text-black shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
                {/* Price */}
                <div className="text-[34px] md:text-[38px] font-semibold text-black">
                    999/-
                    <span className="ml-2 line-through text-[20px] md:text-[22px] text-black/70">
                        1299/-
                    </span>
                    <span className="ml-3 text-[22px] md:text-[24px] font-semibold text-black">
                        25% off
                    </span>
                </div>

                {/* Button */}
                <a href="/intern-login"><button className="mt-6 px-20 py-3 rounded-md bg-sky-900 text-white text-sm md:text-base font-semibold shadow-md hover:bg-sky-800 transition">
                    Buy Now
                </button></a>

                {/* Title */}
                <p className="mt-8 text-[18px] md:text-[20px] font-semibold text-black underline underline-offset-4">
                    What you’ll Get :
                </p>

                {/* Features – centered 2 columns */}
                <div className="mt-8 flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4 gap-x-40 text-left text-[15px] md:text-[16px] text-black">
                        <ul className="space-y-3">
                            <li>✓ 10 Modules</li>
                            <li>✓ Role-Specific Interview Questions</li>
                            <li>✓ Live Interview Preparation Sessions</li>
                            <li>✓ Detailed Performance Feedback</li>
                        </ul>

                    </div>
                </div>

                {/* Share link */}
                <button
                    onClick={handleShare}
                    className="mt-8 text-[14px] md:text-[15px] text-black underline underline-offset-4 hover:text-blue-700 transition"
                >
                    Share this course
                </button>

            </div>
        </div>
    );
};

export default PricingCard;
