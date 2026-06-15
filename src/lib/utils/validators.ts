// Input validators for lead form and user input

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length < 3) {
    return { valid: false, error: "Nama minimal 3 karakter" };
  }
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  // Strip non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Indonesian format: 08xx (10-13 digits) or +62xx
  const indonesianRegex = /^(0\d{9,12}|\+62\d{9,12})$/;

  if (!indonesianRegex.test(cleaned)) {
    return {
      valid: false,
      error: "Format nomor HP tidak valid. Contoh: 081234567890",
    };
  }

  return { valid: true };
}

export function validateEmail(email: string | null | undefined): { valid: boolean; error?: string } {
  // Email is optional
  if (!email || email.trim() === "") {
    return { valid: true };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Format email tidak valid" };
  }

  return { valid: true };
}

export function validateLeadForm(data: {
  name: string;
  phone: string;
  email?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameResult = validateName(data.name);
  if (!nameResult.valid && nameResult.error) errors.name = nameResult.error;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.valid && phoneResult.error) errors.phone = phoneResult.error;

  const emailResult = validateEmail(data.email);
  if (!emailResult.valid && emailResult.error) errors.email = emailResult.error;

  return { valid: Object.keys(errors).length === 0, errors };
}
