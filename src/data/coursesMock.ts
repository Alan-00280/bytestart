export interface Course {
  id: number;
  title: string;
  category: string;
  level: "Pemula" | "Menengah" | "Mahir";
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  duration: string;
  lessons: number;
  ownerId: string;
}

export const coursesData: Course[] = [
  {
    id: 1,
    title: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    category: "Frontend Development",
    level: "Menengah",
    price: 899000,
    originalPrice: 1299000,
    rating: 5.0,
    reviewsCount: 480,
    description: "Step into the future of frontend development. Master server-first rendering, caching strategies, and Tailwind v4's high-performance CSS engine.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
    duration: "24 Jam",
    lessons: 48,
    ownerId: "owner-1"
  },
  {
    id: 2,
    title: "Framer Full Mastery & UI Motion 2026",
    category: "UI/UX Design",
    level: "Pemula",
    price: 999000,
    originalPrice: 1499000,
    rating: 4.9,
    reviewsCount: 320,
    description: "Learn to design, prototype, and build highly interactive layouts with Framer. Master custom animations, scroll variants, and web effects.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    duration: "18 Jam",
    lessons: 35,
    ownerId: "owner-1"
  },
  {
    id: 3,
    title: "UI/UX System Design Core: Figma to Code",
    category: "UI/UX Design",
    level: "Menengah",
    price: 799000,
    originalPrice: 999000,
    rating: 4.8,
    reviewsCount: 512,
    description: "Translate visual ideas into clean code. Master Figma layout principles, component-driven design, typography scales, and unified CSS frameworks.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop&q=80",
    duration: "15 Jam",
    lessons: 30,
    ownerId: "owner-1"
  },
  {
    id: 4,
    title: "Go REST API & Microservices Mastery",
    category: "Backend Development",
    level: "Mahir",
    price: 699000,
    originalPrice: 899000,
    rating: 4.7,
    reviewsCount: 194,
    description: "Build robust, high-performance APIs and microservices in Go. Focus on concurrency models, SQL DB pooling, REST guidelines, and Docker deployment.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    duration: "20 Jam",
    lessons: 42,
    ownerId: "owner-2"
  },
  {
    id: 5,
    title: "iOS Swift & SwiftUI Bootcamp",
    category: "Mobile Development",
    level: "Pemula",
    price: 899000,
    originalPrice: 1199000,
    rating: 4.9,
    reviewsCount: 285,
    description: "Create native iOS apps with swift declarations. Learn navigation flows, state management, offline storage with SwiftData, and App Store publishing.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80",
    duration: "30 Jam",
    lessons: 60,
    ownerId: "owner-2"
  },
  {
    id: 6,
    title: "React Native CLI: Cross-Platform Apps",
    category: "Mobile Development",
    level: "Menengah",
    price: 799000,
    originalPrice: 1099000,
    rating: 4.8,
    reviewsCount: 165,
    description: "Build iOS and Android apps from a single JavaScript codebase. Work with custom bridge integrations, gesture handlers, and push notifications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80",
    duration: "22 Jam",
    lessons: 45,
    ownerId: "owner-2"
  },
  {
    id: 7,
    title: "Python Advanced & Async Architecture",
    category: "Backend Development",
    level: "Mahir",
    price: 849000,
    originalPrice: 1149000,
    rating: 4.8,
    reviewsCount: 220,
    description: "Deep dive into python multiprocessing, asynchronous programming with asyncio, FastAPI framework, database optimizations, and message brokers.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=80",
    duration: "26 Jam",
    lessons: 52,
    ownerId: "owner-2"
  },
  {
    id: 8,
    title: "TypeScript Core: Safe Code Architecture",
    category: "Frontend Development",
    level: "Pemula",
    price: 499000,
    originalPrice: 699000,
    rating: 4.9,
    reviewsCount: 390,
    description: "Learn to write type-safe, maintainable JavaScript. Master generics, decorators, mapping types, and standard software engineering design patterns.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80",
    duration: "12 Jam",
    lessons: 25,
    ownerId: "owner-2"
  },
  {
    id: 9,
    title: "Flutter & Dart: Full iOS & Android App Development",
    category: "Mobile Development",
    level: "Menengah",
    price: 899000,
    originalPrice: 1399000,
    rating: 4.9,
    reviewsCount: 204,
    description: "Master cross-platform mobile development with Flutter. Build beautiful natively compiled apps with custom state, local DBs, and third party APIs.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80",
    duration: "28 Jam",
    lessons: 50,
    ownerId: "owner-2"
  },
  {
    id: 10,
    title: "Rust Core & System Architecture",
    category: "Backend Development",
    level: "Mahir",
    price: 999000,
    originalPrice: 1499000,
    rating: 5.0,
    reviewsCount: 88,
    description: "Learn safe, fast memory programming. Master lifetimes, memory ownership, smart pointers, safe concurrency, and systems coding in Rust.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    duration: "32 Jam",
    lessons: 64,
    ownerId: "owner-2"
  },
  {
    id: 11,
    title: "Tailwind CSS v4 & Creative Layouts Masterclass",
    category: "Frontend Development",
    level: "Pemula",
    price: 449000,
    originalPrice: 649000,
    rating: 4.8,
    reviewsCount: 175,
    description: "Design custom visual themes with Tailwind v4. Master responsive utility layouts, typography hierarchies, creative grid alignments, and smooth transitions.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80",
    duration: "10 Jam",
    lessons: 20,
    ownerId: "owner-1"
  },
  {
    id: 12,
    title: "Figma Advanced Design System & UI Components",
    category: "UI/UX Design",
    level: "Mahir",
    price: 799000,
    originalPrice: 1099000,
    rating: 4.9,
    reviewsCount: 143,
    description: "Build robust, scalable Figma design systems. Master auto-layout v5, component variables, responsive constraints, style libraries, and team handoffs.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop&q=80",
    duration: "16 Jam",
    lessons: 32,
    ownerId: "owner-1"
  },
  {
    id: 13,
    title: "Next.js 15 & Turbopack Advanced",
    category: "Frontend Development",
    level: "Menengah",
    price: 699000,
    originalPrice: 999000,
    rating: 4.8,
    reviewsCount: 104,
    description: "Deep dive into server actions, partial prerefering, custom routes, and high-fidelity page rendering with Turbopack.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
    duration: "16 Jam",
    lessons: 32,
    ownerId: "owner-1"
  },
  {
    id: 14,
    title: "Kotlin Android Native Core",
    category: "Mobile Development",
    level: "Pemula",
    price: 799000,
    originalPrice: 1099000,
    rating: 4.9,
    reviewsCount: 112,
    description: "Build native Android apps with Kotlin and Jetpack Compose. Learn modern layout constraints, coroutines, and viewmodels.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80",
    duration: "20 Jam",
    lessons: 40,
    ownerId: "owner-2"
  },
  {
    id: 15,
    title: "Nest.js Backend & Microservices Bootcamp",
    category: "Backend Development",
    level: "Mahir",
    price: 899000,
    originalPrice: 1299000,
    rating: 5.0,
    reviewsCount: 95,
    description: "Build modular Node.js microservices with NestJS, RabbitMQ, PostgreSQL, TypeORM, and secure JWT authentication systems.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    duration: "26 Jam",
    lessons: 52,
    ownerId: "owner-2"
  },
  {
    id: 16,
    title: "Framer Web Effects & Advanced Motion",
    category: "UI/UX Design",
    level: "Pemula",
    price: 649000,
    originalPrice: 899000,
    rating: 4.8,
    reviewsCount: 110,
    description: "Create highly interactive website interactions and smooth custom visual transformations using Framer components and layout transitions.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    duration: "14 Jam",
    lessons: 28,
    ownerId: "owner-1"
  },
  {
    id: 17,
    title: "React Hook & Global State Architecture",
    category: "Frontend Development",
    level: "Menengah",
    price: 549000,
    originalPrice: 799000,
    rating: 4.9,
    reviewsCount: 156,
    description: "Master React hook mechanics. Study performance optimization, custom hook composition, and global state with Redux Toolkit and Zustand.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80",
    duration: "18 Jam",
    lessons: 36,
    ownerId: "owner-1"
  },
  {
    id: 18,
    title: "Docker & Kubernetes for Developers",
    category: "Backend Development",
    level: "Mahir",
    price: 799000,
    originalPrice: 1199000,
    rating: 4.8,
    reviewsCount: 88,
    description: "Containerize your developer workflow. Learn image builds, Docker compose, multi-stage assemblies, Kubernetes pods, services, and deployments.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=80",
    duration: "22 Jam",
    lessons: 44,
    ownerId: "owner-2"
  }
];

