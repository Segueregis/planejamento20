
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Truck, Users, ClipboardList, Fuel, 
  Settings, FileText, LayoutDashboard, Menu, X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, icon: Icon, label, isActive, onClick 
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
          : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/forklifts", icon: Truck, label: "Empilhadeiras" },
    { to: "/operators", icon: Users, label: "Operadores" },
    { to: "/operations", icon: ClipboardList, label: "Operações" },
    { to: "/maintenance", icon: Settings, label: "Manutenção" },
    { to: "/gas-supply", icon: Fuel, label: "Abastecimento" },
    { to: "/reports", icon: FileText, label: "Relatórios" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar Backdrop (Mobile Only) */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-5">
            <h1 className="text-xl font-bold text-sidebar-foreground">Forklift Manager</h1>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className="p-1 rounded-lg text-sidebar-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {links.map((link) => (
              <SidebarLink 
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
                onClick={isMobile ? closeSidebar : undefined}
              />
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <Users className="w-4 h-4 text-sidebar-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Administrador</p>
                <p className="text-xs text-sidebar-foreground/70">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
