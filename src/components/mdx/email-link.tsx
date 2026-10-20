import React from "react";

interface EmailLinkProps {
  address: string;
  label?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * A mailto link Cloudflare will leave alone.
 *
 * Cloudflare's Email Address Obfuscation rewrites every mailto: href at the
 * edge into /cdn-cgi/l/email-protection#<hash> and decodes it back with
 * JavaScript. Crawlers that don't run that script follow the rewritten href and
 * get a 404, which is what Ahrefs reported on /contact and /services
 * (LAC-4934). The <!--email_off--> markers are Cloudflare's documented opt-out,
 * so the real address ships in the HTML and there is no dead link to follow.
 *
 * React cannot emit HTML comments from JSX, hence the innerHTML. The address is
 * escaped because it comes from MDX and config rather than a literal here.
 */
// The anchor is built as raw HTML, so it misses the classes nextra-theme-docs
// gives every other link in prose. Repeat them here or the address renders as
// plain body text next to a styled phone number.
const NEXTRA_LINK_CLASS =
  "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]";

export const EmailLink = ({ address, label }: EmailLinkProps) => {
  const href = escapeHtml(`mailto:${address}`);
  const text = escapeHtml(label ?? address);

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a class="${NEXTRA_LINK_CLASS}" href="${href}">${text}</a><!--/email_off-->`,
      }}
    />
  );
};

export default EmailLink;
