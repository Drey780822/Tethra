# Tethra

Build a modern, minimal, highly responsive personal task-management web application called:

TETHRA

Tethra is a simple personal task manager built around the idea of a DIGITAL WHITEBOARD.

The philosophy is:

TARGET → DO → PRIORITISE → COMPLETE

I do NOT want Tethra to feel like Trello, ClickUp, Jira, Asana, Monday.com, or another enterprise project-management system.

Those platforms are often too overwhelming.

Tethra should feel like:

"Walking into an empty classroom, picking up a marker, and writing on the whiteboard what you need to accomplish."

A user should be able to open Tethra, quickly write what they need to do, organise it by time, attach supporting documentation if necessary, complete tasks, and move on.

Keep the product extremely simple, modern, clean, fast, and intuitive.

==================================================

1. BRANDING

==================================================

The product name is:

Tethra

Use the attached Tethra logo as the official brand logo.

IMPORTANT:

- Use the attached logo.

- Do NOT redesign the logo.

- Create a favicon from the logo/brand mark.

- Use the logo in the navbar.

- Use the logo appropriately on the landing page.

- Use the logo for the browser favicon.

- Make sure the logo works on both light and dark backgrounds.

The attached logo should be treated as the source of truth for the brand identity.

Extract/derive the visual colour palette from the supplied logo and use it consistently throughout the application.

Do not introduce random colours.

The interface should feel:

- premium

- minimal

- modern

- calm

- intelligent

- technical

- clean

- focused

Avoid excessive gradients, excessive cards, excessive shadows, excessive icons, and unnecessary decoration.

==================================================

2. CORE PRODUCT PHILOSOPHY

==================================================

Tethra is NOT a complicated project-management platform.

The primary experience should be:

OPEN TETHRA

↓

SEE WHAT I NEED TO DO

↓

ADD TASK

↓

PRIORITISE IT

↓

CHOOSE WHEN I WILL DO IT

↓

WORK

↓

TICK COMPLETE

↓

DONE

The application should feel almost like a digital notebook/whiteboard.

The user should never feel like they need to "learn" Tethra.

==================================================

3. LANDING PAGE

==================================================

Create a beautiful modern landing page.

Keep the wording extremely simple.

Do NOT create a long marketing website.

The landing page should communicate the product in seconds.

Suggested hero:

TETHRA

Your work.

Your board.

Your focus.

A simple place to target, prioritise, and get things done.

Primary CTA:

"Open My Board"

Secondary CTA:

"See How It Works"

Keep the landing page visually impressive without being overloaded with text.

==================================================

4. LANDING PAGE VISUAL EXPERIENCE

==================================================

Use the provided React Bits components where appropriate.

The landing page should have a premium interactive visual experience.

--------------------------------------------------

REACT BITS COMPONENT #1 — ScrollExpand

--------------------------------------------------

Integrate the supplied:

<ScrollExpand />

component.

Use the exact component source and CSS provided in this request.

If necessary:

- install dependencies

- create the component file

- create the CSS file

- import it properly

- make it responsive

- optimise it for mobile

- respect prefers-reduced-motion

Use ScrollExpand as a visual storytelling section on the landing page.

The animation should reinforce the idea of:

"From scattered thoughts → to an organised board."

Do NOT let the animation interfere with usability or page performance.

--------------------------------------------------

REACT BITS COMPONENT #2 — GradientWaves

--------------------------------------------------

Integrate the supplied:

<GradientWaves />

component.

Use the exact component source and CSS provided in this request.

Install:

ogl

if it is required.

Use GradientWaves as a subtle visual background/hero effect.

IMPORTANT:

The supplied example colours are NOT the final Tethra colours.

Adapt the GradientWaves colours to the Tethra brand palette derived from the attached logo.

The effect must remain subtle.

Do not make the page look like a gaming website.

==================================================

5. ACCESS — NO TRADITIONAL ACCOUNT REQUIRED

==================================================

I do NOT want users to be forced to create a traditional account just to use Tethra.

