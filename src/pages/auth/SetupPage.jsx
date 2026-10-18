import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import ToyvoltLogo from '../../components/common/ToyvoltLogo';
import StatusBadge from '../../components/common/StatusBadge';

export const SetupPage = () => {
  const { setupStatus, isCheckingSetup, setupInitialAdmin, checkSetupStatus } = useAdminAuth();
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSetupStatus();
  }, [checkSetupStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side pre-validations
    if (!adminId.trim()) {
      setError('Admin ID or Email is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    try {
      await setupInitialAdmin({
        adminId: adminId.trim(),
        name: name.trim() || 'Toyvolt SuperAdmin',
        password,
        confirmPassword
      });
      // Will navigate to /dashboard via setupInitialAdmin hook
    } catch (err) {
      setError(err.message || 'Failed to complete initial administrator setup.');
    } finally {
      setLoading(false);
    }
  };

  // State 1: Checking status with backend
  if (isCheckingSetup && !setupStatus) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-ink border-t-primary-blue animate-spin mb-4" />
        <span className="font-mono text-xs uppercase font-bold text-ink mb-3">
          VERIFYING SETUP PERMISSIONS WITH BACKEND...
        </span>
        <Link
          to="/login"
          className="font-mono text-xs text-[#315FE8] underline uppercase hover:text-ink"
        >
          Proceed directly to Admin Login →
        </Link>
      </div>
    );
  }

  // State 2: Setup already completed (enforced by backend)
  if (setupStatus?.hasAdmin === true && setupStatus?.isSetupRequired === false) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-panel border-2 border-ink shadow-[5px_5px_0px_#171717] p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <ToyvoltLogo />
          </div>

          <div className="p-4 bg-[#FFD983] border-2 border-ink shadow-[2px_2px_0px_#171717] mb-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-ink" />
              <span className="font-display font-bold text-xs uppercase text-ink">
                INITIAL SETUP ALREADY COMPLETED
              </span>
            </div>
            <p className="font-mono text-xs text-ink/90 leading-relaxed">
              An administrator account has already been created. The one-time setup endpoint is permanently disabled by the backend security layer.
            </p>
          </div>

          <p className="font-mono text-xs text-[#6E6E6E] mb-6 text-center">
            Sign in using your configured administrator credentials to access the command center.
          </p>

          <Link
            to="/login"
            className="w-full brutal-btn brutal-btn-primary py-2.5 text-center flex items-center justify-center gap-2 text-xs"
          >
            PROCEED TO ADMIN SIGN IN <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // State 3: Endpoint missing on remote server
  if (setupStatus?.endpointMissing === true) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[5px_5px_0px_#171717] p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <ToyvoltLogo />
          </div>

          <div className="p-4 bg-[#FFD983] border-2 border-ink shadow-[2px_2px_0px_#171717] mb-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-ink" />
              <span className="font-display font-bold text-xs uppercase text-ink">
                BACKEND ENDPOINT PENDING DEPLOYMENT
              </span>
            </div>
            <p className="font-mono text-xs text-ink/90 leading-relaxed">
              The remote backend at Render does not have the <code>/auth/setup-status</code> and <code>/auth/setup</code> routes yet.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs text-ink bg-[#FFF9F0] border-2 border-ink p-4 mb-6">
            <div className="font-bold uppercase text-[#315FE8]">AVAILABLE OPTIONS:</div>
            <p>
              1. <strong>Seed an Admin via CLI</strong>: Run <code>npm run seed:admin</code> in the backend directory to provision an initial administrator directly into MongoDB.
            </p>
            <p>
              2. <strong>Run Local Backend</strong>: Point <code>VITE_API_BASE_URL</code> to <code>http://localhost:5001/api/v1</code> where the updated backend code is mounted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => checkSetupStatus()}
              className="flex-1 brutal-btn bg-white hover:bg-[#F0EEEE] py-2 text-xs"
            >
              RECHECK ENDPOINT
            </button>
            <Link
              to="/login"
              className="flex-1 brutal-btn brutal-btn-primary py-2 text-center text-xs flex items-center justify-center gap-1.5"
            >
              ADMIN LOGIN <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Setup allowed (first-time execution)
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <ToyvoltLogo className="mb-3" />
          <div className="flex items-center gap-1.5 mb-1">
            <StatusBadge variant="danger" size="sm">
              <Shield className="w-2.5 h-2.5" /> ONE-TIME SYSTEM PROVISIONING
            </StatusBadge>
          </div>
          <h1 className="font-display font-black text-xl uppercase tracking-tight text-ink">
            FIRST-TIME ADMIN SETUP
          </h1>
          <p className="font-mono text-xs text-[#6E6E6E] mt-1 max-w-sm">
            Configure the primary store administrator. Once completed, public setup is locked permanently.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FF5638] text-white border-2 border-ink shadow-[2px_2px_0px_#171717] font-mono text-xs mb-5">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin ID / Email */}
          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-ink mb-1">
              ADMIN ID / EMAIL ADDRESS *
            </label>
            <input
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="admin@toyvolt.com or admin_root"
              className="w-full brutal-input font-mono text-xs"
            />
            <span className="font-mono text-[10px] text-[#6E6E6E] mt-0.5 block">
              Used as primary sign-in identifier for the control room.
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-ink mb-1">
              ADMINISTRATOR FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Toyvolt SuperAdmin"
              className="w-full brutal-input font-mono text-xs"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-ink mb-1">
              MASTER PASSWORD (MIN 8 CHARACTERS) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full brutal-input font-mono text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-ink mb-1">
              CONFIRM MASTER PASSWORD *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full brutal-input font-mono text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn brutal-btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                  INITIALIZING ATOMIC CREDENTIALS...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  LOCK IN INITIAL ADMINISTRATOR
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-ink text-center">
          <p className="font-mono text-[10px] text-[#6E6E6E]">
            Already initialized?{' '}
            <Link to="/login" className="text-[#315FE8] font-bold hover:underline">
              Go to sign-in page →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
