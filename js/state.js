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

  const gcqLevel = TransitionPlan.gcq?.level || "not yet assessed";

  el.innerHTML = `
    <p><strong>GCQ Diagnosis:</strong> ${gcqLevel}</p>
    <p><strong>Mission WHY:</strong> ${TransitionPlan.triad.why || 'Not defined yet.'}</p>
    <p><strong>Mission WHO:</strong> ${TransitionPlan.triad.who || 'Not defined yet.'}</p>
    <p><strong>Mission HOW:</strong> ${TransitionPlan.triad.how || 'Not defined yet.'}</p>
  `;
};