The experience should be closer to entering an open classroom.

When a new user opens Tethra, provide a simple entry screen:

"Let's get started."

Name:

[________________]

Email:

[________________]

Button:

"Open My Board"

Keep this extremely simple.

Do NOT ask for:

- username

- password

- date of birth

- address

- unnecessary profile information

- complicated registration forms

==================================================

6. USER SESSION / IDENTITY

==================================================

A user should have a persistent personal workspace.

The user should be able to return to Tethra and see their board.

Use an appropriate lightweight authentication/session architecture.

If Supabase is available/appropriate, use it for:

- user/workspace identity

- task persistence

- attachments

- database

- secure backend operations

Do NOT build unnecessary authentication complexity.

The system should remember:

- name

- email

- workspace

- tasks

- task status

- priorities

- time targets

- attachments

- completion history

The architecture should still allow proper authentication to be added later if Tethra grows.

==================================================

7. MAIN DASHBOARD

==================================================

The dashboard is the HEART of Tethra.

It should feel like a beautiful digital whiteboard.

At the top:

Tethra

Good morning, [Name]

Then a simple summary such as:

TODAY

3 tasks

THIS WEEK

8 tasks

COMPLETED

14 tasks

Do not overdo analytics.

The user should immediately see what needs to be done.

==================================================

8. WHITEBOARD STRUCTURE

==================================================

The core board should use:

TARGET

DO

PRIORITISE

The user should be able to organise work around time horizons.

Main sections:

TODAY

THIS WEEK

THIS MONTH

LATER

BACKLOG

COMPLETED

But do not make these feel like complicated project-management columns.

They should feel like simple sections on a whiteboard.

==================================================

9. TASK STRUCTURE

==================================================

Each task should have:

- title

- optional description

- priority

- status

- target timeframe

- due date

- created date

- completed date

- optional attachment(s)

- optional notes

- optional category/project

- optional estimated effort

Keep the task creation interface extremely fast.

Example:

+ Add task

Then:

Task:

"Fix FuelLinkPro indexing"

Priority:

HIGH

Target:

THIS WEEKEND

Due:

Sunday

[Add Task]

That should be enough.

==================================================

10. BULK TASK CREATION

==================================================

One of the most important features:

Allow users to add tasks individually OR in bulk.

For example, I should be able to paste:

Index FuelLinkPro on Google

Set up Google Search Console

Create/fix sitemap.xml

Create/fix robots.txt

Disable Premium features

Add Premium feature flag

Tethra should turn these into individual tasks.

The bulk input should be extremely easy.

Example:

"Add multiple tasks"

Large text box:

Task 1

Task 2

Task 3

Task 4

Then:

[Create Tasks]

Do NOT require the user to manually create six separate forms.

==================================================

11. IMPORTING STRUCTURED TASK LISTS

==================================================

Tethra should intelligently support structured task lists.

For example:

FUELLinkPro — WEEKEND BUILD BOARD

TARGET: Stabilise → Automate → Scale

WEEKEND 1 — FOUNDATION

Index FuelLinkPro on Google

Set up Google Search Console

Create/fix sitemap.xml

Create/fix robots.txt

Disable Premium features

Add Premium feature flag

WEEKEND 2 — SECURITY

Enhance failed-login security

Enhance password-reset security

Implement suspicious-account flagging

Test authentication security

Review session/security configuration

Tethra should be able to interpret the headings and create:

Project/Board:

FuelLinkPro — Weekend Build Board

Target:

Stabilise → Automate → Scale

Group:

Weekend 1 — Foundation

Tasks:

- Index FuelLinkPro on Google

- Set up Google Search Console

- Create/fix sitemap.xml

- Create/fix robots.txt

- Disable Premium features

- Add Premium feature flag

The user should also be able to edit everything after import.

==================================================

12. TIME TARGETING

==================================================

One of the most important concepts in Tethra:

I should be able to decide:

"I can finish this today."

or:

