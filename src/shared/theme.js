// ═══════════════════════════════════════════════════════════════
// THEME — SIT Design System colors and constants
// ═══════════════════════════════════════════════════════════════

export const C = {
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
};

export const BADGES = {
  'first-step':       { name: 'First Step',          desc: 'Complete the Overview section',          icon: '✦' },
  'research-ready':   { name: 'Research Ready',      desc: 'Perfect score on Basic vs Applied',      icon: '◆' },
  'lit-scholar':      { name: 'Literature Scholar',  desc: 'Complete the Literature Review tab',     icon: '❖' },
  'hypothesis-smith': { name: 'Hypothesis Smith',    desc: 'Build your first valid hypothesis',      icon: '⬢' },
  'path-chooser':     { name: 'Path Chooser',        desc: 'Complete the PhD Journey scenario',      icon: '◈' },
  'sharp-reviewer':   { name: 'Sharp Reviewer',      desc: 'Spot all flaws in Peer Reviewer mode',   icon: '◉' },
  'roychowdhury':     { name: 'Roychowdhury Expert', desc: 'Perfect score on Activity 1 quiz',       icon: '★' },
  'streak-5':         { name: 'On Fire',             desc: 'Answer 5 questions correctly in a row',  icon: '▲' },
  'completionist':    { name: 'Completionist',       desc: 'Finish every tab in Seminar 1',          icon: '◎' },
  // Seminar 2 badges
  'stats-savvy':      { name: 'Stats Savvy',         desc: 'Complete Summary Statistics tab',        icon: '◇' },
  'regression-ready': { name: 'Regression Ready',    desc: 'Build a valid regression model',         icon: '⬡' },
  'causal-thinker':   { name: 'Causal Thinker',      desc: 'Complete the ID Strategy scenario',      icon: '◆' },
  'data-typist':      { name: 'Data Typist',         desc: 'Perfect on Match the Data Type',         icon: '▣' },
  'methods-master':   { name: 'Methods Master',      desc: 'Perfect on Seminar 2 final quiz',       icon: '◙' },
  's2-completionist': { name: 'S2 Complete',         desc: 'Finish every tab in Seminar 2',          icon: '✪' },
  // Seminar 3 badges
  'orthogonalist':    { name: 'Orthogonalist',       desc: 'Master the orthogonality assumption',    icon: '⟂' },
  'bias-detective':   { name: 'Bias Detective',      desc: 'Identify all sources of endogeneity',    icon: '◈' },
  'omitted-spotter':  { name: 'Omitted Spotter',     desc: 'Perfect on Omitted Variables quiz',      icon: '◈' },
  'iv-architect':     { name: 'IV Architect',        desc: 'Build a valid 2SLS strategy',            icon: '▣' },
  'instrument-judge': { name: 'Instrument Judge',    desc: 'Perfect on Valid Instrument quiz',       icon: '◈' },
  'endogeneity-ace':  { name: 'Endogeneity Ace',     desc: 'Perfect on Seminar 3 final quiz',        icon: '◉' },
  's3-completionist': { name: 'S3 Complete',         desc: 'Finish every tab in Seminar 3',          icon: '✪' },
};

export const LEVELS = [
  { lvl: 1, min: 0,    name: 'Inquirer' },
  { lvl: 2, min: 100,  name: 'Observer' },
  { lvl: 3, min: 250,  name: 'Analyst' },
  { lvl: 4, min: 450,  name: 'Researcher' },
  { lvl: 5, min: 700,  name: 'Scholar' },
  { lvl: 6, min: 1000, name: 'Principal Investigator' },
];

export function levelFromXp(xp) {
  let curr = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) curr = l;
  const next = LEVELS.find(l => l.min > xp);
  return { ...curr, nextMin: next ? next.min : curr.min, isMax: !next };
}

export const DEFAULT_PROGRESS = {
  schemaVersion: 2,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  completedTabs: {},
  completedQuizzes: {},
  firstTryCorrect: {},
  xpAwards: {},
  badges: {},
  scenarios: {},
  hypothesisBuilt: {},
  regressionBuilt: {},
  ivBuilt: {},
  seminar: 1,
  lastSeen: 0,
};

export const DEFAULT_IDENTITY = { name: '', studentId: '', hashedId: '', consentedAt: 0 };
