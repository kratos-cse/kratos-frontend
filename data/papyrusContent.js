/** Approved PAPYRUS conference content (source of truth). */

export const PAPYRUS_TAGLINE = "Ideas That Connect. Research That Inspires";
export const PAPYRUS_TAGLINE_LINES = ["Ideas That Connect.", "Research That Inspires."];

export const PAPYRUS_HERO_DATE = "28 OCTOBER 2026";
/** Omit hero time row when empty — do not invent schedule times. */
export const PAPYRUS_HERO_TIME = "";
export const PAPYRUS_HERO_VENUE = "EASWARI ENGINEERING COLLEGE";

export const PAPYRUS_DESCRIPTION =
  "PAPYRUS is a research paper and idea submission conference that provides participants with a platform to present innovative research, emerging ideas and technical solutions across diverse fields of technology and engineering. The event encourages students to explore research-oriented problem solving and communicate their technical ideas effectively. Participants submit their research papers in the prescribed IEEE format, which are evaluated based on originality, relevance and technical content. Shortlisted participants will then present their work before a panel of judges, followed by a brief question-and-answer session. The conference provides participants with an opportunity to gain experience in research, technical presentation, critical thinking and academic communication.";

export const PAPYRUS_PARTICIPATION_GUIDELINES = [
  { num: "01", text: "Individual participation is allowed." },
  { num: "02", text: "Each paper can have a maximum of 3 authors." },
  { num: "03", text: "Participants may register as a single author or as a team of two / three." },
  { num: "04", text: "Both UG and PG students are eligible to participate." },
  { num: "05", text: "Each participant must belong to a recognized educational institution." },
];

export const PAPYRUS_SUBMISSION_SPECS = [
  { key: "Format", value: "IEEE prescribed format" },
  { key: "Length", value: "Maximum 6 pages" },
  { key: "File", value: "PDF" },
  { key: "Originality", value: "Original technology or engineering research" },
  { key: "Domain", value: "Symposium themes (core or interdisciplinary)" },
  { key: "Deadline", value: "Before the specified deadline" },
  { key: "Late submissions", value: "Not accepted" },
  { key: "Plagiarism", value: "Above 15% → disqualification" },
];

export const PAPYRUS_SUBMISSION_REQUIREMENTS = [
  "Research papers must be submitted in the prescribed IEEE format.",
  "Maximum paper length: 6 pages.",
  "Papers must be submitted in PDF format.",
  "The paper must be original and related to technology or engineering.",
  "The topic should align with the symposium themes and may belong to core or interdisciplinary domains.",
  "Papers must be submitted before the specified deadline.",
  "Late submissions will not be accepted.",
  "Plagiarism above 15% will result in disqualification.",
];

export const PAPYRUS_PAPER_SUBMISSION_INTRO =
  "Submit your paper and author details through the official registration form. You will upload your paper as a PDF and provide author information as part of that process.";

export const PAPYRUS_PAPER_SUBMISSION_CARDS = [
  {
    title: "PDF upload",
    body: "Submit your paper in PDF format (IEEE, max 6 pages).",
  },
  {
    title: "Author details",
    body: "Provide author names and institution details in the registration form.",
  },
];

export const PAPYRUS_THEMES = [
  "AI, Machine Learning & Generative Intelligence",
  "Cybersecurity, Blockchain & Digital Trust",
  "Data Science, Big Data & Cloud Computing",
  "IoT, Edge Computing & Smart Systems",
  "Robotics, Autonomous Systems & Industry 5.0",
  "Digital Health, FinTech & Digital Transformation",
  "Sustainable Technology, Smart Infrastructure & Social Impact",
];

export const PAPYRUS_TIMELINE_DATES = [
  { date: "01 OCT", label: "Paper submission opens" },
  { date: "10 OCT", label: "Last date to submit paper" },
  { date: "15 OCT", label: "Acceptance / shortlisting notification" },
  { date: "20 OCT", label: "Final paper submission" },
  { date: "28 OCT", label: "Paper conference — presentation round" },
  { date: "29 OCT", label: "Final presentations & winner announcement" },
];

export const PAPYRUS_CONTACTS = [
  { name: "Chelsia", detail: "IV - A", phone: "7305944614", display: "7305944614" },
  { name: "Sowmiya M S", detail: "III - F", phone: "9790884274", display: "9790884274" },
  { name: "Shreyan Arunlal", detail: "II - F", phone: "7010102889", display: "7010102889" },
];

export const PAPYRUS_RULES = [
  {
    title: "Participation",
    body:
      "Open to UG & PG students; individual participation is allowed, with a maximum of 3 authors per paper.",
  },
  {
    title: "Paper format",
    body:
      "Papers must follow the prescribed IEEE format, be a maximum of 6 pages, and be submitted in PDF format.",
  },
  {
    title: "Submission deadline",
    body: "Papers must be submitted before the specified deadline; late submissions will not be accepted.",
  },
  {
    title: "Originality",
    body:
      "Papers must be original, aligned with the symposium themes and must not contain plagiarism above 15%. Papers exceeding the limit will be disqualified.",
  },
  {
    title: "Presentation",
    body:
      "Shortlisted participants must present their paper in 8 minutes, followed by 2 minutes of Q&A, in English.",
  },
  {
    title: "Reporting",
    body:
      "Participants must report 15 minutes before their allotted session and carry a valid student ID.",
  },
  {
    title: "Presentation copy",
    body:
      "Participants must carry their presentation on a pen drive to avoid technical or connectivity issues.",
  },
  {
    title: "Conduct & decision",
    body:
      "Participants must follow all instructions of the organizers and judges. Misconduct or misrepresentation may result in disqualification; the judges’ and organizers’ decision will be final.",
  },
];
