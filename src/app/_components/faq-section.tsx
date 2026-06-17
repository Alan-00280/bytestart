"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What result can I expect when learning with ByteStart?",
    answer: "We combine interactive labs with project-based learning to help you master modern web technologies. Most students build fully functional portfolio sites and deploy applications within the first few weeks."
  },
  {
    question: "Do I need prior coding experience to join?",
    answer: "No prior experience is needed. We offer beginner-friendly paths that start from the absolute basics, scaling up to advanced topics like Next.js, TypeScript, and system design."
  },
  {
    question: "Are the courses self-paced or live?",
    answer: "Our courses are self-paced, allowing you to learn at your own speed. However, you will have access to weekly live Q&A sessions and our Discord community to get help whenever you are stuck."
  },
  {
    question: "Is there a certificate of completion?",
    answer: "Yes! Every completed course pathway awards a verified digital certificate that you can share on LinkedIn and with potential employers."
  }
];

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <>
      {/* ----------------- SECTION 6: FAQ HEADER (Dark Bg) ----------------- */}
      <div id="faq" className="bg-black w-full pt-24 pb-16 px-6 lg:px-24 relative overflow-hidden">
        {/* Glow backdrop behind FAQ */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{transform: "translateY(calc(var(--spacing)*-16))"}}>
          <img alt="" className="w-full h-full object-cover" src="/images/landing/Group 5.svg" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-16">
          <h2 className="text-4xl sm:text-6xl font-poppins font-normal leading-[1.1] text-white">
            Frequently <br />
            <span className="font-semibold italic">asked</span> <br />
            questions
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-[480px] leading-relaxed md:text-right">
            You can find explanations of our products, services, policies and anything else you may need to know.
          </p>
        </div>
      </div>

      {/* ----------------- SECTION 7: FAQ ACCORDION (Dark Bg) ----------------- */}
      <div className="bg-black w-full pb-24 px-6 lg:px-24 relative">
        <div className="max-w-4xl mx-auto space-y-12">

          <div className="text-center">
            <h3 className="text-3xl sm:text-[40px] font-poppins font-normal text-white">
              Your questions, our <span className="italic font-light text-white/75">clarity</span>
            </h3>
          </div>

          {/* Accordion container */}
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white/[0.04] border border-white/10 rounded-[35px] p-6 sm:p-8 flex flex-col transition-all duration-300"
                >
                  {/* Header click bar */}
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group outline-none"
                  >
                    <span className="font-poppins font-normal text-lg sm:text-[22px] text-white group-hover:text-[#A156E3] transition-colors leading-snug pr-4">
                      {faq.question}
                    </span>
                    <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <ChevronDown
                        className={`w-5 h-5 text-white transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180 text-white" : "text-white/80"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Body expansion */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/5 pt-4 mt-4">
                        <p className="text-[15px] sm:text-[16px] text-white/75 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
