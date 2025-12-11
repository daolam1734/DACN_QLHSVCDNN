'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { menuConfig, getFilteredMenu, hasMenuAccess } from '@/config/menuConfig';
import { MenuItem, MenuGroup } from '@/types/navigation';

interface SidebarProps {
  userRoles: string[];
  userPermissions: string[];
  userName: string;
  userEmail: string;
}

export default function Sidebar({ 
  userRoles, 
  userPermissions, 
  userName,
  userEmail 
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['overview', 'profiles']));

  // Get filtered menu based on user permissions
  const filteredMenu = getFilteredMenu(menuConfig, userRoles, userPermissions);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    const hasActiveItem = group.items.some(item => isActive(item.href));

    return (
      <div key={group.id} className="mb-4">
        <button
          onClick={() => toggleGroup(group.id)}
          className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          <span>{group.label}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-1">
            {group.items.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <>
      {/* User Info */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {userName && userName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'Người dùng'}</p>
            <p className="text-xs text-gray-600 truncate">{userEmail || 'Email'}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {(userRoles || []).map(role => (
                <span 
                  key={role} 
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMenu.map(renderMenuGroup)}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Hệ thống Quản lý Hồ sơ<br />
          Đi nước ngoài TVU
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-40 w-72 h-screen bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
