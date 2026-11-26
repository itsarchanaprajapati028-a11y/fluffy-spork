import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error } = useAuth();
  
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);
  
  const validatePassword = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
    return strength >= 4;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!password) setErrors({ password: 'Password is required' });
    else if (!validatePassword(password)) setErrors({ password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' });
    if (password !== confirmPassword) setErrors({ confirmPassword: 'Passwords do not match' });
    
    if (Object.keys(errors).length > 0) return;
    
    const result = await resetPassword(token, password);
    if (result.success || result.message) {
      setSubmitted(true);
    } else {
      setErrors({ form: result.error || 'Failed to reset password' });
    }
  };
  
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };
  
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900">Invalid Reset Link</h2>
          <p className="mt-2 text-gray-600">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="mt-6 btn-primary inline-block">Request New Link</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">FS-01</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">Enter your new password below</p>
        </div>
        
        {submitted ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Password Reset Successful</h3>
            <p className="text-gray-600">Your password has been updated. You can now sign in with your new password.</p>
            <Link to="/login" className="btn-primary inline-block mt-4">Sign In</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                {errors.form}
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18 10c0 3.866 3.134 7 7 7s7-3.134 7-7-3.134-7-7-7-7 3.134-7 7c0 2.017.834 3.845 2.177 5.155.055.054.12.089.193.118.074.03.15.056.228.073.057.017.113.026.17.026h.008c.056 0 .113-.013.169-.037a4.003 4.003 0 001.444-.074c.13-.03.254-.07.37-.118.123-.048.243-.104.358-.166.115-.062.227-.13.335-.203.108-.073.211-.152.309-.234.1-.082.196-.17.288-.261.145-.145.28-.3.401-.472.121-.172.233-.35.335-.534.102-.184.194-.373.275-.567.081-.194.151-.393.209-.597.058-.204.105-.41.14-.617.034-.207.06-.416.077-.626.017-.21.025-.42.025-.627 0-.207-.009-.413-.025-.62-.016-.207-.05-.414-.097-.621-.046-.206-.101-.41-.167-.604-.066-.192-.14-.377-.189-.55-.09-.173-.187-.339-.292-.501-.106-.162-.218-.317-.331-.458-.112-.14-.229-.274-.344-.4-.116-.125-.235-.244-.351-.341-.105-.097-.213-.19-.319-.276-.095-.086-.194-.17-.274-.244-.086-.073-.173-.14-.234-.2-.076-.059-.154-.117-.194-.166-.066-.049-.135-.088-.157-.127-.058-.038-.116-.059-.117-.03-.076-.017-.077.006-.078.029-.078.052-.078.075-.078.098-.078.121-.078.144-.078.167-.078.19-.078.213-.078.236-.078.259-.078.282-.078.305-.078.328-.078.351-.078.374-.078.397-.078.42-.078.443-.078.466-.078.489-.078 5.005-.078 5.028-.078 5.051-.078 5.074-.078 5.097-.078 5.12-.078 5.143-.078 5.166-.078 5.189-.078 5.212-.078 5.235-.078 5.258-.078 5.281-.078 5.304-.078 5.327-.078 5.35-.078 5.373-.078 5.396-.078 5.419-.078 5.442-.078 5.465-.078 5.488-.078 5.511-.078 5.534-.078 5.557-.078 5.58-.078 5.603-.078 5.626-.078 5.649-.078 5.672-.078 5.695-.078 5.718-.078 5.741-.078 5.764-.078 5.787-.078 5.81-.078 5.833-.078 5.856-.078 5.879-.078 5.902-.078 5.925-.078 5.948-.078 5.971-.078 5.994-.078 6.005-.078 6.028-.078 6.051-.078 6.074-.078 6.097-.078 6.12-.078 6.143-.078 6.166-.078 6.189-.078 6.212-.078 6.235-.078 6.258-.078 6.281-.078 6.304-.078 6.327-.078 6.35-.078 6.373-.078 6.373-.078Z"/></svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({}); validatePassword(e.target.value); }}
                className={`appearance-none relative block w-full px-4 py-3 pl-10 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.password}</p>
              )}
            </div>
            
            {password && (
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Password strength: {getStrengthLabel()}</p>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18 10c0 3.866 3.134 7 7 7s7-3.134 7-7-3.134-7-7-7-7 3.134-7 7c0 2.017.834 3.845 2.177 5.155.055.054.12.089.193.118.074.03.15.056.228.073.057.017.113.026.17.026h.008c.056 0 .113-.013.169-.037a4.003 4.003 0 001.444-.074c.13-.03.254-.07.37-.118.123-.048.243-.104.358-.166.115-.062.227-.13.335-.203.108-.073.211-.152.309-.234.1-.082.196-.17.288-.261.145-.145.28-.3.401-.472.121-.172.233-.35.335-.534.102-.184.194-.373.275-.567.081-.194.151-.393.209-.597.058-.204.105-.41.14-.617.034-.207.06-.416.077-.626.017-.21.025-.42.025-.627 0-.207-.009-.413-.025-.62-.016-.207-.05-.414-.097-.621-.046-.206-.101-.41-.167-.604-.066-.192-.14-.377-.189-.55-.09-.173-.187-.339-.292-.501-.106-.162-.218-.317-.331-.458-.112-.14-.229-.274-.344-.4-.116-.125-.235-.244-.351-.341-.105-.097-.213-.19-.319-.276-.095-.086-.194-.17-.274-.244-.086-.073-.173-.14-.234-.2-.076-.059-.154-.117-.194-.166-.066-.049-.135-.088-.157-.127-.058-.038-.116-.059-.117-.03-.076-.017-.077.006-.078.029-.078.052-.078.075-.078.098-.078.121-.078.144-.078.167-.078.19-.078.213-.078.236-.078.259-.078.282-.078.305-.078.328-.078.351-.078.374-.078.397-.078.42-.078.443-.078.466-.078.489-.078 5.005-.078 5.028-.078 5.051-.078 5.074-.078 5.097-.078 5.12-.078 5.143-.078 5.166-.078 5.189-.078 5.212-.078 5.235-.078 5.258-.078 5.281-.078 5.304-.078 5.327-.078 5.35-.078 5.373-.078 5.396-.078 5.419-.078 5.442-.078 5.465-.078 5.488-.078 5.511-.078 5.534-.078 5.557-.078 5.58-.078 5.603-.078 5.626-.078 5.649-.078 5.672-.078 5.695-.078 5.718-.078 5.741-.078 5.764-.078 5.787-.078 5.81-.078 5.833-.078 5.856-.078 5.879-.078 5.902-.078 5.925-.078 5.948-.078 5.971-.078 5.994-.078 6.005-.078 6.028-.078 6.051-.078 6.074-.078 6.097-.078 6.12-.078 6.143-.078 6.166-.078 6.189-.078 6.212-.078 6.235-.078 6.258-.078 6.281-.078 6.304-.078 6.327-.078 6.35-.078 6.373-.078 6.373-.078Z"/></svg>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({}); }}
                className={`appearance-none relative block w-full px-4 py-3 pl-10 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        )}
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;