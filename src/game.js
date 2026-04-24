export const STARTING_BALANCE = 10;
export const WIN_MULTIPLIER = 7;
export const MAX_PLAYERS = 20;
export const MAX_DUCKS = 20;
export const BETTING_WINDOW_MS = 45000;
export const LINEUP_WINDOW_MS = 7000;
export const FRAME_INTERVAL_MS = 150;
export const TRACK_DISTANCE = 540;

export const TRACKS = [
  {
    id: "sunset-canal",
    name: "Sunset Canal",
    blurb: "Warm evening light, city bridges, and water just calm enough to lie to you.",
    venue: "Old Town Canal",
    camera: "Bridge Cam",
    terrain: "city bridges",
    colors: {
      skyTop: "#ffd36d",
      skyBottom: "#ff8a5c",
      bank: "#16a34a",
      waterA: "#4aa7d4",
      waterB: "#2d82b6",
      waterC: "#8bd7f3",
      accent: "#ffd447",
      horizon: "#0f8f4d"
    }
  },
  {
    id: "rush-river",
    name: "Rush River",
    blurb: "Fast green banks, sharper turns, and enough current to spark late comebacks.",
    venue: "Wildwater Bend",
    camera: "Chase Boat",
    terrain: "rapid river banks",
    colors: {
      skyTop: "#b7f1d6",
      skyBottom: "#5fd2a4",
      bank: "#228b22",
      waterA: "#4bb2c5",
      waterB: "#25788b",
      waterC: "#b8fff2",
      accent: "#d9ff74",
      horizon: "#116530"
    }
  },
  {
    id: "midnight-harbour",
    name: "Midnight Harbour",
    blurb: "Floodlights, reflections, and a finish line that feels twice as far under pressure.",
    venue: "Pier 9 Night Race",
    camera: "Floodlight Cam",
    terrain: "harbour lights",
    colors: {
      skyTop: "#21305d",
      skyBottom: "#4c5fb8",
      bank: "#1b3554",
      waterA: "#3272d9",
      waterB: "#123a77",
      waterC: "#8ec5ff",
      accent: "#fef08a",
      horizon: "#111f3f"
    }
  },
  {
    id: "neon-lagoon",
    name: "Neon Lagoon",
    blurb: "Pink skies, electric water, and the kind of track that creates wild swings.",
    venue: "Arcade Lagoon",
    camera: "Neon Drone",
    terrain: "electric boardwalk",
    colors: {
      skyTop: "#ff98cf",
      skyBottom: "#ff5e8a",
      bank: "#7e22ce",
      waterA: "#58b7ff",
      waterB: "#5a37c8",
      waterC: "#ffb4ef",
      accent: "#67e8f9",
      horizon: "#4a1476"
    }
  },
  {
    id: "royal-regatta",
    name: "Royal Regatta",
    blurb: "Polished lawns, gold bunting, and a grandstand ready to lose its mind.",
    venue: "Crown Reach",
    camera: "Grandstand Cam",
    terrain: "regatta lawns",
    colors: {
      skyTop: "#dff7ff",
      skyBottom: "#8ed6ff",
      bank: "#4f9d43",
      waterA: "#55c7d8",
      waterB: "#207da0",
      waterC: "#d9fbff",
      accent: "#f8d94a",
      horizon: "#34782f"
    }
  },
  {
    id: "jungle-creek",
    name: "Jungle Creek",
    blurb: "Dense palms, dark water, and ducks vanishing into shadows before surging back.",
    venue: "Mango Creek",
    camera: "Canopy Cam",
    terrain: "jungle creek",
    colors: {
      skyTop: "#c8f7ad",
      skyBottom: "#5dbb63",
      bank: "#0f6f3d",
      waterA: "#2fae8d",
      waterB: "#0e5b68",
      waterC: "#9fffe5",
      accent: "#ffcf5a",
      horizon: "#084b2c"
    }
  },
  {
    id: "glacier-run",
    name: "Glacier Run",
    blurb: "Cold blue water, icy banks, and slippery late-race momentum swings.",
    venue: "Frostfall Channel",
    camera: "Ice Cam",
    terrain: "glacier channel",
    colors: {
      skyTop: "#f6fbff",
      skyBottom: "#b9d7ff",
      bank: "#dbeafe",
      waterA: "#8bd3ff",
      waterB: "#2b7bbb",
      waterC: "#ffffff",
      accent: "#38bdf8",
      horizon: "#9ebbe6"
    }
  },
  {
    id: "storm-pier",
    name: "Storm Pier",
    blurb: "Big waves, dark clouds, and a final straight where anything can still happen.",
    venue: "Blackwater Pier",
    camera: "Storm Drone",
    terrain: "open sea pier",
    colors: {
      skyTop: "#334155",
      skyBottom: "#64748b",
      bank: "#57534e",
      waterA: "#3d82a7",
      waterB: "#164e63",
      waterC: "#d9f4ff",
      accent: "#f97316",
      horizon: "#292524"
    }
  }
];

