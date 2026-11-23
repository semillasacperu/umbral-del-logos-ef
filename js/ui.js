window.setActiveTab = function (tabName) {
  var state = window.APP_STATE;
  state.activeTab = tabName;
  var tabSim = document.getElementById("tabSim");
  var tabRes = document.getElementById("tabResources");
  var tabPdf = document.getElementById("tabPdfPreview");
  var tabVal = document.getElementById("tabValidation");

  if (tabSim) tabSim.classList.toggle("active", tabName === "sim");
  if (tabRes) tabRes.classList.toggle("active", tabName === "resources");
  if (tabPdf) tabPdf.classList.toggle("active", tabName === "pdf");
  if (tabVal) tabVal.classList.toggle("active", tabName === "validation");

  var simPanel = document.getElementById("simPanel");
  var resPanel = document.getElementById("resourcesPanel");
  var pdfPanel = document.getElementById("pdfPanel");
  var valPanel = document.getElementById("validationPanel");

  if (simPanel) simPanel.style.display = tabName === "sim" ? "block" : "none";
  if (resPanel) resPanel.style.display = tabName === "resources" ? "block" : "none";
  if (pdfPanel) pdfPanel.style.display = tabName === "pdf" ? "block" : "none";
  if (valPanel) valPanel.style.display = tabName === "validation" ? "block" : "none";

  if (tabName === "resources" && typeof window.renderResources === "function") window.renderResources();
  if (tabName === "pdf" && typeof window.renderPdfPreview === "function") window.renderPdfPreview();
  if (tabName === "validation" && window.STUDENT_VALIDATION && typeof window.STUDENT_VALIDATION.refresh === "function") {
    window.STUDENT_VALIDATION.refresh();
  }
};

window.getRecommendedResources = function () {
  var state = window.APP_STATE;
  var list = window.SYLLABUS_RESOURCES || [];
  var weakCrit = new Set();
  Object.values(state.answers).forEach(function (a) {
    if (a.score < a.max) weakCrit.add(a.cKey);
  });
  if (weakCrit.size === 0) return list.slice(0, 4);
  var filtered = list.filter(function (r) { return weakCrit.has(r.crit); });
  return filtered.length ? filtered : list.slice(0, 4);
};

window.renderResources = function () {
  var rec = window.getRecommendedResources();
  var recEl = document.getElementById("recommendedSection");
  var catEl = document.getElementById("catalogList");

  if (recEl) {
    recEl.innerHTML =
      "<h4>Recomendados según tu desempeño actual</h4>" +
      rec.map(function (r) {
        return "<div class='resource-item'><strong>[" + (r.mod || "") + "] " + (r.title || "") + "</strong><br><span class='sub'>" + (r.note || "") + "</span></div>";
      }).join("");
  }

  if (catEl) {
    catEl.innerHTML = (window.SYLLABUS_RESOURCES || []).map(function (r) {
      return "<div class='resource-item'><strong>[" + (r.mod || "") + "] " + (r.title || "") + "</strong><br><span class='sub'>" + (r.note || "") + "</span></div>";
    }).join("");
  }
};

window.getCriterionRubricLevelText = function (cKey, score, max) {
  if (score <= 0) return "Sin evaluar";
  if (cKey === "c4") {
    if (score >= 6) return "Logro destacado";
    if (score >= 4) return "Logrado";
    return "No logrado";
  }
  var ratio = max > 0 ? score / max : 0;
  if (ratio >= 0.99) return "Logro destacado";
  if (ratio >= 0.62) return "Logrado";
  return "No logrado";
};

