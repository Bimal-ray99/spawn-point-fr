"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function PWAUpdateToast() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reg: ServiceWorkerRegistration | undefined;

    const show = () => {
      toast("Update available", {
        description: "A new version of the app is ready.",
        action: {
          label: "Reload",
          onClick: () => {
            // Ask the waiting SW to activate, then reload.
            reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
            // Small delay so the new SW can take control
            setTimeout(() => window.location.reload(), 300);
          },
        },
      });
    };

    navigator.serviceWorker.getRegistration().then((r) => {
      reg = r || undefined;
      if (!reg) return;

      // If a new SW is found
      reg.addEventListener("updatefound", () => {
        const sw = reg?.installing;
        if (!sw) return;
        sw.addEventListener("statechange", () => {
          // When new SW finished installing while an old one is controlling the page
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            show();
          }
        });
      });
    });

    // When the new SW takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Optional: you can toast “App updated” here instead of auto-reload above.
    });
  }, []);

  return null;
}
