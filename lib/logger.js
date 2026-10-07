import { redactPersonalData } from "./personalData.js";

// Server-side error logging without personal data: errors from libraries
// (e.g. the mail transport or database driver) can contain email addresses.
export function logError(context, ...details) {
  console.error(
    `${context}:`,
    ...details.map((detail) => redactPersonalData(detail)),
  );
}