window.buildReportLines = function () {
  var state = window.APP_STATE;
  var byCrit = { c1: 0, c2: 0, c3: 0, c4: 0 };
  Object.values(state.answers).forEach(function (a) {
    var sc = typeof a.score === "number" ? a.score : 0;
    byCrit[a.cKey] = (byCrit[a.cKey] || 0) + sc;
  });

  var total = Number((byCrit.c1 + byCrit.c2 + byCrit.c3 + byCrit.c4).toFixed(1));
  var gap = Number(Math.max(0, 20 - total).toFixed(1));
  var timerInfo = state.timerEnabled ? "Activado (" + window.formatTime(state.timerSeconds) + " restantes)" : "Desactivado";

  var lines = [
    "REPORTE DE PREPARACIÓN — EVALUACIÓN FINAL 2026-2 (FILOSOFÍA HUM-102 / 810325)",
    "Universidad Científica del Sur | Rúbrica EF 2026-2 (20 pts)",
    "Simulacro #" + state.simNumber + " | Avatar: " + state.avatar + " (" + state.gender + ") | XP: " + state.xp + " | Racha: " + state.streak + " | Cronómetro: " + timerInfo,
    "Puntaje proyectado: " + total.toFixed(1) + " / 20.0 | Brecha al 20: " + gap.toFixed(1) + " pts",
    "========================================================================",
    "SÍNTESIS POR CRITERIOS DE RÚBRICA EF 2026-2:",
    "- Criterio 1 (Integración de conceptos filosóficos): " + byCrit.c1.toFixed(1) + "/4.0 [" + window.getCriterionRubricLevelText("c1", byCrit.c1, 4) + "] -> " + (window.DOMAIN_GUIDANCE && window.DOMAIN_GUIDANCE.c1 ? window.DOMAIN_GUIDANCE.c1 : ""),
    "- Criterio 2 (Reconocimiento de marcos filosóficos y autores): " + byCrit.c2.toFixed(1) + "/4.0 [" + window.getCriterionRubricLevelText("c2", byCrit.c2, 4) + "] -> " + (window.DOMAIN_GUIDANCE && window.DOMAIN_GUIDANCE.c2 ? window.DOMAIN_GUIDANCE.c2 : ""),
    "- Criterio 3 (Diferenciación de problemáticas filosóficas contemporáneas): " + byCrit.c3.toFixed(1) + "/6.0 [" + window.getCriterionRubricLevelText("c3", byCrit.c3, 6) + "] -> " + (window.DOMAIN_GUIDANCE && window.DOMAIN_GUIDANCE.c3 ? window.DOMAIN_GUIDANCE.c3 : ""),
    "- Criterio 4 (Identificación de relaciones filosofía–realidad): " + byCrit.c4.toFixed(1) + "/6.0 [" + window.getCriterionRubricLevelText("c4", byCrit.c4, 6) + "] -> " + (window.DOMAIN_GUIDANCE && window.DOMAIN_GUIDANCE.c4 ? window.DOMAIN_GUIDANCE.c4 : ""),
    "========================================================================",
    "DETALLE DE RESPUESTAS (P1 - P8):"
  ];

  state.questions.forEach(function (q, idx) {
    var a = state.answers[idx];
    if (!a) {
      lines.push("- P" + q.qNum + " (" + q.title + "): Pendiente de responder.");
    } else {
      lines.push("- P" + q.qNum + " [" + q.module + "] -> " + a.score + "/" + a.max + " pts (" + (a.levelLabel || "") + ")");
      lines.push("  Respuesta: " + a.detail);
      if (a.comment) lines.push("  Comentario de rúbrica: " + a.comment);
      lines.push("  Retroalimentación: " + a.fb);
      if (a.recovery) lines.push("  Micro-reto: " + a.recovery);
    }
  });

  lines.push("------------------------------------------------------------------------");
  lines.push("LECTURAS Y VIDEOS RECOMENDADOS DEL SÍLABO:");
  window.getRecommendedResources().forEach(function (r) {
    lines.push("* [" + r.mod + "] " + r.title);
  });

  if ((state.courseNotes || "").trim()) {
    lines.push("------------------------------------------------------------------------");
    lines.push("NOTAS PARA MINIDOCUMENTAL, PODCAST E INFORME DE FILOSOFÍA APLICADA:");
    lines.push(state.courseNotes.trim());
  }

  return lines;
};

window.renderPdfPreview = function () {
  var state = window.APP_STATE;
  var inputEl = document.getElementById("courseNotesInput");
  var boxEl = document.getElementById("pdfPreviewBox");
  if (inputEl) state.courseNotes = inputEl.value;
  if (boxEl) boxEl.textContent = window.buildReportLines().join("\n");
};

window.exportToPdf = function () {
  window.setActiveTab("pdf");
  window.renderPdfPreview();
  var statusEl = document.getElementById("exportStatus");
  if (statusEl) {
    statusEl.textContent = "Abriendo diálogo de impresión del navegador: elige 'Guardar como PDF' como destino.";
  }
  setTimeout(function () { window.print(); }, 120);
};

window.renderNav = function () {
  var state = window.APP_STATE;
  var nav = document.getElementById("qNav");
  if (!nav) return;
  nav.innerHTML = "";
  state.questions.forEach(function (q, idx) {
    var btn = document.createElement("button");
    btn.className = "q-pill" + (idx === state.currentQ ? " active" : "") + (state.answers[idx] ? " answered" : "");
    btn.textContent = "P" + q.qNum + " (" + q.maxPts + "p)";
    btn.onclick = function () { state.currentQ = idx; window.renderQuestion(); };
    nav.appendChild(btn);
  });
};

