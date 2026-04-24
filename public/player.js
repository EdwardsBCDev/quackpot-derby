import { createBrowserId, duckSvg, escapeHtml, formatCountdown, formatMoney, getStandings, getTrack, titleCase } from "/shared-ui.js";

const socket = io();
const playerKeyStorageKey = "quackpot-player-key";
const playerNameStorageKey = "quackpot-player-name";
const playerKey = localStorage.getItem(playerKeyStorageKey) || createBrowserId("player");
const roomFromQuery = new URLSearchParams(window.location.search).get("room") || "";

localStorage.setItem(playerKeyStorageKey, playerKey);

const elements = {
  balance: document.querySelector("#balance"),
  betAmount: document.querySelector("#bet-amount"),
  betForm: document.querySelector("#bet-form"),
  betLabel: document.querySelector("#bet-label"),
  bettingCopy: document.querySelector("#betting-copy"),
  countdown: document.querySelector("#countdown"),
  ducksGrid: document.querySelector("#ducks-grid"),
  joinCard: document.querySelector("#join-card"),
  joinForm: document.querySelector("#join-form"),
  nicknameInput: document.querySelector("#nickname-input"),
  phaseCopy: document.querySelector("#phase-copy"),
  phaseLabel: document.querySelector("#phase-label"),
  playerApp: document.querySelector("#player-app"),
  playerName: document.querySelector("#player-name"),
  placeBet: document.querySelector("#place-bet"),
  resultSummary: document.querySelector("#result-summary"),
  roomInput: document.querySelector("#room-input"),
  roomLabel: document.querySelector("#room-label"),
  standingsList: document.querySelector("#standings-list"),
  toast: document.querySelector("#toast"),
  trackLabel: document.querySelector("#track-label")
};

let state = null;
let roomId = roomFromQuery.toUpperCase();
let countdownTimer = null;
let toastTimer = null;
let selectedDuckNumber = null;

elements.roomInput.value = roomId;
elements.nicknameInput.value = localStorage.getItem(playerNameStorageKey) || "";

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

elements.joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = elements.nicknameInput.value.trim();
  roomId = elements.roomInput.value.trim().toUpperCase();

  if (!nickname || !roomId) {
    showToast("Enter the room code and your name first.");
    return;
  }

  localStorage.setItem(playerNameStorageKey, nickname);

  socket.emit(
    "player:join-room",
    {
      roomId,
      playerKey,
      nickname
    },
    (result) => {
      if (!result?.ok) {
        showToast(result?.error || "Unable to join room.");
        return;
      }

      roomId = result.roomId;
      state = result.state;
      render();
      history.replaceState({}, "", `/play?room=${encodeURIComponent(roomId)}`);
    }
  );
});

elements.betForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state || selectedDuckNumber === null) {
    return;
  }

  const amount = Number(elements.betAmount.value);
  const selectedDuck = state.ducks.find((duck) => duck.number === selectedDuckNumber);

  socket.emit(
    "player:bet",
    {
      duckNumber: selectedDuckNumber,
      amount
    },
    (result) => {
      if (!result?.ok) {
        showToast(result?.error || "That bet did not lock in.");
        return;
      }

      showToast(`Bet locked: ${selectedDuck?.name || `Duck ${selectedDuckNumber}`} for ${formatMoney(amount)}.`);
    }
  );
});

elements.ducksGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-duck-number]");

  if (!card || card.classList.contains("disabled")) {
    return;
  }

  selectedDuckNumber = Number(card.dataset.duckNumber);
  render();
});

if (roomId) {
  socket.emit("room:request-state", { roomId });
}

