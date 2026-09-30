/**
 * Registration CTA state matrix (CommonJS — no package "type":"module").
 * Keep in sync with lib/events/registrationUiState.js
 * Run: node scripts/assert-registration-matrix.cjs
 */

function formatCategory(category) {
  return category || "General";
}

function payStatus(registration) {
  return String(registration?.payment?.status || "").toUpperCase();
}

function regStatus(registration) {
  return String(registration?.status || "").toUpperCase();
}

function myTeamRole(registration, profileId) {
  if (!registration?.team || !profileId) return null;
  const me = (registration.team.members || []).find(
    (m) => String(m.profile_id) === String(profileId)
  );
  if (!me) {
    if (String(registration.team.leader_profile_id) === String(profileId)) return "LEADER";
    return null;
  }
  return String(me.role || "").toUpperCase() || null;
}

function deriveEventUiState(event, myRegistration, opts = {}) {
  const fee = Number(event?.fee);
  const hasFee = !Number.isNaN(fee) && fee > 0;

  if (myRegistration) {
    const status = regStatus(myRegistration);
    const pay = payStatus(myRegistration);
    const role = myTeamRole(myRegistration, opts.profileId);

    if (status === "CANCELLED") {
      return { code: "CANCELLED", label: "Cancelled", tone: "muted", cta: "register", role };
    }
    if (status === "CONFIRMED" || pay === "PAID") {
      if (role === "LEADER") {
        return { code: "TEAM_LEADER", label: "Team leader", tone: "ok", cta: "view", role };
      }
      if (role === "MEMBER") {
        return { code: "TEAM_MEMBER", label: "Team member", tone: "ok", cta: "view", role };
      }
      return { code: "COMPLETE", label: "Registered", tone: "ok", cta: "view", role };
    }
    if (pay === "FAILED") {
      return { code: "PAYMENT_FAILED", label: "Payment failed", tone: "err", cta: "pay", role };
    }
    if (pay === "CREATED" || (status === "PENDING" && hasFee)) {
      return { code: "PAYMENT_PENDING", label: "Payment pending", tone: "warn", cta: "pay", role };
    }
    if (status === "PENDING") {
      return { code: "PENDING", label: "Pending", tone: "warn", cta: "view", role };
    }
    return { code: "REGISTERED", label: "Registered", tone: "ok", cta: "view", role };
  }

  const availability = String(event?.registration_availability || "").toUpperCase();
  if (availability) {
    if (availability === "OPEN") return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
    if (availability === "FULL") return { code: "FULL", label: "Full", tone: "err", cta: "none" };
    if (availability === "CLOSED") {
      return { code: "REGISTRATION_CLOSED", label: "Registration closed", tone: "muted", cta: "none" };
    }
  }

  if (event?.registration_open === true) {
    return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
  }
  if (event?.registration_open === false) {
    return { code: "UNKNOWN", label: "Status unavailable", tone: "default", cta: "none" };
  }
  return { code: "UNKNOWN", label: formatCategory(event?.category), tone: "default", cta: "none" };
}

const openEvent = {
  visibility: "PUBLISHED",
  registration_status: "OPEN",
  registration_availability: "OPEN",
  registration_open: true,
  fee: 100,
  spots_remaining: 5,
};
const freeEvent = {
  visibility: "PUBLISHED",
  registration_status: "OPEN",
  registration_availability: "OPEN",
  registration_open: true,
  fee: 0,
  spots_remaining: 5,
};

const cases = [
  { name: "open → register", event: openEvent, reg: null, expect: { code: "OPEN", cta: "register" } },
  {
    name: "registration closed via availability",
    event: {
      visibility: "PUBLISHED",
      registration_status: "CLOSED",
      registration_availability: "CLOSED",
      registration_open: false,
      fee: 100,
    },
    reg: null,
    expect: { code: "REGISTRATION_CLOSED", cta: "none" },
  },
  {
    name: "full via availability",
    event: {
      visibility: "PUBLISHED",
      registration_status: "OPEN",
      registration_availability: "FULL",
      registration_open: false,
      fee: 100,
    },
    reg: null,
    expect: { code: "FULL", cta: "none" },
  },
  {
    name: "legacy registration_open false without availability",
    event: { visibility: "PUBLISHED", registration_open: false, fee: 100 },
    reg: null,
    expect: { code: "UNKNOWN", cta: "none" },
  },
  {
    name: "cancelled → register again",
    event: openEvent,
    reg: { status: "CANCELLED" },
    expect: { code: "CANCELLED", cta: "register" },
  },
  {
    name: "pending free → view",
    event: freeEvent,
    reg: { status: "PENDING" },
    expect: { code: "PENDING", cta: "view" },
  },
  {
    name: "pending + CREATED → pay",
    event: openEvent,
    reg: { status: "PENDING", payment: { status: "CREATED" } },
    expect: { code: "PAYMENT_PENDING", cta: "pay" },
  },
  {
    name: "pending + FAILED → pay",
    event: openEvent,
    reg: { status: "PENDING", payment: { status: "FAILED" } },
    expect: { code: "PAYMENT_FAILED", cta: "pay" },
  },
  {
    name: "pending paid fee no payment object → pay",
    event: openEvent,
    reg: { status: "PENDING" },
    expect: { code: "PAYMENT_PENDING", cta: "pay" },
  },
  {
    name: "confirmed → view",
    event: openEvent,
    reg: { status: "CONFIRMED" },
    expect: { code: "COMPLETE", cta: "view" },
  },
  {
    name: "team leader",
    event: openEvent,
    reg: {
      status: "CONFIRMED",
      team: { leader_profile_id: "p1", members: [{ profile_id: "p1", role: "LEADER" }] },
    },
    opts: { profileId: "p1" },
    expect: { code: "TEAM_LEADER", cta: "view" },
  },
  {
    name: "team member",
    event: openEvent,
    reg: {
      status: "CONFIRMED",
      team: { leader_profile_id: "p1", members: [{ profile_id: "p2", role: "MEMBER" }] },
    },
    opts: { profileId: "p2" },
    expect: { code: "TEAM_MEMBER", cta: "view" },
  },
];

let failed = 0;
for (const c of cases) {
  const ui = deriveEventUiState(c.event, c.reg, c.opts || {});
  const ok = ui.code === c.expect.code && ui.cta === c.expect.cta;
  if (!ok) {
    console.error(`FAIL ${c.name}: got ${ui.code}/${ui.cta}, expected ${c.expect.code}/${c.expect.cta}`);
    failed += 1;
  } else {
    console.log(`ok ${c.name}`);
  }
}

if (failed) {
  console.error(`\n${failed} registration state matrix case(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${cases.length} registration state matrix cases passed.`);
