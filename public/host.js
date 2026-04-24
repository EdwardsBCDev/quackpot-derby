import { createBrowserId, duckSvg, escapeHtml, formatCountdown, formatMoney, getStandings, getTrack, titleCase } from "/shared-ui.js";

const socket = io();
const hostKeyStorageKey = "quackpot-host-key";
const hostKey = localStorage.getItem(hostKeyStorageKey) || createBrowserId("host");

localStorage.setItem(hostKeyStorageKey, hostKey);

const elements = {
  closeBetting: document.querySelector("#close-betting"),
  countdown: document.querySelector("#countdown"),
  cameraChip: document.querySelector("#camera-chip"),
  historyList: document.querySelector("#history-list"),
  joinUrl: document.querySelector("#join-url"),
  leaderStrip: document.querySelector("#leader-strip"),
  openBetting: document.querySelector("#open-betting"),
  phaseCopy: document.querySelector("#phase-copy"),
  phasePill: document.querySelector("#phase-pill"),
  phaseTitle: document.querySelector("#phase-title"),
  playerCount: document.querySelector("#player-count"),
  playersList: document.querySelector("#players-list"),
  qrImage: document.querySelector("#qr-image"),
  raceAnnouncer: document.querySelector("#race-announcer"),
  raceNumber: document.querySelector("#race-number"),
  raceStage: document.querySelector("#race-stage"),
  resetGame: document.querySelector("#reset-game"),
  resultSummary: document.querySelector("#result-summary"),
  roomCode: document.querySelector("#room-code"),
  standingsList: document.querySelector("#standings-list"),
  toast: document.querySelector("#toast"),
  trackName: document.querySelector("#track-name"),
  trackScene: document.querySelector("#track-scene"),
  trackSelect: document.querySelector("#track-select")
};

let state = null;
let roomId = null;
let countdownTimer = null;
let toastTimer = null;
let publicBaseUrl = window.location.origin;
const trackDistance = 540;

socket.on("connect", () => {
  loadConfig().finally(() => {
    socket.emit("host:connect", { hostKey }, (result) => {
      if (!result?.ok) {
        showToast(result?.error || "Unable to create host room.");
        return;
      }

      roomId = result.roomId;
      state = result.state;
      render();
    });
  });
});

socket.on("room:state", (nextState) => {
  if (roomId && nextState.roomId !== roomId) {
    return;
  }

  roomId = nextState.roomId;
  state = nextState;
  render();
});

socket.on("room:error", (message) => {
  showToast(message);
});

elements.trackSelect.addEventListener("change", () => {
  socket.emit("host:set-track", { trackId: elements.trackSelect.value });
});

elements.openBetting.addEventListener("click", () => {
  socket.emit("host:open-betting");
});

elements.closeBetting.addEventListener("click", () => {
  socket.emit("host:close-betting");
});

elements.resetGame.addEventListener("click", () => {
  socket.emit("host:reset-game");
});

