import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import QRCode from "qrcode";
import { DerbyHub, FRAME_INTERVAL_MS } from "./game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const hub = new DerbyHub();
const port = Number(process.env.PORT || 3000);
const publicBaseUrl = normalizeBaseUrl(process.env.PUBLIC_BASE_URL);

app.set("trust proxy", true);
app.use(express.static(publicDir));

app.get("/", (_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

app.get("/host", (_request, response) => {
  response.sendFile(path.join(publicDir, "host.html"));
});

app.get("/play", (_request, response) => {
  response.sendFile(path.join(publicDir, "play.html"));
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, name: "Quackpot Derby TV Edition" });
});

app.get("/api/config", (request, response) => {
  response.json({
    ok: true,
    publicBaseUrl: getBaseUrl(request)
  });
});

app.get("/api/rooms/:roomId/qr.svg", async (request, response) => {
  const joinUrl = getJoinUrl(request, request.params.roomId);

  try {
    const svg = await QRCode.toString(joinUrl, {
      type: "svg",
      margin: 1,
      width: 280,
      color: {
        dark: "#111827",
        light: "#0000"
      }
    });
    response.type("image/svg+xml").send(svg);
  } catch (error) {
    response.status(500).json({ ok: false, error: "Unable to create QR code." });
  }
});

function roomChannel(roomId) {
  return `room:${roomId}`;
}

function broadcastRoom(roomId) {
  const state = hub.getRoomState(roomId);

  if (!state) {
    return;
  }

  io.to(roomChannel(roomId)).emit("room:state", state);
}

function emitError(socket, message) {
  socket.emit("room:error", message);
}

setInterval(() => {
  const changedRooms = hub.advanceAll(Date.now());
  changedRooms.forEach((roomId) => broadcastRoom(roomId));
}, Math.max(50, Math.floor(FRAME_INTERVAL_MS / 2)));

io.on("connection", (socket) => {
  socket.on("host:connect", (payload = {}, callback = () => {}) => {
    const result = hub.connectHost({
      hostKey: payload.hostKey,
      socketId: socket.id
    });

    if (!result.ok) {
      callback(result);
      return;
    }

    socket.join(roomChannel(result.roomId));
    callback({
      ok: true,
      roomId: result.roomId,
      state: result.state
    });
    broadcastRoom(result.roomId);
  });

  socket.on("player:join-room", (payload = {}, callback = () => {}) => {
    const result = hub.joinPlayer({
      roomId: `${payload.roomId || ""}`.toUpperCase(),
      playerKey: payload.playerKey,
      nickname: payload.nickname,
      socketId: socket.id
    });

    if (!result.ok) {
      callback(result);
      return;
    }

    socket.join(roomChannel(result.roomId));
    callback(result);
    broadcastRoom(result.roomId);
  });

  socket.on("host:set-track", (payload = {}) => {
    const result = hub.setTrack(socket.id, payload.trackId);

    if (!result.ok) {
      emitError(socket, result.error);
      return;
    }

    broadcastRoom(result.roomId);
  });

  socket.on("host:open-betting", () => {
    const result = hub.openBetting(socket.id);

    if (!result.ok) {
      emitError(socket, result.error);
      return;
    }

    broadcastRoom(result.roomId);
  });

  socket.on("host:close-betting", () => {
    const result = hub.closeBetting(socket.id);

    if (!result.ok) {
      emitError(socket, result.error);
      return;
    }

    broadcastRoom(result.roomId);
  });

  socket.on("host:reset-game", () => {
    const result = hub.resetGame(socket.id);

    if (!result.ok) {
      emitError(socket, result.error);
      return;
    }

    broadcastRoom(result.roomId);
  });

  socket.on("player:bet", (payload = {}) => {
    const result = hub.placeBet(socket.id, payload.duckNumber, payload.amount);

    if (!result.ok) {
      emitError(socket, result.error);
      return;
    }

    broadcastRoom(result.roomId);
  });

  socket.on("room:request-state", (payload = {}) => {
    const roomId = `${payload.roomId || ""}`.toUpperCase();
    const state = hub.getRoomState(roomId);

    if (!state) {
      emitError(socket, "That room does not exist.");
      return;
    }

    socket.emit("room:state", state);
  });

  socket.on("disconnect", () => {
    const roomId = hub.disconnectSocket(socket.id);

    if (roomId) {
      broadcastRoom(roomId);
    }
  });
});

server.listen(port, () => {
  console.log(`Quackpot Derby TV Edition is running on port ${port}`);
});

function normalizeBaseUrl(value) {
  if (!value) {
    return null;
  }

  return `${value}`.replace(/\/+$/, "");
}

function getBaseUrl(request) {
  if (publicBaseUrl) {
    return publicBaseUrl;
  }

  return `${request.protocol}://${request.get("host")}`;
}

function getJoinUrl(request, roomId) {
  return `${getBaseUrl(request)}/play?room=${encodeURIComponent(roomId)}`;
}