"I need this weekend."

or:

"This will take me a month."

When creating/editing a task, allow:

TODAY

THIS WEEK

THIS WEEKEND

NEXT WEEK

THIS MONTH

NEXT MONTH

CUSTOM DATE

LATER

Also allow an optional:

Estimated effort:

QUICK

HALF DAY

FULL DAY

WEEKEND

MULTI-WEEK

LONG TERM

Do NOT make this complicated.

The goal is simply helping the user decide:

"When am I actually going to do this?"

==================================================

13. PRIORITY

==================================================

Keep priority simple.

Use:

HIGH

MEDIUM

LOW

Optionally visually distinguish them using the Tethra brand system.

Do not create 15 priority levels.

==================================================

14. TASK COMPLETION

==================================================

Completing a task should be satisfying.

Each task should have a clear checkbox/action:

☐ Task

When completed:

☑ Task

Move it to Completed or visually mark it as complete.

Show completion date/time.

Use a subtle completion animation.

Do NOT make the animation excessive.

==================================================

15. ATTACHMENTS / DOCUMENTATION

==================================================

This is an important feature.

A task should allow the user to attach relevant documentation.

Examples:

- PDF

- DOCX

- XLSX

- TXT

- images

- screenshots

- project documents

- specifications

- notes

- reference files

Example:

Task:

"Fix FuelLinkPro payment flow"

Attachments:

📄 payment-flow-spec.pdf

📷 payment-error.png

The user should be able to:

- upload

- view

- download/open

- remove

- replace attachments

Store files securely.

Do not expose private task attachments publicly.

If using Supabase Storage, implement appropriate access control/security policies.

==================================================

16. TASK DETAIL VIEW

==================================================

Clicking a task should open a clean task detail view/modal.

Display:

TASK TITLE

Description

Priority

Target timeframe

Due date

Status

Attachments

Notes

Created

Completed

The task detail view should remain simple.

==================================================

17. DRAG AND DROP

==================================================

If it improves usability, allow lightweight drag-and-drop between:

TODAY

THIS WEEK

THIS MONTH

LATER

But do NOT turn Tethra into a complicated Kanban system.

Drag-and-drop should be optional and intuitive.

==================================================

18. SEARCH

==================================================

Add a simple search function.

Search across:

- task titles

- descriptions

- notes

- project names

Keep it simple.

==================================================

19. FILTERS

==================================================

Simple filters:

ALL

TODAY

THIS WEEK

THIS MONTH

HIGH PRIORITY

COMPLETED

Do not create complicated filter builders.

==================================================

20. PROJECT / BOARD ORGANISATION

==================================================

Users may have different areas of work.

Allow simple boards/projects such as:

FuelLinkPro

Skills Mapping

Tethra

Research

Personal

But keep project creation lightweight.

A project should simply group tasks.

Do not introduce complex project-management hierarchies.

==================================================

21. EMAIL NOTIFICATION TO FOUNDER / MANAGER

==================================================

This is an IMPORTANT feature.

I am a co-founder and software engineer.

When I complete a task/feature, I want Tethra to automatically notify my founder/manager via email.

Example:

I complete:

"Enhance FuelLinkPro customer dashboard"

I tick:

☑ Completed

Tethra automatically sends an email to the configured founder/manager.

The email should be professional and modern.

Example:

Subject:

Tethra — Task Completed: Enhance FuelLinkPro Customer Dashboard

Email:

Hi [Founder Name],

A development task has been completed in Tethra.

Developer:

[Developer Name]

Task:

Enhance FuelLinkPro Customer Dashboard

Project:

FuelLinkPro

Priority:

High

Target:

Weekend 10

Status:

Completed

Completed:

28 August 2026

The developer has completed the task and pushed the implementation to production.

View Task:

[View Task]

— Tethra

IMPORTANT:

The email should NOT be sent from the browser directly.

Use a secure backend/server-side email mechanism.

Create configuration variables/placeholders for the email provider and founder email.

For example:

