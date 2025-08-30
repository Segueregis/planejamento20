
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Truck, Users, ClipboardList, Fuel, Clock,
  Settings, FileText, LayoutDashboard, Menu, X
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { open } = useSidebar();
  
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Painel" },
    { to: "/service-orders", icon: ClipboardList, label: "Ordens de Serviço" },
    { to: "/queue", icon: Clock, label: "Fila de Programação" },
    { to: "/reports", icon: FileText, label: "Relatórios" },
    { to: "/print", icon: FileText, label: "Impressão" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? "w-64" : "w-14"}>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          {open && "OS Manager"}
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton asChild isActive={isActive(link.to)}>
                    <Link to={link.to}>
                      <link.icon className="w-5 h-5" />
                      {open && <span>{link.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="w-4 h-4 text-sidebar-accent-foreground" />
          </div>
          {open && (
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Administrador</p>
              <p className="text-xs text-sidebar-foreground/70">v1.0.0</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
