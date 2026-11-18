if (matchMedia("(prefers-reduced-motion: no-preference)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!entry.target.contains(document.activeElement)) {
        entry.target.classList.add("reveal-active");
      }
    }
  });

  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}
