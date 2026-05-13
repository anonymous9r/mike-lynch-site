(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const revealItems = document.querySelectorAll(".reveal, .reveal-delay");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const header = document.querySelector(".site-header");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentTheme = root.getAttribute("data-theme");

  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-theme", currentTheme);
  }

  const setToggleLabel = (theme) => {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  };

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

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

  setToggleLabel(currentTheme);
  updateHeaderState();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", currentTheme);
      setToggleLabel(currentTheme);
    });
  }

  if (reduceMotionQuery.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
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

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveNav(visibleEntry.target.id);
        }
      },
      {
        threshold: 0.35,
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  window.addEventListener(
    "scroll",
    () => {
      updateHeaderState();
    },
    { passive: true }
  );

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
})();
