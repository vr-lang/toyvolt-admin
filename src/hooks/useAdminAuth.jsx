import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { authService } from '../services/adminService';
import { parseApiError, getErrorMessage, setStoredToken, getStoredToken } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));
  const [setupStatus, setSetupStatus] = useState(null);
  const [isCheckingSetup, setIsCheckingSetup] = useState(false);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check setup requirement on startup
  const checkSetupStatus = useCallback(async () => {
    setIsCheckingSetup(true);
    try {
      const status = await authService.getSetupStatus();
      setSetupStatus(status);
      return status;
    } catch {
      const fallback = { hasAdmin: true, isSetupRequired: false };
      setSetupStatus(fallback);
      return fallback;
    } finally {
      setIsCheckingSetup(false);
    }
  }, []);

  // Verify current session with backend /auth/me
  const refreshSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setAdminUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const user = await authService.getMe();
      if (user && user.role === 'admin') {
        setAdminUser(user);
        setAuthError(null);
        return user;
      } else {
        setAdminUser(null);
        setStoredToken(null);
        return null;
      }
    } catch {
      setAdminUser(null);
      setStoredToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSetupStatus();
    refreshSession();
  }, [checkSetupStatus, refreshSession]);

  const login = async ({ adminId, password }) => {
    setAuthError(null);
    try {
      const res = await authService.login({ adminId, password });
      const user = res.data?.user || res.user || res.data;

      if (!user || user.role !== 'admin') {
        await authService.logout();
        setAdminUser(null);
        const err = new Error('Access Denied. Account lacks verified administrator privileges.');
        err.type = 'forbidden';
        err.status = 403;
        throw err;
      }

      setAdminUser(user);
      const destination = location.state?.from || '/dashboard';
      navigate(destination, { replace: true });
      return user;
    } catch (err) {
      const parsed = parseApiError(err, 'Failed to authenticate administrator.');
      setAuthError(parsed.message);
      const errorObj = new Error(parsed.message);
      errorObj.type = parsed.type;
      errorObj.status = parsed.status;
      errorObj.retryable = parsed.retryable;
      throw errorObj;
    }
  };

  const setupInitialAdmin = async (formData) => {
    setAuthError(null);
    try {
      const res = await authService.setupInitialAdmin(formData);
      const user = res.data?.user;
      setAdminUser(user);
      setSetupStatus({ hasAdmin: true, isSetupRequired: false });
      navigate('/dashboard', { replace: true });
      return user;
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to initialize administrator.');
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAdminUser(null);
      setStoredToken(null);
      navigate('/login', { replace: true });
    }
  };

  const value = {
    adminUser,
    isAuthenticated: Boolean(adminUser && adminUser.role === 'admin'),
    isLoading,
    setupStatus,
    isCheckingSetup,
    authError,
    setAuthError,
    login,
    setupInitialAdmin,
    logout,
    refreshSession,
    checkSetupStatus
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

/**
 * Route protection gate: ensures administrator is signed in before granting access to dashboard routes.
 */
export const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, setupStatus } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-ink border-t-primary-blue animate-spin mb-4" />
        <span className="font-mono text-xs uppercase font-bold tracking-wider text-ink mb-3">
          VERIFYING OPERATOR CREDENTIALS // SYSTEM INIT
        </span>
        <button
          type="button"
          onClick={() => {
            setStoredToken(null);
            window.location.href = '/login';
          }}
          className="font-mono text-[11px] text-[#315FE8] underline uppercase hover:text-ink mt-2"
        >
          Taking longer than expected? Return to Login
        </button>
      </div>
    );
  }

  // If initial admin setup is required according to backend, redirect to setup
  if (setupStatus?.isSetupRequired === true) {
    return <Navigate to="/setup" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
