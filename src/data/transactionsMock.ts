export interface TransactionItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
}

export interface Transaction {
  id: string;
  date: string;
  totalPrice: number;
  paymentType: string;
  items: TransactionItem[];
  couponApplied?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const dummyTransactions: Transaction[] = [
  {
    id: "BS-666D4B7",
    date: "Jan 4, 2026",
    totalPrice: 149000,
    paymentType: "BNI VA",
    items: [
      {
        id: 11,
        title: "Tailwind CSS v4 & Creative Layouts Masterclass",
        price: 149000,
        originalPrice: 649000
      }
    ],
    couponApplied: "KEELEARNING",
    firstName: "Luthfi Alan",
    lastName: "Perdana",
    email: "luthfialan@bytestart.com"
  },
  {
    id: "BS-2850192",
    date: "Dec 20, 2025",
    totalPrice: 899000,
    paymentType: "GoPay",
    items: [
      {
        id: 1,
        title: "Next.js 15 & Tailwind v4 Pro: Build Production Apps",
        price: 899000,
        originalPrice: 1299000
      }
    ],
    firstName: "Luthfi Alan",
    lastName: "Perdana",
    email: "luthfialan@bytestart.com"
  },
  {
    id: "BS-1928401",
    date: "Nov 15, 2025",
    totalPrice: 1598000,
    paymentType: "BNI VA",
    items: [
      {
        id: 2,
        title: "Framer Full Mastery & UI Motion 2026",
        price: 999000,
        originalPrice: 1499000
      },
      {
        id: 4,
        title: "Go REST API & Microservices Mastery",
        price: 599000,
        originalPrice: 899000
      }
    ],
    firstName: "Luthfi Alan",
    lastName: "Perdana",
    email: "luthfialan@bytestart.com"
  }
];
