// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Users,
  BarChart,
  UserCircle, 
  Heart,
  MapPin
} from 'lucide-react';
import type { ReactNode } from 'react';

// ۱. یک اینترفیس برای تعریف پراپ‌های ورودی کامپوننت بسازید
interface SidebarProps {
  isSidebarOpen: boolean;
}

// Define the structure for a navigation link
interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

// --- Navigation Links for Each Role ---
const userLinks: NavLink[] = [
  { href: '/dashboard', label: 'Menu', icon: <Utensils size={20} /> },
  { href: '/dashboard/orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <UserCircle size={20} /> },
  { href: '/dashboard/addresses', label: 'مدیریت آدرس‌ها', icon: <MapPin size={20} /> },
  { href: '/dashboard/blog', label: 'Menu', icon: <Utensils size={20} /> },
  { href: '/dashboard/favorites', label: 'علاقه‌مندی‌ها', icon: <Heart size={20} /> },

];

const adminLinks: NavLink[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/admin/foods', label: 'Manage Foods', icon: <Utensils size={20} /> },
  { href: '/dashboard/admin/orders', label: 'Manage Orders', icon: <ShoppingBag size={20} /> },
  { href: '/dashboard/admin/users', label: 'Users', icon: <Users size={20} /> },
];

const ownerLinks: NavLink[] = [
  ...adminLinks, // Owner has all admin links
  { href: '/dashboard/owner/analytics', label: 'Analytics', icon: <BarChart size={20} /> },
  { href: '/dashboard/owner/admins', label: 'Manage Admins', icon: <Users size={20} /> },
];
// -----------------------------------------


export default function Sidebar({ isSidebarOpen }: SidebarProps ) {
  const { data: session, status } = useSession();

// if(session ){
//   session.user?.
// }
  // Show a loading state while session is being fetched
  if (status === 'loading') {
    return <aside className="w-64 bg-gray-800 p-4 text-white">Loading...</aside>;
  }

  // Don't render the sidebar if the user is not authenticated
  if (!session) {
    return null;
  }

  // Determine which links to display based on the user's role

  const role = session.user?.role; // Ensure your session object includes the role
  let navLinks: NavLink[] = userLinks; // Default to user links

  if (role === 'OWNER') {
    navLinks = ownerLinks;
  } else if (role === 'ADMIN') {
    navLinks = adminLinks;
  }

  return (
    <aside className={`w-64 min-h-screen bg-gray-900 text-gray-200 p-4 
      transition-transform transform 
      fixed md:static z-20
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0`}>
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-white">Food App</h2>
        <span className="text-sm text-gray-400">{role}</span>
      </div>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-2">
              <Link
                href={link.href}
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}