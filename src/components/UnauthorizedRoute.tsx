import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  avoidRoles: UserRole[];
}

export function UnauthorizedRoute({
    children,
    avoidRoles
}: ProtectedRouteProps) {
    const { hasAnyRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (hasAnyRole(avoidRoles)) {
            navigate(-1);
        }
    }, [hasAnyRole, avoidRoles, navigate]);

    if (hasAnyRole(avoidRoles)) {
        return null;
    }

    return <>{children}</>;
}