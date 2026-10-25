(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle with circular reveal ---------- */
  const toggle = document.querySelector("[data-theme-toggle]");
  const setTheme = (t) => {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("ml-theme", t); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0b0b0f" : "#f4f1ec");
    if (toggle) toggle.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  };
  if (toggle) {
    setTheme(root.getAttribute("data-theme") || "dark");
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (!document.startViewTransition || reduceMotion) return setTheme(next);
      const r = toggle.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => setTheme(next));
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(() => {});
    });
  }

  /* ---------- Header + scroll progress ---------- */
  const header = document.querySelector(".site-header");
  const bar = document.querySelector(".scroll-progress span");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 12);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* Active nav link */
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => navObs.observe(s));
    const heroEl = document.getElementById("hero");
    if (heroEl) navObs.observe(heroEl);
  }

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll("[data-motion-group]").forEach((g) => {
    [...g.querySelectorAll("[data-motion]")].forEach((el, i) => el.style.setProperty("--motion-delay", i % 6));
  });
  document.querySelectorAll("[data-motion-delay]").forEach((el) => el.style.setProperty("--motion-delay", el.dataset.motionDelay));
  const motionEls = document.querySelectorAll("[data-motion]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    motionEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    motionEls.forEach((el) => obs.observe(el));
    // Safety net: never leave content hidden.
    setTimeout(() => motionEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) el.classList.add("is-visible");
    }), 1200);
  }

  /* ---------- Rank bars in hero console ---------- */
  const ranks = document.querySelectorAll(".rank-list li");
  const fillRanks = () => ranks.forEach((li, i) => {
    const p = parseFloat(li.querySelector(".pos").dataset.pos);
    const pct = Math.max(8, Math.min(100, ((11 - p) / 10) * 100));
    setTimeout(() => li.style.setProperty("--bar", pct + "%"), reduceMotion ? 0 : 500 + i * 120);
  });
  fillRanks();

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll("[data-count-to]");
  const fmt = new Intl.NumberFormat("en-US");
  const runCount = (el) => {
    const to = parseFloat(el.dataset.countTo);
    if (reduceMotion || !to) { el.textContent = fmt.format(to); return; }
    const start = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt.format(Math.round(to * eased));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCount(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cObs.observe(c));
  }

  /* ---------- Role lens ---------- */
  const lensBtns = document.querySelectorAll("[data-lens-btn]");
  const lensCopy = document.querySelectorAll("[data-lens-copy]");
  const cases = document.querySelectorAll("[data-lens-sortable] > .case");
  const applyLens = (lens, fromUser) => {
    body.dataset.lens = lens;
    lensBtns.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.lensBtn === lens)));
    lensCopy.forEach((p) => (p.hidden = p.dataset.lensCopy !== lens));
    cases.forEach((c) => (c.style.order = c.dataset["order" + lens.charAt(0).toUpperCase() + lens.slice(1)] || 0));
    if (fromUser) {
      try { history.replaceState(null, "", lens === "all" ? location.pathname : "?lens=" + lens); } catch (e) {}
    }
  };
  lensBtns.forEach((b) => b.addEventListener("click", () => applyLens(b.dataset.lensBtn, true)));
  // Arrow-key support for the radiogroup
  const lensGroup = document.querySelector(".lens-switch");
  if (lensGroup) lensGroup.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const arr = [...lensBtns];
    const i = arr.findIndex((b) => b.getAttribute("aria-checked") === "true");
    const n = arr[(i + (e.key === "ArrowRight" ? 1 : arr.length - 1)) % arr.length];
    n.focus(); n.click(); e.preventDefault();
  });
  const urlLens = new URLSearchParams(location.search).get("lens");
  applyLens(["seo", "ecom", "ai"].includes(urlLens) ? urlLens : "all", false);

  /* ---------- Compare sliders ---------- */
  document.querySelectorAll("[data-compare]").forEach((wrap) => {
    const range = wrap.querySelector(".compare-range");
    const set = (v) => wrap.style.setProperty("--pos", v + "%");
    range.addEventListener("input", () => set(range.value));
    // Gentle hint animation the first time it's seen
    if (!reduceMotion && "IntersectionObserver" in window) {
      const o = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        o.disconnect();
        let t0 = null;
        const anim = (t) => {
          if (!t0) t0 = t;
          const k = (t - t0) / 1600;
          if (k >= 1 || wrap.dataset.touched) { if (!wrap.dataset.touched) set(50); return; }
          set(50 + Math.sin(k * Math.PI * 2) * 18);
          requestAnimationFrame(anim);
        };
        setTimeout(() => requestAnimationFrame(anim), 400);
      }, { threshold: 0.5 });
      o.observe(wrap);
    }
    range.addEventListener("pointerdown", () => (wrap.dataset.touched = "1"));
    range.addEventListener("keydown", () => (wrap.dataset.touched = "1"));
  });

  /* ---------- Architecture tabs (Gatti's) ---------- */
  document.querySelectorAll("[data-arch]").forEach((arch) => {
    const tabs = arch.querySelectorAll("[data-arch-tab]");
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }));
  });

  /* ---------- Workflow explorer ---------- */
  const WF = {
    migration: {
      steps: [
        { t: "Validate source exports", tool: "BigCartel CSV · Python", b: "Every export gets row counts and totals checked before it's used. A two-byte blank orders file was caught at this stage, before it could reach Shopify.", g: "If the totals don't match the platform dashboard, the run stops." },
        { t: "Deterministic transform", tool: "Python · no AI credits", b: "Orders, line items, and customers are mapped to Matrixify's format by a rerunnable script. The same input always gives the same output, so I can rerun after any fix without wondering what changed.", g: "Original order names are kept (#bcgg-) so Matrixify can't create duplicates." },
        { t: "Conservative product linking", tool: "SKU / handle matching", b: "Historical line items are linked to current products only on a confident SKU or handle match. Anything uncertain becomes a tagged custom line item for review.", g: "Leaving a SKU link blank is better than linking the wrong one." },
        { t: "Quiet import settings", tool: "Matrixify", b: "Customer receipts and staff notifications are off, inventory is bypassed, malformed phone numbers are blanked, and partial shipments are held for manual review.", g: "Zero customer emails triggered by the import." },
        { t: "Reconcile and sign off", tool: "Diff report", b: "Final delta: 861 orders and 1,317 line items, with zero transaction-total mismatches against the source.", g: "The owner signs off on inventory before the DNS cutover." }
      ]
    },
    images: {
      steps: [
        { t: "Collect real photos", tool: "Google Drive", b: "Real classroom and campus photos replace AI placeholders. Parents can tell the difference, and so can Google.", g: "No AI-generated children. Ever." },
        { t: "Rename descriptively", tool: "Python", b: "Files get descriptive, location-aware names in place of IMG_4482.jpg, following a fixed naming pattern.", g: "The naming rules are written down, so the output is predictable." },
        { t: "Draft alt text and titles", tool: "Gemini vision API", b: "A vision model drafts alt text and titles from the actual image content and the page it will appear on.", g: "I review the alt text for accessibility first, not keyword stuffing." },
        { t: "Optimize and geotag", tool: "Python · Pillow", b: "Images are resized and compressed for the web, and campus location metadata is written where it applies.", g: "Originals are kept; the pipeline only writes copies." },
        { t: "Log and upload", tool: "CSV log → CMS", b: "Every change is written to a CSV log before the files are uploaded to the site, so the run can be audited or rolled back.", g: "The log is what I check before publishing." }
      ]
    },
    leads: {
      steps: [
        { t: "Normalize UTMs", tool: "Link standards", b: "Every ad, Google Business Profile, and social link uses one UTM convention, so sources aren't split across spelling variants.", g: "A single convention for every channel." },
        { t: "Hidden fields on one form", tool: "GoHighLevel", b: "One embedded form is used across the site, with hidden fields capturing source, medium, campaign, and landing page.", g: "No mailto: buttons. That was the bug that was losing tour requests." },
        { t: "Route to the CRM", tool: "GoHighLevel · Make.com", b: "Submissions go to the client's CRM with attribution attached, so the director knows where each family came from.", g: "Test leads are verified end to end before launch." },
        { t: "Fire clean events", tool: "GA4", b: "generate_lead and click_to_call each fire once per action and are marked as key events, so reports don't double-count.", g: "Validated in DebugView, not assumed." },
        { t: "Report the baseline", tool: "GA4 · Search Console", b: "The first month is reported as a baseline, not a win. That's how the client found out organic search engaged at 68% while paid social engaged at 6%.", g: "Equal date ranges, branded and non-branded traffic separated." }
      ]
    },
    reports: {
      steps: [
        { t: "Pull the data", tool: "Search Console · GA4 APIs", b: "Monthly clicks, impressions, positions, and lead events are pulled for each client property on a schedule.", g: "The read-only API scope is all the job needs." },
        { t: "Find what changed", tool: "Python · AI summary", b: "Period-over-period changes are calculated first. AI then writes a plain-language summary of what moved and why it matters.", g: "The numbers come from code, never from the model." },
        { t: "Build the report", tool: "Branded PDF", b: "A one-page branded PDF a business owner can read in two minutes, with no jargon.", g: "I check the rendered PDF visually before it goes any further." },
        { t: "Save as a draft", tool: "Gmail draft", b: "The report is saved as a Gmail draft, never sent automatically.", g: "A human sends every client email." }
      ]
    }
  };

  const explorer = document.querySelector("[data-explorer]");
  if (explorer) {
    const tabs = explorer.querySelectorAll("[data-wf]");
    const list = explorer.querySelector("[data-wf-steps]");
    const elTool = explorer.querySelector("[data-wf-tool]");
    const elTitle = explorer.querySelector("[data-wf-title]");
    const elBody = explorer.querySelector("[data-wf-body]");
    const elGate = explorer.querySelector("[data-wf-gate]");
    const detail = explorer.querySelector(".wf-detail");

    const showStep = (wf, i) => {
      const s = WF[wf].steps[i];
      list.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
      elTool.textContent = `Step ${i + 1} of ${WF[wf].steps.length} · ${s.tool}`;
      elTitle.textContent = s.t;
      elBody.textContent = s.b;
      elGate.textContent = s.g;
      // retrigger entrance
      [...detail.children].forEach((c) => { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; });
    };
    const showWf = (wf) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.wf === wf)));
      list.innerHTML = "";
      WF[wf].steps.forEach((s, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span><span></span>`;
        btn.lastChild.textContent = s.t;
        btn.addEventListener("click", () => showStep(wf, i));
        li.appendChild(btn);
        list.appendChild(li);
      });
      showStep(wf, 0);
    };
    tabs.forEach((t) => t.addEventListener("click", () => showWf(t.dataset.wf)));
    showWf("migration");
  }

  /* ---------- Case-file drawers ---------- */
  let lastFocus = null;
  document.querySelectorAll("[data-drawer-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const d = document.getElementById(btn.dataset.drawerOpen);
      if (!d || typeof d.showModal !== "function") return;
      lastFocus = btn;
      d.showModal();
      body.classList.add("drawer-open");
      d.querySelector(".drawer-inner").scrollTop = 0;
    });
  });
  document.querySelectorAll("dialog.drawer").forEach((d) => {
    d.querySelectorAll("[data-drawer-close]").forEach((c) => c.addEventListener("click", () => d.close()));
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => { body.classList.remove("drawer-open"); lastFocus && lastFocus.focus(); });
  });
})();
