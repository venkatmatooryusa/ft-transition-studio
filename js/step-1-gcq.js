(function () {
  var gcqChartInstance;

  // Internal helper: update the Plan tab based on GCQ level
  function updateGCQPlanInternal() {
  var planBox = document.getElementById("gcq-plan-content");
  if (!planBox) return;

  var gcq = window.TransitionPlan.gcq;

  // Helper to interpret axis score
  function axisBand(score) {
    if (score >= 4) return "High Golden Cage pressure";
    if (score >= 2.5) return "Moderate pressure";
    return "Low pressure";
  }

  // If GCQ not yet run, show generic guidance
  if (!gcq || !gcq.level) {
    planBox.innerHTML =
      '<h3 style="margin-top:0;margin-bottom:0.5rem;font-size:1rem;color:#fbbf24;">Your GCQ Action Plan</h3>' +
      '<p style="margin-bottom:0.75rem;color:#cbd5e1;">Complete the GCQ in the <strong>Assessment</strong> tab to see a tailored action plan and a breakdown of your radar plot here.</p>' +
      '<ul style="margin:0.5rem 0 0.25rem 1.2rem;color:#cbd5e1;font-size:0.85rem;">' +
      '<li><strong>High GCQ:</strong> You are strongly Golden Cage bound. Step 2 becomes urgent.</li>' +
      '<li><strong>Moderate GCQ:</strong> You are in tension. Small, deliberate shifts matter.</li>' +
      '<li><strong>Low GCQ:</strong> You are relatively aligned. Protect and deepen that alignment.</li>' +
      '</ul>' +
      '<p style="margin-top:0.75rem;color:#22d3ee;font-size:0.85rem;">Once you calculate your GCQ, this plan will update with specific guidance and a radar breakdown.</p>';
    return;
  }

  var level = gcq.level; // "high", "moderate", "low"
  var title = "Your GCQ Action Plan";
  var body = "";
  var bullets = "";

  if (level === "high") {
    body =
      "Your Golden Cage Quotient is <strong>high</strong>. External pressure, status, and structural expectations are driving your career more than your inner purpose. The objective now is not to resign overnight, but to create space for honest diagnosis and future pivots.";
    bullets =
      "<li>Explicitly name your Golden Cage patterns (status, Sacred Debt, conformity) using your radar chart.</li>" +
      "<li>Block a small, recurring time window each week that is not owned by your current employer or CV.</li>" +
      "<li>Commit to completing Step 2 (Catalyst Conversations) within the next 7 days.</li>" +
      "<li>Share your GCQ insights with one trusted person who will hold you to your future self.</li>";
  } else if (level === "moderate") {
    body =
      "Your Golden Cage Quotient is <strong>moderate</strong>. You are living in tension between the Golden Cage and your desire for purpose. You are not fully trapped, but drifting is dangerous if you do nothing.";
    bullets =
      "<li>Circle the 2–3 axes on your radar chart where you feel the most inner friction.</li>" +
      "<li>Design one small experiment at work that moves you slightly closer to your Ethical Tug.</li>" +
      "<li>Use Step 2 (Catalyst Conversations) to turn vague restlessness into a precise Ethical Tug statement.</li>" +
      "<li>Start a simple log in the Review tab whenever you notice Golden Cage decisions.</li>";
  } else { // low
    body =
      "Your Golden Cage Quotient is <strong>low</strong>. You are relatively purpose-aligned already. The goal is to protect this alignment and deepen your contribution with more structural integrity.";
    bullets =
      "<li>Note which axes on your radar chart are already close to the center (low Golden Cage) and why.</li>" +
      "<li>Identify one area where you still feel some compromise and name it clearly.</li>" +
      "<li>Use Step 2 to sharpen your Ethical Tug so that your future choices stay anchored.</li>" +
      "<li>Design one practice or boundary that will prevent future drift back into the Golden Cage.</li>";
  }

  // Axis breakdown table (documenting the radar plot numerically + in words)
  var axes = (gcq && gcq.axes) ? gcq.axes : null;

  var breakdownHTML = "";
  if (axes) {
    breakdownHTML +=
      '<h4 style="margin-top:1rem;margin-bottom:0.4rem;font-size:0.9rem;color:#e5e7eb;">Radar Breakdown</h4>' +
      '<p style="margin:0 0 0.5rem;color:#94a3b8;font-size:0.8rem;">Each axis below corresponds to one spoke on your radar plot. Higher scores indicate stronger Golden Cage pressure on that dimension.</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;color:#cbd5e1;">' +
      '<thead>' +
      '<tr>' +
      '<th style="text-align:left;border-bottom:1px solid #1f2937;padding:0.25rem 0.25rem;">Dimension</th>' +
      '<th style="text-align:center;border-bottom:1px solid #1f2937;padding:0.25rem 0.25rem;">Score (0–5)</th>' +
      '<th style="text-align:left;border-bottom:1px solid #1f2937;padding:0.25rem 0.25rem;">Interpretation</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

    var meta = [
      {
        key: "status_focus",
        label: "Status Focus (ROI)",
        desc: "How strongly status, salary and prestige dominate over purpose."
      },
      {
        key: "external_pressure",
        label: "External Pressure (Sacred Debt)",
        desc: "How much family, social or institutional expectations drive your choices."
      },
      {
        key: "hollowness",
        label: "Misalignment & Hollowness",
        desc: "The felt gap between your daily work and what you truly value."
      },
      {
        key: "no_why",
        label: "Purpose Ambiguity (No WHY)",
        desc: "Lack of a clear ethical problem you feel responsible for."
      },
      {
        key: "no_who",
        label: "Abstract Focus (No WHO)",
        desc: "Lack of a clear community or ecosystem you want to serve."
      },
      {
        key: "path_conformity",
        label: "Path Conformity (Generic HOW)",
        desc: "Extent to which you’re following a generic template instead of an Adjacent Role."
      }
    ];

    for (var i = 0; i < meta.length; i++) {
      var m = meta[i];
      var raw = axes[m.key];
      var score = (typeof raw === "number") ? raw : null;
      var scoreText = (score === null) ? "-" : score.toFixed(1);
      var band = (score === null) ? "Not measured" : axisBand(score);

      breakdownHTML +=
        '<tr>' +
        '<td style="vertical-align:top;padding:0.3rem 0.25rem 0.4rem 0.25rem;">' +
        '<div style="font-weight:600;color:#e5e7eb;">' + m.label + '</div>' +
        '<div style="color:#94a3b8;font-size:0.75rem;margin-top:0.1rem;">' + m.desc + '</div>' +
        '</td>' +
        '<td style="vertical-align:top;text-align:center;padding:0.3rem 0.25rem 0.4rem 0.25rem;">' +
        scoreText +
        '</td>' +
        '<td style="vertical-align:top;padding:0.3rem 0.25rem 0.4rem 0.25rem;color:#e5e7eb;">' +
        band +
        '</td>' +
        '</tr>';
    }

    breakdownHTML += '</tbody></table>';
  } else {
    breakdownHTML +=
      '<h4 style="margin-top:1rem;margin-bottom:0.4rem;font-size:0.9rem;color:#e5e7eb;">Radar Breakdown</h4>' +
      '<p style="margin:0;color:#94a3b8;font-size:0.8rem;">Run the GCQ assessment in the Assessment tab to see a detailed breakdown of each axis here.</p>';
  }

  // Final Plan tab HTML
  planBox.innerHTML =
    '<h3 style="margin-top:0;margin-bottom:0.5rem;font-size:1rem;color:#fbbf24;">' + title + '</h3>' +
    '<p style="margin-bottom:0.75rem;color:#cbd5e1;font-size:0.9rem;">' + body + '</p>' +
    '<ul style="margin:0.5rem 0 0.25rem 1.2rem;color:#cbd5e1;font-size:0.85rem;">' + bullets + '</ul>' +
    '<p style="margin-top:0.75rem;color:#22d3ee;font-size:0.85rem;">Your next move is to continue into Step 2 (Catalyst Conversations) and turn this awareness into a clear Ethical Tug.</p>' +
    breakdownHTML;
}


  // Expose for reuse if needed
  window.updateGCQPlan = updateGCQPlanInternal;

  // Called after Step 1 HTML is injected
  window.initStep1 = function () {
    console.log("initStep1 called");

    // Tab switching
    var tabButtons = document.querySelectorAll(".ft-step-tabs button");
    var panels = document.querySelectorAll(".ft-step-panel");

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

    // Prefill Review notes if present in state
    var reviewNotes = document.getElementById("gcq-review-notes");
    var saveNotesButton = document.getElementById("gcq-save-notes-btn");

    var gcq = window.TransitionPlan.gcq || {};
    if (reviewNotes && gcq.review_notes) {
      reviewNotes.value = gcq.review_notes;
    }

    if (saveNotesButton && reviewNotes) {
      saveNotesButton.addEventListener("click", function () {
        var existing = window.TransitionPlan.gcq || {};
        existing.review_notes = reviewNotes.value || "";
        window.TransitionPlan.gcq = existing;

        if (typeof window.updatePlanSummary === "function") {
          window.updatePlanSummary();
        }

        saveNotesButton.textContent = "GCQ Notes Saved ✓";
        setTimeout(function () {
          saveNotesButton.textContent = "Save GCQ Notes";
        }, 2000);
      });
    }

    // Initial plan rendering (in case GCQ already exists from a previous visit)
    updateGCQPlanInternal();
  };

  // Modal close
  window.closeGCQModal = function () {
    var overlay = document.getElementById('gcq-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  // GCQ calculation + chart (unchanged in spirit, with one extra call to updateGCQPlan)
  window.calculateGCQ = function () {
    // collect values
    var vals = [];
    for (var i = 1; i <= 10; i++) {
      var el = document.getElementById('q' + i);
      vals.push(el ? parseInt(el.value, 10) : 3);
    }

    // Axes
    var axis1 = (vals[0] + (6 - vals[7])) / 2;          // Status vs ROP trade
    var axis2 = (vals[1] + vals[8]) / 2;                // External pressure / Sacred Debt
    var axis3 = (vals[2] + vals[6]) / 2;                // Hollowness / lack of integrity
    var axis4 = 6 - vals[3];                            // No WHY
    var axis5 = 6 - vals[4];                            // No WHO
    var axis6 = ((6 - vals[5]) + (6 - vals[9])) / 2;    // Path conformity

    var scores = [axis1, axis2, axis3, axis4, axis5, axis6];
    var total = 0;
    for (var j = 0; j < scores.length; j++) {
      total += scores[j];
    }

    // Interpretation
    var level = "";
    var text = "";

    if (total > 21) {
      level = "high";
      text = "Your GCQ is <strong>high</strong>. Status, pressure & expectations dominate your career choices.";
    } else if (total > 12) {
      level = "moderate";
      text = "Your GCQ is <strong>moderate</strong>. You are between external success and internal purpose.";
    } else {
      level = "low";
      text = "Your GCQ is <strong>low</strong>. You lean strongly toward purpose-led alignment.";
    }

    var interpEl = document.getElementById('gcq-interpretation-text');
    if (interpEl) {
      interpEl.innerHTML = text;
    }

    // Show modal
    var overlay = document.getElementById('gcq-modal-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }

    // Draw radar chart
    var canvas = document.getElementById('gcqChart');
    if (canvas) {
      var ctx = canvas.getContext('2d');

      if (gcqChartInstance) gcqChartInstance.destroy();

      gcqChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            "Status Focus",
            "External Pressure",
            "Hollowness",
            "No WHY",
            "No WHO",
            "Path Conformity"
          ],
          datasets: [{
            data: scores,
            backgroundColor: 'rgba(251,191,36,0.2)',
            borderColor: '#fbbf24',
            borderWidth: 2,
            pointBackgroundColor: '#fbbf24'
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              min: 0,
              max: 5,
              ticks: { stepSize: 1 },
              grid: { color: "#475569" },
              pointLabels: {
                color: "#e2e8f0",
                font: { size: 13 }
              }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // Build payload for global state
    var payload = {
      axes: {
        status_focus: axis1,
        external_pressure: axis2,
        hollowness: axis3,
        no_why: axis4,
        no_who: axis5,
        path_conformity: axis6
      },
      rawAnswers: vals,
      total: total,
      level: level
    };

    // Call global handler defined in state.js
    if (typeof window.handleGCQResult === "function") {
      window.handleGCQResult(payload);
    }

    // Update the Plan tab based on new GCQ
    updateGCQPlanInternal();
  };
})();
