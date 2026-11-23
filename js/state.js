window.APP_STATE = {
    simNumber: 1,
    gender: "femenino",
    avatar: "caverna",
    xp: 0,
    streak: 0,
    currentQ: 0,
    activeTab: "sim",
    questions: [],
    answers: {},
    recentIds: [],
    badges: new Set(),
    courseNotes: "",
    timerEnabled: false,
    timerRunning: false,
    timerSeconds: 25 * 60,
    timerInterval: null
};

window.shuffleArray = function (arr) {
    var copy = Array.isArray(arr) ? arr.slice() : [];
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    return copy;
};

window.pickItems = function (pool, count) {
    var safePool = Array.isArray(pool) ? pool : [];
    var state = window.APP_STATE;
    var notRecent = safePool.filter(function (item) {
        return state.recentIds.indexOf(item.id) === -1;
    });
    var source = notRecent.length >= count ? notRecent : safePool;
    var picked = window.shuffleArray(source).slice(0, count);
    picked.forEach(function (p) {
        state.recentIds.push(p.id);
        if (state.recentIds.length > 16) state.recentIds.shift();
    });
    return picked;
};

window.normalizeQuestionItem = function (item, extraMeta) {
    var base = Object.assign({}, item || {}, extraMeta || {});
    var rawOpts = Array.isArray(base.options) ? base.options : [];
    base.options = rawOpts.map(function (opt, idx) {
        var o = opt || {};
        var resolvedText = "";
        if (typeof o.text === "string" && o.text.trim()) {
            resolvedText = o.text.trim();
        } else if (typeof o.label === "string" && o.label.trim()) {
            resolvedText = o.label.trim();
        } else if (typeof o.opcion === "string" && o.opcion.trim()) {
            resolvedText = o.opcion.trim();
        }

        if (!resolvedText && console && typeof console.warn === "function") {
            console.warn("[Umbral del Logos] Opción sin 'text' en item '" + (base.id || "sin_id") + "', índice " + idx);
        }

        return {
            pts: typeof o.pts === "number" ? o.pts : 1.0,
            levelLabel: o.levelLabel || "Logrado",
            text: resolvedText || "[Error de datos: falta propiedad 'text' en data/questionBank.js]",
            comment: o.comment || "",
            fb: o.fb || "",
            deepen: o.deepen || "",
            recovery: o.recovery || ""
        };
    });
    return base;
};

window.generateSimulation = function () {
    var state = window.APP_STATE;
    var BANK = window.BANK || { c1: [], c2: [], c3: [], c4: [] };

    var q1_2 = window.pickItems(BANK.c1, 2).map(function (item, idx) {
        var norm = window.normalizeQuestionItem(item, {
            qNum: idx + 1,
            cKey: "c1",
            cLabel: "Criterio 1 · Integración de conceptos filosóficos",
            maxPts: 2,
            type: "mcq"
        });
        norm.shuffledOptions = window.shuffleArray(norm.options);
        return norm;
    });

    var q3_4 = window.pickItems(BANK.c2, 2).map(function (item, idx) {
        var norm = window.normalizeQuestionItem(item, {
            qNum: idx + 3,
            cKey: "c2",
            cLabel: "Criterio 2 · Reconocimiento de marcos filosóficos y autores",
            maxPts: 2,
            type: "mcq"
        });
        norm.shuffledOptions = window.shuffleArray(norm.options);
        return norm;
    });

    var q5_7 = window.pickItems(BANK.c3, 3).map(function (item, idx) {
        var norm = window.normalizeQuestionItem(item, {
            qNum: idx + 5,
            cKey: "c3",
            cLabel: "Criterio 3 · Diferenciación de problemáticas filosóficas contemporáneas",
            maxPts: 2,
            type: "mcq"
        });
        norm.shuffledOptions = window.shuffleArray(norm.options);
        return norm;
    });

    var q8 = window.pickItems(BANK.c4, 1).map(function (item) {
        return Object.assign({}, item, {
            qNum: 8,
            cKey: "c4",
            cLabel: "Criterio 4 · Identificación de relaciones filosofía–realidad",
            maxPts: 6,
            type: "open"
        });
    });

    state.questions = q1_2.concat(q3_4, q5_7, q8);
    state.answers = {};
    state.currentQ = 0;
};