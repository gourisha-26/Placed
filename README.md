# Placed

A mobile app that tracks campus placement applications on its own.

Capstone design project. This repo holds the research documentation and the
working web app built from the final designs.

---

## The problem

Students don't struggle to apply for jobs. They struggle to keep track of them.

Placement information is spread across the college portal, WhatsApp groups,
Gmail, and company websites. The student is the one holding it all together -
re-typing the same details, losing track of which resume went where, and
missing updates that arrive in the wrong place at the wrong time.

Most tracking apps ask the student to maintain a list. That only works if you
have the discipline to keep it updated during the busiest month of your year.

## The idea

The record should build itself.

1. **Capture** - See a job posting anywhere, tap the floating widget, and the
   app reads the details off the screen.
2. **Track** - Connect the email you use to apply. The app reads placement mail
   and updates the status when a company replies.
3. **Decide** - The app suggests which resume to send, flags interview clashes,
   and shows what needs attention today.

The student confirms things. They don't maintain things.

## Main screens

| Screen | What it does |
|---|---|
| Home | What needs attention today |
| Journey | Every application and its current stage |
| Job Detail | One job, its full history, and the resume sent |
| Calendar | Interviews and deadlines, with clash warnings |
| Resume Library | Resume versions and where each was sent |

Statuses run: Saved, Applied, Shortlisted, Interview, Offer, Closed. Each has
its own pastel colour so the stage is readable at a glance.

---

## User research

### Who we test with

- **College students** - final-year students who are applying now, or about to.
  They do all five tasks. Their results decide what changes.
- **Placement cell and faculty** - they check whether the app matches how drives
  actually run.

### The five tasks

| # | Task | What it tests |
|---|---|---|
| 1 | Connect your inbox | Whether students see why a tracked inbox matters, and how many refuse |
| 2 | Capture your first job | Whether the capture widget is findable, and flagged fields get noticed |
| 3 | Apply and update the status | Whether the app finds out you applied |
| 4 | Trust an automatic update | Whether students check automated claims or believe them blindly |
| 5 | Resolve a schedule clash | How students prioritise, and whether they trust a message the app wrote |

Each task is a separate scenario with its own start point in the prototype.
Sessions are about 50 minutes.

### What gets measured

Per task: completion (unaided, assisted, or failed), time taken, wrong taps, an
ease rating out of 7, which branch they chose, and what they said out loud.

Findings are sorted into two piles. **Structural** ones could change the
information architecture. **Surface** ones are wording and layout.

---

## What's in this repo

- `testing-plan.html` - the full usability test plan: participants, the script
  to read out, all five tasks with their flows, what to measure, and the
  questions to ask after each one.
- `testing-analysis.html` - what came out of the sessions.
- The app itself - a Next.js build of the version 2 screens, sized for
  iPhone 16. Every screen is built from the Figma file, and all five task
  flows are walkable end to end.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app opens on the splash flow; the five task
flows start from Home, the capture widget, a job card, the calendar clash and
`/notification` respectively.

## Design files

The screens, component library, mascot, prototype, information architecture and
annotated flows live in Figma.

## Built with

- Figma - screens, components, prototype and motion.
- Next.js, TypeScript, Tailwind CSS and Motion - the web app.

## Status

Design and prototype complete. Round one of user testing run and analysed.
The web app covers the version 2 screens and all five task flows.

## Author

Gourisha - [@gourisha-26](https://github.com/gourisha-26)
