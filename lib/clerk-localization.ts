import { idID } from '@clerk/localizations';

export const customIdID = {
  ...idID,
  formFieldInputPlaceholder__confirmDeletionUserAccount: "Hapus akun",
  userProfile: {
    ...idID.userProfile,
    deletePage: {
      ...idID.userProfile?.deletePage,
      actionDescription: "Ketik 'Hapus akun' (tanpa tanda kutip) untuk melanjutkan.",
    }
  },
  signUp: {
    ...idID.signUp,
    start: {
      ...idID.signUp?.start,
      passwordInput__hint: "Pastikan password kuat dan aman.",
    }
  },
  unstable__errors: {
    ...idID.unstable__errors,
    form_password_length_too_short: "Harus terdiri dari 8 karakter atau lebih.",
    form_password_needs_number: "Harus mengandung minimal 1 angka.",
    form_password_needs_special_char: "Harus mengandung minimal 1 karakter khusus.",
    form_password_needs_uppercase: "Harus mengandung minimal 1 huruf besar.",
    form_password_needs_lowercase: "Harus mengandung minimal 1 huruf kecil.",
  },
  // @ts-ignore
  formFieldHintText: {
    ...((idID as any).formFieldHintText || {}),
    passwordLength: "Harus terdiri dari 8 karakter atau lebih.",
    passwordNumbers: "Harus mengandung minimal 1 angka.",
    passwordSpecialCharacters: "Harus mengandung minimal 1 karakter khusus.",
    passwordUppercaseLetters: "Harus mengandung minimal 1 huruf besar.",
    passwordLowercaseLetters: "Harus mengandung minimal 1 huruf kecil.",
  }
};
(customIdID as any).signUp = {
  ...customIdID.signUp,
  password: {
    ...((customIdID.signUp as any)?.password || {}),
    validations: {
      hasMinLength: "Harus terdiri dari 8 karakter atau lebih.",
      containsNumber: "Harus mengandung minimal 1 angka.",
      containsSpecialCharacter: "Harus mengandung minimal 1 karakter khusus.",
      containsUppercase: "Harus mengandung minimal 1 huruf besar.",
      containsLowercase: "Harus mengandung minimal 1 huruf kecil.",
    },
    strength: "Kekuatan password",
  }
};
(customIdID as any).formPasswordStrength = "Kekuatan password";

export const clerkAppearance = {
  variables: {
    colorPrimary: '#3b82f6',
    borderRadius: '0.75rem',
  }
};
