import { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // keep first one open by default

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white border-t border-gray-150">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full">
            Instant Clarifications
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#081C3A] tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
            Need prompt answers regarding check-ins, VIP lounges, security baggage limits, or refunds? Check our custom quick accordion helper.
          </p>
        </div>

        {/* FAQ Accordion container */}
        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-150 rounded-2xl overflow-hidden transition-all bg-gray-50/30 hover:bg-gray-50/80"
                id={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between font-bold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4 text-sm md:text-base">
                    <HelpCircle className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                    <span>{item.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Smooth expanding container */}
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-40 border-t border-gray-100 py-4 px-6 bg-white" : "max-h-0"
                  }`}
                >
                  <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
