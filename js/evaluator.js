// Evaluación de Criterio 4 según Rúbrica EF 2026-2 (máx. 6 pts: Logro destacado 6 / Logrado 4 / No logrado 2)
window.evaluateOpenCase = function (ethVal, polVal, decText) {
    var clean = (decText || "").trim();
    var words = clean.split(/\s+/).filter(Boolean).length;
    var hasEth = Boolean(ethVal);
    var hasPol = Boolean(polVal);
    var isHelpQuestion = /^(no\s+entiendo|cómo\s+se\s+responde|como\s+se\s+responde|ayuda|duda|no\s+sé\s+qué\s+poner|no\s+se\s+que\s+poner)\b/i.test(clean);
    var hasCaseLink = /(caso|situación|real|hechos|comunidad|estudiantes|migrantes|desplazados|cuenca|agua|vigilancia|espacio|trámites|control|institución|ferias|monitoreo|territorio|emprendedoras)/i.test(clean);
    var hasDecisionOrLimit = /(decisión|propongo|proponer|límite|límites|revisión|consulta|garantía|garantías|proporcional|proporcionalidad|criterio|criterios|acuerdo|mediación|prohibir|restringir|permitir|exigir|establecer|autorizar)/i.test(clean);
    var hasJustification = /(porque|ya que|debido a|puesto que|dado que|para evitar|con el fin de|justifica|justificar|fundamenta|en tanto|por ello|de modo que)/i.test(clean);

    if (!isHelpQuestion && hasEth && hasPol && words >= 18 && hasCaseLink && hasDecisionOrLimit && hasJustification) {
        return {
            score: 6,
            levelLabel: "Logro destacado",
            comment: "Logro destacado (6/6): Identifica con pertinencia conceptual la relación entre ambos enfoques filosóficos y los hechos reales del caso, justificando una decisión o límites específicos.",
            fb: "Articulas con rigor un enfoque ético y uno filosófico-político con los hechos concretos del caso y fundamentas una decisión o límites pertinentes.",
            deepen: "Puedes emplear esta articulación filosofía–realidad en tu Informe de Filosofía Aplicada o podcast.",
            recovery: ""
        };
    }

    if (!isHelpQuestion && hasEth && hasPol && words >= 8 && (hasCaseLink || hasDecisionOrLimit)) {
        var missingParts = [];
        if (!hasCaseLink) missingParts.push("vincular explícitamente ambos enfoques con los hechos concretos del caso");
        if (!hasDecisionOrLimit) missingParts.push("formular una decisión o límites específicos");
        if (!hasJustification) missingParts.push("explicitar la justificación conceptual ('porque / ya que') de la decisión o límite");

        return {
            score: 4,
            levelLabel: "Logrado",
            comment: "Logrado (4/6): Identifica parcialmente la relación entre enfoques filosóficos y la situación real; para alcanzar Logro destacado falta: " + missingParts.join("; ") + ".",
            fb: "Seleccionas ambos enfoques y esbozas una conexión con el caso, pero la vinculación con los hechos concretos, la delimitación de la decisión o su justificación aún es parcial.",
            deepen: "",
            recovery: "Micro-reto de argumento (4 -> 6 pts): (1) Vincula tu enfoque ético y político/cosmológico a un hecho concreto del caso; (2) Propón una decisión o límite; (3) Justifícala con 'porque / ya que'."
        };
    }

    return {
        score: 2,
        levelLabel: "No logrado",
        comment: "No logrado (2/6): Aún no se presenta un argumento coherente que vincule los enfoques filosóficos con los hechos reales del caso y justifique una decisión o límite.",
        fb: "Para obtener puntaje superior en Criterio 4 no basta con seleccionar las listas ni escribir una consulta: debes redactar un argumento coherente conectado con los dos enfoques elegidos y con los hechos del caso.",
        deepen: "",
        recovery: "Guía para construir tu argumento: (1) Explica cómo los dos enfoques seleccionados leen lo que ocurre en el caso; (2) Indica qué decisión o límite propones; (3) Justifícala ('porque / ya que') desde los principios del curso."
    };
};

