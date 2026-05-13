(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(
    ".reveal, .reveal-delay, [data-motion]"
  );

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsObserver = "IntersectionObserver" in window;

  /* ---------- Theme ---------- */

  let currentTheme = root.getAttribute("data-theme");

  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.setAttribute("data-theme", currentTheme);
  }

  const setToggleLabel = (theme) => {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  };

  setToggleLabel(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", currentTheme);
      setToggleLabel(currentTheme);
    });
  }

  /* ---------- Header scroll state ---------- */

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();

  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Active nav highlighting ---------- */

  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (supportsObserver && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveNav(visible.target.id);
        }
      },
      {
        threshold: 0.35,
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  window.addEventListener("hashchange", () => {
    const id = window.location.hash.replace("#", "");
    if (id) setActiveNav(id);
  });

  const initialHash = window.location.hash.replace("#", "");

  if (initialHash) {
    setActiveNav(initialHash);
  } else if (sections[0]?.id) {
    setActiveNav(sections[0].id);
  }

  /* ---------- Reveal / motion system ---------- */

  const showAll = () => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  };

  if (!revealItems.length) {
    // nothing to do
  } else if (reduceMotionQuery.matches || !supportsObserver) {
    showAll();
  } else {
    const motionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => motionObserver.observe(item));
  }

  /* If the user toggles reduced motion mid-session, stop hiding anything. */
  reduceMotionQuery.addEventListener?.("change", (event) => {
    if (event.matches) showAll();
  });
})();