export const DUCKS = [
  duck(1, "Disco Duke", "disco", "#ffe062", "#8b5cf6", "#ff61c7", "#ff9435"),
  duck(2, "Neon Nikki", "visor", "#ff8ecb", "#0f172a", "#78f7d5", "#ff9435"),
  duck(3, "Captain Quill", "captain", "#ffd86b", "#7c2d12", "#f59e0b", "#f97316"),
  duck(4, "Rocket Rita", "space", "#ff6b81", "#e2f3ff", "#60a5fa", "#ff9f43"),
  duck(5, "Vinyl Vinnie", "rock", "#c084fc", "#111827", "#ef4444", "#fb923c"),
  duck(6, "Agent Splash", "spy", "#93c5fd", "#111827", "#9ca3af", "#f97316"),
  duck(7, "Diva Dawn", "diva", "#f9a8d4", "#ffe4f2", "#fb7185", "#fb923c"),
  duck(8, "Turbo Talon", "racer", "#fca5a5", "#ef4444", "#111827", "#fb923c"),
  duck(9, "Goldie Groove", "crown", "#fcd34d", "#f59e0b", "#6ee7b7", "#f97316"),
  duck(10, "Pixel Penny", "gamer", "#86efac", "#22c55e", "#60a5fa", "#f97316"),
  duck(11, "Mambo Max", "feather", "#fdba74", "#ec4899", "#fde047", "#fb923c"),
  duck(12, "Lilac Lou", "beret", "#d8b4fe", "#7c3aed", "#f472b6", "#f97316"),
  duck(13, "Sir Quacksworth", "top-hat", "#bfdbfe", "#1f2937", "#facc15", "#f97316"),
  duck(14, "Popstar Pia", "star", "#f9a8d4", "#f43f5e", "#a3e635", "#ff9435"),
  duck(15, "Glitch Gus", "gamer", "#67e8f9", "#0f172a", "#a78bfa", "#fb923c"),
  duck(16, "Cinema Belle", "diva", "#fde68a", "#f472b6", "#c084fc", "#fb923c"),
  duck(17, "Laser Lex", "visor", "#f0abfc", "#1e293b", "#22d3ee", "#ff9435"),
  duck(18, "Rhythm Rae", "disco", "#fca5a5", "#9333ea", "#4ade80", "#fb923c"),
  duck(19, "Mister Meteor", "space", "#93c5fd", "#dbeafe", "#fb7185", "#fb923c"),
  duck(20, "Banjo Blaze", "feather", "#fde68a", "#92400e", "#34d399", "#fb923c")
];

