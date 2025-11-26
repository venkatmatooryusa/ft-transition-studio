(function () {
  // This should log as soon as the script is loaded by the browser
  console.log("step-2-catalyst.js loaded");

  window.initStep2 = function () {
    console.log("initStep2 called for Step 2");

    // --- Tab switching ---
    var tabButtons = document.querySelectorAll(".ft-step-tabs button");
    var panels = document.querySelectorAll(".ft-step-panel");

    if (!tabButtons.length) {
      console.warn("Step 2: No tab buttons found.");
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        tabButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        panels.forEach(function (panel) {
          var active = panel.getAttribute("data-panel") === tab;
          if (active) panel.classList.add("active");
          else panel.classList.remove("active");
        });
      });
    });

    // --- Form elements ---
    var tugInput = document.getElementById("catalyst-ethical-tug");
    var compulsionInput = document.getElementById("catalyst-compulsion");
    var contributionInput = document.getElementById("catalyst-contribution");
    var skillSelect = document.getElementById("catalyst-skill");

    var synthButton = document.getElementById("catalyst-synthesize-btn");
    var synthOutput = document.getElementById("catalyst-ethicalline");
    var saveButton = document.getElementById("catalyst-save-btn");

    var reviewNotes = document.getElementById("catalyst-review-notes");
    var saveNotesButton = document.getElementById("catalyst-save-notes-btn");

    if (!synthButton) {
      console.warn("Step 2: Synthesize button not found.");
    }

    // --- Prefill from existing state, if any ---
    var catalyst = window.TransitionPlan.catalyst || {};

    if (tugInput && catalyst.ethical_tug_raw) {
      tugInput.value = catalyst.ethical_tug_raw;
    }
    if (compulsionInput && catalyst.unique_compulsion) {
      compulsionInput.value = catalyst.unique_compulsion;
    }
    if (contributionInput && catalyst.contribution_ideas) {
      contributionInput.value = catalyst.contribution_ideas;
    }
    if (skillSelect && catalyst.primary_skill) {
      skillSelect.value = catalyst.primary_skill;
    }
    if (synthOutput && catalyst.ethical_tug_statement) {
      synthOutput.value = catalyst.ethical_tug_statement;
    }
    if (reviewNotes && catalyst.review_notes) {
      reviewNotes.value = catalyst.review_notes;
    }

    // --- Synthesize Ethical Tug ---
    if (synthButton) {
      synthButton.addEventListener("click", function () {
        console.log("Step 2: Synthesize button clicked");

        var tugText = tugInput ? tugInput.value.trim() : "";
        var compulsionText = compulsionInput ? compulsionInput.value.trim() : "";
        var contributionText = contributionInput ? contributionInput.value.trim() : "";
        var skill = skillSelect ? skillSelect.value.trim() : "";

        var injustice = tugText || "a specific injustice that you can no longer ignore";
        var compulsion = compulsionText || "a natural tendency to lean in more than required";
        var contribution = contributionText || "a contribution you feel responsible to make";
        var weaponSkill = skill || "a capability you want to weaponize";

        var draft = "I feel a duty to reduce " + injustice +
          " by leaning into my natural compulsion to " + compulsion +
          ", and by intentionally weaponizing " + weaponSkill +
          " to " + contribution + ".";

        if (synthOutput) {
          synthOutput.value = draft;
        } else {
          console.warn("Step 2: synthOutput textarea not found.");
        }

        // Switch to Synthesis tab
        var synthTab = document.querySelector('.ft-step-tabs button[data-tab="synthesis"]');
        var synthPanel = document.querySelector('.ft-step-panel[data-panel="synthesis"]');

        tabButtons.forEach(function (b) { b.classList.remove("active"); });
        panels.forEach(function (panel) { panel.classList.remove("active"); });

        if (synthTab) synthTab.classList.add("active");
        if (synthPanel) synthPanel.classList.add("active");
      });
    }

    // --- Save Ethical Tug to global state ---
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        console.log("Step 2: Save Ethical Tug clicked");

        var finalStatement = synthOutput ? synthOutput.value.trim() : "";
        var tugText = tugInput ? tugInput.value.trim() : "";
        var compulsionText = compulsionInput ? compulsionInput.value.trim() : "";
        var contributionText = contributionInput ? contributionInput.value.trim() : "";
        var skill = skillSelect ? skillSelect.value.trim() : "";
        var notes = reviewNotes ? reviewNotes.value : "";

        window.TransitionPlan.catalyst = {
          ethical_tug_raw: tugText,
          unique_compulsion: compulsionText,
          contribution_ideas: contributionText,
          primary_skill: skill,
          ethical_tug_statement: finalStatement || null,
          review_notes: notes
        };

        if (typeof window.updatePlanSummary === "function") {
          window.updatePlanSummary();
        }

        saveButton.textContent = "Saved ✓";
        setTimeout(function () {
          saveButton.textContent = "Save Ethical Tug";
        }, 2000);
      });
    } else {
      console.warn("Step 2: Save button not found.");
    }

    // --- Save notes separately ---
    if (saveNotesButton) {
      saveNotesButton.addEventListener("click", function () {
        console.log("Step 2: Save Notes clicked");

        var existing = window.TransitionPlan.catalyst || {};
        var notes = reviewNotes ? reviewNotes.value : "";

        window.TransitionPlan.catalyst = {
          ethical_tug_raw: existing.ethical_tug_raw || "",
          unique_compulsion: existing.unique_compulsion || "",
          contribution_ideas: existing.contribution_ideas || "",
          primary_skill: existing.primary_skill || "",
          ethical_tug_statement: existing.ethical_tug_statement || null,
          review_notes: notes
        };

        if (typeof window.updatePlanSummary === "function") {
          window.updatePlanSummary();
        }

        saveNotesButton.textContent = "Notes Saved ✓";
        setTimeout(function () {
          saveNotesButton.textContent = "Save Notes";
        }, 2000);
      });
    } else {
      console.warn("Step 2: Save Notes button not found.");
    }
  };
})();
