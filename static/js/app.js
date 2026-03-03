/* ═══════════════════════════════════════════════════════════════════════════
   FluencyFlow — Frontend Logic
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ── DOM References ──────────────────────────────────────────────────────
  const inputText   = document.getElementById("inputText");
  const outputText  = document.getElementById("outputText");
  const btnCorrect  = document.getElementById("btnCorrect");
  const btnClear    = document.getElementById("btnClear");
  const btnCopy     = document.getElementById("btnCopy");
  const charCount   = document.getElementById("charCount");
  const loader      = document.getElementById("loader");
  const statusBadge = document.getElementById("statusBadge");
  const modeTabs    = document.querySelectorAll(".mode-tab");
  const subtypeGroups = document.querySelectorAll(".subtype-group");

  // ── Current selection state ─────────────────────────────────────────────
  let currentMode    = "passage";
  let currentSubtype = "casual";

  // ── Mode Tab Switching ──────────────────────────────────────────────────
  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab
      modeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentMode = tab.dataset.mode;

      // Show matching subtype group
      subtypeGroups.forEach((g) => g.classList.remove("active"));
      const activeGroup = document.querySelector(`.subtype-group[data-for="${currentMode}"]`);
      if (activeGroup) {
        activeGroup.classList.add("active");
        // Pick the first active pill in that group as default
        const activePill = activeGroup.querySelector(".subtype-pill.active");
        currentSubtype = activePill ? activePill.dataset.subtype : activeGroup.querySelector(".subtype-pill").dataset.subtype;
      }

      updatePlaceholder();
    });
  });

  // ── Subtype Pill Switching ──────────────────────────────────────────────
  document.querySelectorAll(".subtype-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const group = pill.closest(".subtype-group");
      group.querySelectorAll(".subtype-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentSubtype = pill.dataset.subtype;
      updatePlaceholder();
    });
  });

  // ── Dynamic placeholder based on mode ───────────────────────────────────
  const placeholders = {
    passage:      "Paste or type your paragraph here…",
    email:        "Paste or type your email draft here…",
    conversation: "Type your conversation or chat message here… Roman Urdu works too!",
  };

  function updatePlaceholder() {
    inputText.placeholder = placeholders[currentMode] || placeholders.passage;
  }

  // ── Theme Toggle ───────────────────────────────────────────────────────
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme  = localStorage.getItem("ff-theme");

  // Apply saved preference (default: light)
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggle.addEventListener("click", () => {
    // Add transition class for smooth switch
    document.body.classList.add("theme-transitioning");

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("ff-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ff-theme", "dark");
    }

    // Remove transition class after animation completes
    setTimeout(() => document.body.classList.remove("theme-transitioning"), 450);
  });

  // ── Character Count ─────────────────────────────────────────────────────
  inputText.addEventListener("input", () => {
    const len = inputText.value.length;
    charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? "s" : ""}`;
  });

  // ── Clear Button ────────────────────────────────────────────────────────
  btnClear.addEventListener("click", () => {
    inputText.value = "";
    charCount.textContent = "0 characters";
    outputText.innerHTML = '<span class="placeholder-text">Your corrected text will appear here…</span>';
    btnCopy.classList.add("hidden");
    statusBadge.textContent = "";
    statusBadge.className = "status-badge";
    inputText.focus();
  });

  // ── Copy Button ─────────────────────────────────────────────────────────
  btnCopy.addEventListener("click", async () => {
    const text = outputText.innerText;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      const original = btnCopy.innerHTML;
      btnCopy.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span>Copied!</span>`;
      setTimeout(() => { btnCopy.innerHTML = original; }, 1800);
    } catch {
      /* clipboard access denied — ignore silently */
    }
  });

  // ── Correct Button ──────────────────────────────────────────────────────
  btnCorrect.addEventListener("click", async () => {
    const raw = inputText.value.trim();
    if (!raw) {
      shakeButton(btnCorrect);
      return;
    }

    // UI: loading state
    btnCorrect.classList.add("hidden");
    loader.classList.remove("hidden");
    outputText.innerHTML = '<span class="placeholder-text">Analyzing…</span>';
    btnCopy.classList.add("hidden");
    statusBadge.textContent = "";
    statusBadge.className = "status-badge";

    try {
      const res = await fetch("/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw, mode: currentMode, subtype: currentSubtype }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Unknown error");
      }

      outputText.textContent = data.corrected;
      statusBadge.textContent = "✓ Corrected";
      statusBadge.className = "status-badge success";
      btnCopy.classList.remove("hidden");
    } catch (err) {
      outputText.innerHTML = `<span class="placeholder-text" style="color:var(--error)">Error: ${escapeHtml(err.message)}</span>`;
      statusBadge.textContent = "✕ Failed";
      statusBadge.className = "status-badge error";
    } finally {
      loader.classList.add("hidden");
      btnCorrect.classList.remove("hidden");
    }
  });

  // ── Keyboard shortcut: Ctrl + Enter to correct ──────────────────────────
  inputText.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      btnCorrect.click();
    }
  });

  // ── Helpers ─────────────────────────────────────────────────────────────
  function shakeButton(btn) {
    btn.style.animation = "shake 0.4s ease";
    btn.addEventListener("animationend", () => { btn.style.animation = ""; }, { once: true });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Inject shake keyframes once
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }`;
  document.head.appendChild(style);
})();
