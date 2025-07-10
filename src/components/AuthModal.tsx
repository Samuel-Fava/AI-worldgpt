import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { aipRoute } from '../../utils/apis';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: { firstName: string; lastName: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    switch (field){
      case 'email':
        if (!value) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'; 
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain uppercase, lowercase, and number';
        return '';
      case 'firstName':
        if (!isLogin && !value) return 'First name is required';
        // if (!isLogin && value !== formData.password) return 'Password do not match';
        return '';
      case 'lastName':
        if (!isLogin && !value) return 'Last name is required';
        // if (!isLogin && value !== formData.password) return 'Password do not match';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const fieldsTovalidate = isLogin
      ? ['email', 'password']
      : ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'agreeToTerms'];

    fieldsTovalidate.forEach(field => {
      const error = validateField(field, field === 'agreeToTerms' ? '' : formData[field as keyof typeof formData] as string);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Make all fields as touched
    const fieldsToTouch = isLogin
      ? ['email', 'password']
      : ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    
    const newTouchedFields = { ...touchedFields};
    fieldsToTouch.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      //Simulate API call with realistic delay
      const response:any = await aipRoute().post(isLogin ? '/login' : '/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);

      onAuth({
        firstName: formData.firstName || formData.email.split('@')[0],
        lastName: formData.lastName || formData.email.split('@')[0],
        email: formData.email
      });

      //Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false,
      });
      setTouchedFields({});
      setErrors({});
      onClose();
    } catch (error) {
      console.log(error);
      setErrors({ submit: 'Something went wrong. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string' && touchedFields[field]) {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, typeof value === 'string' ? value : '');
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setErrors({});
      setTouchedFields({});
      setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      agreeToTerms: false,
    });
  };

  const getFieldError = (field: string) => {
    return touchedFields[field] && errors[field];
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: ''};

    let strength = 0;
    if (password.length >= 0) strength++;
    if (/[a—z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/["a-zA-Z\d]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return { 
        strength,
        label: labels[strength - 1] || '',
        color: colors[strength - 1] || 'bg-gray-300'
      };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-SB">
        <div className="bg-white rounded-3xl shadow-2x1 w-full max-w-md relative animate-in fade-in zoom-in duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right—6 text-gray-400 hover:text-gray—600 transition—colors z-19 p-2 rounded-full hover:bg-gray—100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb—3">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text—gray-660 leading-relaxed">
              {isLogin
                ? 'Sign in to continue your AI—powered conversations and access your chat history'
                : 'Join our community and unlock the full potential of AI assistance'
              }
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit}>
              {/* Error Banner */}
              {errors.submit && (
                <div className='p-4 bg-red-50 border-red-200 rounded-xl flex items-center gap-3'>
                  <AlertCircle size={20} className='text-red-600 flex-shrink-0' />
                  <p className='text-red-700 text-sm'>{errors.submit}</p>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'> Full Name </label>
                  <div className='relative magin-top-4'>
                    <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    <input 
                      type="text" 
                      placeholder='Enter your first name' 
                      value={formData.firstName} 
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-SOO focus:border-transparent outline-none transition-all text-sm placeholder-gray-400' ${
                        getFieldError('firstName')
                          ? 'border-red-300 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    /> 
                    {!getFieldError('firstName') && formData.firstName && touchedFields.firstName && (
                      <CheckCircle className='absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500' size={18} />
                    )}
                </div>
                  {getFieldError('firstName') && (
                    <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                      <AlertCircle size={12} />
                      {getFieldError('firstName')}
                    </p>
                  )}
                <div className='margin-top-4 relative'>
                    <input 
                      type="text" 
                      placeholder='Enter your last name' 
                      value={formData.lastName} 
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-SOO focus:border-transparent outline-none transition-all text-sm placeholder-gray-400' ${
                        getFieldError('lastName')
                          ? 'border-red-300 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    />

                    {!getFieldError('lastName') && formData.lastName && touchedFields.lastName && (
                      <CheckCircle className='absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500' size={18} />
                    )}
                  </div>
             
                  {getFieldError('lastName') && (
                    <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                      <AlertCircle size={12}/>
                      {getFieldError('lastName')} 
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className='block text-sm font-semihold text-gray-700 mb-2'>Email Address</label> 
                <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={18}/>
                    <input 
                      type="email"
                      placeholder='Enter your email address'
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-SOO focus:border-transparent outline-none transition-all text-sm placeholder-gray-400' ${
                        getFieldError('email')
                          ? 'border-red-300 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    />
                    {!getFieldError('email') && formData.email && touchedFields.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <CheckCircle className='absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500' size={18} />
                    )}
                </div>
                {getFieldError('email') && (
                  <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                    <AlertCircle size={12} />
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'> Password </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password' 
                    value={formData.password}
                    onChange={ (e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm placeholder-gray-400 ${
                      getFieldError('password')
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 translation-colors p-1'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strenth Indicator */}
                {!isLogin && formData.password && (
                  <div className='mt-3'>
                    <div className='flex items-center gap-2 mb-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%`}}
                        />
                      </div>
                      <span className='text-xs font-medium text-gray-600'>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}

                {getFieldError('password') && (
                  <p className='text-red-500 text-xs flex items-center gap-1'>
                    <AlertCircle size={12} />
                    {getFieldError('password')}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm your password'
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm placeholder-gray-400 ${
                        getFieldError('confirmPassword')
                          ? 'border-red-300 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 text gray-400 hover:text-gray-600 transition-colors p-1'
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {!getFieldError('confirmPassword') && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <CheckCircle className='absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500' size={18} />
                    )}
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                      <AlertCircle size={12} />
                      {getFieldError('confirmPassword')}
                    </p>
                  )}
                </div>
              )}

              {/* Checkboxes */}
              <div className='space-y-4'>
                {isLogin && (
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input 
                      type='checkbox'
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2'
                    />
                    <span className='text-sm text-gray-600 group-hover:text-gray-800 transition-colors'>
                      Keep me signed in for 30 days
                    </span>
                  </label>
                )}

                {!isLogin && (
                  <label className='flex items-start gap-3 cursor-pointer group'>
                    <input
                      type='checkbox'
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-0.5'
                    />
                    <span className='text-sm text-gray-600 group-hover:text-gray-800 transition-colors leading-relaxed'>
                      I agree to the{' '}
                       <a href="#" className='text-blue-600 hover:text-blue-700 font-medium underline'>
                        Terms of Service
                       </a>
                       {' '} and {' '}
                       <a href="#" className='text-blue-600 hover:text-blue-700 font-medium underline'>
                        Privacy Policy
                       </a>
                    </span>
                  </label>
                )}
              </div>

              {isLogin && (
                <div className='text-right'>
                  <button 
                    type='button' 
                    className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
                    onClick={() => alert('Password reset flow coming soon!')}
                  >
                    Forget your password?
                  </button>
                </div>
              )}

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl'
              >
                {isLoading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </button>
            </form>

            {/*Security Notice*/}
            <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-x1 border border-blue-200'>
              <div className='flex items-center gap-3 text-blue-700 text-sm mb-2'>
                  <Shield size={18} />
                  <span className='font-semibold'> Enterprise-grade security </span>
              </div>
              <p className='text-blue-600 text-xs leading-relaxed'>
                Your data is protected with AES-256 encryption, secure authentication, and SOC 2 compliance.
                We never store your conversations on our servers.
              </p>
            </div>

            {/* Toggle mode */}
            <div className='mt-8 text-center'>
              <p className='text-gray-600 text-sm mb-4'>
                  {isLogin ? 'Do not have an account?' : 'Already have an account?'}
              </p>
              <button
                onClick={toggleMode}
                className='text-blue-600 hover:text:blue-700 font-semibold transition-clorors text-sm px-4 py-2 rounted-lg hover:bg-blue-50'
              >
                {isLogin ? 'Create a new account' : 'Sign in to your account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}