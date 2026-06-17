export interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string;
  course: string;
  progress: number;
  joinedDate: string;
  status: "Active" | "Completed" | "Inactive";
}

export const initialStudents: Student[] = [
  {
    id: 1,
    name: "Victor Santoso",
    email: "victor.santoso@gmail.com",
    avatar: "VS",
    course: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    progress: 85,
    joinedDate: "Jan 15, 2026",
    status: "Active"
  },
  {
    id: 2,
    name: "Amelia Ekawati",
    email: "amelia.eka@yahoo.com",
    avatar: "AE",
    course: "Framer Full Mastery & UI Motion 2026",
    progress: 100,
    joinedDate: "Feb 10, 2026",
    status: "Completed"
  },
  {
    id: 3,
    name: "Pradipta Baskara",
    email: "pradipta.baskara@outlook.com",
    avatar: "PB",
    course: "Go REST API & Microservices Mastery",
    progress: 45,
    joinedDate: "Mar 5, 2026",
    status: "Active"
  },
  {
    id: 4,
    name: "Nabila Mutia",
    email: "nabila.mutia@gmail.com",
    avatar: "NM",
    course: "UI/UX System Design Core: Figma to Code",
    progress: 90,
    joinedDate: "Apr 1, 2026",
    status: "Active"
  },
  {
    id: 5,
    name: "Alif Pratama",
    email: "alif.pratama@gmail.com",
    avatar: "AP",
    course: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    progress: 15,
    joinedDate: "May 22, 2026",
    status: "Active"
  },
  {
    id: 6,
    name: "Indra Lesmana",
    email: "indra.lesmana@gmail.com",
    avatar: "IL",
    course: "iOS Swift & SwiftUI Bootcamp",
    progress: 100,
    joinedDate: "May 28, 2026",
    status: "Completed"
  },
  {
    id: 7,
    name: "Sarah Ahmed",
    email: "sarah.ahmed@brightlabs.com",
    avatar: "SA",
    course: "UI/UX System Design Core: Figma to Code",
    progress: 0,
    joinedDate: "Jun 12, 2026",
    status: "Inactive"
  },
  {
    id: 8,
    name: "Jordan Devereaux",
    email: "jordan.d@fanitech.io",
    avatar: "JD",
    course: "Go REST API & Microservices Mastery",
    progress: 60,
    joinedDate: "May 1, 2026",
    status: "Active"
  },
  {
    id: 9,
    name: "Clara Oswald",
    email: "clara.oswald@tardis.co",
    avatar: "CO",
    course: "Framer Full Mastery & UI Motion 2026",
    progress: 35,
    joinedDate: "Jun 8, 2026",
    status: "Active"
  },
  {
    id: 10,
    name: "Luthfi Alan",
    email: "alanperdana08@gmail.com",
    avatar: "LA",
    course: "React Native CLI: Cross-Platform Apps",
    progress: 75,
    joinedDate: "May 15, 2026",
    status: "Active"
  },
  {
    id: 11,
    name: "Budi Gunawan",
    email: "budi.gunawan@gmail.com",
    avatar: "BG",
    course: "Go REST API & Microservices Mastery",
    progress: 100,
    joinedDate: "Jan 22, 2026",
    status: "Completed"
  },
  {
    id: 12,
    name: "Citra Lestari",
    email: "citra.lestari@gmail.com",
    avatar: "CL",
    course: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    progress: 92,
    joinedDate: "Feb 18, 2026",
    status: "Active"
  },
  {
    id: 13,
    name: "Dian Prasetyo",
    email: "dian.prasetyo@outlook.com",
    avatar: "DP",
    course: "TypeScript Core: Safe Code Architecture",
    progress: 80,
    joinedDate: "Mar 10, 2026",
    status: "Active"
  },
  {
    id: 14,
    name: "Eka Wijaya",
    email: "eka.wijaya@gmail.com",
    avatar: "EW",
    course: "Rust Core & System Architecture",
    progress: 10,
    joinedDate: "Mar 25, 2026",
    status: "Active"
  },
  {
    id: 15,
    name: "Fajar Nugroho",
    email: "fajar.nugroho@yahoo.com",
    avatar: "FN",
    course: "Flutter & Dart: Full iOS & Android App Development",
    progress: 55,
    joinedDate: "Apr 5, 2026",
    status: "Active"
  },
  {
    id: 16,
    name: "Gita Permata",
    email: "gita.permata@brightlabs.com",
    avatar: "GP",
    course: "Framer Full Mastery & UI Motion 2026",
    progress: 100,
    joinedDate: "Apr 12, 2026",
    status: "Completed"
  },
  {
    id: 17,
    name: "Haryanto Putra",
    email: "haryanto.putra@gmail.com",
    avatar: "HP",
    course: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    progress: 65,
    joinedDate: "May 2, 2026",
    status: "Active"
  },
  {
    id: 18,
    name: "Irma Safitri",
    email: "irma.safitri@gmail.com",
    avatar: "IS",
    course: "UI/UX System Design Core: Figma to Code",
    progress: 30,
    joinedDate: "May 9, 2026",
    status: "Inactive"
  },
  {
    id: 19,
    name: "Joko Widodo",
    email: "jokowi@indonesia.go.id",
    avatar: "JW",
    course: "TypeScript Core: Safe Code Architecture",
    progress: 100,
    joinedDate: "Jan 5, 2026",
    status: "Completed"
  },
  {
    id: 20,
    name: "Kartika Sari",
    email: "kartika.sari@yahoo.com",
    avatar: "KS",
    course: "React Native CLI: Cross-Platform Apps",
    progress: 40,
    joinedDate: "Jun 1, 2026",
    status: "Active"
  },
  {
    id: 21,
    name: "Lukman Hakim",
    email: "lukman.hakim@outlook.com",
    avatar: "LH",
    course: "Rust Core & System Architecture",
    progress: 85,
    joinedDate: "Apr 29, 2026",
    status: "Active"
  },
  {
    id: 22,
    name: "Mega Utami",
    email: "mega.utami@gmail.com",
    avatar: "MU",
    course: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
    progress: 100,
    joinedDate: "Feb 28, 2026",
    status: "Completed"
  },
  {
    id: 23,
    name: "Nanang Kosim",
    email: "nanang.kosim@gmail.com",
    avatar: "NK",
    course: "Go REST API & Microservices Mastery",
    progress: 20,
    joinedDate: "Jun 10, 2026",
    status: "Active"
  },
  {
    id: 24,
    name: "Olivia Zalianty",
    email: "olivia.z@gmail.com",
    avatar: "OZ",
    course: "Flutter & Dart: Full iOS & Android App Development",
    progress: 70,
    joinedDate: "May 19, 2026",
    status: "Active"
  }
];
