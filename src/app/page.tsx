"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ButtonGlass } from "@/components/ui/button-glass";
import {
  Check,
  Clock,
  BookOpen,
  Users,
  Star,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";

// Figma Localhost Image Assets (DO NOT USE AGAIN)
// const imgGroup2 = "http://localhost:3845/assets/d4a2537c53c307d9054c98b62c7e944ba46c0c6b.svg"; // Hero background glow
// const imgFrame56 = "http://localhost:3845/assets/0a61d6df9664e3e0fbbcd1819095fe516160a2a4.png"; // Course banner
// const imgFrame72 = "http://localhost:3845/assets/6bfbc9404fc31e205b34ab307343936b0dda4592.png"; // Testimonial avatar
// const imgGroup5 = "http://localhost:3845/assets/4d45fc38e071fb0e14fc2ed229056340c6e43e37.svg"; // FAQ background glow
// const imgGroup4 = "http://localhost:3845/assets/26a2424dc7feb09a9ecb387c5f97e817d9529a97.svg"; // Footer background glow
// const imgFrame23 = "http://localhost:3845/assets/760a3364dd96f1f491487c3278121727e3a36fea.svg"; // Decorative divider line

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

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

  const benefits = [
    {
      title: "Built by Professionals",
      description: "Get the best experience knowing that our courses are designed and vetted by industry veterans."
    },
    {
      title: "Interactive Labs",
      description: "Write, run, and test code directly in your browser with our built-in workspace editor."
    },
    {
      title: "Real-world Projects",
      description: "Build portfolio-ready applications that demonstrate actual engineering competence."
    },
    {
      title: "Community Access",
      description: "Join our active Discord server to network with thousands of fellow developers."
    },
    {
      title: "Lifetime Updates",
      description: "Purchase once and get free access to all future course updates as technologies evolve."
    },
    {
      title: "Career Support",
      description: "Access our exclusive resume templates, interview prep guides, and job referrals."
    }
  ];

  const courses = [
    {
      id: 1,
      title: "Framer Full Mastery & More 2024",
      description: "Master Framer in 2024 with this updated course. Learn to design, prototype, and build interactive websites.",
      price: "$999",
      rating: "4.9",
      tag: "Featured",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Next.js 15 & Tailwind v4 Pro",
      description: "Step into the future of frontend development. Build server-first, blindingly fast web applications.",
      price: "$899",
      rating: "5.0",
      tag: "Featured",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "UI/UX System Design Core",
      description: "Translate visual ideas into clean code. Master Figma layout principles, typography scales, and CSS frameworks.",
      price: "$799",
      rating: "4.8",
      tag: "Featured",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "MD, BrightLabs",
      quote: "Refined our brand & increased inbound leads by 70% in just a few months.",
      hasAvatar: false
    },
    {
      name: "Jordan Devereaux",
      role: "Lead Architect, Fanitech",
      quote: "The interactive coding workspace is a game-changer. I went from zero to launching my first SaaS in 60 days.",
      hasAvatar: true
    },
    {
      name: "Clara Oswald",
      role: "Software Engineer",
      quote: "ByteStart courses are clear, concise, and incredibly useful. The best investment I've made in my career.",
      hasAvatar: false
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput("");
      }, 3000);
    }
  };

  return (

    <div className="bg-black min-h-screen text-white antialiased overflow-x-clip font-sans relative">

      {/* Floating Header Wrapper (Matching Figma 71:231 & 71:232) */}
      <div className="sticky top-0 z-50 w-full max-w-[1290px] mx-auto px-4 md:px-0 py-6 h-auto flex items-start">
        <header className="backdrop-blur-xl bg-[rgba(62,5,113,0.18)] border border-white/[0.08] rounded-[58px] px-6 md:px-[50px] py-[10px] flex items-center justify-between w-full h-[79px] gap-[20px] shadow-[0px_8px_32px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3">
            <span className="font-poppins font-semibold text-2xl md:text-3xl text-white tracking-wide text-shadow-[0px_1px_4px_rgba(0,0,0,0.39)]">
              ByteStart
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-[35px] text-[16px] font-normal text-white/90 text-shadow-[0px_1px_4px_rgba(0,0,0,0.39)]">
            <a href="#about" className="hover:text-[#A156E3] transition-colors">About Us</a>
            <a href="#benefits" className="hover:text-[#A156E3] transition-colors">Benefit</a>
            <a href="/articles" className="hover:text-[#A156E3] transition-colors">Article</a>
            <Link href="/courses" scroll={false} className="hover:text-[#A156E3] transition-colors">Explore</Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-[20px]">
            <ButtonGlass themeType="outline" className="h-[43px] px-6" icon={<ShoppingCart className="size-5" />} logoRight>
              Cart
            </ButtonGlass>
            <ButtonGlass themeType="default" className="h-[43px] px-[45px]">
              Sign Up
            </ButtonGlass>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-[130px] left-6 right-6 bg-[#220234]/95 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-5 duration-300 lg:hidden">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">About Us</a>
          <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Benefit</a>
          <a href="/articles" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Article</a>
          <Link href="/courses" scroll={false} onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3] border-b border-white/5">Explore</Link>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-[#A156E3]">FAQs</a>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <ButtonGlass themeType="outline" className="w-full h-11 justify-center" icon={<ShoppingCart className="size-5" />} logoRight>
              Cart
            </ButtonGlass>
            <ButtonGlass themeType="default" className="w-full h-11 justify-center">
              Sign Up
            </ButtonGlass>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 1: HEADER & HERO ----------------- */}
      <div className="relative w-full bg-black pb-24 md:pb-32 px-6 lg:px-24 overflow-hidden">
        {/* Glow backdrop behind Hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[1200px] pointer-events-none z-0 select-none" style={{top: "calc(var(--spacing) * -65)"}} id="glow-backdrop">
          <img alt="" className="w-full h-full object-cover" src="\images\landing\Group 2.svg" />
        </div>

        {/* Hero Section Container */}
        <div className="relative z-10 max-w-7xl mx-auto pt-12 md:pt-20">

          {/* Main Title & Subtitle Flex Row */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-between py-12">
            <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-poppins font-normal text-white leading-[1.15] tracking-tight max-w-[680px]">
              Learn <span className="italic">Smarter</span> Grow Faster with <span className="font-bold">ByteStart</span>
            </h1>
            <div className="lg:max-w-[320px] lg:pt-6">
              <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed lg:text-right">
                Interactive courses, expert instructors, and seamless learning experience - designed to help you succeed.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5 py-6">
            <ButtonGlass themeType="default" className="px-8 h-[43px]" asChild>
              <Link href="/courses" scroll={false}>Start Learning Now</Link>
            </ButtonGlass>
            <ButtonGlass themeType="outline" logoRight className="px-[30px] h-[43px]" asChild>
              <Link href="/courses" scroll={false}>Explore Course</Link>
            </ButtonGlass>
          </div>

          {/* Stats Capsule / Dashboard Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-16 border-t border-white/10 mt-16">
            <span className="text-sm font-normal uppercase tracking-wider text-white/55">
              see our portfolio
            </span>

            {/* Purple Stats Capsule */}
            <div className="bg-[#3A125C] border border-white/10 rounded-[110px] py-[20px] px-8 sm:px-[89px] flex items-center justify-center gap-12 sm:gap-[67px] shadow-2xl">
              <div className="text-center">
                <span className="block font-bold text-[40px] sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                  80K+
                </span>
                <span className="text-xs sm:text-[16px] font-normal text-white/80 mt-1 block">
                  Students
                </span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-[40px] sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                  10K+
                </span>
                <span className="text-xs sm:text-[16px] font-normal text-white/80 mt-1 block">
                  Course
                </span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-[40px] sm:text-[61px] leading-[1] bg-gradient-to-br from-white to-[#925DAE] bg-clip-text text-transparent">
                  98%
                </span>
                <span className="text-xs sm:text-[16px] font-normal text-white/80 mt-1 block">
                  Success Rate
                </span>
              </div>
            </div>

            <span className="text-sm font-normal uppercase tracking-wider text-white/55 animate-bounce">
              scroll now
            </span>
          </div>

        </div>
      </div>

      {/* ----------------- SECTION 2: ABOUT US (Light Beige Bg) ----------------- */}
      <div id="about" className="bg-[#FFFDF4] text-black w-full py-24 md:py-32 px-6 lg:px-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* Belief Statement Callout */}
          <div className="max-w-[920px]">
            <p className="text-3xl sm:text-[50px] lg:text-[61px] font-poppins font-semibold leading-[1.3] text-black tracking-tight">
              At ByteStart — we believe that <span className="italic font-normal">learning</span> to code should be <span className="font-poppins text-[#892CDC] text-4xl sm:text-6xl lg:text-7xl font-black italic">fun</span>, <span className="italic font-medium text-slate-800">accessible</span>, and actually <span className="font-poppins font-black uppercase text-[#892CDC] text-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">useful</span> — feel less intimidating and more like an adventure.
            </p>
          </div>

          {/* About us description grid */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pt-8 border-t border-black/10">
            <h2 className="text-3xl sm:text-[36px] font-normal tracking-tight font-poppins">
              about us
            </h2>
            <div className="max-w-[487px] space-y-6">
              <p className="text-[16px] text-black/75 leading-relaxed">
                We combine creativity and technology to deliver result that not only meet expectation but exceed them.
              </p>
              <a href="#courses" className="inline-block text-xl sm:text-[27px] font-normal border-b border-black hover:text-[#753795] hover:border-[#753795] transition-colors pb-0.5">
                Learn More
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------- SECTION 3: BOOST YOUR SKILLS (Light Beige Bg) ----------------- */}
      <div className="bg-[#FFFDF4] text-black w-full pb-20 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">

          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
              Boost Your Skills
            </h2>
            <p className="text-[16px] text-black/75 leading-relaxed">
              From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
            </p>
          </div>

          {/* 3 cards row */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-16">

            {/* Card 1 */}
            <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
                <Clock className="w-16 h-16 stroke-[1.5]" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">100+</span>
                <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                  Hours of Content
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
                <BookOpen className="w-16 h-16 stroke-[1.5]" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">15+</span>
                <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                  COURSES
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[26px] p-8 w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center shadow-[19px_23px_66px_6px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-[140px] h-[140px] rounded-2xl bg-[#EEE6F2] flex items-center justify-center text-[#753795] mb-4">
                <Users className="w-16 h-16 stroke-[1.5]" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-3xl sm:text-[47px] leading-[1.2]">20K+</span>
                <span className="text-xs uppercase tracking-wider text-black/60 font-semibold mt-1 block">
                  STUDENTS
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ----------------- SECTION 4: KEY BENEFITS (Light Beige Bg) ----------------- */}
      <div id="benefits" className="bg-[#FFFDF4] text-black w-full py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">

          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
              Key Benefits of Courses
            </h2>
            <p className="text-[16px] text-black/75 leading-relaxed">
              From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
            </p>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-16">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-[26px] p-8 h-[200px] flex flex-col justify-center border border-black/5 shadow-[19px_23px_75px_-5px_rgba(0,0,0,0.08)] hover:border-[#753795]/20 transition-all duration-300"
              >
                <h3 className="font-poppins font-semibold text-[22px] text-black mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[15px] text-black/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ----------------- SECTION 5: FEATURED COURSES (Light Beige Bg) ----------------- */}
      <div id="courses" className="bg-[#FFFDF4] text-black w-full py-16 pb-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2]">
              Featured Courses
            </h2>
            <p className="text-[16px] text-black/75 leading-relaxed">
              From critical skills to technical topics, we support your professional development with courses that help you grow and succeed.
            </p>
          </div>

          {/* 3 course cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-[35px] p-6 w-full max-w-[400px] h-[510px] flex flex-col gap-4 shadow-[12px_25px_77px_20px_rgba(0,0,0,0.06)] border border-black/5 hover:-translate-y-2.5 transition-all duration-300"
              >
                {/* Course Banner */}
                <div className="h-[228px] rounded-[19px] bg-neutral-100 overflow-hidden relative border border-black/5">
                  <img
                    alt={course.title}
                    className="w-full h-full object-cover"
                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"}
                    onError={(e) => {
                      // Fallback in case image link is broken
                      e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between px-1 text-sm font-semibold text-black">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-4 fill-amber-500 stroke-amber-500" />
                    <span>{course.rating}</span>
                    <span className="text-black/40 font-normal text-xs">(480 ratings)</span>
                  </div>
                  <span className="text-lg font-bold text-[#753795]">{course.price}</span>
                </div>

                {/* Course Details */}
                <div className="space-y-2 flex-grow">
                  <h3 className="font-poppins font-semibold text-[20px] text-black leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-[14px] text-black/70 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* Badge Tag */}
                <div className="pt-2">
                  <span className="bg-[#EEE6F2] text-[#220234] text-xs font-semibold px-4 py-1.5 rounded-full inline-block">
                    {course.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Button */}
          <div className="text-center pt-8">
            <Link href="/courses" scroll={false} className="inline-flex items-center justify-center gap-2 bg-[#CB71F7]/25 hover:bg-[#CB71F7]/40 text-[#2D0344] font-semibold rounded-[30px] px-8 h-[45px] transition-all cursor-pointer shadow-lg shadow-black/10 border border-white/20 select-none">
              View Course
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8L16 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* ----------------- SECTION 6: FAQ HEADER (Dark Bg) ----------------- */}
      <div id="faq" className="bg-black w-full pt-24 pb-16 px-6 lg:px-24 relative overflow-hidden">
        {/* Glow backdrop behind FAQ */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{transform: "translateY(calc(var(--spacing)*-16))"}}>
          <img alt="" className="w-full h-full object-cover" src="\images\landing\Group 5.svg" />
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

      {/* Decorative divider */}
      <div className="relative w-full max-w-[1440px] mx-auto h-[150px] pointer-events-none select-none z-10 px-6">
        {/* <img alt="" className="w-full h-full object-contain" src={imgFrame23} /> */}
      </div>

      {/* ----------------- SECTION 8: CLIENT FEEDBACK (Dark Bg) ----------------- */}
      <div className="bg-black w-full py-16 px-6 lg:px-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-[61px] font-poppins font-normal leading-[1.2] text-white">
              Client Feedback
            </h2>
            <p className="text-[16px] text-white/70 leading-relaxed">
              Discover success stories from satisfied clients. Learn how we assisted them in reaching their objectives and generating significant, enduring results.
            </p>
          </div>

          {/* Testimonial slider grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/[0.04] border border-white/10 rounded-[20px] p-8 w-full max-w-[400px] h-[340px] flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative group"
              >
                {/* Visual backdrop cover for the middle card with avatar */}
                {t.hasAvatar && (
                  <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none z-0 opacity-30 group-hover:opacity-40 transition-opacity">
                    <img
                      alt=""
                      className="absolute w-full h-full object-cover"
                      src="\images\landing\Frame 72.png"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#753795]/20 to-black/90" />
                  </div>
                )}

                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[16px] text-white/90 leading-relaxed italic flex-grow pt-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author Metadata */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-[#A156E3]">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[15px]">{t.name}</h4>
                    <p className="text-white/60 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ----------------- SECTION 9: TEACH WITH US (Dark Bg) ----------------- */}
      <div className="bg-black w-full py-16 border-t border-white/10 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-8">
          <h2 className="text-3xl sm:text-[61px] font-poppins font-semibold leading-tight text-white tracking-tight">
            Teach with us
          </h2>
          <a
            href="mailto:teach@bytestr.com"
            className="text-2xl sm:text-[40px] md:text-[61px] font-light text-white hover:text-[#A156E3] transition-colors leading-none tracking-tight break-all border-b border-white/20 hover:border-[#A156E3] pb-1"
          >
            teach@bytestr.com
          </a>
        </div>
      </div>

      {/* ----------------- SECTION 10: NEWSLETTER & FOOTER (Dark Bg) ----------------- */}
      <footer className="bg-black w-full pt-20 pb-12 px-6 lg:px-24 relative overflow-hidden border-t border-white/10">
        {/* Glow backdrop behind Footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[800px] pointer-events-none opacity-40 z-0">
          <img alt="" className="w-full h-full object-cover" src="\images\landing\Group 4.svg" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-16">

          {/* Main flex columns (Newsletter card + navigation links) */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start justify-between">

            {/* Newsletter Subscription Box */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-8 w-full lg:max-w-[420px] h-[280px] flex flex-col justify-between">
              <h3 className="font-poppins font-medium text-2xl sm:text-3xl text-white">
                Subscribe to our newsletter
              </h3>

              <form onSubmit={handleSubscribe} className="relative border-b border-white/40 pb-2 flex items-center justify-between">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-transparent border-none text-white text-base placeholder-white/40 outline-none w-full pr-10 py-1"
                />
                <button type="submit" className="absolute right-0 text-white hover:text-[#A156E3] transition-colors cursor-pointer" aria-label="Subscribe">
                  {subscribed ? <Check className="w-6 h-6 text-green-400" /> : <Mail className="w-6 h-6" />}
                </button>
              </form>

              {subscribed && (
                <p className="text-green-400 text-xs font-semibold animate-pulse">
                  Subscribed successfully! Thank you.
                </p>
              )}
            </div>

            {/* Link Columns Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[15px] text-white/80 w-full lg:flex-grow">

              {/* Column 1 */}
              <div className="space-y-4">
                <h4 className="font-poppins font-semibold text-white tracking-wide">Quick Links</h4>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="hover:text-[#A156E3] transition-colors">Home</a>
                  <a href="#about" className="hover:text-[#A156E3] transition-colors">About Us</a>
                  <a href="#benefits" className="hover:text-[#A156E3] transition-colors">Benefits</a>
                  <a href="#courses" className="hover:text-[#A156E3] transition-colors">Explore</a>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <h4 className="font-poppins font-semibold text-white tracking-wide">Support</h4>
                <div className="flex flex-col gap-2.5">
                  <a href="#faq" className="hover:text-[#A156E3] transition-colors">FAQs</a>
                  <a href="#" className="hover:text-[#A156E3] transition-colors">Support Center</a>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4 col-span-2 md:col-span-1">
                <h4 className="font-poppins font-semibold text-white tracking-wide">Get in Touch With Us</h4>
                <div className="flex flex-col gap-3 font-light text-white/70">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#A156E3]" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#A156E3]" />
                    <span>hello@bytestart.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A156E3]" />
                    <span>123 Main Street, Cyber City</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Large Brand Text & Copyright block */}
          <div className="pt-12 border-t border-white/10 flex flex-col gap-8 items-start justify-end w-full">
            <div className="flex items-end gap-4 w-full">
              <span className="font-poppins font-bold text-5xl sm:text-7xl lg:text-[120px] leading-[0.75] text-white tracking-[-2px] uppercase select-none">
                BYTESTART
              </span>
              <span className="text-white text-base md:text-2xl font-semibold mb-1">
                TM
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between w-full text-[14px] text-white/50 gap-4">
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </div>
              <p>&copy; {new Date().getFullYear()} Alan Perdana. All rights reserved.</p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
