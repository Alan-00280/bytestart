"use client";

import React from "react";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { AboutUsSection } from "./_components/about-us-section";
import { BoostSkillsSection } from "./_components/boost-skills-section";
import { BenefitsSection } from "./_components/benefits-section";
import { FeaturedCoursesSection } from "./_components/featured-courses-section";
import { FaqSection } from "./_components/faq-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { TeachWithUsSection } from "./_components/teach-with-us-section";
import { FooterSection } from "./_components/footer-section";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white antialiased overflow-x-clip font-sans relative">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <BoostSkillsSection />
      <BenefitsSection />
      <FeaturedCoursesSection />
      <FaqSection />
      
      {/* Decorative spacer */}
      <div className="relative w-full max-w-[1440px] mx-auto h-[150px] pointer-events-none select-none z-10 px-6" />
      
      <TestimonialsSection />
      <TeachWithUsSection />
      <FooterSection />
    </div>
  );
}
