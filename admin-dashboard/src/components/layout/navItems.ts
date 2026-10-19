import {
  LucideIcon,
  LayoutDashboard,
  ShoppingBag,
  ScrollText,
  Package,
  FolderTree,
  Users,
  Truck,
  IndianRupee,
  Bell,
  Settings,
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: ShoppingBag,
  },
  {
    id: 'purchase-requirements',
    label: 'Purchase Requirement',
    path: '/purchase-requirements',
    icon: ScrollText,
  },
  {
    id: 'products',
    label: 'Products / Inventory',
    path: '/products',
    icon: Package,
  },
  {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: FolderTree,
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: Users,
  },
  {
    id: 'delivery-partners',
    label: 'Delivery Partners',
    path: '/delivery-partners',
    icon: Truck,
  },
  {
    id: 'cod-partner-payments',
    label: 'COD & Partner Payment',
    path: '/cod-partner-payments',
    icon: IndianRupee,
  },
  {
    id: 'notifications-offers',
    label: 'Notifications / Offers',
    path: '/notifications-offers',
    icon: Bell,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export const getPageTitleByPath = (pathname: string): string => {
  const item = NAV_ITEMS.find((nav) => nav.path === pathname);
  if (item) {
    return item.label;
  }
  // Check alternative matching prefixes or aliases
  if (pathname.startsWith('/orders')) return 'Orders';
  if (pathname.startsWith('/purchase-requirements')) return 'Purchase Requirement';
  if (pathname.startsWith('/products')) return 'Products / Inventory';
  if (pathname.startsWith('/categories')) return 'Categories';
  if (pathname.startsWith('/customers')) return 'Customers';
  if (pathname.startsWith('/delivery-partners')) return 'Delivery Partners';
  if (pathname.startsWith('/cod-partner-payments') || pathname.startsWith('/settlements')) return 'COD & Partner Payment';
  if (pathname.startsWith('/notifications-offers') || pathname.startsWith('/notifications')) return 'Notifications / Offers';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return 'TaazaTokari Admin';
};
