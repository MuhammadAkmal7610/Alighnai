/** Stored on Page `metadata.clientAccessForm` for the Client Access template. */
export type ClientAccessFormCopy = {
  badge?: string;
  title?: string;
  subtitle?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  submitButton?: string;
  footerLine1?: string;
  footerLine2?: string;
};

export const DEFAULT_CLIENT_ACCESS_FORM: Required<ClientAccessFormCopy> = {
  badge: "• Invitation Only",
  title: "Client & Partner Access",
  subtitle:
    "Secure access to your AlignAI workspace, reports, and resources.",
  emailLabel: "Email Address",
  emailPlaceholder: "you@organization.com",
  passwordLabel: "Password",
  passwordPlaceholder: "**********",
  submitButton: "Sign In →",
  footerLine1: "Access is by invitation only",
  footerLine2: "To request access, contact bburke@bytestream.ca",
};

export function mergeClientAccessForm(
  raw?: ClientAccessFormCopy | null
): Required<ClientAccessFormCopy> {
  return { ...DEFAULT_CLIENT_ACCESS_FORM, ...(raw || {}) };
}
