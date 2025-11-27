// js/why-categories.js

var WHY_CATEGORIES = [
  {
    id: "clarity_synthesis",
    label: "Clarity & Synthesis",
    keywords: [
      { word: "clarify", weight: 2 },
      { word: "clarity", weight: 2 },
      { word: "simplify", weight: 2 },
      { word: "distill", weight: 2 },
      { word: "synthesize", weight: 2 },
      { word: "structure", weight: 1 },
      { word: "framework", weight: 1 },
      { word: "explain", weight: 1 },
      { word: "translate", weight: 1 }
    ]
  },
  {
    id: "protection_preservation",
    label: "Protection & Preservation",
    keywords: [
      { word: "protect", weight: 2 },
      { word: "preserve", weight: 2 },
      { word: "guard", weight: 2 },
      { word: "defend", weight: 2 },
      { word: "secure", weight: 2 },
      { word: "vulnerable", weight: 1 },
      { word: "resilience", weight: 1 },
      { word: "heritage", weight: 1 },
      { word: "environment", weight: 1 }
    ]
  },
  {
    id: "equity_access",
    label: "Equity & Access",
    keywords: [
      { word: "equity", weight: 2 },
      { word: "equality", weight: 2 },
      { word: "fairness", weight: 2 },
      { word: "justice", weight: 2 },
      { word: "access", weight: 2 },
      { word: "inclusive", weight: 1 },
      { word: "inclusion", weight: 1 },
      { word: "underserved", weight: 2 },
      { word: "under-served", weight: 2 },
      { word: "marginalized", weight: 2 },
      { word: "disadvantaged", weight: 2 }
    ]
  },
  {
    id: "utility_efficiency",
    label: "Utility & Efficiency",
    keywords: [
      { word: "efficiency", weight: 2 },
      { word: "efficient", weight: 2 },
      { word: "optimize", weight: 2 },
      { word: "streamline", weight: 2 },
      { word: "system", weight: 1 },
      { word: "process", weight: 1 },
      { word: "workflow", weight: 1 },
      { word: "operations", weight: 1 },
      { word: "scalable", weight: 1 },
      { word: "scale", weight: 1 }
    ]
  },
  {
    id: "creation_innovation",
    label: "Creation & Innovation",
    keywords: [
      { word: "create", weight: 2 },
      { word: "invent", weight: 2 },
      { word: "innovate", weight: 2 },
      { word: "innovation", weight: 2 },
      { word: "build", weight: 1 },
      { word: "prototype", weight: 1 },
      { word: "launch", weight: 1 },
      { word: "experiment", weight: 1 },
      { word: "explore", weight: 1 }
    ]
  },
  {
    id: "aesthetics_experience",
    label: "Aesthetics & Experience",
    keywords: [
      { word: "beauty", weight: 2 },
      { word: "beautiful", weight: 2 },
      { word: "aesthetic", weight: 2 },
      { word: "design", weight: 2 },
      { word: "experience", weight: 2 },
      { word: "delight", weight: 1 },
      { word: "emotion", weight: 1 },
      { word: "storytelling", weight: 1 },
      { word: "resonance", weight: 1 }
    ]
  }
];

function detectWhyCategoryFromCatalyst(catalyst) {
  if (!catalyst) catalyst = {};

  var fields = [
    { text: catalyst.ethical_tug_raw || "",      weight: 3.0 },
    { text: catalyst.contribution_ideas || "",   weight: 2.0 },
    { text: catalyst.unique_compulsion || "",    weight: 1.5 },
    { text: catalyst.primary_skill || "",        weight: 1.0 }
  ];

  var i;
  for (i = 0; i < fields.length; i++) {
    fields[i].text = (fields[i].text || "").toLowerCase();
  }

  var bestCategory = null;
  var bestScore = 0;

  var c, f, k;
  for (c = 0; c < WHY_CATEGORIES.length; c++) {
    var cat = WHY_CATEGORIES[c];
    var score = 0;

    for (f = 0; f < fields.length; f++) {
      var t = fields[f].text;
      if (!t) continue;

      for (k = 0; k < cat.keywords.length; k++) {
        var kw = cat.keywords[k];
        if (!kw.word) continue;

        if (t.indexOf(kw.word.toLowerCase()) !== -1) {
          var kwWeight = kw.weight || 1;
          score += fields[f].weight * kwWeight;
        }
      }
    }

    cat._score = score; // debug

    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  if (!bestCategory || bestScore <= 0) {
    return null;
  }

  return {
    id: bestCategory.id,
    label: bestCategory.label,
    score: bestScore
  };
}

