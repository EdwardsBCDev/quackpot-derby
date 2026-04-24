export function formatMoney(value) {
  return `£${Number(value || 0)}`;
}

export function createBrowserId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2);
  const timePart = Date.now().toString(36);

  return `${prefix}-${timePart}-${randomPart}`;
}

export function titleCase(value) {
  return `${value || ""}`
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function escapeHtml(value) {
  return `${value}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getTrack(state) {
  return state?.tracks?.find((track) => track.id === state.currentTrackId) || null;
}

export function getStandings(state) {
  return [...(state?.raceProgress || [])].sort((left, right) => {
    if (right.progress !== left.progress) {
      return right.progress - left.progress;
    }

    return left.duckNumber - right.duckNumber;
  });
}

export function formatCountdown(targetTime) {
  if (!targetTime) {
    return null;
  }

  const remainingMs = targetTime - Date.now();

  if (remainingMs <= 0) {
    return "0s";
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`;
}

export function duckSvg(duck, options = {}) {
  const width = options.width || 88;
  const height = options.height || 60;
  const outline = "#111827";
  const styleMarkup = hatForStyle(duck);
  const gradientId = `duck-body-${duck.number}`;
  const wingId = `duck-wing-${duck.number}`;

  return `
    <svg class="duck-svg" viewBox="0 0 140 100" width="${width}" height="${height}" aria-hidden="true">
      <defs>
        <linearGradient id="${gradientId}" x1="24" x2="128" y1="40" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"></stop>
          <stop offset="0.32" stop-color="${duck.bodyColor}"></stop>
          <stop offset="1" stop-color="${duck.bodyColor}" stop-opacity="0.72"></stop>
        </linearGradient>
        <linearGradient id="${wingId}" x1="56" x2="92" y1="62" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${duck.accentColor}" stop-opacity="1"></stop>
          <stop offset="1" stop-color="${duck.accentColor}" stop-opacity="0.62"></stop>
        </linearGradient>
      </defs>
      <ellipse cx="72" cy="94" rx="49" ry="11" fill="rgba(0,0,0,0.18)"></ellipse>
      <path d="M30 78c5-12 16-19 30-20 10-10 24-15 42-13 21 2 34 15 34 32 0 19-17 30-43 30H58c-20 0-34-10-34-26 0-6 2-11 6-17Z" fill="url(#${gradientId})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      <path d="M44 65c13-8 30-10 47-5" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.24"></path>
      <circle cx="103" cy="42" r="20" fill="url(#${gradientId})" stroke="${outline}" stroke-width="4"></circle>
      <path d="M111 44c14-5 25 0 25 8 0 7-10 13-23 11l-10-2 8-17Z" fill="${duck.beakColor}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      <path d="M116 51c7-1 13 0 17 3" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.35"></path>
      <path d="M31 73 14 64 17 82 31 79Z" fill="${duck.accentColor}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      <ellipse cx="74" cy="76" rx="17" ry="13" fill="url(#${wingId})" stroke="${outline}" stroke-width="4" transform="rotate(-14 74 76)"></ellipse>
      <path d="M61 69c8 2 16 2 25-1" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.3"></path>
      <rect x="43" y="76" width="24" height="20" rx="8" fill="#fffdf2" stroke="${outline}" stroke-width="4" transform="rotate(-6 55 86)"></rect>
      <text x="55" y="91" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="15" fill="${outline}" transform="rotate(-6 55 86)">${duck.number}</text>
      <circle cx="103" cy="39" r="4.6" fill="#111827"></circle>
      <circle cx="105" cy="37.5" r="1.2" fill="#ffffff"></circle>
      <path d="M92 34c6-7 17-8 25-1" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.28"></path>
      ${styleMarkup}
      <path d="M46 104c9 0 17-2 22-6" fill="none" stroke="${outline}" stroke-width="4" stroke-linecap="round"></path>
      <path d="M63 104c9 0 17-2 22-6" fill="none" stroke="${outline}" stroke-width="4" stroke-linecap="round"></path>
      <circle cx="37" cy="92" r="5" fill="rgba(255,255,255,0.22)"></circle>
      <circle cx="48" cy="95" r="4" fill="rgba(255,255,255,0.18)"></circle>
    </svg>
  `;
}

function hatForStyle(duck) {
  const outline = "#111827";
  const hat = duck.hatColor;
  const accent = duck.accentColor;

  switch (duck.style) {
    case "disco":
      return `
        <circle cx="84" cy="15" r="10" fill="${hat}" stroke="${outline}" stroke-width="4"></circle>
        <path d="M77 22h16l7 7H70l7-7Z" fill="${accent}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      `;
    case "visor":
      return `
        <path d="M84 18h32l-4 10H81l3-10Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <rect x="79" y="28" width="27" height="8" rx="4" fill="${accent}" stroke="${outline}" stroke-width="4"></rect>
      `;
    case "captain":
      return `
        <path d="M84 12h26l5 12H79l5-12Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <rect x="76" y="24" width="38" height="8" rx="4" fill="${accent}" stroke="${outline}" stroke-width="4"></rect>
      `;
    case "space":
      return `
        <ellipse cx="99" cy="21" rx="18" ry="11" fill="rgba(255,255,255,0.55)" stroke="${outline}" stroke-width="4"></ellipse>
        <ellipse cx="99" cy="21" rx="12" ry="6" fill="${hat}" opacity="0.5"></ellipse>
      `;
    case "rock":
      return `
        <path d="M82 11c8-7 22-6 30 2l-1 16H84l-2-18Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      `;
    case "spy":
      return `
        <path d="M80 17h38l-2 8H82l-2-8Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <path d="M88 8h20l3 11H85l3-11Z" fill="${accent}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      `;
    case "diva":
      return `
        <path d="M84 15c5-9 19-10 25 0l8 12H76l8-12Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <circle cx="119" cy="28" r="5" fill="${accent}" stroke="${outline}" stroke-width="4"></circle>
      `;
    case "racer":
      return `
        <path d="M82 17c7-8 24-8 30 0l-2 10H84l-2-10Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <path d="M90 17h14" stroke="${accent}" stroke-width="4" stroke-linecap="round"></path>
      `;
    case "crown":
      return `
        <path d="M81 24 87 10l10 9 8-11 7 16Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      `;
    case "gamer":
      return `
        <rect x="83" y="18" width="28" height="12" rx="4" fill="${hat}" stroke="${outline}" stroke-width="4"></rect>
        <path d="M91 24h6M106 24h0" stroke="${accent}" stroke-width="4" stroke-linecap="round"></path>
      `;
    case "feather":
      return `
        <path d="M85 17c10-7 23-6 29 4l-2 7H84l1-11Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
        <path d="M108 7c5 3 7 9 4 14" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"></path>
      `;
    case "beret":
      return `
        <ellipse cx="95" cy="21" rx="19" ry="10" fill="${hat}" stroke="${outline}" stroke-width="4"></ellipse>
        <circle cx="112" cy="17" r="4" fill="${accent}" stroke="${outline}" stroke-width="4"></circle>
      `;
    case "top-hat":
      return `
        <rect x="88" y="4" width="20" height="20" rx="3" fill="${hat}" stroke="${outline}" stroke-width="4"></rect>
        <rect x="82" y="22" width="32" height="6" rx="3" fill="${accent}" stroke="${outline}" stroke-width="4"></rect>
      `;
    case "star":
      return `
        <path d="m98 8 4 8 9 1-6 6 2 9-9-4-8 4 1-9-6-6 9-1Z" fill="${hat}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"></path>
      `;
    default:
      return "";
  }
}
