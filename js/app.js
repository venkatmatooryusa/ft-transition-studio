(function () {
  const container = document.getElementById("step-container");
  const navButtons = document.querySelectorAll(".ft-nav-item");

  function setActiveNav(step) {
    navButtons.forEach(btn => {
      const s = btn.getAttribute("data-step");
      btn.classList.toggle("active", s === String(step));
    });
  }

  async function loadStep(step) {
    setActiveNav(step);
    if (!container) return;

    container.innerHTML = "<p>Loading…</p>";

    try {
      const res = await fetch(`modules/step-${step}-${getStepSlug(step)}.html`);
      if (!res.ok) throw new Error("Not found");
      const html = await res.text();
      container.innerHTML = html;

      const fnName = `initStep${step}`;
      if (typeof window[fnName] === "function") {
        window[fnName]();
      }

    } catch (err) {
      container.innerHTML = "<p>Step coming soon.</p>";
    }
  }

  function getStepSlug(step) {
    switch (Number(step)) {
      case 1: return "gcq";
      case 2: return "catalyst";
      case 3: return "triad";
      case 4: return "t-shaped";
      case 5: return "ftp";
      case 6: return "pivot";
      case 7: return "strategic";
      case 8: return "rop-audit";
      default: return "gcq";
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const step = btn.getAttribute("data-step");
      window.location.hash = `#step-${step}`;
    });
  });

  function handleHashChange() {
    const hash = window.location.hash || "#step-1";
    const match = hash.match(/step-(\d)/);
    const step = match ? match[1] : "1";
    loadStep(step);
  }

  window.addEventListener("hashchange", handleHashChange);

  handleHashChange();
  window.updatePlanSummary();
})();