FOUNDER_EMAIL=

EMAIL_FROM=

EMAIL_PROVIDER_API_KEY=

Do NOT hardcode credentials.

If using an email provider such as Resend is appropriate, structure the integration cleanly so credentials are stored securely in environment variables.

==================================================

22. COMPLETION CONFIRMATION

==================================================

When the user marks a task complete, show a subtle confirmation:

✓ Task completed

Notification sent to [Founder Name]

If email delivery fails:

✓ Task completed

⚠ Email notification could not be delivered.

Do NOT mark the task as incomplete simply because the email failed.

Store email notification status.

==================================================

23. COMPLETION HISTORY

==================================================

Keep a lightweight history of completed tasks.

Example:

COMPLETED

✓ Fix payment callback

FuelLinkPro

28 Aug

✓ Improve driver tracking

FuelLinkPro

24 Aug

✓ Deploy dashboard update

Tethra

20 Aug

Do not create a complicated activity feed.

==================================================

24. MOBILE EXPERIENCE — EXTREMELY IMPORTANT

==================================================

Mobile responsiveness is one of the highest priorities.

Tethra must work beautifully on:

- iPhone

- Android

- small phones

- large phones

- tablets

- laptops

- desktops

- ultrawide screens

Do NOT simply make the desktop layout shrink.

Design mobile intentionally.

On mobile:

- navigation should become compact

- task cards should fit perfectly

- buttons should be thumb-friendly

- modals should fit the screen

- task creation should be fast

- attachments should be easy to upload

- no horizontal scrolling

- no broken layouts

- no text overflow

- no clipped buttons

- no overlapping elements

Test at minimum:

320px

375px

390px

414px

768px

1024px

1280px

1440px

1920px

The interface must adapt gracefully.

==================================================

25. RESPONSIVE WHITEBOARD

==================================================

Desktop:

Use a spacious whiteboard-style layout.

Mobile:

Convert the board into a clean vertical experience.

For example:

TODAY

↓

Tasks

THIS WEEK

↓

Tasks

THIS MONTH

↓

Tasks

LATER

↓

Tasks

Do not force desktop columns onto mobile.

==================================================

26. NAVIGATION

==================================================

Keep navigation minimal.

Possible navigation:

Tethra logo

Board

Tasks

Completed

Then:

Settings

User/profile

Do NOT create 15 navigation items.

==================================================

27. SETTINGS

==================================================

Create a simple settings page.

Allow:

Name

Email

Founder/Manager email

Notification preferences

Theme

Default task priority

Default task timeframe

Potential:

Email notifications:

ON/OFF

Task completion notifications:

ON/OFF

Do not make settings overwhelming.

==================================================

28. DARK / LIGHT MODE

==================================================

Support:

Light

Dark

System

Use the Tethra brand palette appropriately in both modes.

The UI must remain readable and accessible.

==================================================

29. ACCESSIBILITY

==================================================

Make the application accessible.

Include:

- proper button labels

- keyboard navigation

- focus states

- semantic HTML

- accessible forms

- accessible modals

- alt text for images

- sufficient contrast

- reduced-motion support

Do not sacrifice accessibility for aesthetics.

==================================================

30. PERFORMANCE

==================================================

Tethra should feel extremely fast.

Optimise:

- images

- animations

- task lists

- database queries

- file uploads

- dashboard rendering

Do not run expensive animations unnecessarily.

For GradientWaves:

- pause when not visible if possible

- respect reduced-motion

- ensure mobile performance is acceptable

For ScrollExpand:

- respect reduced-motion

- prevent layout issues

- ensure mobile scrolling remains natural

==================================================

31. DATABASE ARCHITECTURE

==================================================

Keep the database clean and simple.

Suggested entities:

users/workspaces

projects

tasks

task_attachments

task_activity

email_notifications

settings

Potential task fields:

id

workspace_id

project_id

title

description

status

priority

target_type

due_date

estimated_effort

created_at

completed_at

Do not create unnecessary tables.