function render() {
  if (!state || !roomId) {
    return;
  }

  const track = getTrack(state);
  const standings = getStandings(state);
  const leader = standings[0] ? state.ducks.find((duck) => duck.number === standings[0].duckNumber) : null;
  const joinUrl = `${getBaseUrl()}/play?room=${encodeURIComponent(roomId)}`;

  elements.roomCode.textContent = roomId;
  elements.joinUrl.textContent = joinUrl;
  elements.qrImage.src = `/api/rooms/${encodeURIComponent(roomId)}/qr.svg`;
  elements.phasePill.textContent = titleCase(state.phase);
  elements.playerCount.textContent = `${state.players.length} / ${state.maxPlayers}`;
  elements.raceNumber.textContent = `Race ${state.raceNumber}`;
  elements.trackName.textContent = track?.name || "Track";
  elements.trackScene.dataset.phase = state.phase;
  elements.trackScene.dataset.camera = getCameraMode();
  elements.trackScene.dataset.track = track?.id || "track";
  elements.trackScene.style.setProperty("--water-a", track?.colors?.waterA || "#4aa7d4");
  elements.trackScene.style.setProperty("--water-b", track?.colors?.waterB || "#2d82b6");
  elements.trackScene.style.setProperty("--water-c", track?.colors?.waterC || "#8bd7f3");
  elements.trackScene.style.setProperty("--bank", track?.colors?.bank || "#16a34a");
  elements.trackScene.style.setProperty("--sky-a", track?.colors?.skyTop || "#ffd36d");
  elements.trackScene.style.setProperty("--sky-b", track?.colors?.skyBottom || "#ff8a5c");
  elements.trackScene.style.setProperty("--track-accent", track?.colors?.accent || "#ffd447");
  elements.trackScene.style.setProperty("--horizon", track?.colors?.horizon || "#0f8f4d");
  elements.cameraChip.textContent = `${track?.camera || "Race Cam"} · ${cameraLabelForPhase(state.phase)}`;

  renderTrackOptions(track?.id);
  renderPhaseText(track, leader, standings);
  renderPlayers();
  renderHistory();
  renderStandings(standings);
  renderLeaderStrip(standings);
  renderRaceStage();
  refreshCountdown();
  renderResultSummary();

  elements.openBetting.disabled = !["lobby", "results"].includes(state.phase);
  elements.closeBetting.disabled = state.phase !== "betting";
}

function renderTrackOptions(selectedId) {
  elements.trackSelect.innerHTML = state.tracks
    .map(
      (track) => `<option value="${track.id}" ${track.id === selectedId ? "selected" : ""}>${escapeHtml(track.name)}</option>`
    )
    .join("");
  elements.trackSelect.disabled = !["lobby", "results"].includes(state.phase);
}

function renderPhaseText(track, leader, standings) {
  const betCount = state.players.filter((player) => player.currentBet).length;

  if (state.phase === "lobby") {
    elements.phaseTitle.textContent = "Lobby Open";
    elements.phaseCopy.textContent = "Get players scanned in and ready.";
    elements.raceAnnouncer.textContent = `Room ${roomId} is open. Players scan the QR code, type their name, and receive £10 before betting starts.`;
    return;
  }

  if (state.phase === "betting") {
    elements.phaseTitle.textContent = `Race ${state.raceNumber} Betting`;
    elements.phaseCopy.textContent = `${betCount} bet${betCount === 1 ? "" : "s"} placed`;
    elements.raceAnnouncer.textContent = `${track?.venue || track?.name || "Track"} is ready. Players are backing ducks now. Close bets when the room is set.`;
    return;
  }

  if (state.phase === "lineup") {
    elements.phaseTitle.textContent = "Ducks To The Line";
    elements.phaseCopy.textContent = "Lineup countdown running";
    elements.raceAnnouncer.textContent = "Bets are closed. The ducks are shuffling into place for the start.";
    return;
  }

  if (state.phase === "racing") {
    const second = standings[1] ? state.ducks.find((duck) => duck.number === standings[1].duckNumber) : null;
    const gap = standings.length > 1 ? standings[0].progress - standings[1].progress : 0;

    elements.phaseTitle.textContent = "Race Underway";
    elements.phaseCopy.textContent = leader ? `${leader.name} leads` : "Race live";
    elements.raceAnnouncer.textContent = !leader
      ? "The ducks are on the water."
      : !second
        ? `${leader.name} is the only duck with clear water ahead.`
        : gap < 4
          ? `${leader.name} and ${second.name} are nearly side by side.`
          : `${leader.name} has ${gap.toFixed(1)}m on ${second.name}.`;
    return;
  }

  const winner = state.lastResult
    ? state.ducks.find((duck) => duck.number === state.lastResult.winningDuckNumber)
    : null;

  elements.phaseTitle.textContent = "Results";
  elements.phaseCopy.textContent = winner ? `${winner.name} wins` : "Race complete";
  elements.raceAnnouncer.textContent = winner
    ? `${winner.name} has taken the flag. Open betting when you want the next race.`
    : "Race complete.";
}

