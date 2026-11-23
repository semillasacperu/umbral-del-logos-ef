window.MEDALS_CATALOG = [
    {
        id: "Dominio C1",
        order: 1,
        name: "Antorcha de la Caverna",
        imgSrc: "assets/medals/antorcha-caverna.png",
        desc: "1.ª Medalla · Criterio 1 (Integración de conceptos filosóficos): Logro destacado pleno en el criterio."
    },
    {
        id: "Dominio C2",
        order: 2,
        name: "Lente de lo Sensible",
        imgSrc: "assets/medals/lente-sensible.png",
        desc: "2.ª Medalla · Criterio 2 (Marcos y autores): Logro destacado pleno en el criterio."
    },
    {
        id: "Dominio C3",
        order: 3,
        name: "Balanza del Logos",
        imgSrc: "assets/medals/balanza-logos.png",
        desc: "3.ª Medalla · Criterio 3 (Problemáticas contemporáneas): Logro destacado pleno en el criterio."
    },
    {
        id: "Dominio C4",
        order: 4,
        name: "Puente Filosofía–Realidad",
        imgSrc: "assets/medals/puente-filosofia-realidad.png",
        desc: "4.ª Medalla · Criterio 4 (Relaciones filosofía–realidad): Logro destacado pleno (6/6) en el criterio."
    },
    {
        id: "Rumbo al 20",
        order: 5,
        name: "Laurel del Yanantin",
        imgSrc: "assets/medals/laurel-yanantin.png",
        desc: "5.ª Medalla · Progreso acumulado (>= 150 XP y >= 10.0/20.0 pts): Avance sostenido rumbo a los 20.0 puntos."
    },
    {
        id: "Simulacro EF Completo",
        order: 6,
        name: "Orbe del Antropoceno",
        imgSrc: "assets/medals/orbe-antropoceno.png",
        desc: "6.ª Medalla · Simulacro EF Completo: 8/8 ítems completados con puntaje proyectado >= 16.0/20.0."
    }
];

window.DOMAIN_GUIDANCE = {
    c1: "Vale 4.0/20.0 en Rúbrica EF (Logro destacado: 4 / Logrado: 3 / No logrado: 2). Integra conceptos al caso, no solo los enumeres.",
    c2: "Vale 4.0/20.0 en Rúbrica EF (Logro destacado: 4 / Logrado: 3 / No logrado: 2). Vincula corriente o autor con el planteamiento del caso.",
    c3: "Vale 6.0/20.0 en Rúbrica EF (Logro destacado: 6 / Logrado: 3 / No logrado: 2). Distingue con claridad problemáticas contemporáneas.",
    c4: "Vale 6.0/20.0 en Rúbrica EF (Logro destacado: 6 / Logrado: 4 / No logrado: 2). Relaciona enfoque filosófico con hechos reales y justifica decisión/límites."
};

window.renderAvatarSVG = function (gender, role, xp) {
    var roleThemes = {
        caverna: { primary: "#38bdf8", tunic: "#1e3a5f", symbol: "Φ" },
        agora: { primary: "#c084fc", tunic: "#3b1d5e", symbol: "⚖" },
        yanantin: { primary: "#34d399", tunic: "#134e3a", symbol: "⋈" },
        antropoceno: { primary: "#fbbf24", tunic: "#4a3210", symbol: "♁" }
    };
    var t = roleThemes[role] || roleThemes.caverna;
    var hasHalo = xp >= 100;
    var hasCrown = xp >= 250;

    var hairBack = "";
    var hairFront = "";
    var faceDetails = "";

    if (gender === "femenino") {
        hairBack = "<path d='M30 48 C26 78, 32 104, 42 110 L76 110 C86 104, 92 78, 88 48 Z' fill='#1e1b2e'/>";
        hairFront = "<path d='M36 46 C38 24, 80 24, 82 46 C76 34, 62 32, 59 38 C52 32, 42 35, 36 46 Z' fill='#1e1b2e'/>";
        faceDetails = "<path d='M48 68 Q59 74 70 68' stroke='#b45349' stroke-width='2.2' fill='none' stroke-linecap='round'/>" +
            "<circle cx='49' cy='56' r='2.5' fill='#0f172a'/><circle cx='69' cy='56' r='2.5' fill='#0f172a'/>";
    } else if (gender === "masculino") {
        hairBack = "<path d='M36 46 C36 28, 82 28, 82 46 L80 56 L38 56 Z' fill='#172033'/>";
        hairFront = "<path d='M36 46 C38 25, 80 25, 82 46 C74 36, 44 36, 36 46 Z' fill='#172033'/>";
        faceDetails = "<path d='M49 69 L69 69' stroke='#9a473e' stroke-width='2.3' stroke-linecap='round'/>" +
            "<rect x='45' y='50' width='8' height='2' rx='1' fill='#172033'/><rect x='65' y='50' width='8' height='2' rx='1' fill='#172033'/>" +
            "<circle cx='49' cy='56' r='2.5' fill='#0f172a'/><circle cx='69' cy='56' r='2.5' fill='#0f172a'/>";
    } else {
        hairBack = "<path d='M32 48 C30 70, 35 88, 42 92 L76 92 C83 88, 88 70, 86 48 Z' fill='#26233d'/>";
        hairFront = "<path d='M35 46 C38 24, 80 24, 83 46 C72 34, 58 40, 48 34 C42 38, 38 41, 35 46 Z' fill='#26233d'/>";
        faceDetails = "<path d='M50 68 Q59 72 68 68' stroke='#a84c42' stroke-width='2.2' fill='none' stroke-linecap='round'/>" +
            "<circle cx='49' cy='56' r='2.5' fill='#0f172a'/><circle cx='69' cy='56' r='2.5' fill='#0f172a'/>";
    }

    var haloSvg = hasHalo
        ? "<circle cx='59' cy='52' r='34' fill='none' stroke='" + t.primary + "' stroke-width='2' stroke-dasharray='4 3' opacity='0.85'/>"
        : "";
    var crownSvg = hasCrown
        ? "<polygon points='45,23 52,14 59,21 66,14 73,23' fill='#fbbf24' stroke='#fef08a' stroke-width='1'/>"
        : "";

    return "<svg viewBox='0 0 118 128' width='118' height='128' xmlns='http://www.w3.org/2000/svg'>" +
        "<defs>" +
        "<linearGradient id='tunicGrad' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0%' stop-color='" + t.primary + "'/>" +
        "<stop offset='100%' stop-color='" + t.tunic + "'/>" +
        "</linearGradient>" +
        "</defs>" +
        haloSvg +
        hairBack +
        "<path d='M22 126 C24 96, 40 86, 59 86 C78 86, 94 96, 96 126 Z' fill='url(#tunicGrad)' stroke='" + t.primary + "' stroke-width='1.5'/>" +
        "<path d='M45 87 L59 106 L73 87' fill='none' stroke='#f8fafc' stroke-width='2' opacity='0.75'/>" +
        "<rect x='52' y='74' width='14' height='16' rx='6' fill='#eab696'/>" +
        "<ellipse cx='59' cy='55' rx='21' ry='24' fill='#f3c6a5'/>" +
        hairFront +
        faceDetails +
        crownSvg +
        "<circle cx='59' cy='111' r='11' fill='#0b1120' stroke='" + t.primary + "' stroke-width='1.8'/>" +
        "<text x='59' y='115' text-anchor='middle' font-size='12' font-weight='800' fill='" + t.primary + "'>" + t.symbol + "</text>" +
        "</svg>";
};

