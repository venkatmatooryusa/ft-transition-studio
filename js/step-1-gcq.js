(function () {
  let gcqChartInstance;

  // Called after step-1 HTML is injected
  window.initStep1 = function () {
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
  };

  // Expose modal close globally
  window.closeGCQModal = function () {
    const overlay = document.getElementById('gcq-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  // Expose calculateGCQ globally (called by button onclick)
  window.calculateGCQ = function () {
    // collect values
    const vals = [];
    for (let i = 1; i <= 10; i++) {
      const el = document.getElementById('q' + i);
      vals.push(el ? parseInt(el.value) : 3);
    }

    // Axes
    const axis1 = (vals[0] + (6 - vals[7])) / 2;          // Status vs ROP trade
    const axis2 = (vals[1] + vals[8]) / 2;                // External pressure / Sacred Debt
    const axis3 = (vals[2] + vals[6]) / 2;                // Hollowness / lack of integrity
    const axis4 = 6 - vals[3];                            // No WHY
    const axis5 = 6 - vals[4];                            // No WHO
    const axis6 = ((6 - vals[5]) + (6 - vals[9])) / 2;    // Path conformity

    const scores = [axis1, axis2, axis3, axis4, axis5, axis6];
    const total = scores.reduce((a, b) => a + b, 0);

    // Interpretation
    let level = '';
    let text = '';

    if (total > 21) {
      level = 'high';
      text = "Your GCQ is <strong>high</strong>. Status, pressure & expectations dominate your career choices.";
    } else if (total > 12) {
      level = 'moderate';
      text = "Your GCQ is <strong>moderate</strong>. You are between external success and internal purpose.";
    } else {
      level = 'low';
      text = "Your GCQ is <strong>low</strong>. You lean strongly toward purpose-led alignment.";
    }

    const interpEl = document.getElementById('gcq-interpretation-text');
    if (interpEl) {
      interpEl.innerHTML = text;
    }

    // Show modal
    const overlay = document.getElementById('gcq-modal-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }

    // Draw radar chart
    const canvas = document.getElementById('gcqChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');

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
    const payload = {
      axes: {
        status_focus: axis1,
        external_pressure: axis2,
        hollowness: axis3,
        no_why: axis4,
        no_who: axis5,
        path_conformity: axis6
      },
      rawAnswers: vals,
      total,
      level
    };

    // Call global handler defined in state.js
    if (typeof window.handleGCQResult === "function") {
      window.handleGCQResult(payload);
    }
  };
})();