Use proper foreign keys.

Use timestamps.

Use secure access policies.

==================================================

32. SECURITY

==================================================

Implement proper security.

Especially for:

- task data

- user data

- email addresses

- attachments

- email notification configuration

Do not expose:

- API keys

- service-role keys

- email provider secrets

- private storage credentials

Never place sensitive credentials in frontend code.

Validate uploads.

Restrict file access to the appropriate workspace/user.

==================================================

33. EMPTY STATES

==================================================

Empty states should feel friendly.

Example:

No tasks yet.

Your board is empty.

What's the first thing you want to get done?

[ + Add Task ]

Another:

Nothing left to do.

Nice work. 🎉

==================================================

34. LANDING PAGE COPY

==================================================

Keep the copy simple.

Possible sections:

Hero:

TETHRA

Your work.

Your board.

Your focus.

"Target it. Prioritise it. Get it done."

CTA:

Open My Board

Then a very short section:

TARGET

Decide what matters.

DO

Focus on the work.

DONE

Mark it complete.

Then a visual section using ScrollExpand.

Then:

"Simple enough to use every day."

CTA:

Open Tethra

Do not create a huge landing page.

==================================================

35. VISUAL STYLE

==================================================

Tethra should look like a premium modern software product.

Think:

digital whiteboard

+

modern productivity tool

+

developer workspace

+

minimal notebook

Avoid:

- corporate dashboard overload

- excessive gradients

- excessive glassmorphism

- excessive rounded cards

- giant text everywhere

- unnecessary animations

- huge sidebars

- complicated charts

- fake statistics

- unnecessary AI features

The product should feel confident because it is simple.

==================================================

36. IMPORTANT — DO NOT OVERENGINEER

==================================================

This is extremely important.

DO NOT add features simply because other task-management applications have them.

Do NOT automatically add:

- Gantt charts

- calendars

- time tracking

- chat

- complex workflows

- OKRs

- complex reporting

- team permissions

- complicated role systems

- AI task generation

- complicated automation builders

- enterprise billing

- complex Kanban systems

unless explicitly requested later.

Build the foundation first.

==================================================

37. PERSONAL-FIRST BUT SHAREABLE

==================================================

Tethra is primarily my personal task manager.

However, the website can be shared publicly.

Someone else should be able to visit Tethra and create/use their own workspace.

The architecture should therefore support multiple independent users/workspaces without forcing the product to become a team collaboration platform.

==================================================

38. SAMPLE DATA / FIRST BOARD

==================================================

Use the following as example seed/demo content:

FUELLinkPro — WEEKEND BUILD BOARD

TARGET:

Stabilise → Automate → Scale

WEEKEND 1 — FOUNDATION

- Index FuelLinkPro on Google

- Set up Google Search Console

- Create/fix sitemap.xml

- Create/fix robots.txt

- Disable Premium features

- Add Premium feature flag

WEEKEND 2 — SECURITY

- Enhance failed-login security

- Enhance password-reset security

- Implement suspicious-account flagging

- Test authentication security

- Review session/security configuration

WEEKEND 3 — SYSTEM CONTROL

- Fix system_logs

- Record authentication events

- Record order events

- Record payment events

- Fix system_settings

- Move important settings into system_settings

The user should be able to use this as a real example of how Tethra works.

==================================================

39. LOGO + FAVICON

==================================================

Use the supplied Tethra logo asset throughout the project.

Create/configure:

favicon

Apple touch icon if appropriate

application icon

navbar logo

landing-page logo

Do not replace the supplied logo with text-only branding.

==================================================

40. TECHNICAL QUALITY

==================================================

Use clean modern React architecture.

Use reusable components.

Avoid giant monolithic components.

Suggested component structure:

components/

  tasks/

  board/

  dashboard/

  landing/

  ui/

  attachments/

  notifications/

Create reusable components for:

TaskCard

TaskCreator

BulkTaskCreator

TaskDetail

BoardSection

PriorityBadge