window.renderFallbackMedalSVG = function (medalId) {
    var configs = {
        "Dominio C1": { color: "#38bdf8", sym: "Φ" },
        "Dominio C2": { color: "#c084fc", sym: "Ω" },
        "Dominio C3": { color: "#34d399", sym: "⚖" },
        "Dominio C4": { color: "#fbbf24", sym: "Ψ" },
        "Rumbo al 20": { color: "#f59e0b", sym: "⋈" },
        "Simulacro EF Completo": { color: "#a78bfa", sym: "♁" }
    };
    var cfg = configs[medalId] || { color: "#fbbf24", sym: "★" };
    return "<svg viewBox='0 0 64 64' width='56' height='56' xmlns='http://www.w3.org/2000/svg'>" +
        "<circle cx='32' cy='32' r='27' fill='#0f172a' stroke='" + cfg.color + "' stroke-width='3'/>" +
        "<text x='32' y='38' text-anchor='middle' font-size='18' font-weight='800' fill='" + cfg.color + "'>" + cfg.sym + "</text>" +
        "</svg>";
};

window.handleMedalImgError = function (imgEl, medalId) {
    if (!imgEl) return;
    if (!imgEl.dataset.triedDoublePng && imgEl.src && !/\.png\.png$/i.test(imgEl.src)) {
        imgEl.dataset.triedDoublePng = "1";
        imgEl.src = imgEl.src + ".png";
        return;
    }
    var wrap = document.createElement("span");
    wrap.className = "medal-svg-fallback";
    wrap.innerHTML = window.renderFallbackMedalSVG(medalId);
    if (imgEl.parentNode) {
        imgEl.parentNode.replaceChild(wrap, imgEl);
    }
};

window.renderMedalBadgeVisual = function (medal) {
    var safeSrc = (medal && medal.imgSrc) ? medal.imgSrc : "";
    var safeId = (medal && medal.id) ? medal.id : "";
    var safeName = (medal && medal.name) ? medal.name : "Medalla";
    return '<img class="medal-img" src="' + safeSrc + '" alt="' + safeName + '" onerror="window.handleMedalImgError(this, \'' + safeId + '\')" />';
};

window.renderDomainRingSVG = function (score, max, color) {
    var pct = Math.max(0, Math.min(1, score / max));
    var r = 22;
    var circ = 2 * Math.PI * r;
    var offset = circ * (1 - pct);
    var pctText = Math.round(pct * 100) + "%";

    return "<svg class='domain-ring' viewBox='0 0 58 58' xmlns='http://www.w3.org/2000/svg'>" +
        "<circle cx='29' cy='29' r='" + r + "' fill='none' stroke='#0b1120' stroke-width='6'/>" +
        "<circle cx='29' cy='29' r='" + r + "' fill='none' stroke='" + color + "' stroke-width='6' " +
        "stroke-dasharray='" + circ.toFixed(1) + "' stroke-dashoffset='" + offset.toFixed(1) + "' " +
        "stroke-linecap='round' transform='rotate(-90 29 29)'/>" +
        "<text x='29' y='33' text-anchor='middle' font-size='11' font-weight='800' fill='#f8fafc'>" + pctText + "</text>" +
        "</svg>";
};