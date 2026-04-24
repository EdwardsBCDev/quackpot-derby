const socket = io();
const playerKeyStorageKey = "quackpot-player-key";
const playerNameStorageKey = "quackpot-player-name";
const playerKey = localStorage.getItem(playerKeyStorageKey) || crypto.randomUUID();

localStorage.setItem(playerKeyStorageKey, playerKey);

const elements = {
  announcerBar: document.querySelector("#announcer-bar"),
  betAmount: document.querySelector("#bet-amount"),
  betForm: document.querySelector("#bet-form"),
  betHint: document.querySelector("#bet-hint"),
  body: document.body,
  connectedCount: document.querySelector("#connected-count"),
  countdownLabel: document.querySelector("#countdown-label"),
  ducksGrid: document.querySelector("#ducks-grid"),
  heroBlurb: document.querySelector("#hero-blurb"),
  historyList: document.querySelector("#history-list"),
  hostBadge: document.querySelector("#host-badge"),
  joinForm: document.querySelector("#join-form"),
  joinOverlay: document.querySelector("#join-overlay"),
  joinStage: document.querySelector("#join-stage"),
  leaderBadge: document.querySelector("#leader-badge"),
  miniPodium: document.querySelector("#mini-podium"),
  nicknameInput: document.querySelector("#nickname-input"),
  openBettingButton: document.querySelector("#open-betting-button"),
  phaseBet: document.querySelector("#phase-bet"),
  phaseJoin: document.querySelector("#phase-join"),
  phasePill: document.querySelector("#phase-pill"),
  phaseRace: document.querySelector("#phase-race"),
  playerBalance: document.querySelector("#player-balance"),
  playerBet: document.querySelector("#player-bet"),
  playerName: document.querySelector("#player-name"),
  playersList: document.querySelector("#players-list"),
  raceLabel: document.querySelector("#race-label"),
  raceScene: document.querySelector("#race-scene"),
  raceStage: document.querySelector("#race-stage"),
  raceStageView: document.querySelector("#race-stage-view"),
  raceSummary: document.querySelector("#race-summary"),
  resultBanner: document.querySelector("#result-banner"),
  stageLabel: document.querySelector("#stage-label"),
  standingsList: document.querySelector("#standings-list"),
  startRaceButton: document.querySelector("#start-race-button"),
  startingBalance: document.querySelector("#starting-balance"),
  toast: document.querySelector("#toast"),
  trackBlurb: document.querySelector("#track-blurb"),
  trackName: document.querySelector("#track-name"),
  trackPill: document.querySelector("#track-pill"),
  trackSelect: document.querySelector("#track-select"),
  winMultiplier: document.querySelector("#win-multiplier"),
  youBetStage: document.querySelector("#bet-stage")
};

let gameState = null;
let countdownTimer = null;
let toastTimer = null;
let selectedDuckNumber = null;
let announcerState = {
  phase: null,
  leaderDuckNumber: null,
  message: ""
};

elements.nicknameInput.value = localStorage.getItem(playerNameStorageKey) || "";

socket.on("connect", () => {
  socket.emit("state:request");
  const savedName = localStorage.getItem(playerNameStorageKey);

  if (savedName) {
    socket.emit("player:join", { playerKey, nickname: savedName });
  }
});

socket.on("state:update", (nextState) => {
  gameState = nextState;
  render();
});

socket.on("game:error", (message) => {
  showToast(message);
});

elements.joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nickname = elements.nicknameInput.value.trim();

  if (!nickname) {
    showToast("Pick a nickname before you join.");
    return;
  }

  localStorage.setItem(playerNameStorageKey, nickname);
  socket.emit("player:join", { playerKey, nickname });
});

elements.betForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!gameState || selectedDuckNumber === null) {
    return;
  }

  socket.emit("player:bet", {
    duckNumber: selectedDuckNumber,
    amount: Number(elements.betAmount.value)
  });
});

elements.ducksGrid.addEventListener("click", (event) => {
  const duckCard = event.target.closest("[data-duck-number]");

  if (!duckCard || duckCard.classList.contains("is-disabled")) {
    return;
  }

  selectedDuckNumber = Number(duckCard.dataset.duckNumber);
  render();
});

elements.trackSelect.addEventListener("change", () => {
  socket.emit("host:set-track", { trackId: elements.trackSelect.value });
});

elements.openBettingButton.addEventListener("click", () => {
  socket.emit("host:open-betting");
});

elements.startRaceButton.addEventListener("click", () => {
  socket.emit("host:start-race");
});

