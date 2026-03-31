import { usePage } from '@inertiajs/react';

export interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: string[];
}

export function usePermissions() {
    const { currentUserRole } = usePage().props as { currentUserRole: Role | null };
    
    const hasPermission = (permission: string): boolean => {
        if (!currentUserRole) return false;
        return currentUserRole.permissions.includes('*') || currentUserRole.permissions.includes(permission);
    };
    
    const hasAnyPermission = (permissions: string[]): boolean => {
        if (!currentUserRole) return false;
        if (currentUserRole.permissions.includes('*')) return true;
        return permissions.some(permission => currentUserRole.permissions.includes(permission));
    };
    
    const hasAllPermissions = (permissions: string[]): boolean => {
        if (!currentUserRole) return false;
        if (currentUserRole.permissions.includes('*')) return true;
        return permissions.every(permission => currentUserRole.permissions.includes(permission));
    };
    
    const getRoleName = (): string => {
        return currentUserRole?.name || 'Unknown';
    };
    
    const getRoleSlug = (): string => {
        return currentUserRole?.slug || 'unknown';
    };
    
    const getPermissions = (): string[] => {
        return currentUserRole?.permissions || [];
    };
    
    const isAdmin = (): boolean => {
        return currentUserRole?.slug === 'admin';
    };
    
    const isStaff = (): boolean => {
        return currentUserRole?.slug === 'staff';
    };
    
    const isViewer = (): boolean => {
        return currentUserRole?.slug === 'viewer';
    };
    
    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getRoleName,
        getRoleSlug,
        getPermissions,
        isAdmin,
        isStaff,
        isViewer,
        role: currentUserRole,
    };
}

// Available permissions in the system
export const PERMISSIONS = {
    // Wildcard permission (all permissions)
    ALL: '*',
    
    // Dashboard permissions
    VIEW_DASHBOARD: 'view_dashboard',
    
    // CMS permissions
    MANAGE_CMS: 'manage_cms',
    
    // Events permissions
    MANAGE_EVENTS: 'manage_events',
    
    // Forms permissions
    MANAGE_FORMS: 'manage_forms',
    
    // User management permissions
    MANAGE_USERS: 'manage_users',
    
    // Role management permissions
    MANAGE_ROLES: 'manage_roles',
    
    // Academies management permissions
    MANAGE_ACADEMIES: 'manage_academies',
    
    // System permissions
    MANAGE_SYSTEM: 'manage_system',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
