import { useState } from "react";
import { REVIEWS } from "../data";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function ReviewCarousel() {
  const [currIdx, setCurrIdx] = useState(0);

  const prevReview = () => {
    setCurrIdx((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrIdx((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const activeReview = REVIEWS[currIdx];

  return (
    <section id="story" className="py-24 bg-gray-50 border-t border-gray-150 relative overflow-hidden">
      {/* Absolute decorative gradient orb for luxury aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full">
            Elite Endorsements
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#081C3A] tracking-tight font-display">
            Customer Testimonials
          </h2>
        </div>

        {/* Testimonial Active Display Card */}
        <div 
          className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center text-center space-y-6 relative transition-all duration-300"
          id={`review-card-${currIdx}`}
        >
          {/* Quote icon visual decoration */}
          <div className="absolute top-6 left-8 text-gray-100">
            <Quote className="w-16 h-16 fill-gray-50" />
          </div>

          <div className="flex space-x-1">
            {Array.from({ length: activeReview.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <p className="text-sm md:text-base text-gray-600 font-light italic leading-relaxed max-w-2xl relative z-10">
            "{activeReview.experience}"
          </p>

          <div className="flex flex-col items-center pt-4 border-t border-gray-150 w-full max-w-xs">
            <img 
              src={activeReview.avatar} 
              alt={activeReview.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2.5"
              referrerPolicy="no-referrer"
            />
            <h4 className="font-extrabold text-gray-900">{activeReview.name}</h4>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider block">{activeReview.flightBooked}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-6 pt-4">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-xs hover:shadow-md flex items-center justify-center text-gray-600 transition-all cursor-pointer"
              id="review-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-1.5">
              {REVIEWS.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrIdx(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    idx === currIdx ? "bg-[#202A36] w-5" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-xs hover:shadow-md flex items-center justify-center text-gray-600 transition-all cursor-pointer"
              id="review-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
