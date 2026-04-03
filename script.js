const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsPointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const header = document.querySelector(".site-header");
const yearNode = document.querySelector("#year");
const revealNodes = document.querySelectorAll("[data-reveal]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const tiltNodes = [...document.querySelectorAll("[data-tilt]")];

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.25;
  let currentSection = sections[0]?.id ?? "";

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      currentSection = section.id;
    }
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("is-active", isActive);
  });
};

updateHeaderState();
updateActiveNav();

window.addEventListener(
  "scroll",
  () => {
    updateHeaderState();
    updateActiveNav();
  },
  { passive: true }
);

if (prefersReducedMotion) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  if (supportsPointerTilt) {
    tiltNodes.forEach((node) => {
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 8;
        const rotateY = (x - 0.5) * 10;

        node.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      node.addEventListener("pointerleave", () => {
        node.style.transform = "";
      });
    });
  }
}