function render() {
  if (!gameState) {
    return;
  }

  const me = gameState.players.find((player) => player.playerKey === playerKey) || null;
  const isHost = Boolean(me && gameState.hostPlayerKey === me.playerKey);
  const currentTrack = gameState.tracks.find((track) => track.id === gameState.currentTrackId) || gameState.tracks[0];
  const uiStage = getUiStage(me);
  const standings = getStandings();

  ensureSelectedDuck(me);

  elements.body.dataset.track = currentTrack.id;
  elements.body.dataset.stage = uiStage;
  elements.connectedCount.textContent = String(gameState.players.filter((player) => player.connected).length);
  elements.startingBalance.textContent = `£${gameState.startingBalance}`;
  elements.winMultiplier.textContent = `${gameState.winMultiplier}x stake`;
  elements.phasePill.textContent = titleCase(gameState.phase);
  elements.stageLabel.textContent = titleCase(uiStage);
  elements.trackName.textContent = currentTrack.name;
  elements.trackPill.textContent = currentTrack.name;
  elements.trackBlurb.textContent = currentTrack.blurb;
  elements.heroBlurb.textContent = buildHeroCopy(uiStage, currentTrack);
  elements.raceScene.classList.toggle("is-racing", gameState.phase === "racing");

  const displayRaceNumber =
    gameState.phase === "results" && gameState.lastResult ? gameState.lastResult.raceNumber : gameState.raceNumber;
  elements.raceLabel.textContent = `Race ${displayRaceNumber}`;

  renderPhaseCards(uiStage);
  renderTrackOptions(isHost);
  renderPlayerSummary(me, isHost);
  renderPlayers(me);
  renderHistory();
  renderBetting(me, uiStage);
  renderRaceStage(standings);
  renderStandings(standings);
  renderMiniPodium(standings);
  renderResultBanner();
  renderRaceSummary(standings, uiStage);
  renderAnnouncer(standings, currentTrack, uiStage);
  renderJoinOverlay(me);
  refreshCountdown();
}

function getUiStage(me) {
  if (!me || gameState.phase === "lobby") {
    return "join";
  }

  if (gameState.phase === "betting") {
    return "bet";
  }

  return "race";
}

function ensureSelectedDuck(me) {
  if (me?.currentBet?.duckNumber) {
    selectedDuckNumber = me.currentBet.duckNumber;
    return;
  }

  if (selectedDuckNumber && gameState.ducks.some((duck) => duck.number === selectedDuckNumber)) {
    return;
  }

  selectedDuckNumber = gameState.ducks[0]?.number ?? null;
}

function buildHeroCopy(uiStage, currentTrack) {
  if (uiStage === "join") {
    return `${currentTrack.name} is next up. Get everyone into the lobby before the host opens betting.`;
  }

  if (uiStage === "bet") {
    return `${currentTrack.name} is loading. Pick one duck, set your stake, and lock it in before the horn.`;
  }

  return `${currentTrack.name} is underway. Watch the leader swings and late surges play out across the water.`;
}

function renderPhaseCards(uiStage) {
  const phaseMap = [
    { element: elements.phaseJoin, stage: "join" },
    { element: elements.phaseBet, stage: "bet" },
    { element: elements.phaseRace, stage: "race" }
  ];

  const currentIndex = phaseMap.findIndex((entry) => entry.stage === uiStage);

  phaseMap.forEach((entry, index) => {
    entry.element.classList.toggle("is-active", index === currentIndex);
    entry.element.classList.toggle("is-complete", index < currentIndex);
  });

  elements.joinStage.classList.toggle("hidden", uiStage !== "join");
  elements.youBetStage.classList.toggle("hidden", uiStage !== "bet");
  elements.raceStageView.classList.toggle("hidden", uiStage !== "race");
}

function renderTrackOptions(isHost) {
  const optionMarkup = gameState.tracks
    .map(
      (track) =>
        `<option value="${track.id}" ${track.id === gameState.currentTrackId ? "selected" : ""}>${track.name}</option>`
    )
    .join("");

  elements.trackSelect.innerHTML = optionMarkup;
  elements.trackSelect.disabled = !isHost || gameState.phase === "racing";
  elements.openBettingButton.disabled = !isHost || gameState.phase === "racing" || gameState.phase === "betting";
  elements.startRaceButton.disabled = !isHost || gameState.phase !== "betting";
}

function renderPlayerSummary(me, isHost) {
  elements.playerName.textContent = me ? me.nickname : "Join to play";
  elements.playerBalance.textContent = me ? `£${me.balance}` : "£0";
  elements.playerBet.textContent = me?.currentBet
    ? `Duck ${me.currentBet.duckNumber} for £${me.currentBet.amount}`
    : "No bet placed";
  elements.hostBadge.classList.toggle("hidden", !isHost);
}

