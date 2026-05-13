(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const revealItems = document.querySelectorAll(".reveal, .reveal-delay");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const header = document.querySelector(".site-header");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const experienceSteps = document.querySelectorAll("[data-step]");
  const experienceKicker = document.querySelector("[data-exp-kicker]");
  const experienceTitle = document.querySelector("[data-exp-title]");
  const experienceRange = document.querySelector("[data-exp-range]");
  const experienceCopy = document.querySelector("[data-exp-copy]");
  const experiencePoints = document.querySelector("[data-exp-points]");
  const experienceDisplay = document.querySelector(".experience-display");
  const progressLine = document.querySelector(".experience-progress-line");

  const updateExperienceDisplay = (step) => {
    if (
      !step ||
      !experienceKicker ||
      !experienceTitle ||
      !experienceRange ||
      !experienceCopy ||
      !experiencePoints ||
      !experienceDisplay
    ) return;

    const kicker = step.dataset.kicker || "";
    const title = step.dataset.title || "";
    const range = step.dataset.range || "";
    const copy = step.dataset.copy || "";
    let points = [];

    try {
      points = JSON.parse(step.dataset.points || "[]");
    } catch (error) {
      points = [];
    }

    experienceDisplay.classList.remove("is-transitioning");
    void experienceDisplay.offsetWidth;
    experienceDisplay.classList.add("is-transitioning");

    experienceKicker.textContent = kicker;
    experienceTitle.textContent = title;
    experienceRange.textContent = range;
    experienceCopy.textContent = copy;

    experiencePoints.innerHTML = points
      .map((point) => `<li>${point}</li>`)
      .join("");

    window.setTimeout(() => {
      experienceDisplay.classList.remove("is-transitioning");
    }, 380);
  };

  const updateExperienceProgress = (activeIndex) => {
    if (!progressLine || !experienceSteps.length) return;
    const percent = ((activeIndex + 1) / experienceSteps.length) * 100;
    progressLine.style.height = `${percent}%`;
  };

  const setActiveExperienceStep = (step) => {
    if (!step) return;

    experienceSteps.forEach((item, index) => {
      const isActive = item === step;
      item.classList.toggle("is-active", isActive);
      if (isActive) {
        updateExperienceDisplay(item);
        updateExperienceProgress(index);
      }
    });
  };
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
      if ("IntersectionObserver" in window && experienceSteps.length) {
    const experienceObserver = new IntersectionObserver(
      (entries) => {
        const visibleStep = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleStep?.target) {
          setActiveExperienceStep(visibleStep.target);
        }
      },
      {
        threshold: [0.3, 0.55, 0.8],
        rootMargin: "-20% 0px -35% 0px"
      }
    );

    experienceSteps.forEach((step) => experienceObserver.observe(step));

    const initiallyActive = document.querySelector(".experience-step.is-active") || experienceSteps[0];
    if (initiallyActive) {
      setActiveExperienceStep(initiallyActive);
    }
  }
  }
})();