function duck(number, name, style, bodyColor, hatColor, accentColor, beakColor) {
  return {
    number,
    name,
    style,
    bodyColor,
    hatColor,
    accentColor,
    beakColor
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampNickname(rawName) {
  const cleaned = `${rawName || ""}`.replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 18) || "Mystery Duck";
}

function sortPlayers(players) {
  return [...players].sort((left, right) => {
    if (right.balance !== left.balance) {
      return right.balance - left.balance;
    }

    if (left.connected !== right.connected) {
      return left.connected ? -1 : 1;
    }

    return left.joinedAt - right.joinedAt;
  });
}

function createRaceProgress() {
  return DUCKS.map((duckInfo) => ({
    duckNumber: duckInfo.number,
    progress: 0
  }));
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createRoomId(existingIds) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  while (true) {
    let candidate = "";

    for (let index = 0; index < 5; index += 1) {
      candidate += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }
}

function createRoom(hostKey) {
  return {
    roomId: "",
    hostKey,
    hostSocketId: null,
    createdAt: Date.now(),
    raceNumber: 1,
    phase: "lobby",
    currentTrackId: TRACKS[0].id,
    players: new Map(),
    currentBets: new Map(),
    raceProgress: createRaceProgress(),
    raceTimeline: null,
    raceFrameIndex: 0,
    nextFrameAt: null,
    bettingClosesAt: null,
    lineupEndsAt: null,
    lastResult: null,
    history: []
  };
}

function createPlayer({ playerKey, nickname, socketId }) {
  return {
    playerKey,
    nickname: clampNickname(nickname),
    balance: STARTING_BALANCE,
    currentBet: null,
    connected: true,
    joinedAt: Date.now(),
    socketId
  };
}

function resetPlayersForNewGame(room) {
  room.players.forEach((player) => {
    player.balance = STARTING_BALANCE;
    player.currentBet = null;
  });
}

function buildRaceTimeline() {
  const minFrames = 215 + Math.floor(Math.random() * 35);
  const maxFrames = minFrames + 80;
  const racers = DUCKS.map((duckInfo) => ({
    duckNumber: duckInfo.number,
    progress: 0,
    baseSpeed: 1.08 + Math.random() * 0.28,
    drag: Math.random() * 0.12,
    finishKick: 0.25 + Math.random() * 0.65,
    surges: Array.from({ length: 4 }, (_, surgeIndex) => {
      const start = 16 + surgeIndex * 42 + Math.floor(Math.random() * 32);
      return {
        start,
        end: start + 14 + Math.floor(Math.random() * 24),
        boost: 0.18 + Math.random() * 0.5
      };
    })
  }));
  const frames = [];

  for (let frame = 0; frame < maxFrames; frame += 1) {
    const leaderProgress = Math.max(...racers.map((racer) => racer.progress));
    const earlyFactor = clamp(frame / 20, 0.35, 1);
    const lateFactor = frame > minFrames * 0.72 ? (frame - minFrames * 0.72) / (minFrames * 0.28) : 0;

    racers.forEach((racer) => {
      const deficit = leaderProgress - racer.progress;
      const catchUpBoost = clamp(deficit / 48, 0, 1.35);
      const surgeBoost = racer.surges.reduce((sum, surge) => {
        return frame >= surge.start && frame <= surge.end ? sum + surge.boost : sum;
      }, 0);
      const jitter = (Math.random() - 0.48) * 0.42;
      const finishKick = lateFactor > 0 ? racer.finishKick * lateFactor * 0.32 : 0;
      const stride = clamp(
        (racer.baseSpeed + surgeBoost + catchUpBoost * 0.34 + finishKick + jitter - racer.drag) * earlyFactor,
        0.32,
        3.45
      );

      racer.progress = Math.min(TRACK_DISTANCE, racer.progress + stride);
    });

    const snapshot = racers
      .map((racer) => ({
        duckNumber: racer.duckNumber,
        progress: Number(racer.progress.toFixed(2))
      }))
      .sort((left, right) => left.duckNumber - right.duckNumber);

    frames.push(snapshot);

    if (frame >= minFrames && racers.some((racer) => racer.progress >= TRACK_DISTANCE)) {
      break;
    }
  }

  const finishOrder = [...racers]
    .sort((left, right) => {
      if (right.progress !== left.progress) {
        return right.progress - left.progress;
      }

      return Math.random() - 0.5;
    })
    .map((racer, index) => ({
      position: index + 1,
      duckNumber: racer.duckNumber
    }));

  return {
    frames,
    finishOrder
  };
}

export class DerbyHub {
  constructor() {
    this.rooms = new Map();
    this.hostRooms = new Map();
    this.socketMeta = new Map();
  }

  connectHost({ hostKey, socketId }) {
    if (!hostKey) {
      return { ok: false, error: "Missing host key." };
    }

    let roomId = this.hostRooms.get(hostKey);
    let room = roomId ? this.rooms.get(roomId) : null;

    if (!room) {
      room = createRoom(hostKey);
      room.roomId = createRoomId(this.rooms);
      roomId = room.roomId;
      this.rooms.set(roomId, room);
      this.hostRooms.set(hostKey, roomId);
    }

    room.hostSocketId = socketId;
    this.socketMeta.set(socketId, { role: "host", roomId });

    return { ok: true, roomId, state: this.getRoomState(roomId) };
  }

  joinPlayer({ roomId, playerKey, nickname, socketId }) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return { ok: false, error: "That game room does not exist." };
    }

    if (!playerKey) {
      return { ok: false, error: "Missing player key." };
    }

    const existing = room.players.get(playerKey);

    if (!existing && room.players.size >= MAX_PLAYERS) {
      return { ok: false, error: "This game already has 20 players." };
    }

    const player = existing || createPlayer({ playerKey, nickname, socketId });

    player.nickname = clampNickname(nickname);
    player.connected = true;
    player.socketId = socketId;

    room.players.set(playerKey, player);
    this.socketMeta.set(socketId, { role: "player", roomId, playerKey });

    return { ok: true, roomId, state: this.getRoomState(roomId), player: this.serializePlayer(player) };
  }

  disconnectSocket(socketId) {
    const meta = this.socketMeta.get(socketId);

    if (!meta) {
      return null;
    }

    this.socketMeta.delete(socketId);
    const room = this.rooms.get(meta.roomId);

    if (!room) {
      return null;
    }

    if (meta.role === "host") {
      room.hostSocketId = null;
      return meta.roomId;
    }

    if (meta.role === "player") {
      const player = room.players.get(meta.playerKey);

      if (player) {
        player.connected = false;
        player.socketId = null;
      }

      return meta.roomId;
    }

    return null;
  }

  setTrack(socketId, trackId) {
    const room = this.getRoomForHostSocket(socketId);

    if (!room) {
      return { ok: false, error: "Only the host can change the track." };
    }

    if (!TRACKS.some((track) => track.id === trackId)) {
      return { ok: false, error: "That track does not exist." };
    }

    if (room.phase === "racing" || room.phase === "lineup") {
      return { ok: false, error: "Track changes are locked once ducks are heading to the line." };
    }

    room.currentTrackId = trackId;
    return { ok: true, roomId: room.roomId };
  }

  openBetting(socketId) {
    const room = this.getRoomForHostSocket(socketId);

    if (!room) {
      return { ok: false, error: "Only the host can open betting." };
    }

    if (room.phase === "betting") {
      return { ok: false, error: "Betting is already open." };
    }

    if (room.phase === "lineup" || room.phase === "racing") {
      return { ok: false, error: "Finish the current race flow before opening bets again." };
    }

    room.currentBets.clear();
    room.players.forEach((player) => {
      player.currentBet = null;
    });
    room.raceProgress = createRaceProgress();
    room.raceTimeline = null;
    room.raceFrameIndex = 0;
    room.nextFrameAt = null;
    room.bettingClosesAt = Date.now() + BETTING_WINDOW_MS;
    room.lineupEndsAt = null;
    room.phase = "betting";

    return { ok: true, roomId: room.roomId };
  }

  closeBetting(socketId, { force = false } = {}) {
    const room = force ? this.rooms.get(this.socketMeta.get(socketId)?.roomId) : this.getRoomForHostSocket(socketId);

    if (!room) {
      return { ok: false, error: "Only the host can close betting." };
    }

    if (room.phase !== "betting") {
      return { ok: false, error: "Betting is not currently open." };
    }

    room.phase = "lineup";
    room.bettingClosesAt = null;
    room.lineupEndsAt = Date.now() + LINEUP_WINDOW_MS;

    return { ok: true, roomId: room.roomId };
  }

  placeBet(socketId, duckNumber, amount) {
    const meta = this.socketMeta.get(socketId);

    if (!meta || meta.role !== "player") {
      return { ok: false, error: "Join the game before placing a bet." };
    }

    const room = this.rooms.get(meta.roomId);

    if (!room || room.phase !== "betting") {
      return { ok: false, error: "Betting is not open right now." };
    }

    const player = room.players.get(meta.playerKey);

    if (!player) {
      return { ok: false, error: "Player not found in this room." };
    }

    const duckInfo = DUCKS.find((entry) => entry.number === Number(duckNumber));
    const safeAmount = Number(amount);

    if (!duckInfo) {
      return { ok: false, error: "Pick one of the available ducks." };
    }

    if (!Number.isInteger(safeAmount) || safeAmount < 1) {
      return { ok: false, error: "Bets must be whole pounds." };
    }

    const previousBet = room.currentBets.get(player.playerKey);
    const availableBalance = player.balance + (previousBet?.amount || 0);

    if (safeAmount > availableBalance) {
      return { ok: false, error: "That bet is bigger than your balance." };
    }

    player.balance = availableBalance - safeAmount;
    player.currentBet = { duckNumber: duckInfo.number, amount: safeAmount };
    room.currentBets.set(player.playerKey, { duckNumber: duckInfo.number, amount: safeAmount });

    return { ok: true, roomId: room.roomId };
  }

  resetGame(socketId) {
    const room = this.getRoomForHostSocket(socketId);

    if (!room) {
      return { ok: false, error: "Only the host can reset the game." };
    }

    resetPlayersForNewGame(room);
    room.currentBets.clear();
    room.raceProgress = createRaceProgress();
    room.raceTimeline = null;
    room.raceFrameIndex = 0;
    room.nextFrameAt = null;
    room.phase = "lobby";
    room.raceNumber = 1;
    room.bettingClosesAt = null;
    room.lineupEndsAt = null;
    room.lastResult = null;
    room.history = [];

    return { ok: true, roomId: room.roomId };
  }

  advanceAll(now = Date.now()) {
    const changedRoomIds = [];

    this.rooms.forEach((room) => {
      let changed = false;

      if (room.phase === "betting" && room.bettingClosesAt && now >= room.bettingClosesAt) {
        room.phase = "lineup";
        room.bettingClosesAt = null;
        room.lineupEndsAt = now + LINEUP_WINDOW_MS;
        changed = true;
      }

      if (room.phase === "lineup" && room.lineupEndsAt && now >= room.lineupEndsAt) {
        this.startRace(room, now);
        changed = true;
      }

      if (room.phase === "racing" && room.raceTimeline) {
        while (room.nextFrameAt && now >= room.nextFrameAt && room.raceFrameIndex < room.raceTimeline.frames.length - 1) {
          room.raceFrameIndex += 1;
          room.raceProgress = room.raceTimeline.frames[room.raceFrameIndex];
          room.nextFrameAt += FRAME_INTERVAL_MS;
          changed = true;
        }

        if (room.raceFrameIndex >= room.raceTimeline.frames.length - 1) {
          this.finishRace(room);
          changed = true;
        }
      }

      if (changed) {
        changedRoomIds.push(room.roomId);
      }
    });

    return changedRoomIds;
  }

  getRoomState(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    return {
      roomId: room.roomId,
      phase: room.phase,
      raceNumber: room.raceNumber,
      currentTrackId: room.currentTrackId,
      tracks: TRACKS,
      ducks: DUCKS,
      players: sortPlayers(room.players.values()).map((player) => this.serializePlayer(player)),
      raceProgress: room.raceProgress,
      bettingClosesAt: room.bettingClosesAt,
      lineupEndsAt: room.lineupEndsAt,
      lastResult: room.lastResult,
      history: room.history,
      startingBalance: STARTING_BALANCE,
      winMultiplier: WIN_MULTIPLIER,
      maxPlayers: MAX_PLAYERS,
      maxDucks: MAX_DUCKS
    };
  }

  serializePlayer(player) {
    return {
      playerKey: player.playerKey,
      nickname: player.nickname,
      balance: player.balance,
      connected: player.connected,
      joinedAt: player.joinedAt,
      currentBet: player.currentBet || null
    };
  }

  getRoomForHostSocket(socketId) {
    const meta = this.socketMeta.get(socketId);

    if (!meta || meta.role !== "host") {
      return null;
    }

    return this.rooms.get(meta.roomId) || null;
  }

  startRace(room, now) {
    room.phase = "racing";
    room.lineupEndsAt = null;
    room.raceTimeline = buildRaceTimeline();
    room.raceFrameIndex = 0;
    room.raceProgress = room.raceTimeline.frames[0] || createRaceProgress();
    room.nextFrameAt = now + FRAME_INTERVAL_MS;
  }

  finishRace(room) {
    const finishOrder = room.raceTimeline?.finishOrder || [];
    const winningDuckNumber = finishOrder[0]?.duckNumber || null;
    const payouts = [];

    room.players.forEach((player) => {
      const bet = room.currentBets.get(player.playerKey);

      if (!bet) {
        player.currentBet = null;
        return;
      }

      let payout = 0;

      if (bet.duckNumber === winningDuckNumber) {
        payout = bet.amount * WIN_MULTIPLIER;
        player.balance += payout;
      }

      payouts.push({
        nickname: player.nickname,
        playerKey: player.playerKey,
        duckNumber: bet.duckNumber,
        amount: bet.amount,
        payout
      });

      player.currentBet = null;
    });

    room.currentBets.clear();
    room.phase = "results";
    room.bettingClosesAt = null;
    room.lineupEndsAt = null;
    room.nextFrameAt = null;
    room.lastResult = {
      raceNumber: room.raceNumber,
      winningDuckNumber,
      finishOrder,
      payouts,
      trackId: room.currentTrackId,
      completedAt: Date.now()
    };
    room.history = [room.lastResult, ...room.history].slice(0, 10);
    room.raceNumber += 1;
    room.raceTimeline = null;
    room.raceFrameIndex = 0;
  }
}
