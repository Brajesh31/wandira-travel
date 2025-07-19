import { LayoutDashboard, Map, MapPlus, UsersRound ,ArrowRightLeft } from "lucide-react";

export const sidebarIcon = [
  {
    id: 1,
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    id: 2,
    icon: Map,
    label: "All Trips",
    href: "/admin/trips",
  },
  {
    id: 3,
    icon: UsersRound,
    label: "All Users",
    href: "/admin/all-users",
  },
  {
    id: 4,
    icon: MapPlus,
    label: "Generate Trips",
    href: "/admin/create-trip",
  },
  {
    id: 5,
    icon: ArrowRightLeft,
    label: "User Mode",
    href: "/",
  },
];