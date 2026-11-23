window.formatTime = function (sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return m + ":" + s;
};

window.updateTimerUI = function () {
    const state = window.APP_STATE;
    const btn = document.getElementById("toggleTimerBtn");
    const bar = document.getElementById("timerBar");
    const clock = document.getElementById("clockDisplay");
    const pauseBtn = document.getElementById("pauseTimerBtn");
    const notice = document.getElementById("timerNotice");

    clock.textContent = window.formatTime(state.timerSeconds);
    if (state.timerEnabled) {
        btn.textContent = "Cronómetro: Activado";
        btn.classList.add("btn-timer-on");
        bar.classList.add("visible");
        pauseBtn.textContent = state.timerRunning ? "Pausar" : "Reanudar";
        notice.textContent = state.timerSeconds === 0 ? "Tiempo agotado: puedes seguir revisando o exportar tu PDF sin bloqueo." : (state.timerRunning ? "Cronómetro en marcha." : "Cronómetro en pausa.");
    } else {
        btn.textContent = "Cronómetro: Desactivado";
        btn.classList.remove("btn-timer-on");
        bar.classList.remove("visible");
    }
};

window.startTimerLoop = function () {
    const state = window.APP_STATE;
    clearInterval(state.timerInterval);
    state.timerRunning = true;
    state.timerInterval = setInterval(() => {
        if (!state.timerEnabled || !state.timerRunning) return;
        if (state.timerSeconds > 0) {
            state.timerSeconds -= 1;
            window.updateTimerUI();
        } else {
            state.timerRunning = false;
            clearInterval(state.timerInterval);
            window.updateTimerUI();
        }
    }, 1000);
    window.updateTimerUI();
};

window.enableTimer = function () {
    const state = window.APP_STATE;
    const mins = parseInt(document.getElementById("timerMinutesSelect").value, 10) || 25;
    state.timerEnabled = true;
    state.timerSeconds = mins * 60;
    window.startTimerLoop();
};

window.disableTimer = function () {
    const state = window.APP_STATE;
    state.timerEnabled = false;
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    window.updateTimerUI();
};