function renderPlayers() {
  if (!state.players.length) {
    elements.playersList.innerHTML = `<div class="empty-card">No players joined yet.</div>`;
    return;
  }

  elements.playersList.innerHTML = state.players
    .map((player) => {
      const betLabel = player.currentBet
        ? `Duck ${player.currentBet.duckNumber} · ${formatMoney(player.currentBet.amount)}`
        : state.phase === "betting"
          ? "No bet yet"
          : "Waiting";
      return `
        <article class="player-row">
          <div>
            <strong>${escapeHtml(player.nickname)}</strong>
            <small>${betLabel}</small>
          </div>
          <div class="player-balance">
            <strong>${formatMoney(player.balance)}</strong>
            <span class="status-dot ${player.connected ? "live" : "away"}"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderHistory() {
  if (!state.history.length) {
    elements.historyList.innerHTML = `<div class="empty-card">Winners will appear here after the first race.</div>`;
    return;
  }

  elements.historyList.innerHTML = state.history
    .map((entry) => {
      const duck = state.ducks.find((item) => item.number === entry.winningDuckNumber);
      const track = state.tracks.find((item) => item.id === entry.trackId);
      return `
        <article class="history-row">
          <strong>Race ${entry.raceNumber}</strong>
          <span>${escapeHtml(duck?.name || "Winner")}</span>
          <small>${escapeHtml(track?.name || "Track")}</small>
        </article>
      `;
    })
    .join("");
}

function renderStandings(standings) {
  if (!standings.length) {
    elements.standingsList.innerHTML = `<div class="empty-card">Standings appear once the ducks move.</div>`;
    return;
  }

  elements.standingsList.innerHTML = standings
    .slice(0, 5)
    .map((entry, index) => {
      const duck = state.ducks.find((item) => item.number === entry.duckNumber);
      const leaderProgress = standings[0]?.progress || 0;
      const gap = index === 0 ? "Leader" : `${(leaderProgress - entry.progress).toFixed(1)}m back`;
      return `
        <article class="standing-row ${index === 0 ? "leading" : ""}">
          <div class="standing-left">
            <span class="rank-badge">P${index + 1}</span>
            <div>
              <strong>#${duck.number} ${escapeHtml(duck.name)}</strong>
              <small>${gap}</small>
            </div>
          </div>
          <strong>${entry.progress.toFixed(1)}m</strong>
        </article>
      `;
    })
    .join("");
}

function renderLeaderStrip(standings) {
  const activeStandings = standings.length ? standings : state.ducks.slice(0, 5).map((duck) => ({ duckNumber: duck.number, progress: 0 }));

  elements.leaderStrip.innerHTML = activeStandings
    .slice(0, 5)
    .map((entry, index) => {
      const duck = state.ducks.find((item) => item.number === entry.duckNumber);
      return `
        <article class="leader-card ${index === 0 ? "leader" : ""}">
          <span>P${index + 1}</span>
          <strong>#${duck?.number || entry.duckNumber}</strong>
          <small>${escapeHtml(duck?.name || "Duck")}</small>
        </article>
      `;
    })
    .join("");
}

function renderRaceStage() {
  const byDuck = new Map(state.raceProgress.map((entry) => [entry.duckNumber, entry.progress]));
  const standings = getStandings(state);
  const ranks = new Map(standings.map((entry, index) => [entry.duckNumber, index + 1]));

  elements.raceStage.innerHTML = state.ducks
    .map((duck, index) => {
      const progress = byDuck.get(duck.number) || 0;
      const rawProgressPercent = Math.min(100, (progress / trackDistance) * 100);
      const progressPercent = progressForPhase(rawProgressPercent, index);
      const sceneProgressPercent = 7.5 + progressPercent * 0.82;
      const lane = index % 10;
      const column = Math.floor(index / 10);
      const lanePercent = 14 + lane * 7.7 + column * 2.1;
      const scale = 0.72 + lane * 0.028 + column * 0.04;
      const bob = (index % 5) * 0.12;
      const rank = ranks.get(duck.number) || index + 1;
      const isWinner = state.lastResult?.winningDuckNumber === duck.number;
      const isContender = state.phase === "racing" && rank <= 3;
      const duckWidth = state.phase === "racing" || state.phase === "results" ? 128 : 104;
      const duckHeight = state.phase === "racing" || state.phase === "results" ? 92 : 74;

      return `
        <article
          class="race-duck ${isContender ? "contender" : ""} ${isWinner ? "winner" : ""}"
          style="--x:${sceneProgressPercent.toFixed(2)}%; --y:${lanePercent.toFixed(2)}%; --scale:${scale.toFixed(3)}; --z:${20 + lane + column * 12}; --bob:${bob}s; --wake:${Math.max(12, rawProgressPercent * 0.78).toFixed(1)}%;"
        >
          <div class="duck-wake"></div>
          <div class="duck-shadow"></div>
          <div class="duck-visual">
            ${duckSvg(duck, { width: duckWidth, height: duckHeight })}
          </div>
          <div class="duck-tag"><span>#${duck.number}</span>${escapeHtml(duck.name)}</div>
        </article>
      `;
    })
    .join("");
}

function progressForPhase(progressPercent, index) {
  if (state.phase === "lobby") {
    return 4 + (index % 5) * 0.8;
  }

  if (state.phase === "betting") {
    return 6 + (index % 4) * 0.55;
  }

  if (state.phase === "lineup") {
    return 8.5 + (index % 3) * 0.3;
  }

  if (state.phase === "results") {
    return Math.max(progressPercent, state.lastResult ? 92 : progressPercent);
  }

  return progressPercent;
}

function getCameraMode() {
  if (state.phase === "lineup") {
    return "lineup";
  }

  if (state.phase === "racing") {
    return "race";
  }

  if (state.phase === "results") {
    return "finish";
  }

  return "wide";
}

function cameraLabelForPhase(phase) {
  if (phase === "lineup") {
    return "Lineup";
  }

  if (phase === "racing") {
    return "Live Race";
  }

  if (phase === "results") {
    return "Finish";
  }

  return "Wide";
}

function renderResultSummary() {
  if (!state.lastResult) {
    elements.resultSummary.textContent = "No race run yet.";
    return;
  }

  const winner = state.ducks.find((duck) => duck.number === state.lastResult.winningDuckNumber);
  const winners = state.lastResult.payouts.filter((entry) => entry.payout > 0);
  const payoutSummary = winners.length
    ? winners.map((entry) => `${entry.nickname} ${formatMoney(entry.payout)}`).join(" · ")
    : "Nobody backed the winner.";

  elements.resultSummary.textContent = `${winner?.name || "Winner"} took Race ${state.lastResult.raceNumber}. ${payoutSummary}`;
}

function refreshCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;

  const update = () => {
    if (state.phase === "betting") {
      elements.countdown.textContent = formatCountdown(state.bettingClosesAt) || "0s";
      return;
    }

    if (state.phase === "lineup") {
      elements.countdown.textContent = formatCountdown(state.lineupEndsAt) || "0s";
      return;
    }

    elements.countdown.textContent = state.phase === "racing" ? "Live" : "Waiting";
  };

  update();

  if (state.phase === "betting" || state.phase === "lineup") {
    countdownTimer = setInterval(update, 250);
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2800);
}

function getBaseUrl() {
  return publicBaseUrl.replace(/\/+$/, "");
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const payload = await response.json();

    if (payload?.publicBaseUrl) {
      publicBaseUrl = payload.publicBaseUrl;
    }
  } catch {
    publicBaseUrl = window.location.origin;
  }
}
