document.addEventListener("DOMContentLoaded", () => {
    const state = window.APP_STATE;

    function showMainSection(sectionKey) {
        state.activeTab = sectionKey;

        document.getElementById("tabSim")?.classList.toggle("active", sectionKey === "sim");
        document.getElementById("tabResources")?.classList.toggle("active", sectionKey === "resources");
        document.getElementById("tabPdfPreview")?.classList.toggle("active", sectionKey === "pdf");
        document.getElementById("tabValidation")?.classList.toggle("active", sectionKey === "validation");

        const simPanel = document.getElementById("simPanel");
        const resPanel = document.getElementById("resourcesPanel");
        const pdfPanel = document.getElementById("pdfPanel");
        const valPanel = document.getElementById("validationPanel");

        if (simPanel) simPanel.style.display = sectionKey === "sim" ? "block" : "none";
        if (resPanel) resPanel.style.display = sectionKey === "resources" ? "block" : "none";
        if (pdfPanel) pdfPanel.style.display = sectionKey === "pdf" ? "block" : "none";
        if (valPanel) valPanel.style.display = sectionKey === "validation" ? "block" : "none";

        if (sectionKey === "resources" && typeof window.renderResources === "function") {
            window.renderResources();
        }
        if (sectionKey === "pdf" && typeof window.renderPdfPreview === "function") {
            window.renderPdfPreview();
        }
        if (sectionKey === "validation" && window.STUDENT_VALIDATION && typeof window.STUDENT_VALIDATION.refresh === "function") {
            window.STUDENT_VALIDATION.refresh();
        }
    }

    window.setActiveTab = showMainSection;

    document.getElementById("tabSim")?.addEventListener("click", () => showMainSection("sim"));
    document.getElementById("tabResources")?.addEventListener("click", () => showMainSection("resources"));
    document.getElementById("tabPdfPreview")?.addEventListener("click", () => showMainSection("pdf"));
    document.getElementById("tabValidation")?.addEventListener("click", () => showMainSection("validation"));
    document.getElementById("openValidationFromPdfBtn")?.addEventListener("click", () => showMainSection("validation"));
    document.getElementById("openValidationFromAsideBtn")?.addEventListener("click", () => showMainSection("validation"));

    document.getElementById("toggleTimerBtn")?.addEventListener("click", () => {
        if (!state.timerEnabled) window.enableTimer();
        else window.disableTimer();
    });

    document.getElementById("timerMinutesSelect")?.addEventListener("change", () => {
        if (state.timerEnabled) window.enableTimer();
    });

    document.getElementById("pauseTimerBtn")?.addEventListener("click", () => {
        if (!state.timerEnabled) return;
        if (state.timerRunning) {
            state.timerRunning = false;
            clearInterval(state.timerInterval);
            window.updateTimerUI();
        } else if (state.timerSeconds > 0) {
            window.startTimerLoop();
        }
    });

    document.getElementById("resetTimerBtn")?.addEventListener("click", () => {
        if (state.timerEnabled) window.enableTimer();
    });

    document.getElementById("disableTimerBtn")?.addEventListener("click", window.disableTimer);

    document.getElementById("newSimBtn")?.addEventListener("click", () => {
        state.simNumber += 1;
        window.generateSimulation();
        showMainSection("sim");
        window.renderAll();
    });

    document.getElementById("exportPdfBtn")?.addEventListener("click", window.exportToPdf);
    document.getElementById("downloadPdfFromPanelBtn")?.addEventListener("click", window.exportToPdf);

    document.getElementById("courseNotesInput")?.addEventListener("input", (e) => {
        state.courseNotes = e.target.value;
        window.renderPdfPreview();
    });

    document.getElementById("genderSelect")?.addEventListener("change", (e) => {
        state.gender = e.target.value;
        window.renderDashboard();
    });

    document.getElementById("avatarSelect")?.addEventListener("change", (e) => {
        state.avatar = e.target.value;
        window.renderDashboard();
    });

    window.generateSimulation();
    window.renderAll();

    if (window.STUDENT_VALIDATION && typeof window.STUDENT_VALIDATION.init === "function") {
        window.STUDENT_VALIDATION.init();
    }
});