function renderPlayers(me) {
  if (!gameState.players.length) {
    elements.playersList.innerHTML = `<div class="empty-state">No players yet. Join the lobby to become the first host.</div>`;
    return;
  }

  elements.playersList.innerHTML = gameState.players
    .map((player) => {
      const betLine = player.currentBet
        ? `Duck ${player.currentBet.duckNumber} · £${player.currentBet.amount}`
        : gameState.phase === "lobby"
          ? "Waiting in lobby"
          : "Waiting";
      const chips = [
        player.playerKey === gameState.hostPlayerKey ? `<span class="tiny-pill">Host</span>` : "",
        player.playerKey === me?.playerKey ? `<span class="tiny-pill accent">You</span>` : "",
        !player.connected ? `<span class="tiny-pill soft">Away</span>` : ""
      ].join("");

      return `
        <article class="player-row ${player.playerKey === me?.playerKey ? "is-me" : ""}">
          <div>
            <div class="row-title">
              <strong>${escapeHtml(player.nickname)}</strong>
              <span class="row-chips">${chips}</span>
            </div>
            <small>${betLine}</small>
          </div>
          <strong>£${player.balance}</strong>
        </article>
      `;
    })
    .join("");
}

function renderHistory() {
  if (!gameState.history.length) {
    elements.historyList.innerHTML = `<div class="empty-state">Results will stack up here once the ducks start flying.</div>`;
    return;
  }

  elements.historyList.innerHTML = gameState.history
    .map((entry) => {
      const duck = gameState.ducks.find((candidate) => candidate.number === entry.winningDuckNumber);
      const track = gameState.tracks.find((candidate) => candidate.id === entry.trackId);
      return `
        <article class="history-row">
          <div>
            <strong>Race ${entry.raceNumber}</strong>
            <small>${track?.name || "Track unknown"}</small>
          </div>
          <span>${duck?.name || `Duck ${entry.winningDuckNumber}`}</span>
        </article>
      `;
    })
    .join("");
}

