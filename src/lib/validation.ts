/**
 * Validation utilities for TD STUDIOS authentication
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate username
 * Rules: alphanumeric, min 3 chars, max 20 chars
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be less than 20 characters" };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, and underscores" };
  }

  return { valid: true };
}

/**
 * Validate phone number
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890, etc.
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: true }; // Phone is optional
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return { valid: false, error: "Phone number must be at least 10 digits" };
  }

  if (digitsOnly.length > 11) {
    return { valid: false, error: "Phone number is too long" };
  }

  return { valid: true };
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: true }; // Email is optional
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Validate Instagram handle
 * Rules: can start with @, alphanumeric + underscores + periods, 1-30 chars
 */
export function validateInstagram(handle: string): ValidationResult {
  if (!handle) {
    return { valid: true }; // Instagram is optional
  }

  // Remove @ if present
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

  if (cleanHandle.length < 1) {
    return { valid: false, error: "Instagram handle is required" };
  }

  if (cleanHandle.length > 30) {
    return { valid: false, error: "Instagram handle is too long" };
  }

  if (!/^[a-zA-Z0-9._]+$/.test(cleanHandle)) {
    return { valid: false, error: "Instagram handle can only contain letters, numbers, dots, and underscores" };
  }

  return { valid: true };
}

/**
 * PIN strength assessment
 */
export interface PINStrength {
  strength: 'weak' | 'medium' | 'strong';
  message: string;
}

const WEAK_PINS = [
  '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1234', '4321', '2580', '0852', '1212', '6969', '0420', '1004',
  '1010', '2020', '1122', '3344', '5566', '7788', '9900'
];

/**
 * Check PIN strength
 */
export function checkPINStrength(pin: string): PINStrength {
  if (pin.length !== 4) {
    return { strength: 'weak', message: 'PIN must be 4 digits' };
  }

  // Check if it's a known weak PIN
  if (WEAK_PINS.includes(pin)) {
    return { strength: 'weak', message: 'This PIN is too common. Try something unique.' };
  }

  // Check if all digits are the same
  if (new Set(pin).size === 1) {
    return { strength: 'weak', message: 'Avoid using the same digit repeatedly' };
  }

  // Check if it's sequential
  const digits = pin.split('').map(Number);
  let isSequential = true;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] + 1 !== digits[i + 1] && digits[i] - 1 !== digits[i + 1]) {
      isSequential = false;
      break;
    }
  }

  if (isSequential) {
    return { strength: 'weak', message: 'Sequential numbers are easy to guess' };
  }

  // Check if it has at least 3 unique digits (medium strength)
  if (new Set(pin).size >= 3) {
    return { strength: 'strong', message: 'Strong PIN' };
  }

  return { strength: 'medium', message: 'Medium strength' };
}

/**
 * Validate 4-digit access code
 * Valid codes for TD STUDIOS entry
 */
const VALID_ACCESS_CODES = [
  '1420', // TD STUDIOS code 1
  '4200', // TD STUDIOS code 2
  '2024', // Year code
  '1111', // Demo code
];

export function validateAccessCode(code: string): ValidationResult {
  if (!code || code.length !== 4) {
    return { valid: false, error: "Access code must be 4 digits" };
  }

  if (!/^\d{4}$/.test(code)) {
    return { valid: false, error: "Access code must be numeric" };
  }

  if (!VALID_ACCESS_CODES.includes(code)) {
    return { valid: false, error: "Invalid access code. Please contact TD STUDIOS for access." };
  }

  return { valid: true };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  if (digitsOnly.length === 11) {
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  return phone;
}

/**
 * Validate that at least one contact method is provided
 */
export function validateContactMethods(phone: string, email: string, instagram: string): ValidationResult {
  if (!phone && !email && !instagram) {
    return { valid: false, error: "Please provide at least one contact method" };
  }

  return { valid: true };
}
