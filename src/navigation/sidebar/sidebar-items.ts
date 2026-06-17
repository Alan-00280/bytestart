import {
  Banknote,
  Calendar,
  ChartBar,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: ListTodo,
      },
      {
        title: "E-commerce",
        url: "/dashboard/ecommerce",
        icon: ShoppingBag,
      },
      {
        title: "Academy",
        url: "/dashboard/academy",
        icon: GraduationCap,
        isNew: true,
      },
      {
        title: "Logistics",
        url: "/dashboard/logistics",
        icon: Forklift,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        title: "Invoice",
        url: "/dashboard/coming-soon",
        icon: ReceiptText,
        comingSoon: true,
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login", url: "https://true-series-379734.framer.app/login", newTab: true },
          { title: "Register", url: "https://true-series-379734.framer.app/", newTab: true },
        ],
      },
      {
        title: "Calendar",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
      },
    ],
  },
  // {
  //   id: 3,
  //   label: "Legacy",
  //   items: [
  //     {
  //       title: "Dashboards",
  //       url: "/dashboard/default-v1",
  //       subItems: [
  //         { title: "Default V1", url: "/dashboard/default-v1" },
  //         { title: "CRM V1", url: "/dashboard/crm-v1" },
  //         { title: "Finance V1", url: "/dashboard/finance-v1" },
  //         { title: "Analytics V1", url: "/dashboard/analytics-v1" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   label: "Misc",
  //   items: [
  //     {
  //       title: "Others",
  //       url: "/dashboard/coming-soon",
  //       icon: SquareArrowUpRight,
  //       comingSoon: true,
  //     },
  //   ],
  // },
];
