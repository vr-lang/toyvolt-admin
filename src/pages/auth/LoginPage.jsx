import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, ShieldCheck, KeyRound, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { parseApiError } from '../../services/api';
import ToyvoltLogo from '../../components/common/ToyvoltLogo';
import StatusBadge from '../../components/common/StatusBadge';

export const LoginPage = () => {
  const { login, setupStatus } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorObj(null);

    if (!adminId.trim()) {
      setErrorObj({
        type: 'validation',
        title: 'REQUIRED FIELD',
        message: 'Admin ID or Email is required.',
        retryable: false
      });
      return;
    }
    if (!password) {
      setErrorObj({
        type: 'validation',
        title: 'REQUIRED FIELD',
        message: 'Password is required.',
        retryable: false
      });
      return;
    }

    setLoading(true);
    try {
      await login({
        adminId: adminId.trim(),
        password
      });
      // Redirect handled by useAdminAuth hook
    } catch (err) {
      const parsed = err.type ? err : parseApiError(err);
      let title = 'AUTHENTICATION FAILED';
      if (parsed.type === 'credentials') title = 'INVALID CREDENTIALS (401)';
      else if (parsed.type === 'cold_start') title = 'BACKEND WAKING UP (COLD START)';
      else if (parsed.type === 'network') title = 'BACKEND UNREACHABLE';
      else if (parsed.type === 'server_error') title = 'SERVER ERROR (500)';
      else if (parsed.type === 'forbidden') title = 'ACCESS RESTRICTED (403)';
      else if (parsed.type === 'rate_limit') title = 'RATE LIMIT ENGAGED (429)';

      setErrorObj({
        type: parsed.type,
        title,
        message: parsed.message || 'Authentication failed. Please verify credentials.',
        retryable: Boolean(parsed.retryable)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <ToyvoltLogo className="mb-3" />
          <div className="flex items-center gap-1.5 mb-1">
            <StatusBadge variant="info" size="sm">
              <ShieldCheck className="w-2.5 h-2.5 text-[#315FE8]" /> OPERATOR CONTROL ROOM
            </StatusBadge>
          </div>
          <h1 className="font-display font-black text-xl uppercase tracking-tight text-ink">
            ADMIN SIGN IN
          </h1>
          <p className="font-mono text-xs text-[#6E6E6E] mt-1">
            Enter authorized store administrator credentials.
          </p>
        </div>

        {/* Error Notification */}
        {errorObj && (
          <div
            className={`p-3.5 border-2 border-ink shadow-[3px_3px_0px_#171717] font-mono text-xs mb-5 ${
              errorObj.type === 'cold_start' || errorObj.type === 'rate_limit'
                ? 'bg-[#FFD983] text-ink'
                : 'bg-[#FF5638] text-white'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider mb-1.5 pb-1 border-b border-current/30">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {errorObj.title || 'SYSTEM ALERT'}
              </span>
              {errorObj.type && (
                <span className="text-[9px] font-bold uppercase px-1 py-0.5 border border-current tracking-wider">
                  {errorObj.type}
                </span>
              )}
            </div>
            <p className="leading-relaxed text-[11px] mb-2">{errorObj.message}</p>
            {errorObj.retryable && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className="w-full bg-white text-ink border-2 border-ink font-bold py-1.5 px-3 text-[11px] shadow-[2px_2px_0px_#171717] hover:bg-[#F0EEEE] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 uppercase transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'RETRYING REQUEST...' : 'RETRY CONNECTION'}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin ID / Email */}
          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-ink mb-1">
              ADMIN ID / EMAIL
            </label>
            <input
              type="text"
              required
              autoFocus
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="admin@toyvolt.com"
              className="w-full brutal-input font-mono text-xs"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-[11px] uppercase font-bold text-ink">
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full brutal-input font-mono text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn brutal-btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                  AUTHENTICATING OPERATOR...
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  AUTHORIZE SESSION
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info: Setup banner if setup is needed */}
        {setupStatus?.isSetupRequired === true && (
          <div className="mt-6 pt-4 border-t-2 border-ink bg-[#FFF9F0] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 text-center">
            <span className="font-mono text-[10px] text-[#6E6E6E] block mb-1">
              FIRST TIME BOOTSTRAPPING?
            </span>
            <Link
              to="/setup"
              className="text-[#315FE8] font-bold font-mono text-xs hover:underline uppercase flex items-center justify-center gap-1"
            >
              <KeyRound className="w-3 h-3" /> Initial Admin Setup →
            </Link>
          </div>
        )}

        {setupStatus?.isSetupRequired === false && (
          <div className="mt-6 pt-4 border-t-2 border-ink text-center">
            <p className="font-mono text-[10px] text-[#6E6E6E]">
              SECURE ADMIN NAMESPACE <br />
              Public customer registration disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
