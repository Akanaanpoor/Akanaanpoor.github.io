// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Respect reduced-motion for the SVG radar sweep (native SMIL animations
// aren't paused by the CSS prefers-reduced-motion override above)
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const sweepAnim = document.getElementById("sweepAnim");
  if (sweepAnim) sweepAnim.setAttribute("repeatCount", "0");
}

// Nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu toggle
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");
navToggle.addEventListener("click", () => {
  const open = navMobile.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});
navMobile.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navMobile.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Active section highlighting in the desktop nav
const sections = ["about", "experience", "work", "skills", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll("#navLinks a[data-nav]");

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   Signature interactions
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Custom cursor ---------- */
if (finePointer) {
  document.body.classList.add("has-cursor");
  const ring = document.getElementById("cursorRing");
  const dot = document.getElementById("cursorDot");
  let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
  let rx = mx,
    ry = my;

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    },
    { passive: true }
  );

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.querySelectorAll("a, button, .proj, .skill-chips span").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}

/* ---------- Flight progress rail ---------- */
const railMarker = document.getElementById("railMarker");
const railFl = document.getElementById("railFl");
if (railMarker) {
  const updateRail = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    const rail = railMarker.parentElement;
    const railHeight = rail.clientHeight;
    railMarker.style.top = pct * railHeight + "px";
    const fl = Math.round(pct * 410);
    if (railFl) railFl.textContent = "FL" + String(fl).padStart(3, "0");
  };
  updateRail();
  window.addEventListener("scroll", updateRail, { passive: true });
  window.addEventListener("resize", updateRail);
}

/* ---------- Self-drawing route line ---------- */
const routeEl = document.getElementById("routeEl");
const routeLine = document.getElementById("routeLine");
const routeSvg = document.getElementById("routeSvg");
if (routeEl && routeLine && routeSvg) {
  const sizeRoute = () => {
    const h = routeEl.scrollHeight;
    routeSvg.setAttribute("viewBox", `0 0 12 ${h}`);
    routeSvg.setAttribute("preserveAspectRatio", "none");
    routeLine.setAttribute("y2", Math.max(0, h - 8));
    const len = routeLine.getTotalLength ? routeLine.getTotalLength() : h;
    routeLine.style.strokeDasharray = len;
    if (!routeEl.classList.contains("in-view")) {
      routeLine.style.strokeDashoffset = len;
    }
  };
  sizeRoute();
  window.addEventListener("resize", sizeRoute);

  if ("IntersectionObserver" in window) {
    const routeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            routeEl.classList.add("in-view");
            routeLine.style.strokeDashoffset = "0";
            routeObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    routeObserver.observe(routeEl);
  } else {
    routeEl.classList.add("in-view");
    routeLine.style.strokeDashoffset = "0";
  }
}

/* ---------- Radar mouse parallax ---------- */
if (!reduceMotion && finePointer) {
  const radarWrap = document.getElementById("radarWrap");
  if (radarWrap) {
    radarWrap.addEventListener("mousemove", (e) => {
      const r = radarWrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      radarWrap.style.setProperty("--ry", px * 16 + "deg");
      radarWrap.style.setProperty("--rx", py * -16 + "deg");
    });
    radarWrap.addEventListener("mouseleave", () => {
      radarWrap.style.setProperty("--ry", "0deg");
      radarWrap.style.setProperty("--rx", "0deg");
    });
  }
}

/* ---------- Split-flap status readout ---------- */
const flapWord = document.getElementById("flapWord");
if (flapWord) {
  const words = [
    "SYSTEM DESIGN",
    "DISTRIBUTED SYSTEMS",
    "MICROSERVICES",
    "CQRS + DDD",
    "ASP.NET CORE",
    "CLEAN ARCHITECTURE",
    "Performance & Reliability",
    "Refactoring Techniques",
  ];
  if (!reduceMotion) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      flapWord.classList.add("flip");
      setTimeout(() => {
        flapWord.textContent = words[i];
      }, 250);
      setTimeout(() => {
        flapWord.classList.remove("flip");
      }, 500);
    }, 2600);
  }
}

/* ---------- Live clock (Asia/Tehran) ---------- */
const liveClock = document.getElementById("liveClock");
if (liveClock) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const tickClock = () => {
    liveClock.textContent = fmt.format(new Date()) + " IRST";
  };
  tickClock();
  setInterval(tickClock, 1000);
}

/* ---------- Animated stat counters ---------- */
const statNums = document.querySelectorAll(".hero-stats .n");
if (statNums.length && "IntersectionObserver" in window) {
  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = "0" + suffix;
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  statNums.forEach((el) => statObserver.observe(el));
}

/* ---------- Project card tilt + cursor spotlight ---------- */
document.querySelectorAll(".proj").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", px * 100 + "%");
    card.style.setProperty("--my", py * 100 + "%");
    if (!reduceMotion && finePointer) {
      const rotY = (px - 0.5) * 8;
      const rotX = (py - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "none";
  });
});

/* ---------- Theme toggle (persisted) ---------- */
const THEME_KEY = "ak-theme";
const rootEl = document.documentElement;

function applyTheme(theme) {
  if (theme === "light" || theme === "dark") {
    rootEl.setAttribute("data-theme", theme);
  } else {
    rootEl.removeAttribute("data-theme");
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const isLight =
      theme === "light" ||
      (!theme && window.matchMedia("(prefers-color-scheme: light)").matches);
    meta.setAttribute("content", isLight ? "#eef1f6" : "#0a0e16");
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch (e) {
  /* storage unavailable (private mode etc.) — fall back to system theme */
}
applyTheme(savedTheme);

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = rootEl.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* ignore */
    }
  });
}

/* ---------- Subtle scroll reveal ---------- */
const revealSelector =
  "#experience .section-head, #experience .xp, " +
  "#work .section-head, #work .proj, " +
  "#skills .section-head, #skills .skill-group, " +
  "#education .section-head, #education .edu-row, " +
  "#contact .section-kicker, #contact h2, #contact .contact-lede";
const revealEls = Array.from(document.querySelectorAll(revealSelector));

const parentCounters = new Map();
revealEls.forEach((el) => {
  el.classList.add(el.classList.contains("proj") ? "reveal-init" : "reveal");
  const idx = parentCounters.get(el.parentElement) || 0;
  parentCounters.set(el.parentElement, idx + 1);
  el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- Magnetic buttons ---------- */
if (!reduceMotion && finePointer) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.style.transition = "transform 0.15s ease-out";
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const px = e.clientX - r.left - r.width / 2;
      const py = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${px * 0.25}px, ${py * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}