export const categories = [
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "UI/UX Design"
];

export const levels = ["Pemula", "Menengah", "Mahir"];

export const roles = [
  { id: "public", name: "Calon Pelanggan", badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/40" },
  { id: "student", name: "Pelanggan", badgeColor: "bg-[#A156E3]/20 text-[#DDA5FF] border-[#A156E3]/40" },
  { id: "admin", name: "Admin", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "owner", name: "Course Owner", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40" }
];

export interface Owner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
}

export const ownersData: Record<string, Owner> = {
  "owner-1": {
    id: "owner-1",
    name: "Luthfi Alan",
    email: "alanperdana08@gmail.com",
    avatar: "LA",
    title: "Senior Frontend Engineer & UI Expert",
    bio: "Luthfi Alan adalah seorang praktisi industri senior yang memimpin tim kurikulum di ByteStart. Berpengalaman bertahun-tahun dalam Next.js, Framer Motion, dan Figma."
  },
  "owner-2": {
    id: "owner-2",
    name: "Olivia Rhye",
    email: "olivia.rhye@bytestart.edu",
    avatar: "OR",
    title: "Lead Platform Architect & Go/Rust Expert",
    bio: "Olivia Rhye adalah arsitek sistem terdistribusi dengan spesialisasi Backend di Go, Rust, dan sistem microservices berbasis Docker/Kubernetes."
  }
};
