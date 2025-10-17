// components/TrustpilotWidget.tsx
"use client";

import { useEffect } from "react";

export default function TrustpilotWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="trustpilot-widget"
      data-locale="fr-FR"
      data-template-id="53aa8807dec7e10d38f59f36"
      data-businessunit-id="TON_BUSINESS_ID"
      data-style-height="150px"
      data-style-width="100%"
    >
      <a href="https://fr.trustpilot.com/review/tonsite.com" target="_blank" rel="noopener">
        Trustpilot
      </a>
    </div>
  );
}
