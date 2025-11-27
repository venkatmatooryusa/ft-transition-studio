// js/step-3-triad.js
(function () {
  console.log("step-3-triad.js loaded");

  function cleanSentence(text) {
    if (!text) return "";
    text = text.replace(/\s+/g, " ").trim();
    return text.replace(/[.。]+$/, "");
  }

  function buildWhySentence(cat, catalyst) {
    if (!catalyst) catalyst = {};

    var baseProblem =
      cleanSentence(catalyst.ethical_tug_raw) ||
      cleanSentence(catalyst.ethical_tug_statement) ||
      "the injustice I can no longer ignore";

    var sentence = "";

    if (!cat || !cat.id) {
      sentence = "I exist to address " + baseProblem + " in a way that is structurally consistent with who I am.";
      return sentence;
    }

    if (cat.id === "clarity_synthesis") {
      sentence =
        "I exist to create clarity and synthesis around " + baseProblem +
        ", so that people can see and act on what truly matters.";
    } else if (cat.id === "protection_preservation") {
      sentence =
        "I exist to protect and preserve those most exposed to " + baseProblem +
        ", so that what is vulnerable is not quietly destroyed.";
    } else if (cat.id === "equity_access") {
      sentence =
        "I exist to dismantle structural barriers behind " + baseProblem +
        ", so that access and opportunity are not reserved for a few.";
    } else if (cat.id === "utility_efficiency") {
      sentence =
        "I exist to design systems that make " + baseProblem +
        " structurally easier to solve, through ruthless utility and efficiency.";
    } else if (cat.id === "creation_innovation") {
      sentence =
        "I exist to create new solutions that current tools cannot offer for " + baseProblem +
        ", so that this problem is attacked in fundamentally better ways.";
    } else if (cat.id === "aesthetics_experience") {
      sentence =
        "I exist to transform how people experience " + baseProblem +
        ", using design, aesthetics, and emotion to shift behaviour and meaning.";
    } else {
      sentence =
        "I exist to address " + baseProblem +
        " in a way that is structurally consistent with who I am.";
    }

    return sentence;
  }

  function findCategoryById(id) {
    if (!id || !window.WHY_CATEGORIES) return null;
    for (var i = 0; i < WHY_CATEGORIES.length; i++) {
      if (WHY_CATEGORIES[i].id === id) return WHY_CATEGORIES[i];
    }
    return null;
  }

  window.initStep3 = function () {
    console.log("initStep3 called for Step 3");

    var whyTextarea = document.getElementById("triad-why-text");
    var whoTextarea = document.getElementById("triad-who-text");
    var howTextarea = document.getElementById("triad-how-text");
    var catLabel = document.getElementById("triad-why-category-label");
    var catHint = document.getElementById("triad-why-hint");
    var catPills = document.querySelectorAll(".triad-category-pill");
    var saveBtn = document.getElementById("triad-save-btn");

    var triad = window.TransitionPlan.triad || {};
    var catalyst = window.TransitionPlan.catalyst || {};

    function setActiveCategoryPill(catId) {
      if (!catPills) return;
      for (var i = 0; i < catPills.length; i++) {
        var pill = catPills[i];
        if (pill.getAttribute("data-why-category") === catId) {
          pill.classList.add("active");
        } else {
          pill.classList.remove("active");
        }
      }
    }

    function applyCategorySuggestion(cat) {
      var sentence = buildWhySentence(cat, catalyst);

      if (whyTextarea && !triad.why) {
        // Only auto-overwrite if user hasn't already saved a WHY
        whyTextarea.value = sentence;
      }
      if (catLabel && cat) {
        catLabel.textContent = cat.label;
      } else if (catLabel && !cat) {
        catLabel.textContent = "Not yet detected";
      }
      if (catHint && cat) {
        catHint.textContent = "Detected WHY category: " + cat.label + ". You can still rewrite the sentence in your own voice.";
      } else if (catHint) {
        catHint.textContent = "We’ll auto-fill a draft based on your Ethical Tug. You can still rewrite it in your own words.";
      }
      if (cat && cat.id) {
        setActiveCategoryPill(cat.id);
        triad.why_category = { id: cat.id, label: cat.label };
      }
    }

    // Prefill from existing TRIAD if present
    if (triad && triad.why) {
      if (whyTextarea) whyTextarea.value = triad.why;
      if (whoTextarea && triad.who) whoTextarea.value = triad.who;
      if (howTextarea && triad.how) howTextarea.value = triad.how;
      if (catLabel && triad.why_category && triad.why_category.label) {
        catLabel.textContent = triad.why_category.label;
      }
      if (triad.why_category && triad.why_category.id) {
        setActiveCategoryPill(triad.why_category.id);
      }
    } else {
      // No TRIAD saved yet: try automatic detection from Catalyst
      if (typeof detectWhyCategoryFromCatalyst === "function") {
        var detected = detectWhyCategoryFromCatalyst(catalyst);
        if (detected) {
          console.log("Detected WHY category:", detected);
          applyCategorySuggestion(detected);
        } else {
          console.log("No WHY category detected");
          if (catLabel) {
            catLabel.textContent = "Not yet detected";
          }
        }
      }
    }

    // Wire up category pills (user can click any category to regenerate WHY)
    if (catPills && catPills.length) {
      for (var i = 0; i < catPills.length; i++) {
        (function (pill) {
          pill.addEventListener("click", function () {
            var catId = pill.getAttribute("data-why-category");
            var cat = findCategoryById(catId);
            applyCategorySuggestion(cat);
          });
        })(catPills[i]);
      }
    }

    // Save TRIAD
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var whyVal = whyTextarea ? cleanSentence(whyTextarea.value) : "";
        var whoVal = whoTextarea ? cleanSentence(whoTextarea.value) : "";
        var howVal = howTextarea ? cleanSentence(howTextarea.value) : "";

        var finalTriad = {
          why: whyVal,
          who: whoVal,
          how: howVal
        };

        if (triad.why_category) {
          finalTriad.why_category = triad.why_category;
        }

        window.TransitionPlan.triad = finalTriad;

        if (typeof window.updatePlanSummary === "function") {
          window.updatePlanSummary();
        }

        saveBtn.textContent = "TRIAD Saved ✓";
        setTimeout(function () {
          saveBtn.textContent = "Save TRIAD";
        }, 2000);
      });
    }
  };
})();

