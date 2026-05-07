# ACC3018 Site Layout Handoff

Use this guide when asking another session/project to match the ACC3018 teaching-site layout and interaction style.

## Overall Feel

The site is an undergraduate teaching tool, not a marketing site.

It should feel:

- structured
- calm
- academic
- interactive in small, purposeful ways
- concept-first, activity-second

Avoid:

- landing-page hero marketing language
- decorative cards without purpose
- dumping commands before explaining why they matter
- dense static grids when the content has multiple parts students should inspect one at a time

## Page Shell

Each seminar uses:

- fixed dark top tab navigation
- full-width hero or section bands
- centered content column
- progress widget
- footer

Recommended content width:

```css
max-width: 840px;
margin: 0 auto;
padding: 0 36px;
```

Top padding should account for the fixed nav:

```css
padding-top: 56px;
```

## Section Rhythm

Use section wrappers rather than floating page cards.

Common section styles:

```jsx
<Wrap>...</Wrap>              // white section
<Wrap bg={C.black05}>...</Wrap> // quiet grey section
<DarkWrap>...</DarkWrap>      // dark teaching/activity section
```

Typical vertical padding:

```css
padding: 56px 0;  /* compact */
padding: 64px 0;  /* standard */
```

## Hero Pattern

Seminar heroes use:

- dark background
- SIT red accent line/shape
- seminar label
- large bold H1
- short descriptive paragraph

Hero text should be direct:

```text
ACC3018 · Seminar 5
Stata, Results Tables and Robustness Checks
From Stata basics to summary statistics, correlations...
```

Do not use feature cards inside the hero.

## Typography

Use compact, high-contrast hierarchy:

- labels: small, uppercase, bold, letter-spaced
- headings: large, black, very bold
- body copy: 15-16px, relaxed line-height
- explanations: simple language for undergraduates

Heading style:

```css
font-weight: 900;
line-height: 1.08;
letter-spacing: -0.02em;
```

Body style:

```css
font-size: 16px;
line-height: 1.7;
color: C.black60;
```

## Teaching Flow

Each tab should usually follow this order:

1. Concept explanation
2. Plain-English translation
3. Example or worked case
4. Interactive check/activity
5. Continue button

Good pattern:

```text
What is the concept?
Why does it matter?
How does it appear in accounting/finance research?
Now try applying it.
```

Avoid starting a tab with a quiz, command list, or activity unless students already have the conceptual frame.

## Cards and Panels

Use cards for:

- individual repeated items
- quizzes
- interactive panels
- worked examples
- compact teaching blocks

Do not nest cards inside cards.

Main explanatory panels should be white with colored accent borders:

```css
background: C.white;
border: 1px solid C.black10;
border-left: 4px solid accentColor;
border-radius: 8px;
padding: 14px 16px;
```

Use tinted backgrounds sparingly for:

- selected buttons
- whole section backgrounds
- success/error quiz states
- small inner note boxes

## Clickable Concept Panels

When a concept has multiple parts, prefer clickable buttons plus one attached panel.

Use this for:

- logic chains
- process stages
- model components
- result interpretation
- command families
- common mistakes

Pattern:

```jsx
buttons: flex-wrap row
selected button: subtle accent background
content panel: white background + accent border-left
```

The panel should include:

- title
- guiding question
- short explanation
- example or student check

Example structure:

```text
Direction
Does the coefficient point the right way?
Start with the sign. If the hypothesis predicts...
Example: If H1 predicts ESG improves ROA...
```

## Command and Code Blocks

Commands should be taught as answers to student questions.

Use this framing:

```text
Student question: Do the merge keys match the unit and time period?
Commands: duplicates report, isid, merge, tab _merge
Why: A merge is not automatically correct because Stata runs it.
```

Code blocks should be dark:

```css
background: C.black;
color: C.white;
border-radius: 8px;
font-family: 'JetBrains Mono', monospace;
font-size: 12.5px;
line-height: 1.65;
```

## Interactive Activities

Interactions should be small and educational, not decorative.

Good interactions:

- click a concept to reveal explanation
- choose the right variable/command/model
- classify examples
- build a hypothesis/regression/IV strategy step by step
- inspect a mock Stata interface

Each interaction should make students practise a concept already explained above it.

## Quiz Placement

Place quizzes after explanation.

Quiz section label examples:

```text
Check
Now test yourself
Interactive
Apply what you learned
```

Do not let the quiz be the first teaching moment.

## Navigation

Tabs are seminar-local and fixed at the top.

Use short labels:

```text
Overview
Research
Process
Ideas
Lit Review
Hypotheses
Design
Results
Activity
```

Continue buttons should be explicit:

```text
Continue to Stata workflow ->
Now Apply: Build a Regression ->
Start In-Class Activities ->
```

## Tone

Use simple undergraduate-facing language.

Prefer:

```text
The coefficient mixes the effect of X with the effect of the missing factor.
```

Avoid:

```text
The estimator suffers from asymptotic inconsistency under violations of strict exogeneity.
```

Technical terms are fine, but define them immediately in plain English.

## Quick Prompt for Another Session

```text
Follow the ACC3018 teaching-site layout:
- fixed dark top tab nav
- centered 840px content column
- full-width section bands using white, black05, or dark wraps
- dark hero with SIT red accent
- concept-first, activity-second teaching flow
- white content panels with colored left accents
- clickable button + attached explanation panel for multi-part concepts
- dark code blocks for Stata/R/Python commands
- quizzes only after explanation
- simple undergraduate-friendly wording
- preserve progress IDs and existing gamification patterns
```
