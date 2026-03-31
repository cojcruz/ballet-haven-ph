export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'staff' | 'viewer';
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        impersonating: boolean;
        originalUser: User | null;
    };
    roles: Role[];
    currentUserRole: Role | null;
};
