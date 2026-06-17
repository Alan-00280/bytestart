export type Role = {
  role: string;
  group: string;
  accessLevel: string;
  users: number;
  permissionSets: string[];
  lastReview: string;
  owner: string;
  status: "Active" | "Needs review";
};

export const roles: Role[] = [
  {
    role: "Admin",
    group: "System roles",
    accessLevel: "Full",
    users: 3,
    permissionSets: [
      "User Accounts Control",
      "Platform Settings",
      "Revenue Reports",
      "System Logs Monitor",
      "Security Auditing",
      "Role Switcher Core"
    ],
    lastReview: "Jun 16, 2026",
    owner: "System",
    status: "Active",
  },
  {
    role: "Course Owner",
    group: "System roles",
    accessLevel: "Scoped",
    users: 2,
    permissionSets: [
      "Catalog Management",
      "Curriculum Editor",
      "Reviews Moderation",
      "Q&A Manager",
      "Instructor Announcements",
      "Estimated Revenue Insights"
    ],
    lastReview: "Jun 16, 2026",
    owner: "System",
    status: "Active",
  },
  {
    role: "Student",
    group: "System roles",
    accessLevel: "Scoped",
    users: 3842,
    permissionSets: [
      "My Learning Dashboard",
      "Course Video Player",
      "Take Notes & Timestamps",
      "Submit Reviews",
      "Q&A Discussion",
      "Purchase History & Invoices"
    ],
    lastReview: "Jun 15, 2026",
    owner: "System",
    status: "Active",
  },
  {
    role: "Guest",
    group: "System roles",
    accessLevel: "Read only",
    users: 15420,
    permissionSets: [
      "View Course Catalog",
      "Read Technical Articles",
      "Browse Landing Page",
      "Newsletter Subscription"
    ],
    lastReview: "Jun 12, 2026",
    owner: "System",
    status: "Active",
  },
  // {
  //   role: "Content Editor",
  //   group: "Custom roles",
  //   accessLevel: "Scoped",
  //   users: 4,
  //   permissionSets: [
  //     "Article Writer Editor",
  //     "Categories Manager",
  //     "SEO Metadata Config",
  //     "Draft Submissions"
  //   ],
  //   lastReview: "Jun 10, 2026",
  //   owner: "Jane Doe",
  //   status: "Active",
  // },
  // {
  //   role: "Support Staff",
  //   group: "Custom roles",
  //   accessLevel: "Scoped",
  //   users: 6,
  //   permissionSets: [
  //     "Q&A Answers Moderation",
  //     "User Support Tickets",
  //     "Refund Requests Review"
  //   ],
  //   lastReview: "Jun 12, 2026",
  //   owner: "Chris Lee",
  //   status: "Active",
  // },
  // {
  //   role: "Finance Officer",
  //   group: "Custom roles",
  //   accessLevel: "Scoped",
  //   users: 2,
  //   permissionSets: [
  //     "Invoices Auditing",
  //     "Billing Logs Analysis",
  //     "Coupon Codes Generator"
  //   ],
  //   lastReview: "Jun 14, 2026",
  //   owner: "Alex Kim",
  //   status: "Active",
  // },
];
