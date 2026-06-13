export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  popular?: boolean;
}

export interface EbookWebinar {
  id: number;
  type: "WEBINARS" | "EBOOKS";
  title: string;
  linkText: string;
  bgGradient: string;
}

export const articleCategories = [
  "Engineering",
  "Design",
  "Strategy",
  "Inspiration",
  "Development"
];

export const articlesData: Article[] = [
  {
    id: 1,
    title: "Building Server-First React Applications with Next.js 15 Actions",
    category: "Engineering",
    summary: "An in-depth guide to securing, testing, and optimizing React Server Actions in production-grade Next.js applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    author: "Rian Kurniawan",
    date: "June 8, 2026",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Tailwind CSS v4: The Shift to CSS-First Configuration",
    category: "Engineering",
    summary: "Exploring the brand-new styling engine in Tailwind CSS v4, utilizing CSS variables instead of heavy JavaScript configs.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    author: "Adi Pratama",
    date: "June 6, 2026",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "Design Systems in Figma: Managing Variables at Scale",
    category: "Design",
    summary: "How to structure auto-layout tokens, typography curves, and light/dark mode variables within enterprise Figma libraries.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    author: "Siti Dahlia",
    date: "June 3, 2026",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "How to Build a High-Performance Go REST API",
    category: "Development",
    summary: "Step-by-step assembly of concurrency models, connection pooling, and JWT authentication in lightweight Go web servers.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    author: "ByteStart Team",
    date: "May 28, 2026",
    readTime: "10 min read"
  },
  {
    id: 5,
    title: "Product Strategy: Aligning Visuals with Business Goals",
    category: "Strategy",
    summary: "Bridging the gap between creative designers and business stakeholders to drive conversions through visual storytelling.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    author: "Maria Lestari",
    date: "June 1, 2026",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "Framer Motion: Creating Natural Fluid Animations",
    category: "Design",
    summary: "Understanding the physics of layout transitions, spring physics, and scroll-bound animations in framer components.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    author: "Siti Dahlia",
    date: "May 25, 2026",
    readTime: "5 min read"
  },
  {
    id: 7,
    title: "Developing Native iOS Apps with SwiftUI & SwiftData",
    category: "Development",
    summary: "Leveraging Swift's declarative syntax, local database modeling, and offline synchronization mechanisms.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    author: "ByteStart Team",
    date: "May 20, 2026",
    readTime: "9 min read"
  },
  {
    id: 8,
    title: "A Developer's Guide to Mastering Docker Compose",
    category: "Engineering",
    summary: "Orchestrating multi-container environments, setting up networks, and defining persistent volume stores locally.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
    author: "Rian Kurniawan",
    date: "May 15, 2026",
    readTime: "8 min read"
  },
  {
    id: 9,
    title: "UX/UI Copywriting: Writing Interfaces Users Love",
    category: "Inspiration",
    summary: "How microcopy affects product conversions, navigation clarity, and user satisfaction across web interfaces.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    author: "Maria Lestari",
    date: "May 10, 2026",
    readTime: "6 min read",
    popular: true
  },
  {
    id: 10,
    title: "Type-Safe State Management in React with Zustand",
    category: "Engineering",
    summary: "Ditching complex Boilerplates. Build clean, lightweight, and type-safe stores with Zustand hooks.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    author: "Adi Pratama",
    date: "May 5, 2026",
    readTime: "4 min read"
  },
  {
    id: 11,
    title: "Micro-interactions: Tiny Details That Wow Customers",
    category: "Design",
    summary: "Why subtle hover states, click animations, and sound effects can dramatically elevate user engagement on web platforms.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80",
    author: "Siti Dahlia",
    date: "April 29, 2026",
    readTime: "5 min read"
  },
  {
    id: 12,
    title: "Continuous Integration: Automating Next.js Tests",
    category: "Strategy",
    summary: "Configuring GitHub Actions to automatically run lints, type-checks, and cypress test pipelines on every PR.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    author: "Rian Kurniawan",
    date: "April 22, 2026",
    readTime: "7 min read"
  }
];

export const ebooksWebinarsData: EbookWebinar[] = [
  {
    id: 1,
    type: "WEBINARS",
    title: "Next.js 15 & Tailwind CSS v4 Production Scaling Strategies",
    linkText: "Watch webinar",
    bgGradient: "from-[#1a0a2a] via-[#52057B]/40 to-[#892CDC]/20"
  },
  {
    id: 2,
    type: "EBOOKS",
    title: "Figma Variables & Advanced Component Autolayout Blueprint",
    linkText: "Read ebook",
    bgGradient: "from-[#08152e] via-[#103070]/40 to-[#3b82f6]/20"
  },
  {
    id: 3,
    type: "WEBINARS",
    title: "Go REST API Scaling: Concurrency & Database Connection Pooling",
    linkText: "Watch webinar",
    bgGradient: "from-[#071d15] via-[#10523e]/40 to-[#10b981]/20"
  },
  {
    id: 4,
    type: "EBOOKS",
    title: "Mobile UX Checklist: Gesture Handlers & Micro-interactions",
    linkText: "Read ebook",
    bgGradient: "from-[#1f1906] via-[#5c4a0f]/40 to-[#fbbf24]/20"
  }
];
