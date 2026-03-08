/**
 * Masks a sensitive string, showing only first 4 and last 2 characters.
 * Example: "8704125678091" → "8704******91"
 */
export const maskSensitive = (value: string | null | undefined): string => {
  if (!value || value.length < 6) return "••••••";
  const first = value.slice(0, 4);
  const last = value.slice(-2);
  const masked = "*".repeat(Math.max(value.length - 6, 2));
  return `${first}${masked}${last}`;
};

/**
 * Determines compliance status label and color.
 */
export const getComplianceDisplay = (status: string | null | undefined) => {
  switch (status) {
    case "verified":
      return { label: "Verified", emoji: "🟢", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "missing_documents":
      return { label: "Missing Documents", emoji: "🔴", color: "text-red-500", bg: "bg-red-500/10" };
    case "pending":
    default:
      return { label: "Pending Verification", emoji: "🟡", color: "text-amber-500", bg: "bg-amber-500/10" };
  }
};
