// Maps NextAuth error codes (the `error` query parameter) to translation
// keys. Codes without a specific message fall back to a generic one.
const AUTH_ERROR_MESSAGE_KEYS = {
  Verification: "authError.verification",
  AccessDenied: "authError.accessDenied",
  Configuration: "authError.configuration",
  OAuthAccountNotLinked: "authError.accountNotLinked",
  EmailSignin: "login.sendLinkError",
};

export function getAuthErrorMessageKey(error) {
  return AUTH_ERROR_MESSAGE_KEYS[error] || "authError.default";
}
