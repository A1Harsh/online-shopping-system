import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  User,
  CustomerAddress,
  SavedPaymentMethod,
  AdminSession,
  CustomerSession,
} from '../types';
import { mockDb } from '../data/mockDb';
import { INITIAL_USER } from '../data/initialData';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  createAdminSession,
  isSessionExpired,
  authRateLimiter,
} from '../utils/security';
import { logSecurityEvent } from '../utils/securityLogger';

// Default admin password for first-time login (gets replaced with PBKDF2 hash on first use)
const DEFAULT_ADMIN_PASSWORD = 'Admin@1234';

// App-specific localStorage keys to wipe on error reset (instead of clear-all)
export const APP_STORAGE_KEYS = [
  'jayveermart_products',
  'jayveermart_categories',
  'jayveermart_brands',
  'jayveermart_orders',
  'jayveermart_reviews',
  'jayveermart_users',
  'jayveermart_current_user',
  'jayveermart_cart',
  'jayveermart_wishlist',
  'jayveermart_store_settings',
  'jayveermart_admin_sessions',
  'jayveermart_current_admin_session',
  'jayveermart_customer_sessions',
  'jayveermart_current_customer_session',
  'jayveermart_customer_addresses',
  'jayveermart_saved_payments',
  'jayveermart_known_devices',
  'jayveermart_otp_tokens',
  'jayveermart_admin_reset_tokens',
  'jayveermart_email_outbox',
  'jayveermart_processed_login_events',
  'jayveermart_security_audit_logs',
];

export interface AuthContextType {
  user: User | null;
  currentSession: AdminSession | CustomerSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  is2faVerified: boolean;

  // Profile Management
  updateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  updatePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // Customer Addresses
  getCustomerAddresses: () => CustomerAddress[];
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => CustomerAddress;
  updateCustomerAddress: (address: CustomerAddress) => void;
  deleteCustomerAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Saved Payment Methods
  getSavedPaymentMethods: () => SavedPaymentMethod[];
  addSavedCard: (cardName: string, cardNumber: string, expDate: string, isDefault?: boolean) => SavedPaymentMethod;
  addSavedUpi: (upiId: string, isDefault?: boolean) => SavedPaymentMethod;
  deleteSavedPaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // Auth
  login: (emailOrMobile: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; message: string; requiresCaptcha?: boolean }>;
  logout: () => void;
  logoutAllDevices: () => void;
  identifyAccount: (emailOrMobile: string) => { exists: boolean; emailOrMobile: string };
  requestRegistration: (data: any, pass?: string) => Promise<{ success: boolean; message: string }>;
  verifyRegistrationOtp: (token: string, otp: string) => Promise<{ success: boolean; user?: User; message: string }>;
  resendRegistrationOtp: (token: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  verifyPasswordReset: (email: string, otp: string, pass: string) => Promise<{ success: boolean; message: string }>;
  requestCustomerPasswordReset: (emailOrMobile: string) => { success: boolean; message: string };
  verifyCustomerPasswordReset: (token: string, otp: string, pass: string) => Promise<{ success: boolean; message: string }>;
  enable2FA: (secret: string, otp: string) => Promise<{ success: boolean; recoveryCodes?: string[]; message: string }>;
  disable2FA: (password: string) => Promise<{ success: boolean; message: string }>;
  regenerateRecoveryCodes: () => Promise<{ success: boolean; recoveryCodes?: string[]; message: string }>;
  verify2FALogin: (code: string, isRecovery?: boolean) => Promise<{ success: boolean; message: string }>;
  verifyCustomer2FALogin: (code: string, isRecovery?: boolean) => Promise<{ success: boolean; message: string }>;
  getActiveSessions: () => (AdminSession | CustomerSession)[];
  getAdminSessions: () => AdminSession[];
  terminateSession: (sessionId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ─── Storefront User (Public Access — always initialised) ──────────────────
  const [user, setUser] = useState<User>(() => {
    const current = mockDb.getCurrentUser();
    if (current) return current;
    mockDb.saveCurrentUser(INITIAL_USER);
    return INITIAL_USER;
  });

  // ─── Admin Session (Real — persisted in localStorage) ─────────────────────
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const session = mockDb.getCurrentAdminSession();
    if (session && !isSessionExpired(session)) return session;
    if (session) mockDb.saveCurrentAdminSession(null); // clear expired
    return null;
  });

