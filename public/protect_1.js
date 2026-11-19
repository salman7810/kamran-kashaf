/**
 * protect.js — Lightweight theme-protection deterrents
 *
 * PURPOSE  : Discourage casual copying via keyboard shortcuts, right-click,
 *            text selection, and DevTools inspection.
 * LIMITS   : Does NOT stop HTTrack, curl, or determined developers.
 *            All public files remain publicly accessible via HTTP.
 * USAGE    : Drop this file into any theme folder and add one <script> tag
 *            before </body>:  <script src="/protect.js"></script>
 * UNDO     : Delete this file and remove the <script> tag.
 *
 * CONFIG   ──────────────────────────────────────────────────────────────────
 */
const PROTECT_CONFIG = {
  /** Block common keyboard shortcuts that expose source or DevTools. */
  blockShortcuts: true,

  /** Suppress the right-click context menu. */
  blockContextMenu: true,

  /** Prevent text selection across the page. */
  blockTextSelection: true,

  /** Trigger a debugger breakpoint loop to slow down DevTools inspection.
   *  This pauses script execution when DevTools is open.
   *  Set to false if it interferes with your own development workflow. */
  devToolsDetection: true,

  /** Optional: message shown when a blocked action is attempted.
   *  Set to null / "" to silently suppress without any alert. */
  blockedMessage: null,
};
/* ─────────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* 1. Block keyboard shortcuts
   * Covered: Ctrl+U (view-source), Ctrl+S (save), Ctrl+P (print/save),
   *          F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
   * ─────────────────────────────────────────────────────────────────────── */
  if (PROTECT_CONFIG.blockShortcuts) {
    document.addEventListener("keydown", function (e) {
      const ctrl = e.ctrlKey || e.metaKey; // metaKey = Cmd on Mac
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      const blocked =
        (ctrl && key === "u") || // View Source
        (ctrl && key === "s") || // Save Page
        (ctrl && key === "p") || // Print (can save as PDF)
        (ctrl && shift && key === "i") || // DevTools (Elements)
        (ctrl && shift && key === "j") || // DevTools (Console)
        (ctrl && shift && key === "c") || // DevTools (Inspector)
        e.key === "F12"; // DevTools toggle

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        if (PROTECT_CONFIG.blockedMessage) {
          alert(PROTECT_CONFIG.blockedMessage);
        }
      }
    });
  }

  /* 2. Suppress right-click context menu
   * ─────────────────────────────────────────────────────────────────────── */
  if (PROTECT_CONFIG.blockContextMenu) {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }

  /* 3. Prevent text selection (CSS + JS fallback)
   * user-select is set via JS so it stays out of your style.css entirely.
   * ─────────────────────────────────────────────────────────────────────── */
  if (PROTECT_CONFIG.blockTextSelection) {
    const style = document.createElement("style");
    style.id = "protect-no-select";
    style.textContent =
      "* { -webkit-user-select: none !important; user-select: none !important; }";
    document.head.appendChild(style);

    document.addEventListener("selectstart", function (e) {
      e.preventDefault();
    });
  }

  /* 4. DevTools detection via debugger heartbeat
   * When DevTools is open the browser pauses on `debugger`, making the tab
   * appear frozen. This discourages casual DOM inspection sessions.
   * The interval is long (3 s) so it has zero impact on normal browsing.
   * ─────────────────────────────────────────────────────────────────────── */
  if (PROTECT_CONFIG.devToolsDetection) {
    setInterval(function () {
      // eslint-disable-next-line no-debugger
      debugger; // pauses only when DevTools panel is open
    }, 3000);
  }
})();

