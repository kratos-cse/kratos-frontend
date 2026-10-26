/**
 * Roster conflict → participant copy (keep in sync with lib/errors/userMessages.js)
 * Run: node scripts/assert-roster-user-messages.cjs
 */

const ROSTER_CODES_PREFER_API_MESSAGE = new Set([
  "TEAM_FULL",
  "TEAM_MANDATORY_FULL",
  "TEAM_SUBSTITUTE_LIMIT",
  "ALREADY_REGISTERED",
  "ROSTER_INVALID",
  "CONFLICT",
]);

const CODE_MESSAGES = {
  TEAM_FULL:
    "This team has reached its maximum size. You cannot add another participant.",
  TEAM_MANDATORY_FULL:
    "This team already has the required number of members. Add substitutes only if substitute slots remain.",
  TEAM_SUBSTITUTE_LIMIT: "All substitute slots for this team are filled.",
  ALREADY_REGISTERED:
    "That participant is already registered for this event on another team.",
  ROSTER_INVALID:
    "This event uses regular member slots, not substitutes. Add this participant as a member instead.",
  CONFLICT:
    "This action could not be completed because of a conflict. Refresh the page and try again.",
};

function isSafeParticipantApiMessage(message) {
  if (!message || message === "Request failed") return false;
  if (message.length > 280) return false;
  if (/traceback|sqlalchemy|psycopg|exception|password|secret/i.test(message)) return false;
  return true;
}

function toUserMessageRoster(err) {
  const { status = 0, code, message: normalizedMessage } = err;
  const apiMessage =
    normalizedMessage && normalizedMessage !== "Request failed" ? normalizedMessage : null;
  if (
    apiMessage &&
    code &&
    (ROSTER_CODES_PREFER_API_MESSAGE.has(code) ||
      ["MISSING_REQUIRED_FIELD", "INVALID_FIELD_VALUE", "UNKNOWN_FIELD"].includes(code)) &&
    isSafeParticipantApiMessage(apiMessage)
  ) {
    return apiMessage;
  }
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];
  return normalizedMessage || "Something went wrong. Please try again.";
}

const cases = [
  {
    name: "TEAM_FULL uses backend message when specific",
    err: {
      status: 409,
      code: "TEAM_FULL",
      message: CODE_MESSAGES.TEAM_FULL,
    },
    expect: CODE_MESSAGES.TEAM_FULL,
  },
  {
    name: "ROSTER_INVALID preserves backend RANGE substitute explanation",
    err: {
      status: 409,
      code: "ROSTER_INVALID",
      message: CODE_MESSAGES.ROSTER_INVALID,
    },
    expect: CODE_MESSAGES.ROSTER_INVALID,
  },
  {
    name: "duplicate phone preserves backend message",
    err: {
      status: 409,
      code: "ALREADY_REGISTERED",
      message:
        "A participant with this phone number is already on a roster for this event.",
    },
    expect:
      "A participant with this phone number is already on a roster for this event.",
  },
  {
    name: "unsafe backend text falls back to code message",
    err: {
      status: 409,
      code: "TEAM_FULL",
      message: "sqlalchemy.exc.IntegrityError: duplicate key",
    },
    expect: CODE_MESSAGES.TEAM_FULL,
  },
  {
    name: "CONFLICT fallback when no api message",
    err: { status: 409, code: "CONFLICT", message: "Request failed" },
    expect: CODE_MESSAGES.CONFLICT,
  },
];

for (const { name, err, expect } of cases) {
  const got = toUserMessageRoster(err);
  if (got !== expect) {
    console.error(`FAIL ${name}: expected "${expect}", got "${got}"`);
    process.exit(1);
  }
}

console.log("assert-roster-user-messages: ok");
