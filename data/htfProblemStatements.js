/** Official Hack the Future 2.0 problem statements (source document). */

export const HTF_PROBLEM_STATEMENTS = [
  {
    id: "ps-01",
    number: "01",
    title: "Dynamic Generation of Context-Aware Content and Media",
    challengeSummary:
      "Transform a user-defined subject into structured content and supporting multimedia—with human review and refinement.",
    tagAreas: ["AI", "Multimedia", "Review"],
    problemStatement:
      "Applications that need to present information for changing subjects often depend on manually prepared content. Creating structured explanations, supporting material, and relevant multimedia for every new subject can require significant effort. The challenge is to create a system that accepts a user-defined subject or theme and dynamically generates relevant, structured content together with suitable multimedia. The generated output should remain consistent with the supplied subject and should be easy for a user to review and refine.",
    realWorldExample:
      "A user enters the subject “Electric Vehicle Battery Management.” The system should be able to generate a structured overview, important concepts, supporting explanations, and relevant visual or video material. If the user changes the subject to “Cybersecurity Fundamentals,” the system should produce a new set of content appropriate to the new input.",
    challenge:
      "Develop a simple generative-AI workflow that can transform a short user input into coherent content and supporting media without relying entirely on pre-created material.",
    keyProblemAreas: [
      "Generating relevant content from a short or open-ended input.",
      "Maintaining consistency between generated text and multimedia.",
      "Organizing generated information into a logical sequence.",
      "Reducing irrelevant, repeated, or incomplete output.",
      "Handling cases where AI-generated information requires review.",
      "Allowing a user to regenerate or refine unsuitable output.",
    ],
    handsOnExercise: [
      "Accepts a subject or theme as input.",
      "Sends the input to a suitable AI API.",
      "Generates structured content related to the input.",
      "Generates or retrieves suitable topic-related visual or video material.",
      "Displays the generated output through a simple interface.",
      "Allows the user to review the output.",
      "Provides an option to regenerate or refine the output.",
    ],
    technicalExpectations: [
      "Students may use any suitable AI API or model provider.",
      "Students may use their own API key and are responsible for configuring it securely.",
      "REST APIs and JSON-based communication may be used.",
      "Any suitable programming language or web framework may be used.",
      "A simple frontend and backend implementation is sufficient.",
    ],
    expectedOutcome:
      "The prototype should demonstrate how a single user-defined input can be transformed into structured, context-relevant content and supporting media, with an opportunity for human review.",
    workflow: [
      "User subject/theme",
      "AI API",
      "Structured content",
      "Relevant multimedia",
      "Review",
      "Regenerate/refine",
    ],
  },
  {
    id: "ps-02",
    number: "02",
    title: "Context-Aware Conversational Processing and Personalized Voice",
    challengeSummary:
      "Text or speech in, contextual AI response, human review, then personalized voice output—not a generic synthetic voice.",
    tagAreas: ["Speech", "Context", "Review", "Voice"],
    problemStatement:
      "Applications that interact with users through text or speech need to understand more than the latest sentence. The meaning of an input can depend on the current topic, previous interactions, and the surrounding context. A system is required to capture text or speech input, process it using contextual information, generate an appropriate response, and provide a human review step before the response is delivered. The final response should also be capable of being converted into speech using a permitted personalized voice rather than a generic synthetic voice.",
    realWorldExample:
      "A user asks, “Why was my previous request rejected?” The application should consider the current interaction and relevant previous information before generating a response. The response is shown to an operator, who can accept it, modify it, or request a new response. The final version is then converted into speech using the configured voice profile.",
    challenge:
      "Create a simple conversational pipeline that combines speech or text input, contextual AI processing, human review, and personalized voice output.",
    keyProblemAreas: [
      "Capturing input through text or speech.",
      "Converting speech into text when required.",
      "Maintaining relevant context across interactions.",
      "Generating responses that match the supplied context.",
      "Handling ambiguous or incomplete inputs.",
      "Allowing a human to accept, edit, or regenerate a response.",
      "Converting the final response into a personalized voice.",
      "Maintaining understandable pronunciation and natural delivery.",
    ],
    handsOnExercise: [
      "Accepts text input and optionally microphone input.",
      "Converts speech input into text when required.",
      "Maintains a small amount of current and previous context.",
      "Sends the input and context to an AI API.",
      "Generates a response based on the available context.",
      "Displays the response in a Response Review screen.",
      "Allows the user to accept, edit, or regenerate the response.",
      "Converts the final response into speech using an available personalized/custom voice capability.",
    ],
    technicalExpectations: [
      "Speech-to-text APIs may be used for voice input.",
      "Any suitable large language model or AI API may be used.",
      "Text-to-speech or permitted custom-voice APIs may be used for output.",
      "Basic context/session management should be demonstrated.",
      "Students must use only voices for which they have appropriate permission or consent.",
      "The implementation may use any suitable programming language or framework.",
    ],
    expectedOutcome:
      "The prototype should demonstrate the complete flow of input capture, contextual processing, AI response generation, human review, and personalized voice output.",
    workflow: [
      "Text/microphone input",
      "Speech-to-text (where required)",
      "Context",
      "AI response",
      "Human review",
      "Accept/edit/regenerate",
      "Personalized voice output",
    ],
  },
  {
    id: "ps-03",
    number: "03",
    title: "Post-Visit Follow-Up Agent",
    challengeSummary:
      "After the visit: explain the prescription simply, auto-schedule follow-up calls, check adherence, summarize, and alert the clinic—without diagnosing or changing care.",
    tagAreas: ["Healthcare", "Voice", "Safety", "Scheduling"],
    problemStatement:
      "A doctor’s consultation lasts only a few minutes, but the patient’s recovery takes days or weeks, and most of it happens at home with nobody watching. In those first days the instructions are easily lost. A patient forgets whether a tablet goes before or after food, misreads a prescription written as “1-0-1”, stops a course of medicine as soon as they feel better, or never returns for the review visit. When that happens the treatment does not work as intended, recovery takes longer, and the patient often comes back to the clinic sicker than before. Clinics know this, but cannot fix it on their own: a busy clinic sees hundreds of patients a day, and no one has the time to phone each of them to ask whether they took their medicines. Follow-up is the part of care that is needed most and done least.\n\nThis challenge asks you to build the missing follow-up layer as an AI agent that takes over after the visit. Given a prescription, the agent first explains it in simple language, so the patient understands what to take, when and why. It then schedules the follow-up calls on its own, working out the call times from the dosage timings with nobody setting them up by hand. At each scheduled time it holds a short voice call in the browser and asks what a caring nurse would: have you taken your tablets as prescribed, are you having any side effects, do you have any doubts? Doubts are answered only from what the doctor wrote. After every call it saves a summary, and it alerts the clinic when something looks wrong, such as missed doses, worsening or red-flag symptoms, or a patient who does not answer.\n\nThe goal is not to replace the doctor but to extend the doctor’s reach. The agent only explains and checks on what the doctor already wrote. It must never diagnose, name a condition, or change a dose.",
    realWorldExample:
      "The prescription “Tab. Paracetamol 500 mg, 1-0-1, after food, 3 days” leads to calls on Day 1 at 8:30 PM (“Have you started your medicines?”), Day 2 at 9 AM (“Did you take your morning tablet after food?”) and Day 3 in the evening (“Is the fever gone?”).",
    challenge:
      "Build an AI follow-up agent that extends care after the visit using prescription-grounded explanations, auto-scheduled calls, and clinic alerts—without diagnosing or altering treatment.",
    workflow: [
      "Prescription input",
      "Explain simply",
      "Auto-schedule calls",
      "Follow-up call",
      "Call summary",
      "Clinic alert",
    ],
    requiredModules: [
      {
        name: "Prescription input",
        description:
          "Takes a typed or pasted prescription and extracts medicines, dose, timing, duration and review date.",
        implementation: "A free LLM key or a local model.",
      },
      {
        name: "Explain simply",
        description: "Turns every instruction into plain language the patient understands.",
        implementation: "Same LLM.",
      },
      {
        name: "Auto-scheduler",
        description:
          "Creates the call times by itself from the dosage timings. No manual scheduling.",
        implementation: "APScheduler or node-cron (runs locally).",
      },
      {
        name: "Follow-up call",
        description:
          "Starts a short voice call in the browser, asks about doses and side effects, and answers doubts only from the prescription.",
        implementation: "Browser Web Speech API. Typed chat as fallback.",
      },
      {
        name: "Call summary",
        description:
          "Saves a structured summary of each call: doses taken or missed, symptoms, questions.",
        implementation: "LLM output as JSON, stored in SQLite or a file.",
      },
      {
        name: "Clinic alert",
        description:
          "Flags missed doses, worsening or red-flag symptoms and unanswered calls on a simple dashboard.",
        implementation: "Plain HTML or React page.",
      },
    ],
    safetyRules: [
      "Never diagnose, name a condition, or tell a patient to change, skip or add a medicine or dose.",
      "Answer only from the prescription. Anything else: “Please contact the clinic.”",
      "Red-flag symptoms (for example breathing difficulty or chest pain): tell the patient to contact the clinic or emergency services, and alert the clinic.",
      "Say it is an AI at the start of every call. Use synthetic data only.",
    ],
    rules: [
      "Use any tools, models or libraries you prefer, and keep a typed-chat fallback in case voice or a service fails during the demo.",
      "The call is simulated in the browser. A “Receive call” button opens the voice or chat session. No phone, SMS or WhatsApp integration is needed.",
      "Use dummy prescriptions. Create your own made-up prescriptions (typed or pasted) to build and test with. Never use real patient data.",
      "The demo must run live on a laptop.",
    ],
    deliverables: [
      "Working demo with an auto-generated schedule, one live call and clinic dashboard",
      "Code repository with a README",
      "One-page architecture diagram",
      "Short pitch with Q&A",
    ],
    judging: [
      {
        criterion: "Safety and guardrails",
        marks: 25,
        description:
          "No diagnosis or dose changes, red flags handled, declares it is an AI.",
      },
      {
        criterion: "Auto-scheduling",
        marks: 20,
        description: "Correct schedule from the prescription with no manual input.",
      },
      {
        criterion: "Call quality",
        marks: 20,
        description:
          "Natural, short, asks the right questions, answers only from the prescription.",
      },
      {
        criterion: "Summary and alerts",
        marks: 20,
        description: "Useful call summaries and a clear clinic alert for risky cases.",
      },
      { criterion: "Demo and pitch", marks: 15, description: "Works live, problem clearly understood." },
    ],
  },
  {
    id: "ps-04",
    number: "04",
    title: "Career Path Graph and Guidance Bot",
    challengeSummary:
      "Turn career stories into an interactive path graph; answer student goals with cited paths from the graph—never invented routes.",
    tagAreas: ["Graph", "RAG", "Guidance", "Citations"],
    problemStatement:
      "After school, a student has to make two of the biggest decisions of their life, which course to take and which college to join, usually with very little real information. Advice comes from relatives, coaching-centre brochures and college rankings, and it tends to be generic. What students actually want to know is far more specific: “I want to become a data scientist. Which course should I pick, which college, what did people who made it study, which skills did they learn along the way, and how did they land their first job?” Real answers exist, scattered across interviews, profiles and articles, but nobody connects them into something a student can explore.\n\nThis challenge asks you to build that missing connection in two parts. Part one is the graph: take unstructured career stories and use an AI model to extract people, schools, courses, colleges, skills and jobs into a career-path knowledge graph shown as an interactive map. Part two is the guidance bot: a student chats with the bot and states a goal, and the bot finds matching paths in the graph, answers with the real people and routes it used as references, and highlights those paths on screen. Every answer must come from the graph, not from the model’s imagination.\n\nThe bot suggests and explains, and the student decides. It must say so honestly when the graph has no path for what was asked.",
    realWorldExample:
      "A student asks “I want to become a data scientist after 12th.” The bot replies that three people in the graph took this route, for instance B.Sc. Statistics, then Python and SQL, then a data analyst job, then data scientist, and highlights those three paths in the graph.",
    challenge:
      "Build a career-path knowledge graph from stories and a guidance bot that answers only from that graph—with citations and on-screen path highlighting.",
    workflow: [
      "Career stories",
      "Extract with AI",
      "Build graph",
      "Chat with student",
      "Find matching paths",
      "Answer and graph view",
    ],
    requiredModules: [
      {
        name: "Career data",
        description: "A small set of career stories as plain text.",
        implementation: "Public career/occupation data or dummy profiles you create.",
      },
      {
        name: "Graph builder",
        description:
          "An AI model reads each story and extracts people, schools, courses, colleges, skills and jobs, plus links. Duplicates are merged.",
        implementation: "Any LLM asked to return JSON.",
      },
      {
        name: "Graph store",
        description: "Holds the nodes and links and can find paths between them.",
        implementation: "NetworkX (Python) or a JSON file. No database needed.",
      },
      {
        name: "Graph view",
        description: "An interactive graph. Clicking a node shows its details.",
        implementation: "react-force-graph, Cytoscape.js or vis-network.",
      },
      {
        name: "Guidance chatbot",
        description:
          "Takes the student’s goal, finds matching paths in the graph and answers using them.",
        implementation: "Same LLM plus a graph lookup (graph-based RAG).",
      },
      {
        name: "Cite and highlight",
        description:
          "Lists the people and paths used in each answer, highlights them in the graph, and says “no matching path” when there is none.",
        implementation: "Link chat answers to graph node IDs.",
      },
    ],
    dataSources: [
      {
        source: "O*NET",
        description:
          "US occupation database: skills, knowledge, tasks and typical education for each occupation.",
        notes: "Free web API or downloadable files. Credit the source.",
      },
      {
        source: "Wikidata",
        description:
          "Real, notable people with their education and occupation, using its query service (SPARQL).",
        notes: "Free to use under its stated licensing.",
      },
      {
        source: "Wikipedia",
        description: "Biography text that can be turned into career stories.",
        notes: "Free to reuse with appropriate credit.",
      },
      {
        source: "Your own dataset",
        description: "30–50 made-up career stories, 3–5 lines each, if more data is needed.",
        notes: "Enough to build and demonstrate the full graph.",
      },
    ],
    rules: [
      "Use any tools, models or libraries you prefer, and keep a fallback such as a pre-built graph file in case a service fails during the demo.",
      "Answers must come from the graph. Every answer cites the people and paths it used. If nothing matches, say so. Never invent people or career paths.",
      "Use public or dummy data only. Do not scrape sites that forbid it, and never use real students’ personal information.",
      "Credit your sources in the README and presentation material.",
      "The demo must run live on a laptop.",
    ],
    bonus: "Compare two career routes side by side, or allow the student to chat in Tamil.",
    deliverables: [
      "Working demo with graph view and a chatbot giving cited answers",
      "Code repository with a README",
      "One-page architecture diagram",
      "Short pitch with Q&A",
    ],
    judging: [
      {
        criterion: "Graph quality and extraction",
        marks: 30,
        description:
          "Correct people, courses, skills and jobs and links; duplicates merged; a graph that is useful to explore.",
      },
      {
        criterion: "Grounded, cited answers",
        marks: 25,
        description:
          "Answers come from the graph, cite real paths, and admit when no path exists.",
      },
      {
        criterion: "Usefulness to a student",
        marks: 20,
        description: "Clear, practical guidance on courses, colleges, skills and next steps.",
      },
      {
        criterion: "Graph visualisation",
        marks: 15,
        description: "Interactive, readable, and highlights the paths used in an answer.",
      },
      { criterion: "Demo and pitch", marks: 10, description: "Works live, problem clearly understood." },
    ],
  },
];

export const HTF_CONTACTS = [
  { name: "Sai Madhan", phone: "7418731723", display: "74187 31723" },
  { name: "Mahalakshmi", phone: "9363023735", display: "93630 23735" },
  { name: "Lavanya", phone: "8270991746", display: "82709 91746" },
  { name: "Kamaliga", phone: "6383617513", display: "6383617513" },
];