function render() {
  if (!state) {
    return;
  }

  const me = state.players.find((player) => player.playerKey === playerKey) || null;
  const track = getTrack(state);
  const standings = getStandings(state);
  const canBet = Boolean(me) && state.phase === "betting";
  const previousBet = me?.currentBet?.amount || 0;
  const availableBalance = (me?.balance || 0) + previousBet;

  selectedDuckNumber = me?.currentBet?.duckNumber || selectedDuckNumber || state.ducks[0]?.number || null;
  const selectedDuck = state.ducks.find((duck) => duck.number === selectedDuckNumber) || null;

  elements.joinCard.classList.toggle("hidden", Boolean(me));
  elements.playerApp.classList.toggle("hidden", !me);

  if (!me) {
    return;
  }

  elements.playerName.textContent = me.nickname;
  elements.balance.textContent = formatMoney(me.balance);
  elements.roomLabel.textContent = roomId;
  elements.phaseLabel.textContent = titleCase(state.phase);
  elements.trackLabel.textContent = `Track: ${track?.name || "Unknown"}`;
  elements.betLabel.textContent = me.currentBet
    ? `Duck ${me.currentBet.duckNumber} · ${formatMoney(me.currentBet.amount)}`
    : "No bet yet";

  elements.phaseCopy.textContent =
    state.phase === "lobby"
      ? "The host is getting the room ready."
      : state.phase === "betting"
        ? "Betting is open. Pick one duck and lock in your stake."
        : state.phase === "lineup"
          ? "Bets are closed. The ducks are walking to the line."
          : state.phase === "racing"
            ? "The race is running on the host screen right now."
            : "Race complete. Wait for the host to open the next round.";

  elements.betAmount.value = String(previousBet || (availableBalance >= 1 ? 1 : 0));
  elements.betAmount.max = String(Math.max(availableBalance, 1));
  elements.betAmount.disabled = !canBet;
  elements.placeBet.disabled = !canBet || !selectedDuck || availableBalance < 1;

  elements.bettingCopy.textContent = !canBet
    ? state.phase === "betting"
      ? "You need at least £1 to place a bet."
      : "Betting is currently closed."
    : `Selected: ${selectedDuck?.name || "No duck"} · Available bankroll: ${formatMoney(availableBalance)}`;

  renderDucks(me, canBet);
  renderStandings(standings);
  renderResultSummary();
  refreshCountdown();
}

function renderDucks(me, canBet) {
  elements.ducksGrid.innerHTML = state.ducks
    .map((duck) => {
      const isSelected = selectedDuckNumber === duck.number;
      const isMyBet = me.currentBet?.duckNumber === duck.number;
      const isWinner = state.lastResult?.winningDuckNumber === duck.number && state.phase === "results";
      return `
        <article class="duck-card ${isSelected ? "selected" : ""} ${isMyBet ? "my-bet" : ""} ${isWinner ? "winner" : ""} ${!canBet ? "disabled" : ""}" data-duck-number="${duck.number}">
          <div class="duck-card-top">
            <span class="duck-badge">#${duck.number}</span>
            ${duckSvg(duck, { width: 72, height: 52 })}
          </div>
          <div>
            <strong>${escapeHtml(duck.name)}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStandings(standings) {
  if (!standings.length) {
    elements.standingsList.innerHTML = `<div class="empty-card">No race data yet.</div>`;
    return;
  }

  elements.standingsList.innerHTML = standings
    .slice(0, 5)
    .map((entry, index) => {
      const duck = state.ducks.find((item) => item.number === entry.duckNumber);
      return `
        <article class="standing-row ${index === 0 ? "leading" : ""}">
          <div class="standing-left">
            <span class="rank-badge">P${index + 1}</span>
            <div>
              <strong>#${duck.number} ${escapeHtml(duck.name)}</strong>
              <small>${entry.progress.toFixed(1)}m</small>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderResultSummary() {
  if (!state.lastResult) {
    elements.resultSummary.textContent = "Once the race starts, the current leaders and winner will show here.";
    return;
  }

  const winner = state.ducks.find((duck) => duck.number === state.lastResult.winningDuckNumber);
  const winners = state.lastResult.payouts.filter((entry) => entry.payout > 0);
  const didIWin = winners.find((entry) => entry.playerKey === playerKey);

  elements.resultSummary.textContent = didIWin
    ? `${winner?.name || "Winner"} took the race and you won ${formatMoney(didIWin.payout)}.`
    : `${winner?.name || "Winner"} won the race.`;
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
  }, 2600);
}