window.renderQuestion = function () {
  var state = window.APP_STATE;
  window.renderNav();
  var q = state.questions[state.currentQ];
  if (!q) return;

  var ans = state.answers[state.currentQ];
  var area = document.getElementById("questionArea");
  if (!area) return;
  var body = "";

  if (q.type === "mcq") {
    var subPrompt = (Array.isArray(q.subQuestions) && q.subQuestions.length) ? q.subQuestions.join("<br>") : "";
    var letters = ["A", "B", "C", "D"];
    var opts = Array.isArray(q.shuffledOptions) ? q.shuffledOptions : (Array.isArray(q.options) ? q.options : []);

    body =
      "<div class='case-box'>" + (q.caseText || "") + "</div>" +
      (subPrompt ? "<div class='sub-box'>" + subPrompt + "</div>" : "") +
      "<p><strong>" + (q.question || "") + "</strong></p>" +
      "<div class='options'>" +
      opts.map(function (opt, idx) {
        var hasText = opt && typeof opt.text === "string" && opt.text.trim().length > 0;
        var safeText = hasText ? opt.text : "[Error de datos: falta propiedad 'text' en data/questionBank.js]";
        var safePts = (opt && typeof opt.pts === "number") ? opt.pts : 1.0;
        var cls = "opt-btn";
        if (ans && ans.chosenIdx === idx) {
          cls += safePts >= 2.0 ? " top" : (safePts >= 1.25 ? " mid" : " low");
        }
        return "<button class='" + cls + "' onclick='selectMcq(" + state.currentQ + ", " + idx + ")'><strong>" + (letters[idx] || "") + ".</strong> " + safeText + "</button>";
      }).join("") +
      "</div>";
  } else {
    var ethOpts = Array.isArray(q.ethicalOptions) ? q.ethicalOptions : [];
    var polOpts = Array.isArray(q.politicalOptions) ? q.politicalOptions : [];

    body =
      "<div class='case-box'>" + (q.caseText || "") + "</div>" +
      "<div class='sub-box'><strong>Rúbrica EF Criterio 4 (Logro destacado: 6 / Logrado: 4 / No logrado: 2):</strong> " + (q.guidance || "") + "</div>" +
      "<div class='open-form'>" +
      "<label>1. Enfoque / noción ética vinculada al caso:" +
      "<select id='ethSelect'><option value=''>-- Selecciona un enfoque ético --</option>" +
      ethOpts.map(function (o) {
        return "<option value='" + o + "'" + (ans && ans.ethVal === o ? " selected" : "") + ">" + o + "</option>";
      }).join("") +
      "</select></label>" +
      "<label>2. Enfoque / noción filosófico-política o de cosmovisión:" +
      "<select id='polSelect'><option value=''>-- Selecciona un enfoque filosófico-político / cosmovisión --</option>" +
      polOpts.map(function (o) {
        return "<option value='" + o + "'" + (ans && ans.polVal === o ? " selected" : "") + ">" + o + "</option>";
      }).join("") +
      "</select></label>" +
      "<div class='arg-instruction-box'>" +
      "<strong>Instrucción para el argumento (obligatorio para evaluar con rigor):</strong> " +
      "En este cuadro debes redactar un <strong>argumento coherente</strong> articulado con las dos nociones seleccionadas arriba: (a) explica cómo se relacionan ambos enfoques con los <strong>hechos concretos</strong> de la situación real; (b) propón una <strong>decisión o límite específico</strong>; y (c) justifícala (<em>porque / ya que</em>)." +
      "</div>" +
      "<label>3. Redacción de tu argumento (relación filosofía–realidad, decisión o límites y justificación):" +
      "<textarea id='decInput' placeholder='Redacta aquí tu argumento coherente conectando ambos enfoques con los hechos del caso y justificando una decisión o límite específico...'>" + (ans ? (ans.decText || "") : "") + "</textarea></label>" +
      "<div><button class='btn-primary' onclick='submitOpen(" + state.currentQ + ")'>Evaluar argumento y relación filosofía–realidad (6 pts)</button></div>" +
      "</div>";
  }

  var fbHtml = "";
  if (ans) {
    var isTop = ans.score >= ans.max;
    var nextBtn = state.currentQ < state.questions.length - 1
      ? "<button class='btn-primary' style='margin-top:0.75rem;' onclick='window.APP_STATE.currentQ += 1; window.renderQuestion();'>Siguiente pregunta →</button>"
      : "<button class='btn-ok' style='margin-top:0.75rem;' onclick=\"window.setActiveTab('pdf')\">Ver vista previa y exportar PDF</button>";

    fbHtml =
      "<div class='feedback " + (isTop ? "top" : "partial") + "'>" +
      "<div class='fb-top'><span>Retroalimentación inmediata · " + (ans.levelLabel || "") + "</span><span>Puntaje: " + ans.score + " / " + ans.max + " pts</span></div>" +
      (ans.comment ? "<div class='rubric-comment'><strong>Comentario tipo rúbrica:</strong> " + ans.comment + "</div>" : "") +
      "<div style='margin-top:0.45rem;'>" + (ans.fb || "") + "</div>" +
      (ans.deepen ? "<div class='deepen'><strong>Profundización y vínculo con el curso:</strong> " + ans.deepen + "</div>" : "") +
      (ans.recovery ? "<div class='recovery'>" + ans.recovery + "</div>" : "") +
      "<div>" + nextBtn + "</div></div>";
  }

  area.innerHTML =
    "<div class='meta-row'><span class='badge'>" + (q.cLabel || "") + "</span><span class='badge badge-mod'>" + (q.module || "") + " · Máx. " + (q.maxPts || 2) + " pts</span></div>" +
    "<h2>Pregunta " + (q.qNum || (state.currentQ + 1)) + ": " + (q.title || "") + "</h2>" +
    body + fbHtml;
};

