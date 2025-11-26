(function () {
  window.initStep2 = function () {
    // Tab switching
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

    // Form elements
    const tugInput = document.getElementById("catalyst-ethical-tug");
    const compulsionInput = document.getElementById("catalyst-compulsion");
    const contributionInput = document.getElementById("catalyst-contribution");
    const skillSelect = document.getElementById("catalyst-skill");

    const synthButton = document.getElementById("catalyst-synthesize-btn");
    const synthOutput = document.getElementById("catalyst-ethicalline");
    const saveButton = document.getElementById("catalyst-save-btn");

    const reviewNotes = document.getElementById("catalyst-review-notes");
    const saveNotesButton = document.getElementById("catalyst-save-notes-btn");

    // Prefill from existing state, if any
    const catalyst = window.TransitionPlan.catalyst || {};
    if (tugInput && catalyst.ethical_tug_raw) tugInput.value = catalyst.ethical_tug_raw;
    if (compulsionInput && catalyst.unique_compulsion) compulsionInput.value = catalyst.unique_compulsion;
    if (contributionInput && catalyst.contribution_ideas) contributionInput.value = catalyst.contribution_ideas;
    if (skillSelect && catalyst.primary_skill) skillSelect.value = catalyst.primary_skill;
    if (synthOutput && catalyst.ethical_tug_statement) synthOutput.value = catalyst.ethical_tug_statement;
    if (reviewNotes && catalyst.review_notes) reviewNotes.value = catalyst.review_notes;

    // Synthesize Ethical Tug
    if (synthButton) {
      synthButton.addEventListener("click", () => {
        const tugText = (tugInput?.value || "").trim();
        const compulsionText = (compulsionInput?.value || "").trim();
        const contributionText = (contributionInput?.value || "").trim();
        const skill = (skillSelect?.value || "").trim();

        // Simple extraction / defaults
        const injustice = tugText || "a specific injustice that you can no longer ignore";
        const compulsion = compulsionText || "a natural tendency to lean in more than required";
        const contribution = contributionText || "a contribution you feel responsible to make";
        const weaponSkill = skill || "a capability you want to weaponize";

        const draft = `I feel a duty to reduce ${injustice} by leaning into my natural compulsion to ${compulsion}, and by intentionally weaponizing ${weaponSkill} to ${contribution}.`;

        if (synthOutput) synthOutput.value = draft;

        // Switch to Synthesis tab
        tabButtons.forEach(b => b.classList.remove("active"));
        panels.forEach(panel => panel.classList.remove("active"));
        const synthTab = document.querySelector('.ft-step-tabs button[data-tab="synthesis"]');
        const synthPanel = document.querySelector('.ft-step-panel[data-panel="synthesis"]');
        if (synthTab) synthTab.classList.add("active");
        if (synthPanel) synthPanel.classList.add("active");
      });
    }

    // Save Ethical Tug to global state
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        const finalStatement = (synthOutput?.value || "").trim();
        const tugText = (tugInput?.value || "").trim();
        const compulsionText = (compulsionInput?.value || "").trim();
        const contributionText = (contributionInput?.value || "").trim();
        const skill = (skillSelect?.value || "").trim();

        window.TransitionPlan.catalyst = {
          ethical_tug_raw: tugText,
          unique_compulsion: compulsionText,
          contribution_ideas: contributionText,
          primary_skill: skill,
          ethical_tug_statement: finalStatement || null,
          review_notes: reviewNotes?.value || ""
        };

        window.updatePlanSummary();

        // Simple visual feedback (non-intrusive)
        saveButton.textContent = "Saved ✓";
        setTimeout(() => {
          saveButton.textContent = "Save Ethical Tug";
        }, 2000);
      });
    }

    // Save notes separately
    if (saveNotesButton) {
      saveNotesButton.addEventListener("click", () => {
        const existing = window.TransitionPlan.catalyst || {};
        window.TransitionPlan.catalyst = {
          ...existing,
          review_notes: reviewNotes?.value || ""
        };
        window.updatePlanSummary();

        saveNotesButton.textContent = "Notes Saved ✓";
        setTimeout(() => {
          saveNotesButton.textContent = "Save Notes";
        }, 2000);
      });
    }
  };
})();