function renderBetting(me, uiStage) {
  const existingStake = me?.currentBet?.amount || 0;
  const availableBankroll = (me?.balance || 0) + existingStake;
  const canBet = Boolean(me) && gameState.phase === "betting" && availableBankroll >= 1;
  const selectedDuck = gameState.ducks.find((duck) => duck.number === selectedDuckNumber);

  elements.betAmount.value = String(existingStake || (availableBankroll >= 1 ? 1 : 0));
  elements.betAmount.max = String(Math.max(availableBankroll, 1));
  elements.betAmount.disabled = !canBet;
  elements.betForm.querySelector("button").disabled = !canBet || !selectedDuck;

  if (!me) {
    elements.betHint.textContent = "Join the lobby to place a bet.";
  } else if (gameState.phase !== "betting") {
    elements.betHint.textContent = "Betting opens in phase two. The host controls when the room moves on.";
  } else {
    elements.betHint.textContent = `Selected: ${selectedDuck?.name || "No duck"} · Available to wager: £${availableBankroll}. You can replace your bet until the timer ends.`;
  }

  elements.ducksGrid.innerHTML = gameState.ducks
    .map((duck) => {
      const isPicked = selectedDuckNumber === duck.number;
      const isMyBet = me?.currentBet?.duckNumber === duck.number;
      const isWinner = gameState.lastResult?.winningDuckNumber === duck.number && gameState.phase === "results";
      const isDisabled = uiStage !== "bet" || !canBet;
      return `
        <article
          class="duck-card ${isPicked ? "is-picked" : ""} ${isMyBet ? "is-my-bet" : ""} ${isWinner ? "is-winner" : ""} ${isDisabled ? "is-disabled" : ""}"
          data-duck-number="${duck.number}"
        >
          <div class="duck-card-top">
            <span class="duck-number">#${duck.number}</span>
            ${duckAvatarMarkup(duck)}
          </div>
          <div>
            <h3>${escapeHtml(duck.name)}</h3>
            <p>${escapeHtml(duck.persona)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderRaceStage(standings) {
  const finishOrder = new Map((gameState.lastResult?.finishOrder || []).map((entry) => [entry.duckNumber, entry.position]));
  const leaderDuckNumber = standings[0]?.duckNumber || null;
  const leaderDuck = gameState.ducks.find((duck) => duck.number === leaderDuckNumber);

  elements.leaderBadge.textContent =
    gameState.phase === "racing"
      ? `${leaderDuck?.name || "Waiting"} in front`
      : gameState.phase === "results"
        ? `${leaderDuck?.name || "Winner"} took it`
        : "No leader yet";

  elements.raceStage.innerHTML = standings
    .map((entry, index) => {
      const duck = gameState.ducks.find((candidate) => candidate.number === entry.duckNumber);
      const medal = finishOrder.get(entry.duckNumber);
      const progressPercent = Math.max(0, Math.min(100, entry.progress));
      const gap = index === 0 ? "Leader" : `-${(standings[0].progress - entry.progress).toFixed(1)}m`;
      return `
        <article class="lane ${index === 0 ? "is-leading" : ""}">
          <div class="lane-label">
            <span class="lane-rank">P${index + 1}</span>
            <span class="lane-number">#${duck.number}</span>
            <strong>${escapeHtml(duck.name)}</strong>
            <small>${escapeHtml(duck.persona)}</small>
            <span class="lane-gap">${gap}</span>
          </div>
          <div class="lane-water">
            <div class="lane-waves"></div>
            <div class="lane-markers"></div>
            <div class="lane-foam lane-foam-a"></div>
            <div class="lane-foam lane-foam-b"></div>
            <div class="duck-splash" style="left: calc(${progressPercent}% - 3.7rem);"></div>
            <div class="duck-runner ${index === 0 ? "is-front" : ""}" style="left: calc(${progressPercent}% - 3rem);">
              ${duckAvatarMarkup(duck, false)}
            </div>
            ${medal ? `<div class="medal-badge">P${medal}</div>` : ""}
            <div class="finish-post">Finish</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStandings(standings) {
  if (!standings.length) {
    elements.standingsList.innerHTML = `<div class="empty-state">Standings will appear once the ducks are on the water.</div>`;
    return;
  }

  elements.standingsList.innerHTML = standings
    .slice(0, 5)
    .map((entry, index) => {
      const duck = gameState.ducks.find((candidate) => candidate.number === entry.duckNumber);
      const gap = index === 0 ? "Leading" : `${(standings[0].progress - entry.progress).toFixed(1)}m back`;
      return `
        <article class="standing-row ${index === 0 ? "is-leading" : ""}">
          <div class="standing-left">
            <span class="standing-rank">P${index + 1}</span>
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

function renderMiniPodium(standings) {
  if (!standings.length) {
    elements.miniPodium.innerHTML = `<div class="empty-state">Race order will lock in here once the ducks start moving.</div>`;
    return;
  }

  elements.miniPodium.innerHTML = standings
    .slice(0, 3)
    .map((entry, index) => {
      const duck = gameState.ducks.find((candidate) => candidate.number === entry.duckNumber);
      return `
        <article class="podium-card place-${index + 1}">
          <span class="podium-rank">P${index + 1}</span>
          <strong>#${duck.number} ${escapeHtml(duck.name)}</strong>
          <small>${entry.progress.toFixed(1)}m covered</small>
        </article>
      `;
    })
    .join("");
}

function renderRaceSummary(standings, uiStage) {
  if (uiStage !== "race") {
    elements.raceSummary.textContent = "The race view is live. Watch the leader board and the track together.";
    return;
  }

  if (gameState.phase === "results" && gameState.lastResult) {
    const winner = gameState.ducks.find((duck) => duck.number === gameState.lastResult.winningDuckNumber);
    elements.raceSummary.textContent = `${winner?.name || "The winner"} took Race ${gameState.lastResult.raceNumber}. The top three are frozen below until the next betting round opens.`;
    return;
  }

  const leader = standings[0] ? gameState.ducks.find((duck) => duck.number === standings[0].duckNumber) : null;
  const challenger = standings[1] ? gameState.ducks.find((duck) => duck.number === standings[1].duckNumber) : null;

  if (!leader) {
    elements.raceSummary.textContent = "The race view is live. Watch the leader board and the track together.";
    return;
  }

  if (!challenger) {
    elements.raceSummary.textContent = `${leader.name} is the only duck with clear space ahead right now.`;
    return;
  }

  const gap = standings[0].progress - standings[1].progress;
  elements.raceSummary.textContent =
    gap < 4
      ? `${leader.name} and ${challenger.name} are nearly level. This one is still open.`
      : `${leader.name} has ${gap.toFixed(1)}m over ${challenger.name}.`;
}

function renderResultBanner() {
  const lastResult = gameState.lastResult;

  if (gameState.phase === "betting") {
    elements.resultBanner.className = "result-banner betting";
    elements.resultBanner.textContent = "Bets are open. Pick one duck and get your stake in before the horn.";
    return;
  }

  if (gameState.phase === "racing") {
    elements.resultBanner.className = "result-banner racing";
    elements.resultBanner.textContent = "The ducks are moving. Watch the live order and the water for every overtake.";
    return;
  }

  if (!lastResult) {
    elements.resultBanner.className = "result-banner muted";
    elements.resultBanner.textContent = "Open betting to get the next race rolling.";
    return;
  }

  const winner = gameState.ducks.find((duck) => duck.number === lastResult.winningDuckNumber);
  const winningPayouts = lastResult.payouts.filter((entry) => entry.payout > 0);
  const payoutLine = winningPayouts.length
    ? winningPayouts.map((entry) => `${entry.nickname} +£${entry.payout}`).join(" · ")
    : "Nobody backed the winner this time.";

  elements.resultBanner.className = "result-banner result";
  elements.resultBanner.textContent = `${winner?.name || `Duck ${lastResult.winningDuckNumber}`} won Race ${lastResult.raceNumber}. ${payoutLine}`;
}

function renderAnnouncer(standings, currentTrack, uiStage) {
  const leader = standings[0] ? gameState.ducks.find((duck) => duck.number === standings[0].duckNumber) : null;
  const second = standings[1] ? gameState.ducks.find((duck) => duck.number === standings[1].duckNumber) : null;
  let message = "";

  if (uiStage === "join") {
    message = "Phase one: get the room into the lobby, then the host opens betting.";
  } else if (gameState.phase === "betting") {
    const betCount = gameState.players.filter((player) => player.currentBet).length;
    message = `Phase two: bets are open on ${currentTrack.name}. ${betCount} ${betCount === 1 ? "player has" : "players have"} backed a duck so far.`;
  } else if (gameState.phase === "results" && gameState.lastResult) {
    const winner = gameState.ducks.find((duck) => duck.number === gameState.lastResult.winningDuckNumber);
    message = `${winner?.name || "The winning duck"} has crossed first on ${currentTrack.name}. Open betting when you want the next race.`;
  } else if (leader && second) {
    const gap = standings[0].progress - standings[1].progress;

    if (announcerState.phase !== "racing") {
      message = `${leader.name} jumps out quickest on ${currentTrack.name}.`;
    } else if (announcerState.leaderDuckNumber !== leader.number) {
      message = `${leader.name} takes the lead. ${second.name} drops back into second.`;
    } else if (gap < 3) {
      message = `${leader.name} and ${second.name} are almost side by side.`;
    } else if (gap > 12) {
      message = `${leader.name} has clean water ahead with a proper breakaway.`;
    } else {
      message = `${leader.name} still leads, but ${second.name} is keeping the pressure on.`;
    }
  } else {
    message = "The grandstand is waiting. Open betting when the room is ready.";
  }

  announcerState = {
    phase: gameState.phase,
    leaderDuckNumber: leader?.number || null,
    message
  };
  elements.announcerBar.textContent = message;
}

function renderJoinOverlay(me) {
  elements.joinOverlay.classList.toggle("hidden", Boolean(me));
}

function refreshCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;

  const update = () => {
    if (!gameState?.bettingClosesAt) {
      elements.countdownLabel.textContent =
        gameState?.phase === "racing" ? "Race in progress" : gameState?.phase === "results" ? "Race complete" : "Waiting for host";
      return;
    }

    const remainingMs = gameState.bettingClosesAt - Date.now();

    if (remainingMs <= 0) {
      elements.countdownLabel.textContent = "Closing now";
      return;
    }

    elements.countdownLabel.textContent = `${Math.ceil(remainingMs / 1000)}s left to bet`;
  };

  update();

  if (gameState?.bettingClosesAt) {
    countdownTimer = setInterval(update, 250);
  }
}

function getStandings() {
  return [...(gameState?.raceProgress || [])].sort((left, right) => {
    if (right.progress !== left.progress) {
      return right.progress - left.progress;
    }

    return left.duckNumber - right.duckNumber;
  });
}

function duckAvatarMarkup(duck, compact = false) {
  return `
    <div class="duck-avatar ${compact ? "compact" : ""} style-${duck.style}">
      <div class="duck-hat"></div>
      <div class="duck-head">
        <span class="duck-eye left"></span>
        <span class="duck-eye right"></span>
        <span class="duck-beak"></span>
      </div>
      <div class="duck-body"></div>
      <div class="duck-accessory"></div>
    </div>
  `;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return `${value}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2800);
}
