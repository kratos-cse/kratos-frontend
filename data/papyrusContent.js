/** Official PAPYRUS content — only organizer-approved copy. */

export const PAPYRUS_EVENT_NAME = "PAPYRUS – Paper Presentation Round";

export const PAPYRUS_TAGLINE = "Ideas That Connect. Research That Inspires.";
export const PAPYRUS_TAGLINE_LINES = ["Ideas That Connect.", "Research That Inspires."];

export const PAPYRUS_HERO_DATE = "28 OCTOBER 2026";
export const PAPYRUS_HERO_TIME = "10:00 AM–2:30 PM";
export const PAPYRUS_HERO_VENUE = "EASWARI ENGINEERING COLLEGE";

export const PAPYRUS_DESCRIPTION =
  "PAPYRUS is an idea submission conference that provides students with a platform to present innovative research, emerging ideas, and technical solutions across diverse fields of technology and engineering. Participants are invited to submit their research papers in the prescribed format. Submissions will be evaluated based on originality, relevance, technical content, and research contribution. Shortlisted participants will get the opportunity to present their work before a panel of judges, followed by a brief Q&A session.";

export const PAPYRUS_ELIGIBILITY =
  "Open to undergraduate and postgraduate students from recognized institutions.";

export const PAPYRUS_PARTICIPATION =
  "Individual participation or a maximum of 3 participants per team.";

export const PAPYRUS_SUBMISSION_FORMAT_NOTE =
  "Keep the research paper and presentation formats distinct: the paper is a PDF, while the presentation uses the prescribed PPT format.";

/** Organizer submission requirements (exact labels and copy). */
export const PAPYRUS_SUBMISSION_REQUIREMENTS = [
  { label: "Paper length", text: "Maximum 8 pages." },
  { label: "Research paper format", text: "PDF." },
  { label: "Presentation slides", text: "Prescribed PPT format." },
  {
    label: "Evaluation",
    text: "Originality, relevance, technical content, and research contribution.",
  },
  { label: "Presentation duration", text: "8 minutes." },
  { label: "Q&A", text: "2 minutes." },
];

export const PAPYRUS_EVENT_SCHEDULE = {
  date: "28 October 2026, Wednesday",
  time: "10:00 AM–2:30 PM",
  venue: "Easwari Engineering College",
};

export const PAPYRUS_PARTICIPANT_COMMUNICATION =
  "Please ensure that all information supplied in the registration form is accurate. Participants will be notified through their registered contact details.";

export const PAPYRUS_CONTACTS = [
  { name: "Chelsia Gladwin", phone: "7305944614" },
  { name: "Sowmiya MS", phone: "9790884274" },
  { name: "Shreyan Arunlal", phone: "7010102889" },
];

/** Rules page — same official copy as the main event page. */
export const PAPYRUS_RULES = [
  { title: "Eligibility", body: PAPYRUS_ELIGIBILITY },
  { title: "Participation", body: PAPYRUS_PARTICIPATION },
  { title: "Submission requirements", body: PAPYRUS_SUBMISSION_FORMAT_NOTE },
  {
    title: "Paper length",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[0].text,
  },
  {
    title: "Research paper format",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[1].text,
  },
  {
    title: "Presentation slides",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[2].text,
  },
  {
    title: "Evaluation",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[3].text,
  },
  {
    title: "Presentation duration",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[4].text,
  },
  {
    title: "Q&A",
    body: PAPYRUS_SUBMISSION_REQUIREMENTS[5].text,
  },
  {
    title: "Event schedule",
    body: `${PAPYRUS_EVENT_SCHEDULE.date}. ${PAPYRUS_EVENT_SCHEDULE.time}. ${PAPYRUS_EVENT_SCHEDULE.venue}.`,
  },
  { title: "Participant communication", body: PAPYRUS_PARTICIPANT_COMMUNICATION },
];
