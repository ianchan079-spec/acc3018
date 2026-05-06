# ACC3018 Color Scheme Handoff

Use this scheme for ACC3018-style teaching pages: clean academic layout, white content panels, strong SIT red accents, and restrained semantic colors.

## Core Palette

```js
const C = {
  red: '#E4002B',
  redDark: '#B5001F',
  redSubtle: '#FFF0F3',
  black: '#1D1D1B',
  black80: '#4A4A48',
  black60: '#767674',
  black20: '#D1D1D0',
  black10: '#E8E8E7',
  black05: '#F4F4F3',
  white: '#FFFFFF',
  green: '#1A7F4B',
  greenBg: '#E6F4ED',
  amber: '#E67700',
  amberBg: '#FFF8E6',
  gold: '#D4A017',
  goldBg: '#FDF5E0',
  blue: '#1A5FA0',
  blueBg: '#E6F0FB',
  purple: '#6F3FA7',
  purpleBg: '#F2EAF8',
};
```

## Usage Rules

### Page Structure

- Use `black` for hero/header sections and footer areas.
- Use `white` for main content panels.
- Use `black05` for quiet page-section backgrounds.
- Use `red` as the primary brand/action color.

### Content Panels

Main explanation panels should usually be white:

```css
background: #FFFFFF;
border: 1px solid #E8E8E7;
border-left: 4px solid accentColor;
border-radius: 8px;
```

Use the accent color only for:

- left border
- small heading/label
- selected button border/text
- important status text

Avoid large tinted content panels unless the whole section intentionally needs a soft background.

### Buttons and Interactive Panels

Selected concept buttons:

```css
background: subtleAccentBg;
border: 1px solid accentColor;
color: accentColor;
```

Unselected buttons:

```css
background: #FFFFFF;
border: 1px solid #D1D1D0;
color: #4A4A48;
```

### Semantic Colors

- `red`: primary brand, warnings, danger, main calls to action.
- `blue`: guidance, process, instructional checks.
- `green`: correct, completed, valid, success.
- `amber`: caution, interpretation notes, “be careful” moments.
- `purple`: measurement/error diagnosis or special recap sections.
- `gold`: gamification or achievement highlights.

### Code Blocks

Use dark code blocks:

```css
background: #1D1D1B;
color: #FFFFFF;
border-radius: 8px;
font-family: 'JetBrains Mono', monospace;
```

### Typography

- Headings: very bold, tight line-height.
- Body text: `black60` or `black80`, line-height around `1.6-1.7`.
- Small labels: uppercase, bold, letter-spaced, colored by section accent.

## Quick CSS Variables

```css
:root {
  --sit-red: #E4002B;
  --sit-red-dark: #B5001F;
  --sit-red-subtle: #FFF0F3;
  --sit-black: #1D1D1B;
  --sit-black-80: #4A4A48;
  --sit-black-60: #767674;
  --sit-black-20: #D1D1D0;
  --sit-black-10: #E8E8E7;
  --sit-black-05: #F4F4F3;
  --sit-white: #FFFFFF;
  --sit-green: #1A7F4B;
  --sit-green-bg: #E6F4ED;
  --sit-amber: #E67700;
  --sit-amber-bg: #FFF8E6;
  --sit-gold: #D4A017;
  --sit-gold-bg: #FDF5E0;
  --sit-blue: #1A5FA0;
  --sit-blue-bg: #E6F0FB;
  --sit-purple: #6F3FA7;
  --sit-purple-bg: #F2EAF8;
}
```
