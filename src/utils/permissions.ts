import { UserRole } from '@/contexts/AuthContext';

// Sistema de permissões baseado em roles
export const PERMISSIONS = {
  // Administração
  MANAGE_USERS: ['admin'] as UserRole[],
  MANAGE_SYSTEM: ['admin'] as UserRole[],
  
  // Liderança
  MANAGE_TEAM: ['admin', 'lider'] as UserRole[],
  APPROVE_ORDERS: ['admin', 'lider'] as UserRole[],
  VIEW_REPORTS: ['admin', 'lider'] as UserRole[],
  
  // Técnico
  EXECUTE_SERVICES: ['admin', 'lider', 'tecnico'] as UserRole[],
  UPDATE_ORDER_STATUS: ['admin', 'lider', 'tecnico'] as UserRole[],
  
  // Operador (básico)
  VIEW_ORDERS: ['admin', 'lider', 'tecnico', 'operador'] as UserRole[],
  CREATE_ORDERS: ['admin', 'lider', 'tecnico', 'operador'] as UserRole[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Verifica se o usuário tem uma permissão específica baseada em suas roles
 */
export const hasPermission = (userRoles: UserRole[], permission: Permission): boolean => {
  const requiredRoles = PERMISSIONS[permission];
  return userRoles.some(role => requiredRoles.includes(role));
};

/**
 * Hook utilitário para verificar permissões em componentes
 */
export const usePermissions = (userRoles: UserRole[]) => {
  return {
    canManageUsers: hasPermission(userRoles, 'MANAGE_USERS'),
    canManageTeam: hasPermission(userRoles, 'MANAGE_TEAM'),
    canApproveOrders: hasPermission(userRoles, 'APPROVE_ORDERS'),
    canExecuteServices: hasPermission(userRoles, 'EXECUTE_SERVICES'),
    canViewReports: hasPermission(userRoles, 'VIEW_REPORTS'),
    canCreateOrders: hasPermission(userRoles, 'CREATE_ORDERS'),
    canViewOrders: hasPermission(userRoles, 'VIEW_ORDERS'),
    canUpdateOrderStatus: hasPermission(userRoles, 'UPDATE_ORDER_STATUS'),
    canManageSystem: hasPermission(userRoles, 'MANAGE_SYSTEM'),
  };
};