TimeframeSelector

AttachmentUploader

CompletionModal

NotificationStatus

ProjectSelector

==================================================

41. BUILD ORDER

==================================================

Build in this order:

PHASE 1

Landing page

Branding

Logo

Favicon

Responsive foundation

PHASE 2

User entry

Name/email

Workspace creation

Persistence

PHASE 3

Core task system

Create

Edit

Delete

Complete

PHASE 4

Whiteboard organisation

Today

This Week

This Month

Later

Backlog

Completed

PHASE 5

Priority + timeframe

High

Medium

Low

Today

Week

Weekend

Month

Custom

PHASE 6

Bulk task creation

Structured task import

PHASE 7

Attachments

PHASE 8

Projects/boards

PHASE 9

Completion history

PHASE 10

Founder/manager email notifications

PHASE 11

Settings

PHASE 12

Mobile optimisation

Accessibility

Performance

Testing

==================================================

42. TESTING REQUIREMENTS

==================================================

Before considering the project complete, test:

[ ] Landing page

[ ] Logo

[ ] Favicon

[ ] Mobile landing page

[ ] Desktop landing page

[ ] Name/email entry

[ ] Workspace creation

[ ] Task creation

[ ] Task editing

[ ] Task deletion

[ ] Task completion

[ ] Task reopening

[ ] Priority

[ ] Timeframe

[ ] Due dates

[ ] Bulk task creation

[ ] Structured task import

[ ] Attachments

[ ] Attachment security

[ ] Projects

[ ] Search

[ ] Filters

[ ] Completed history

[ ] Founder email notification

[ ] Email failure handling

[ ] Settings

[ ] Dark mode

[ ] Light mode

[ ] Mobile responsiveness

[ ] Tablet responsiveness

[ ] Desktop responsiveness

[ ] Reduced motion

[ ] Keyboard navigation

==================================================

43. FINAL DESIGN TEST

==================================================

After building the application, ask:

"Does this feel like a simple whiteboard?"

If the answer is no:

REMOVE complexity.

The user should be able to understand the application without a tutorial.

The primary interaction should always be obvious:

+ Add Task

Then:

Target it.

Prioritise it.

Do it.

Tick it.

Done.

==================================================

44. DO NOT MODIFY THE CORE CONCEPT

==================================================

Do not reinterpret Tethra into:

"another project management SaaS."

Tethra's identity is:

A personal digital whiteboard for organising the things I need to do.

Simple.

Focused.

Beautiful.

Fast.

==================================================

45. IMPORTANT IMPLEMENTATION INSTRUCTION

==================================================

Before writing large amounts of code:

1. Inspect the project structure.

2. Determine the existing framework and dependencies.

3. Determine whether Supabase is already configured.

4. Determine how assets are currently handled.

5. Add the supplied Tethra logo correctly.

6. Install only necessary dependencies.

7. Build incrementally.

8. Test after each major phase.

9. Do not overwrite existing working functionality unnecessarily.

10. Do not introduce unnecessary libraries.

For the supplied React Bits components, use the source provided in this request rather than creating unrelated approximations.

If a dependency is required, install it properly.

==================================================

FINAL PRODUCT VISION

==================================================

Tethra should feel like this:

I wake up.

I open Tethra.

I see:

TODAY

☐ Finish FuelLinkPro payment testing

☐ Review Skills Mapping UI

☐ Push Tethra changes

THIS WEEK

☐ Enhance driver dashboard

☐ Fix system logs

☐ Integrate SMS

THIS MONTH

☐ Launch new FuelLinkPro features

I finish something.

I click:

☑ DONE

Tethra tells me:

"Task completed."

My founder automatically receives:

"Thabang completed: Enhance Driver Dashboard."

Then I move on.

THAT is the experience.

Do not overcomplicate it.

Build Tethra as a beautiful, extremely simple, mobile-first digital whiteboard for getting work done.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e3e3b0bd-7ff2-497f-9a40-7b3f0724b7a0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
