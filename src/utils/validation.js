/**
 * Form validation utilities for SafeSats
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('one special character');
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      error: `Password must contain ${errors.join(', ')}` 
    };
  }
  
  return { isValid: true, error: null };
};

// Password strength calculation
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: 'gray' };
  
  let score = 0;
  
  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character types
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Patterns
  if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
  if (!/123|abc|qwe/i.test(password)) score += 1; // No common sequences
  
  if (score <= 2) return { strength: 1, label: 'Weak', color: 'red' };
  if (score <= 4) return { strength: 2, label: 'Fair', color: 'yellow' };
  if (score <= 6) return { strength: 3, label: 'Good', color: 'blue' };
  return { strength: 4, label: 'Strong', color: 'green' };
};

// Full name validation
export const validateFullName = (name) => {
  if (!name) {
    return { isValid: false, error: 'Full name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, error: null };
};

// Malawi phone number validation
export const validateMalawiPhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Malawi phone number patterns:
  // - Mobile: 088/099/077/085/087 followed by 7 digits
  // - Landline: 01 followed by 6-7 digits
  const mobileRegex = /^(265)?(0)?(88|99|77|85|87)\d{7}$/;
  const landlineRegex = /^(265)?(0)?1\d{6,7}$/;
  
  if (!mobileRegex.test(cleanPhone) && !landlineRegex.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Malawi phone number (e.g., 088 123 4567)' 
    };
  }
  
  return { isValid: true, error: null };
};

// Format Malawi phone number
export const formatMalawiPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add country code if not present
  let formattedPhone = cleanPhone;
  if (cleanPhone.startsWith('0')) {
    formattedPhone = '265' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('265')) {
    formattedPhone = '265' + cleanPhone;
  }
  
  // Format as +265 XX XXX XXXX
  if (formattedPhone.length === 12) {
    return `+${formattedPhone.substring(0, 3)} ${formattedPhone.substring(3, 5)} ${formattedPhone.substring(5, 8)} ${formattedPhone.substring(8)}`;
  }
  
  return phone; // Return original if formatting fails
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted) => {
  if (!accepted) {
    return { isValid: false, error: 'You must accept the Terms of Service and Privacy Policy' };
  }
  
  return { isValid: true, error: null };
};

// Comprehensive form validation
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  // Validate confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // Validate full name
  const nameValidation = validateFullName(formData.fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
  }
  
  // Validate phone
  const phoneValidation = validateMalawiPhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }
  
  // Validate terms acceptance
  const termsValidation = validateTermsAcceptance(formData.acceptTerms);
  if (!termsValidation.isValid) {
    errors.acceptTerms = termsValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