  const [addresses, setAddresses] = useState<CustomerAddress[]>(() => {
    const existing = mockDb.getCustomerAddresses();
    if (existing.length === 0) {
      const defaultAddr: CustomerAddress = {
        id: 'addr_default_1',
        userId: user.user_id,
        fullName: `${user.first_name} ${user.last_name}`.trim(),
        mobile: user.mobile,
        addressLine1: user.address1 || '123, Sample Street',
        addressLine2: user.address2 || 'Area',
        city: 'Your City',
        state: 'Karnataka',
        zip: '000000',
        country: 'India',
        addressType: 'Home',
        isDefault: true,
      };
      mockDb.addCustomerAddress(defaultAddr);
      return [defaultAddr];
    }
    return existing;
  });

  const [payments, setPayments] = useState<SavedPaymentMethod[]>(() => {
    const existing = mockDb.getSavedPaymentMethods();
    if (existing.length === 0) {
      const defaultUpi: SavedPaymentMethod = {
        id: 'pay_default_1',
        userId: user.user_id,
        type: 'UPI',
        upiId: 'rahul.sharma@okaxis',
        isDefault: true,
        token: 'tok_upi_default',
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(defaultUpi);
      return [defaultUpi];
    }
    return existing;
  });

  // ─── Derived auth state ────────────────────────────────────────────────────
  const isAdmin = adminSession !== null && !isSessionExpired(adminSession);
  const isAuthenticated = true; // Storefront is publicly accessible
  const is2faVerified = adminSession?.is2faVerified ?? false;

  // ─── Real Admin Login ──────────────────────────────────────────────────────
  const adminLogin = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; requires2FA?: boolean; message: string; requiresCaptcha?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate-limit check
    const limitStatus = authRateLimiter.check(cleanEmail);
    if (limitStatus.locked) {
      logSecurityEvent('AUTH_RATE_LIMITED', {
        email: cleanEmail,
        status: 'FAILURE',
        action: `Admin login locked for ${limitStatus.lockoutSeconds}s`,
      });
      return {
        success: false,
        requiresCaptcha: true,
        message: `Account temporarily locked. Try again in ${limitStatus.lockoutSeconds} seconds.`,
      };
    }

    // 2. Find admin user
    const users = mockDb.getUsers();
    const adminUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === 'admin'
    );

    if (!adminUser) {
      authRateLimiter.recordFailure(cleanEmail);
      logSecurityEvent('AUTH_LOGIN_FAILURE', {
        email: cleanEmail,
        status: 'FAILURE',
        action: 'Admin login: account not found',
      });
      return { success: false, message: 'Invalid email or password.' };
    }

    // 3. Verify password (PBKDF2 or first-time default)
    let isValid = false;
    if (!adminUser.password_hash || !adminUser.password_salt) {
      // First ever login — accept the default password and immediately hash it
      if (password === DEFAULT_ADMIN_PASSWORD) {
        const salt = generateSalt(16);
        const hash = await hashPassword(password, salt);
        const updatedUser = { ...adminUser, password_hash: hash, password_salt: salt };
        mockDb.saveUsers(users.map((u) => (u.user_id === adminUser.user_id ? updatedUser : u)));
        isValid = true;
      }
    } else {
      isValid = await verifyPassword(password, adminUser.password_hash, adminUser.password_salt);
    }

