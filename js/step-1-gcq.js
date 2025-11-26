(function () {
  window.initStep1 = function () {
    const tabButtons = document.querySelectorAll(".ft-step-tabs button");
    const panels = document.querySelectorAll(".ft-step-panel");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        panels.forEach(panel => {
          panel.classList.toggle("active", panel.getAttribute("data-panel") === tab);
        });
      });
    });

    // Nothing else needed here for GCQ wiring:
    // handleGCQResult is now defined in state.js and will be called from the GCQ script.
  };
})();
