import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sprout,
  X,
} from 'lucide-react';
import '../../styles/login.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, adminProfile, login, resetPassword, error, clearError } = useAuth();

  // Form states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Field validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetSubmitting, setResetSubmitting] = useState<boolean>(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user && adminProfile) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, adminProfile, navigate, location]);

  // Email format regex validation
  const validateEmailFormat = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let hasValidationError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required.');
      hasValidationError = true;
    } else if (!validateEmailFormat(email)) {
      setEmailError('Please enter a valid email address (e.g. admin@taazatokari.com).');
      hasValidationError = true;
    } else {
      setEmailError(null);
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required.');
      hasValidationError = true;
    } else {
      setPasswordError(null);
    }

    if (hasValidationError) {
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error state handled inside AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMessage(null);
    setResetSuccessMessage(null);

    if (!resetEmail.trim()) {
      setResetErrorMessage('Please enter your admin email address.');
      return;
    }

    if (!validateEmailFormat(resetEmail)) {
      setResetErrorMessage('Please enter a valid email address.');
      return;
    }

    setResetSubmitting(true);
    try {
      await resetPassword(resetEmail);
      setResetSuccessMessage('Password reset link sent! Check your inbox to set a new password.');
    } catch (err: any) {
      setResetErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon-wrapper">
            <Sprout size={32} />
          </div>
          <h1 className="brand-title">TaazaTokari</h1>
          <p className="brand-subtitle">Operational Control Center • Admin Portal</p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div>{error}</div>
          </div>
        )}

        {/* Global Success Banner (e.g. from password reset) */}
        {resetSuccessMessage && !showForgotModal && (
          <div className="alert-banner success" role="status">
            <CheckCircle2 size={18} className="alert-icon" />
            <div>{resetSuccessMessage}</div>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">
              Admin Email
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="admin-email"
                type="email"
                className={`form-input ${emailError ? 'has-error' : ''}`}
                placeholder="admin@taazatokari.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                  if (error) clearError();
                }}
                disabled={submitting}
                autoComplete="email"
                autoFocus
              />
            </div>
            {emailError && <span className="field-error">{emailError}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${passwordError ? 'has-error' : ''}`}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                  if (error) clearError();
                }}
                disabled={submitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <span className="field-error">{passwordError}</span>}
          </div>

          {/* Forgot Password Link */}
          <div className="form-meta">
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => {
                setResetEmail(email);
                setResetErrorMessage(null);
                setResetSuccessMessage(null);
                setShowForgotModal(true);
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="modal-title">Reset Admin Password</h2>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ color: 'var(--slate-400)', padding: '4px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-description">
              Enter your registered administrator email address and we'll dispatch a secure password reset link.
            </p>

            {resetErrorMessage && (
              <div className="alert-banner error" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} className="alert-icon" />
                <div>{resetErrorMessage}</div>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="alert-banner success" style={{ marginBottom: '16px' }}>
                <CheckCircle2 size={16} className="alert-icon" />
                <div>{resetSuccessMessage}</div>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    placeholder="admin@taazatokari.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={resetSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForgotModal(false)}
                  disabled={resetSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={resetSubmitting}
                >
                  {resetSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
