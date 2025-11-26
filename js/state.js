// Global in-browser state for the Living Transition Plan
window.TransitionPlan = {
  gcq: null,            // Step 1 output
  catalyst: null,       // Step 2 output
  triad: {
    why: "",
    who: "",
    how: ""
  },
  tShaped: null,
  ftpProjects: [],
  pivotMode: null,
  conversations: [],
  ropAudits: []
};

window.updatePlanSummary = function () {
  const el = document.getElementById("plan-summary-content");
  if (!el) return;

  const gcqLevel = window.TransitionPlan.gcq?.level || "not yet assessed";

  el.innerHTML = `
    <p><strong>GCQ Diagnosis:</strong> ${gcqLevel}</p>
    <p><strong>Mission WHY:</strong> ${window.TransitionPlan.triad.why || 'Not defined yet.'}</p>
    <p><strong>Mission WHO:</strong> ${window.TransitionPlan.triad.who || 'Not defined yet.'}</p>
    <p><strong>Mission HOW:</strong> ${window.TransitionPlan.triad.how || 'Not defined yet.'}</p>
  `;
};

/**
 * 🔁 This is the global hook that GCQ calls.
 * The GCQ module invokes `window.handleGCQResult(payload)`.
 * We store it and refresh the sidebar here.
 */
window.handleGCQResult = function (result) {
  window.TransitionPlan.gcq = result;
  window.updatePlanSummary();
};
