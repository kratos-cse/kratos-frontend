/**
 * Participant error copy — keep in sync with lib/errors/userMessages.js
 * Run: node scripts/assert-participant-errors.cjs
 */
const fs = require("fs");
const path = require("path");

const userMessages = fs.readFileSync(
  path.join(__dirname, "..", "lib", "errors", "userMessages.js"),
  "utf8",
);

const requiredCodes = [
  "PAYMENT_CANCELLED",
  "PAYMENT_RECONCILIATION_PENDING",
  "PAYMENT_ALREADY_PROCESSED",
  "TIMEOUT",
  "NETWORK",
];

for (const code of requiredCodes) {
  if (!userMessages.includes(`${code}:`)) {
    console.error(`Missing CODE_MESSAGES.${code}`);
    process.exit(1);
  }
}

const checkout = fs.readFileSync(
  path.join(__dirname, "..", "components", "registration", "PaymentCheckout.js"),
  "utf8",
);
if (!checkout.includes("await opts.onSuccess")) {
  console.error("PaymentCheckout must await onSuccess before resolving");
  process.exit(1);
}

console.log("assert-participant-errors: ok");
