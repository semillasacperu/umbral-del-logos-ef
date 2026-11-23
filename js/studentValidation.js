window.STUDENT_VALIDATION = (function () {
    var STORAGE_KEY = "umbral_logos_ef_2026_2_validations_v2";

    function getStoredEntries() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function saveStoredEntries(entries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (err) {
            // Sin bloqueo ante restricciones de almacenamiento local
        }
    }

    function updateCounters(count) {
        var tabCountEl = document.getElementById("valTabCount");
        var asideCountEl = document.getElementById("valAsideCount");
        if (tabCountEl) tabCountEl.textContent = String(count);
        if (asideCountEl) asideCountEl.textContent = String(count);
    }

    function getCurrentSimSnapshot() {
        var st = window.APP_STATE || {};
        var answersObj = st.answers || {};
        var keys = Object.keys(answersObj);
        var totalScore = 0;

        for (var i = 0; i < keys.length; i++) {
            var item = answersObj[keys[i]];
            if (item && typeof item.score === "number") {
                totalScore += item.score;
            }
        }

        return {
            simNumber: st.simNumber || 1,
            avatarRole: st.avatar || "caverna",
            gender: st.gender || "femenino",
            xp: typeof st.xp === "number" ? st.xp : 0,
            answeredCount: keys.length,
            totalScore: Number(totalScore.toFixed(1))
        };
    }

    function getTopChoice(entries, fieldName) {
        if (!entries.length) return "Sin datos aún";
        var counts = {};
        var bestVal = "";
        var bestCount = 0;

        for (var i = 0; i < entries.length; i++) {
            var val = entries[i][fieldName] || "No especificado";
            counts[val] = (counts[val] || 0) + 1;
            if (counts[val] > bestCount) {
                bestCount = counts[val];
                bestVal = val;
            }
        }
        return bestVal + " (" + bestCount + "/" + entries.length + ")";
    }

    function renderDistributionList(title, entries, fieldName) {
        var counts = {};
        for (var i = 0; i < entries.length; i++) {
            var val = entries[i][fieldName] || "No especificado";
            counts[val] = (counts[val] || 0) + 1;
        }

        var keys = Object.keys(counts);
        var rows = [];
        for (var j = 0; j < keys.length; j++) {
            var k = keys[j];
            var pct = entries.length ? Math.round((counts[k] / entries.length) * 100) : 0;
            rows.push(
                "<div class='author-dist-row'>" +
                "<span>" + escapeHtml(k) + "</span>" +
                "<strong>" + counts[k] + " (" + pct + "%)</strong>" +
                "</div>"
            );
        }

        return (
            "<div class='author-breakdown-box'>" +
            "<div class='author-breakdown-title'>" + escapeHtml(title) + "</div>" +
            (rows.length ? rows.join("") : "<div class='sub'>Sin registros todavía.</div>") +
            "</div>"
        );
    }

    function buildAuthorReport(entries) {
        var list = Array.isArray(entries) ? entries : getStoredEntries();
        if (!list.length) {
            return "DASHBOARD DEL AUTOR · UMBRAL DEL LOGOS (FILOSOFÍA HUM-102 / EF 2026-2)\nNo hay validaciones registradas en este equipo todavía.";
        }

        var sumScore = 0;
        var optionalNotesCount = 0;
        for (var i = 0; i < list.length; i++) {
            sumScore += Number(list[i].totalScore || 0);
            if (list[i].optionalComment) optionalNotesCount += 1;
        }
        var avgScore = (sumScore / list.length).toFixed(1);

        var lines = [
            "DASHBOARD DEL AUTOR · ESCALAMIENTO DE UMBRAL DEL LOGOS (HUM-102 / EF 2026-2)",
            "Total de validaciones: " + list.length + " | Puntaje promedio simulacro: " + avgScore + "/20.0 | Con nota opcional: " + optionalNotesCount,
            "Top Utilidad EF: " + getTopChoice(list, "usefulness"),
            "Top Reto y claridad: " + getTopChoice(list, "clarity"),
            "Top Recurso útil: " + getTopChoice(list, "bestFeature"),
            "Top Prioridad de mejora/escalamiento: " + getTopChoice(list, "improvement"),
            "========================================================================"
        ];

        for (var j = 0; j < list.length; j++) {
            var e = list[j];
            lines.push(
                "#" + (j + 1) + " [" + e.timestamp + "] Sim #" + e.simNumber +
                " (" + Number(e.totalScore || 0).toFixed(1) + "/20.0 pts) | " +
                e.usefulness + " | " + e.clarity + " | Mejor: " + e.bestFeature + " | Mejora: " + e.improvement
            );
            if (e.optionalComment) {
                lines.push("  Nota opcional: " + e.optionalComment);
            }
        }

        return lines.join("\n");
    }

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/"/g, """);
  }

    function renderAuthorDashboard(entries, statusMessage) {
        var kpiEl = document.getElementById("authorKpis");
        var breakdownEl = document.getElementById("authorBreakdown");
        var listEl = document.getElementById("valHistoryList");
        var summaryBoxEl = document.getElementById("valSummaryBox");
        var statusEl = document.getElementById("valStatusMsg");

        updateCounters(entries.length);

        if (statusEl && typeof statusMessage === "string") {
            statusEl.textContent = statusMessage;
        }

        var sumScore = 0;
        var optionalItems = [];
        for (var i = 0; i < entries.length; i++) {
            sumScore += Number(entries[i].totalScore || 0);
            if (entries[i].optionalComment) {
                optionalItems.push(entries[i]);
            }
        }
        var avgScore = entries.length ? (sumScore / entries.length).toFixed(1) : "0.0";

        if (kpiEl) {
            kpiEl.innerHTML =
                "<div class='author-kpi'>" +
                "<div class='author-kpi-val'>" + entries.length + "</div>" +
                "<div class='author-kpi-lbl'>Validaciones</div>" +
                "</div>" +
                "<div class='author-kpi'>" +
                "<div class='author-kpi-val'>" + avgScore + "</div>" +
                "<div class='author-kpi-lbl'>Promedio / 20.0</div>" +
                "</div>" +
                "<div class='author-kpi'>" +
                "<div class='author-kpi-val'>" + optionalItems.length + "</div>" +
                "<div class='author-kpi-lbl'>Notas opcionales</div>" +
                "</div>";
        }

        if (breakdownEl) {
            breakdownEl.innerHTML =
                renderDistributionList("Utilidad EF", entries, "usefulness") +
                renderDistributionList("Reto y claridad", entries, "clarity") +
                renderDistributionList("Más útil para estudiar", entries, "bestFeature") +
                renderDistributionList("Prioridad de escalamiento", entries, "improvement");
        }

        if (listEl) {
            if (!optionalItems.length) {
                listEl.innerHTML = "<div class='val-empty'>No se han registrado comentarios opcionales aún. Las selecciones predeterminadas ya están contabilizadas en el Dashboard del Autor.</div>";
            } else {
                var rev = optionalItems.slice().reverse();
                listEl.innerHTML = rev.map(function (item) {
                    return (
                        "<article class='val-entry'>" +
                        "<div class='val-entry-head'>" +
                        "<strong>" + escapeHtml(item.contextTag || "Validación") + " · Sim #" + item.simNumber + " (" + Number(item.totalScore || 0).toFixed(1) + "/20.0)</strong>" +
                        "<span class='sub'>" + escapeHtml(item.timestamp) + "</span>" +
                        "</div>" +
                        "<p class='val-text'>" + escapeHtml(item.optionalComment) + "</p>" +
                        "</article>"
                    );
                }).join("");
            }
        }

        if (summaryBoxEl) {
            summaryBoxEl.value = buildAuthorReport(entries);
        }
    }

    function refresh(statusMessage) {
        var entries = getStoredEntries();
        renderAuthorDashboard(entries, statusMessage);
    }

    function handleSubmit(event) {
        event.preventDefault();

        var useEl = document.getElementById("valUsefulness");
        var claEl = document.getElementById("valClarity");
        var bestEl = document.getElementById("valBestFeature");
        var impEl = document.getElementById("valImprovement");
        var ctxEl = document.getElementById("valContext");
        var optCommentEl = document.getElementById("valOptionalComment");

        var snap = getCurrentSimSnapshot();
        var now = new Date();
        var optText = optCommentEl ? optCommentEl.value.trim() : "";

        var entry = {
            id: "val_" + now.getTime(),
            timestamp: now.toLocaleString("es-PE"),
            simNumber: snap.simNumber,
            avatarRole: snap.avatarRole,
            totalScore: snap.totalScore,
            answeredCount: snap.answeredCount,
            usefulness: useEl ? useEl.value : "Muy útil para la EF",
            clarity: claEl ? claEl.value : "Retador y claro",
            bestFeature: bestEl ? bestEl.value : "Casos tipo evaluación y rúbrica",
            improvement: impEl ? impEl.value : "Mantener estructura actual y escalar",
            contextTag: ctxEl ? ctxEl.value : "Estudiante HUM-102 · EF 2026-2",
            optionalComment: optText
        };

        var entries = getStoredEntries();
        entries.push(entry);
        saveStoredEntries(entries);

        if (optCommentEl) optCommentEl.value = "";
        refresh("Validación registrada (" + entries.length + " total). Dashboard del Autor actualizado.");
    }

    function handleNewRespondent() {
        var form = document.getElementById("studentValidationForm");
        if (form) form.reset();
        refresh("Campos predeterminados listos para un nuevo registro.");
    }

    function handleClearHistory() {
        saveStoredEntries([]);
        refresh("Historial local de validaciones limpiado.");
    }

    function handleCopySummary() {
        var summaryBoxEl = document.getElementById("valSummaryBox");
        if (!summaryBoxEl) return;
        var text = summaryBoxEl.value;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                refresh("Reporte del autor copiado al portapapeles.");
            }, function () {
                fallbackCopy(summaryBoxEl);
            });
        } else {
            fallbackCopy(summaryBoxEl);
        }
    }

    function fallbackCopy(el) {
        el.select();
        try {
            document.execCommand("copy");
            refresh("Reporte del autor copiado.");
        } catch (e) {
            refresh("Selecciona el texto y cópialo con Ctrl + C.");
        }
    }

    function init() {
        var form = document.getElementById("studentValidationForm");
        var newBtn = document.getElementById("valNewRespondentBtn");
        var clrBtn = document.getElementById("valClearBtn");
        var cpyBtn = document.getElementById("valCopySummaryBtn");

        refresh("");
        if (!form) return;

        form.addEventListener("submit", handleSubmit);
        if (newBtn) newBtn.addEventListener("click", handleNewRespondent);
        if (clrBtn) clrBtn.addEventListener("click", handleClearHistory);
        if (cpyBtn) cpyBtn.addEventListener("click", handleCopySummary);
    }

    return {
        init: init,
        refresh: refresh,
        getStoredEntries: getStoredEntries,
        buildAuthorReport: buildAuthorReport
    };
})();