    if (!isValid) {
      const failure = authRateLimiter.recordFailure(cleanEmail);
      logSecurityEvent('AUTH_LOGIN_FAILURE', {
        userId: adminUser.user_id,
        email: cleanEmail,
        status: 'FAILURE',
        action: 'Admin login: wrong password',
      });
      const remaining = failure.remainingAttempts;
      return {
        success: false,
        requiresCaptcha: failure.requiresCaptcha,
        message: remaining > 0
          ? `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
          : 'Account locked due to too many failed attempts.',
      };
    }

    // 4. Success — create and persist session
    authRateLimiter.reset(cleanEmail);
    const session = createAdminSession(adminUser, false, false);

    // Store in sessions list + current session
    const existingSessions = mockDb.getAdminSessions();
    mockDb.saveAdminSessions([session, ...existingSessions.slice(0, 9)]); // keep last 10
    mockDb.saveCurrentAdminSession(session);
    setAdminSession(session);

    logSecurityEvent('AUTH_LOGIN_SUCCESS', {
      userId: adminUser.user_id,
      email: cleanEmail,
      status: 'SUCCESS',
      action: 'Admin login successful',
    });

    return { success: true, message: 'Login successful.' };
  }, []);

  // ─── Admin Logout ──────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    if (adminSession) {
      logSecurityEvent('AUTH_LOGOUT', {
        userId: adminSession.userId,
        email: adminSession.email,
        status: 'SUCCESS',
        action: 'Admin logout',
      });
      mockDb.terminateAdminSession(adminSession.sessionId);
      mockDb.saveCurrentAdminSession(null);
    }
    setAdminSession(null);
  }, [adminSession]);

  const logoutAllDevices = useCallback(() => {
    if (adminSession) {
      logSecurityEvent('AUTH_LOGOUT_ALL', {
        userId: adminSession.userId,
        email: adminSession.email,
        status: 'SUCCESS',
        action: 'Admin logout all devices',
      });
      mockDb.terminateAllAdminSessions();
    }
    setAdminSession(null);
  }, [adminSession]);

  // ─── Session Management ────────────────────────────────────────────────────
  const getAdminSessions = useCallback(() => mockDb.getAdminSessions(), []);

  const getActiveSessions = useCallback((): (AdminSession | CustomerSession)[] => {
    return mockDb.getAdminSessions();
  }, []);

  const terminateSession = useCallback((sessionId: string) => {
    mockDb.terminateAdminSession(sessionId);
    if (adminSession?.sessionId === sessionId) {
      setAdminSession(null);
      mockDb.saveCurrentAdminSession(null);
    }
  }, [adminSession]);

  // ─── Profile Updates ───────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updatedData: Partial<User>): Promise<boolean> => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      mockDb.saveCurrentUser(updated);
      const all = mockDb.getUsers().map((u) => (u.user_id === prev.user_id ? updated : u));
      mockDb.saveUsers(all);
      return updated;
    });
    return true;
  }, []);

  const updatePassword = useCallback(async (_oldPass: string, _newPass: string) => {
    return { success: true, message: 'Password updated successfully.' };
  }, []);

  // ─── Customer Addresses ────────────────────────────────────────────────────
  const getCustomerAddresses = useCallback(() => {
    return mockDb.getCustomerAddresses(user.user_id);
  }, [user.user_id]);

  const addCustomerAddress = useCallback(
    (addressData: Omit<CustomerAddress, 'id'>): CustomerAddress => {
      const newAddress: CustomerAddress = {
        ...addressData,
        id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      mockDb.addCustomerAddress(newAddress);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
      return newAddress;
    },
    [user.user_id]
  );

  const updateCustomerAddress = useCallback(
    (updated: CustomerAddress) => {
      mockDb.updateCustomerAddress(updated);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  const deleteCustomerAddress = useCallback(
    (id: string) => {
      mockDb.deleteCustomerAddress(id);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      const all = mockDb.getCustomerAddresses();
      all.forEach((a) => {
        if (a.userId === user.user_id) {
          a.isDefault = a.id === id;
        }
      });
      mockDb.saveCustomerAddresses(all);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  // ─── Saved Payment Methods ─────────────────────────────────────────────────
  const getSavedPaymentMethods = useCallback(() => {
    return mockDb.getSavedPaymentMethods(user.user_id);
  }, [user.user_id]);

  const addSavedCard = useCallback(
    (cardName: string, cardNumber: string, expDate: string, isDefault: boolean = false): SavedPaymentMethod => {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4);
      let cardBrand: SavedPaymentMethod['cardBrand'] = 'Visa';
      if (cleanNum.startsWith('5')) cardBrand = 'Mastercard';
      else if (cleanNum.startsWith('6') || cleanNum.startsWith('8')) cardBrand = 'RuPay';
      else if (cleanNum.startsWith('3')) cardBrand = 'Amex';

      const expParts = expDate.split('/');
      const expiryMonth = expParts[0] || '12';
      const expiryYear = expParts[1] ? `20${expParts[1]}` : '2028';

      const newMethod: SavedPaymentMethod = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: user.user_id,
        type: 'CARD',
        cardHolderName: cardName,
        cardBrand,
        last4,
        expiryMonth,
        expiryYear,
        isDefault,
        token: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(newMethod);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
      return newMethod;
    },
    [user.user_id]
  );

  const addSavedUpi = useCallback(
    (upiId: string, isDefault: boolean = false): SavedPaymentMethod => {
      const newMethod: SavedPaymentMethod = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: user.user_id,
        type: 'UPI',
        upiId: upiId.trim(),
        isDefault,
        token: `tok_upi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(newMethod);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
      return newMethod;
    },
    [user.user_id]
  );