// Recalcula de forma estricta y coherente las medallas por criterio y progreso
window.recalculateBadges = function () {
    var state = window.APP_STATE;
    var freshBadges = new Set();
    var answersList = Object.values(state.answers || {});

    var critStats = {
        c1: { count: 0, allMax: true },
        c2: { count: 0, allMax: true },
        c3: { count: 0, allMax: true },
        c4: { count: 0, allMax: true }
    };

    var totalScore = 0;

    for (var i = 0; i < answersList.length; i++) {
        var ans = answersList[i];
        if (!ans || typeof ans.score !== "number" || typeof ans.max !== "number") continue;
        totalScore += ans.score;
        var cKey = ans.cKey || "c1";
        if (!critStats[cKey]) {
            critStats[cKey] = { count: 0, allMax: true };
        }
        critStats[cKey].count += 1;
        if (ans.score < ans.max) {
            critStats[cKey].allMax = false;
        }
    }

    if (critStats.c1.count > 0 && critStats.c1.allMax) freshBadges.add("Dominio C1");
    if (critStats.c2.count > 0 && critStats.c2.allMax) freshBadges.add("Dominio C2");
    if (critStats.c3.count > 0 && critStats.c3.allMax) freshBadges.add("Dominio C3");
    if (critStats.c4.count > 0 && critStats.c4.allMax) freshBadges.add("Dominio C4");

    if (state.xp >= 150 && totalScore >= 10.0) {
        freshBadges.add("Rumbo al 20");
    }

    if (answersList.length === 8 && totalScore >= 16.0) {
        freshBadges.add("Simulacro EF Completo");
    }

    state.badges = freshBadges;
};

window.recordAnswer = function (qIdx, resultObj, detailStr) {
    var state = window.APP_STATE;
    var q = state.questions[qIdx];
    var prev = state.answers[qIdx];

    if (prev) {
        var prevEarned = (prev.score >= prev.max)
            ? Math.round(prev.score * 25) + 10
            : Math.round((prev.score || 0) * 10);
        state.xp = Math.max(0, state.xp - prevEarned);
    }

    var maxPts = q.maxPts || 2;
    var isPerfect = resultObj.score >= maxPts;

    state.answers[qIdx] = {
        score: resultObj.score,
        levelLabel: resultObj.levelLabel || "",
        comment: resultObj.comment || "",
        fb: resultObj.fb || "",
        deepen: resultObj.deepen || "",
        recovery: resultObj.recovery || "",
        chosenIdx: resultObj.chosenIdx,
        ethVal: resultObj.ethVal,
        polVal: resultObj.polVal,
        decText: resultObj.decText,
        max: maxPts,
        cKey: q.cKey || "c1",
        module: q.module || "Módulo del curso",
        qNum: q.qNum || (qIdx + 1),
        detail: detailStr || "Sin detalle"
    };

    if (isPerfect) {
        state.streak += 1;
        state.xp += Math.round(resultObj.score * 25) + state.streak * 10;
    } else {
        state.streak = 0;
        state.xp += Math.round((resultObj.score || 0) * 10);
    }

    window.recalculateBadges();
    window.renderAll();
};

window.selectMcq = function (qIdx, optIdx) {
    var q = window.APP_STATE.questions[qIdx];
    var opts = (q && q.shuffledOptions) ? q.shuffledOptions : [];
    var opt = opts[optIdx] || {};
    var letter = ["A", "B", "C", "D"][optIdx] || "";
    var safeText = opt.text || "[Error de datos: falta propiedad 'text' en data/questionBank.js]";

    window.recordAnswer(
        qIdx,
        {
            score: typeof opt.pts === "number" ? opt.pts : 1.0,
            levelLabel: opt.levelLabel || "Logrado",
            comment: opt.comment || "",
            fb: opt.fb || "",
            deepen: opt.deepen || "",
            recovery: opt.recovery || "",
            chosenIdx: optIdx
        },
        letter + ". " + safeText
    );
};

window.submitOpen = function (qIdx) {
    var ethEl = document.getElementById("ethSelect");
    var polEl = document.getElementById("polSelect");
    var decEl = document.getElementById("decInput");
    var ethVal = ethEl ? ethEl.value : "";
    var polVal = polEl ? polEl.value : "";
    var decText = decEl ? decEl.value : "";
    var res = window.evaluateOpenCase(ethVal, polVal, decText);

    window.recordAnswer(
        qIdx,
        {
            score: res.score,
            levelLabel: res.levelLabel,
            comment: res.comment,
            fb: res.fb,
            deepen: res.deepen,
            recovery: res.recovery,
            ethVal: ethVal,
            polVal: polVal,
            decText: decText
        },
        "Ética: " + (ethVal || "—") + " | Política/Cosmovisión: " + (polVal || "—") + " | Argumento y decisión: " + (decText || "—")
    );
};