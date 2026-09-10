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