  const deleteSavedPaymentMethod = useCallback(
    (id: string) => {
      mockDb.deleteSavedPaymentMethod(id);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
    },
    [user.user_id]
  );

  const setDefaultPaymentMethod = useCallback(
    (id: string) => {
      const all = mockDb.getSavedPaymentMethods();
      all.forEach((p) => {
        if (p.userId === user.user_id) {
          p.isDefault = p.id === id;
        }
      });
      mockDb.saveSavedPaymentMethods(all);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
    },
    [user.user_id]
  );

  // ─── Storefront Stubs (public access — login not required for browsing) ────
  const login = useCallback(async () => ({ success: true, message: 'Access granted' }), []);
  const identifyAccount = useCallback((emailOrMobile: string) => ({ exists: true, emailOrMobile }), []);
  const requestRegistration = useCallback(async () => ({ success: true, message: 'Registered' }), []);
  const verifyRegistrationOtp = useCallback(async () => ({ success: true, user, message: 'Verified' }), [user]);
  const resendRegistrationOtp = useCallback(() => ({ success: true, message: 'Resent' }), []);
  const requestPasswordReset = useCallback(() => ({ success: true, message: 'OTP sent' }), []);
  const verifyPasswordReset = useCallback(async () => ({ success: true, message: 'Password reset' }), []);
  const requestCustomerPasswordReset = useCallback(() => ({ success: true, message: 'OTP sent' }), []);
  const verifyCustomerPasswordReset = useCallback(async () => ({ success: true, message: 'Password reset' }), []);
  const enable2FA = useCallback(async () => ({ success: true, message: '2FA Enabled' }), []);
  const disable2FA = useCallback(async () => ({ success: true, message: '2FA Disabled' }), []);
  const regenerateRecoveryCodes = useCallback(async () => ({ success: true, message: 'Codes generated' }), []);
  const verify2FALogin = useCallback(async () => ({ success: true, message: 'Verified' }), []);
  const verifyCustomer2FALogin = useCallback(async () => ({ success: true, message: 'Verified' }), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentSession: adminSession,
        isAuthenticated,
        isAdmin,
        is2faVerified,
        updateProfile,
        updatePassword,
        getCustomerAddresses,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        getSavedPaymentMethods,
        addSavedCard,
        addSavedUpi,
        deleteSavedPaymentMethod,
        setDefaultPaymentMethod,
        login,
        adminLogin,
        logout,
        logoutAllDevices,
        identifyAccount,
        requestRegistration,
        verifyRegistrationOtp,
        resendRegistrationOtp,
        requestPasswordReset,
        verifyPasswordReset,
        requestCustomerPasswordReset,
        verifyCustomerPasswordReset,
        enable2FA,
        disable2FA,
        regenerateRecoveryCodes,
        verify2FALogin,
        verifyCustomer2FALogin,
        getActiveSessions,
        getAdminSessions,
        terminateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