window.showMedalInfo = function (medalId) {
  var m = (window.MEDALS_CATALOG || []).find(function (item) { return item.id === medalId; });
  var detailEl = document.getElementById("medalDetail");
  if (!m || !detailEl) return;
  var unlocked = window.APP_STATE.badges.has(medalId);
  var status = unlocked ? "[LOGRADA] " : "[Aún no lograda] ";
  detailEl.textContent = status + m.name + " — " + m.desc;
};

window.showDomainInfo = function (cKey, label, val, max) {
  var detailEl = document.getElementById("domainDetail");
  if (!detailEl) return;
  var safeVal = Number(val || 0);
  var safeMax = Number(max || 0);
  var missing = Math.max(0, safeMax - safeVal).toFixed(1);
  var tip = (window.DOMAIN_GUIDANCE && window.DOMAIN_GUIDANCE[cKey]) || "";
  var msg = missing === "0.0"
    ? label + ": Logro destacado alcanzado (" + safeVal.toFixed(1) + "/" + safeMax.toFixed(1) + " pts). " + tip
    : label + ": tienes " + safeVal.toFixed(1) + "/" + safeMax.toFixed(1) + " pts (faltan " + missing + " pts para el máximo del criterio). " + tip;
  detailEl.textContent = msg;
};

window.renderDashboard = function () {
  var state = window.APP_STATE;
  if (typeof window.recalculateBadges === "function") {
    window.recalculateBadges();
  }

  var byCrit = { c1: 0, c2: 0, c3: 0, c4: 0 };
  var byMod = [0, 0, 0, 0];

  Object.values(state.answers).forEach(function (a) {
    var sc = typeof a.score === "number" ? a.score : 0;
    byCrit[a.cKey] = (byCrit[a.cKey] || 0) + sc;
    var modStr = a.module || "";
    if (modStr.indexOf("Módulo 1") !== -1) byMod[0] += sc;
    else if (modStr.indexOf("Módulo 2") !== -1) byMod[1] += sc;
    else if (modStr.indexOf("Módulo 3") !== -1) byMod[2] += sc;
    else if (modStr.indexOf("Módulo 4") !== -1) byMod[3] += sc;
  });

  var total = Number((byCrit.c1 + byCrit.c2 + byCrit.c3 + byCrit.c4).toFixed(1));
  var gap = Number(Math.max(0, 20 - total).toFixed(1));

  var portraitEl = document.getElementById("avatarPortrait");
  if (portraitEl && typeof window.renderAvatarSVG === "function") {
    portraitEl.innerHTML = window.renderAvatarSVG(state.gender, state.avatar, state.xp);
  }

  var rank = state.xp >= 250 ? "Maestro/a del Logos (Rumbo al 20)" : (state.xp >= 100 ? "Analista Crítico/a" : "Aprendiz del Logos");
  var rankEl = document.getElementById("avatarRank");
  var xpEl = document.getElementById("xpVal");
  var streakEl = document.getElementById("streakVal");
  var simNumEl = document.getElementById("simNumVal");
  if (rankEl) rankEl.textContent = "Rango: " + rank;
  if (xpEl) xpEl.textContent = state.xp;
  if (streakEl) streakEl.textContent = state.streak;
  if (simNumEl) simNumEl.textContent = state.simNumber;

  var medalsGrid = document.getElementById("medalsGrid");
  var orderedCatalog = (window.MEDALS_CATALOG || []).slice().sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  var earnedMedals = orderedCatalog.filter(function (m) {
    return state.badges.has(m.id);
  });

  if (medalsGrid) {
    if (!earnedMedals.length) {
      medalsGrid.innerHTML = "<div class='medals-empty'>Medallas logradas: 0 / " + orderedCatalog.length + ". Aparecerán en orden aquí solo al lograrlas.</div>";
    } else {
      medalsGrid.innerHTML = earnedMedals.map(function (m) {
        return "<div class='medal-card unlocked' onclick=\"window.showMedalInfo('" + m.id + "')\" onmouseover=\"window.showMedalInfo('" + m.id + "')\">" +
          window.renderMedalBadgeVisual(m) +
          "<div class='medal-order-tag'>#" + m.order + "</div>" +
          "<div class='medal-name'>" + m.name + "</div>" +
          "</div>";
      }).join("");
    }
  }

  var totalScoreEl = document.getElementById("totalScore");
  var gapValEl = document.getElementById("gapVal");
  if (totalScoreEl) {
    totalScoreEl.innerHTML = total.toFixed(1) + " <span style='font-size:0.9rem; color:var(--muted);'>/ 20.0</span>";
  }
  if (gapValEl) {
    gapValEl.textContent = gap === 0 ? "Meta 20.0 alcanzada" : "Faltan " + gap.toFixed(1) + " pts";
  }

  var critColors = { c1: "#38bdf8", c2: "#c084fc", c3: "#34d399", c4: "#fbbf24" };
  var critDomainsEl = document.getElementById("criteriaDomains");
  if (critDomainsEl) {
    critDomainsEl.innerHTML = (window.CRITERIA_META || []).map(function (c) {
      var val = Number((byCrit[c.key] || 0).toFixed(1));
      var ratio = c.max > 0 ? val / c.max : 0;
      var lvlClass = ratio >= 0.99 ? "level-high" : (ratio > 0 ? "level-mid" : "");
      var lvlLabel = window.getCriterionRubricLevelText(c.key, val, c.max);
      return "<div class='domain-tile " + lvlClass + "' onclick=\"window.showDomainInfo('" + c.key + "', '" + c.label + "', " + val + ", " + c.max + ")\" onmouseover=\"window.showDomainInfo('" + c.key + "', '" + c.label + "', " + val + ", " + c.max + ")\">" +
        window.renderDomainRingSVG(val, c.max, critColors[c.key]) +
        "<div class='domain-info'>" +
        "<div class='domain-title'>" + c.label + "</div>" +
        "<div class='domain-score'>" + val.toFixed(1) + " / " + c.max + " pts</div>" +
        "<div class='domain-state'>" + lvlLabel + "</div>" +
        "</div>" +
        "</div>";
    }).join("");
  }

  var modBarsEl = document.getElementById("modulesBars");
  if (modBarsEl) {
    modBarsEl.innerHTML = (window.MODULES_META || []).map(function (m, idx) {
      var val = Number((byMod[idx] || 0).toFixed(1));
      var pct = Math.min(100, (val / 6) * 100);
      return "<div class='mod-tile'>" +
        "<div class='mod-top'><span>" + m + "</span><strong>" + val.toFixed(1) + " pts</strong></div>" +
        "<div class='bar-bg'><div class='bar-fill' style='width:" + pct + "%'></div></div>" +
        "</div>";
    }).join("");
  }

  var notesEl = document.getElementById("notesBox");
  if (notesEl) {
    var notes = Object.values(state.answers).map(function (a) {
      return "<li><strong>P" + a.qNum + " (" + a.score + "/" + a.max + " · " + (a.levelLabel || "") + "):</strong> " + (a.comment || a.fb || "") + "</li>";
    });
    notesEl.innerHTML = notes.length ? notes.join("") : "<li>Responde ítems para recibir comentarios tipo rúbrica, micro-retos y pistas para el curso.</li>";
  }

  if (state.activeTab === "pdf") window.renderPdfPreview();
};

window.renderAll = function () {
  window.renderQuestion();
  window.renderDashboard();
  window.updateTimerUI();
};