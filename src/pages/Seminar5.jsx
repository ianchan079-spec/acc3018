import { useState } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Li, Num, NextBtn, GamifiedQuiz, Formula, TopNav, ProgressWidget,
} from '../shared/components';

const TABS = [
  { id: 's5:overview', label: 'Overview' },
  { id: 's5:stata', label: 'Stata Basics' },
  { id: 's5:inspect', label: 'Inspect Data' },
  { id: 's5:variables', label: 'Variables' },
  { id: 's5:models', label: 'Models' },
  { id: 's5:robustness', label: 'Robustness' },
  { id: 's5:activity', label: 'Activity' },
];

const text = { fontSize: 13, color: C.black80, lineHeight: 1.6 };

function Code({ children }) {
  return <pre style={{ margin: '10px 0', padding: '14px 16px', borderRadius: 8, background: C.black, color: C.white, overflowX: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.65 }}>{children}</pre>;
}

function Grid({ items, color = C.red }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12 }}>
    {items.map((it, i) => <Card key={i} style={{ borderTop: `3px solid ${it.color || color}` }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: it.color || color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{it.k}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 5 }}>{it.t}</div>
      <div style={text}>{it.d}</div>
    </Card>)}
  </div>;
}

function OverviewTab({ next }) {
  const { completeTab } = useGame();
  return <div>
    <div style={{ background: C.black, minHeight: '52vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 56 }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 420, height: 420, background: C.red, borderRadius: '0 0 0 100%', opacity: 0.08 }} />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, height: 4, background: C.red }} />
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '44px 36px', width: '100%', position: 'relative' }}>
        <Reveal>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 14 }}>ACC3018 · Seminar 5</div>
          <h1 style={{ fontSize: 'clamp(32px,5.5vw,60px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', color: C.white, marginBottom: 14 }}>Stata, Results Tables<br />and Robustness Checks</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 600, lineHeight: 1.6 }}>From Stata basics to summary statistics, correlations, fixed-effect regressions, subsample analysis and event-study logic.</p>
        </Reveal>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>Roadmap</Label><H size={30}>What Seminar 5 adds</H><P>Seminar 4 built the dataset. Seminar 5 shows students how to inspect it, transform variables, run regression models, export results and test whether findings survive alternative samples or events.</P></Reveal>
      <Reveal delay={0.06}><Grid items={[
        { k: '01', t: 'Operate Stata', d: 'Command window, variables window, properties window, do-file editor and data browser.' },
        { k: '02', t: 'Inspect data', d: 'Use summarize, detail, tabulate and two-way tabulations to understand variables and spot coding issues.' },
        { k: '03', t: 'Create variables', d: 'Use replace, gen and egen to handle missing values, dummies, row means, fixed-effect groups and controls.' },
        { k: '04', t: 'Run models', d: 'Use areg, store estimates and export tables using esttab.' },
        { k: '05', t: 'Test robustness', d: 'Use subsamples and event-study interactions to see whether results are concentrated in groups or periods.' },
      ]} /></Reveal>
      <NextBtn onClick={() => { completeTab('s5:overview', 20); next(); }} label="Start Stata basics ->" />
    </Wrap>
  </div>;
}

function StataBasicsTab({ next }) {
  const { completeTab } = useGame();
  const [active, setActive] = useState('command');
  const panels = {
    command: ['Command window', 'Students can type commands directly here. This is useful for quick checks, but do-files are better for reproducible research.'],
    variables: ['Variables window', 'Clicking a variable shows its description; double-clicking can insert the variable name into the command window.'],
    properties: ['Properties window', 'Shows information about the selected variable and the dataset, helping students understand labels, storage type and metadata.'],
    dofile: ['Do-file editor', 'A specialised text editor for Stata scripts. Commands appear in blue; comments usually begin with * and are not executed.'],
    import: ['Import and browse', 'Use File -> Import for files, then browse the loaded dataset to inspect rows and variable types. Numeric, string and labelled variables appear differently.'],
  };
  const qs = [
    { id: 'st1', q: 'Why use a do-file instead of only typing commands interactively?', opts: ['It makes analysis reproducible', 'It prevents all errors', 'It removes missing values', 'It changes strings to numbers'], c: 0, ex: 'A do-file records the exact commands, making the analysis easier to rerun and check.' },
    { id: 'st2', q: 'What does browse do?', opts: ['Runs regression', 'Opens the data like a spreadsheet', 'Exports a table', 'Creates a dummy'], c: 1, ex: 'browse lets students view the dataset row by row.' },
    { id: 'st3', q: 'What are comments for in a do-file?', opts: ['They are executed first', 'They explain code without being executed', 'They delete variables', 'They replace commands'], c: 1, ex: 'Comments document the code and make the research workflow easier to understand.' },
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Introduction to Stata</Label><H>Use the Interface Without Losing Reproducibility</H><P>The early slides introduce the Command window, Variables window, Properties window, do-file editor, import tools and browser. The key message is simple: use the interface to learn, but use do-files to preserve the research workflow.</P></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {Object.entries(panels).map(([k, p]) => <button key={k} onClick={() => setActive(k)} style={{ padding: '8px 12px', border: `1px solid ${active === k ? C.red : C.black20}`, background: active === k ? C.redSubtle : C.white, color: active === k ? C.red : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, cursor: 'pointer' }}>{p[0]}</button>)}
        </div>
        <div style={{ padding: 14, background: C.redSubtle, borderLeft: `4px solid ${C.red}`, borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.black, marginBottom: 4 }}>{panels[active][0]}</div>
          <div style={text}>{panels[active][1]}</div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Teaching note:</strong> students often focus on clicking the right menu. Push them one step further: every important action should become a line in a do-file.</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>Stata Basics Quiz</H></Reveal>
      <GamifiedQuiz quizId="s5:stata" questions={qs} xpPerQ={10} perfectBonus={15} badgeOnPerfect="stata-starter" />
      <NextBtn onClick={() => { completeTab('s5:stata'); next(); }} label="Continue to inspecting data ->" />
    </Wrap>
  </div>;
}

function InspectDataTab({ next }) {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const [cmd, setCmd] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tasks = [
    { id: 'mean', q: 'You need mean, standard deviation, min and max for read and math.', opts: ['summarize read math', 'tab read math', 'replace read math'], c: 0, explain: 'summarize gives Obs, Mean, Std. Dev., Min and Max.' },
    { id: 'detail', q: 'You need percentiles, variance, skewness and kurtosis.', opts: ['summarize read, detail', 'browse detail', 'tab read, detail'], c: 0, explain: 'The detail option expands summarize into distribution diagnostics.' },
    { id: 'cat', q: 'You need counts and percentages for SES.', opts: ['tabulate ses', 'summarize ses, detail', 'areg ses'], c: 0, explain: 'tabulate is designed for categorical frequency tables.' },
    { id: 'twoway', q: 'You need race by SES with row percentages.', opts: ['tab race ses, row', 'sum race ses', 'replace race ses'], c: 0, explain: 'Two-way tabulations show joint frequencies and row percentages.' },
  ];
  const score = tasks.filter(t => cmd[t.id] === t.c).length;
  const submit = () => { setSubmitted(true); awardXpOnce('activity:s5:command-match', score * 8 + (score === tasks.length ? 20 : 0), `${score}/${tasks.length} Stata commands`, { allowImprovement: true }); if (score === tasks.length) awardBadge('output-reader'); };
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Inspecting data</Label><H>Summary Statistics, Frequencies and Data Checks</H><P>The slides show summarize, detailed summaries, one-way tabulations and two-way tabulations. These are the first checks before any regression table is worth reading.</P></Reveal>
      <Reveal delay={0.05}><Grid color={C.blue} items={[
        { k: 'summarize', t: 'Continuous variables', d: 'Reports observations, mean, standard deviation, minimum and maximum.' },
        { k: 'detail', t: 'Distribution shape', d: 'Adds percentiles, median, variance, skewness and kurtosis.' },
        { k: 'tabulate', t: 'Categorical variables', d: 'Displays counts, percentages and cumulative percentages.' },
        { k: 'row / col', t: 'Two-way tables', d: 'Shows how categories overlap, useful for spotting suspicious values such as a race code of 5.' },
      ]} /></Reveal>
      <Reveal delay={0.1}><Callout><strong>Research habit:</strong> never move straight to regression. First ask: how many observations do I have, what is missing, are categories coded correctly, and do the distributions make sense?</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Interactive</Label><H size={28}>Choose the Stata Command</H></Reveal>
      <Reveal delay={0.05}><Card>
        {tasks.map((t, i) => <div key={t.id} style={{ borderTop: i ? `1px solid ${C.black10}` : 'none', paddingTop: i ? 14 : 0, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 8 }}>{t.q}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 8 }}>{t.opts.map((o, oi) => <button key={o} onClick={() => !submitted && setCmd(v => ({ ...v, [t.id]: oi }))} style={{ padding: '9px 12px', border: `1.5px solid ${submitted && oi === t.c ? C.green : cmd[t.id] === oi ? C.blue : C.black20}`, background: submitted && oi === t.c ? C.greenBg : cmd[t.id] === oi ? C.blueBg : C.white, color: submitted && oi === t.c ? C.green : cmd[t.id] === oi ? C.blue : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, cursor: submitted ? 'default' : 'pointer', textAlign: 'left' }}>{o}</button>)}</div>
          {submitted && <div style={{ ...text, marginTop: 7 }}>{t.explain}</div>}
        </div>)}
        {!submitted ? <Btn onClick={submit} disabled={Object.keys(cmd).length < tasks.length}>Check commands</Btn> : <P mb={0} color={score === tasks.length ? C.green : C.amber}>{score}/{tasks.length} correct</P>}
      </Card></Reveal>
      <NextBtn onClick={() => { completeTab('s5:inspect'); next(); }} label="Continue to creating variables ->" />
    </Wrap>
  </div>;
}

function VariablesTab({ next }) {
  const { completeTab } = useGame();
  const qs = [
    { id: 'v1', q: 'What does replace do?', opts: ['Creates a new dataset', 'Changes values in an existing variable', 'Runs a regression', 'Exports a table'], c: 1, ex: 'replace modifies an existing variable, usually with an if condition.' },
    { id: 'v2', q: 'What does a 0/1 dummy variable represent?', opts: ['A category membership indicator', 'A missing value only', 'A command error', 'A table heading'], c: 0, ex: 'A dummy equals 1 when the observation belongs to the category, and 0 otherwise.' },
    { id: 'v3', q: 'Why use egen rowmean?', opts: ['To average across variables while handling missing values sensibly', 'To delete rows', 'To estimate fixed effects', 'To import data'], c: 0, ex: 'egen has extended functions such as rowmean, group and median.' },
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Creating variables</Label><H>From Raw Columns to Analysis Variables</H><P>The middle slides cover replacing values, dummy indicators and egen. These are small commands, but they define the variables that later appear in regression tables.</P></Reveal>
      <Reveal delay={0.05}><div style={{ display: 'grid', gap: 12 }}>
        <Card><P color={C.black} mb={6}><strong>Replacing values with conditions</strong></P><Code>{`replace total = math + science if science == .`}</Code><div style={text}>Use with care: a bad condition can overwrite valid data. Always summarize before and after.</div></Card>
        <Card><P color={C.black} mb={6}><strong>Creating a dummy variable</strong></P><Code>{`gen academic = 0
replace academic = 1 if prgtype == "academic"
tab prgtype academic`}</Code><div style={text}>A dummy variable turns a category into a numeric indicator that regression commands can use.</div></Card>
        <Card><P color={C.black} mb={6}><strong>Using egen for extended operations</strong></P><Code>{`egen meantest = rowmean(read math science socst)
egen long FE2 = group(industry fyear)
bysort FE2: egen size_median = median(Size)`}</Code><div style={text}>egen handles grouped or extended calculations that are awkward with simple generate.</div></Card>
      </div></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>Variable Construction Quiz</H></Reveal>
      <GamifiedQuiz quizId="s5:variables" questions={qs} xpPerQ={10} perfectBonus={15} badgeOnPerfect="variable-builder" />
      <NextBtn onClick={() => { completeTab('s5:variables'); next(); }} label="Continue to models ->" />
    </Wrap>
  </div>;
}

function ModelsTab({ next }) {
  const { completeTab } = useGame();
  const [model, setModel] = useState('d3');
  const models = {
    d1: ['d1', 'Profit1 on Profit, industry FE', 'A simple persistence model: does current profitability predict future profitability after absorbing industry differences?'],
    d3: ['d3', 'Profit1 on Profit, Lev, Size, Cash, industry FE', 'Adds controls so the Profit coefficient is interpreted net of leverage, size and cash.'],
    d6: ['d6', 'Profit1 on Lev, Size, Cash, year FE', 'Focuses on controls and absorbs time shocks common to all firms.'],
    d9: ['d9', 'Profit1 on Profit, controls, industry-year FE', 'The fuller model absorbs joint industry-year shocks, making comparison within the same industry-year cell.'],
  };
  const qs = [
    { id: 'm1', q: 'What does areg Profit1 Profit, a(industry) do?', opts: ['Runs Profit1 on Profit with absorbed industry fixed effects', 'Creates industry codes', 'Exports a CSV only', 'Runs a logit'], c: 0, ex: 'areg estimates a linear regression while absorbing the fixed effect listed in a().' },
    { id: 'm2', q: 'Why store estimates with est store d1?', opts: ['To compare/export models later', 'To remove outliers', 'To browse data', 'To make strings numeric'], c: 0, ex: 'Stored estimates can be combined in esttab output.' },
    { id: 'm3', q: 'What does ar2 in esttab usually request?', opts: ['Adjusted R-squared', 'Two-stage least squares', 'A second table', 'A robust event dummy'], c: 0, ex: 'ar2 reports adjusted R-squared in the exported table.' },
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Main regression</Label><H>Building Results Tables Model by Model</H><P>The slides move from summary and correlation work to nine regression models. The important idea is not that students memorise d1 to d9; it is that each column answers a slightly different specification question.</P></Reveal>
      <Reveal delay={0.05}><Card style={{ marginBottom: 14 }}>
        <P color={C.black} mb={6}><strong>Core Stata pattern</strong></P>
        <Code>{`areg Profit1 Profit, a(industry)
est store d1
areg Profit1 Lev Size Cash, a(industry)
est store d2
areg Profit1 Profit Lev Size Cash, a(industry)
est store d3

esttab d1 d2 d3 using maintable.csv, nogaps replace t b(3) ar2 star(* 0.10 ** 0.05 *** 0.01)`}</Code>
        <div style={text}>The workflow is: run a model, store it, run the next model, then export the group as a table.</div>
      </Card></Reveal>
      <Reveal delay={0.1}><Card>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>{Object.keys(models).map(k => <button key={k} onClick={() => setModel(k)} style={{ padding: '8px 12px', border: `1px solid ${model === k ? C.red : C.black20}`, background: model === k ? C.redSubtle : C.white, color: model === k ? C.red : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, cursor: 'pointer' }}>{k}</button>)}</div>
        <div style={{ padding: 14, background: C.redSubtle, borderLeft: `4px solid ${C.red}`, borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.black, marginBottom: 4 }}>{models[model][1]}</div>
          <div style={text}>{models[model][2]}</div>
        </div>
      </Card></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>Regression Table Quiz</H></Reveal>
      <GamifiedQuiz quizId="s5:models" questions={qs} xpPerQ={10} perfectBonus={20} badgeOnPerfect="table-builder" />
      <NextBtn onClick={() => { completeTab('s5:models'); next(); }} label="Continue to robustness ->" />
    </Wrap>
  </div>;
}

function RobustnessTab({ next }) {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const [pick, setPick] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const checks = [
    { id: 'small', q: 'You split firms by median Size within FE2. What question are you asking?', opts: ['Do results differ for small vs large firms?', 'Are all firms missing size?', 'Can we remove year effects?'], c: 0 },
    { id: 'risk', q: 'You split firms by median leverage. What is this testing?', opts: ['Heterogeneity by risk/financial structure', 'Whether Stata can import data', 'Whether SIC is a string'], c: 0 },
    { id: 'event', q: 'You create COVID and ProfitxCOVID. What is the interaction for?', opts: ['To see whether the Profit effect changes during the event period', 'To delete COVID years', 'To create a ticker'], c: 0 },
  ];
  const score = checks.filter(c => pick[c.id] === c.c).length;
  const submit = () => { setSubmitted(true); awardXpOnce('activity:s5:robustness-check', score * 10 + (score === checks.length ? 20 : 0), `${score}/${checks.length} robustness decisions`, { allowImprovement: true }); if (score === checks.length) awardBadge('robustness-auditor'); };
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Robustness</Label><H>Subsamples and Event Studies</H><P>The final modelling slides ask whether results survive different groups and periods. This is where students move from "I ran a regression" to "I tested whether my result is stable."</P></Reveal>
      <Reveal delay={0.05}><Grid color={C.amber} items={[
        { k: 'Subsample by size', t: 'Small vs large firms', d: 'Create a median split within FE2, then rerun the same models for each group.' },
        { k: 'Subsample by risk', t: 'Risky vs less risky firms', d: 'Use leverage median splits to see whether relationships differ by financial structure.' },
        { k: 'Event study', t: 'COVID or GFC period', d: 'Create an event dummy and interaction to test whether the main relationship changes during the event.' },
      ]} /></Reveal>
      <Reveal delay={0.1}><Card>
        <P color={C.black} mb={6}><strong>Event-study pattern from the slides</strong></P>
        <Code>{`gen COVID = 0
replace COVID = 1 if fyear > 2019 & fyear < 2022
gen ProfitxCOVID = Profit * COVID
areg Profit1 Profit COVID ProfitxCOVID, a(FE2)`}</Code>
        <div style={text}>The coefficient on ProfitxCOVID tells students whether the Profit-to-future-Profit relationship is different during the COVID period.</div>
      </Card></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Interactive</Label><H size={28}>Robustness Decision Check</H></Reveal>
      <Reveal delay={0.05}><Card>
        {checks.map((c, i) => <div key={c.id} style={{ borderTop: i ? `1px solid ${C.black10}` : 'none', paddingTop: i ? 14 : 0, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 8 }}>{c.q}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 8 }}>{c.opts.map((o, oi) => <button key={o} onClick={() => !submitted && setPick(v => ({ ...v, [c.id]: oi }))} style={{ padding: '9px 12px', border: `1.5px solid ${submitted && oi === c.c ? C.green : pick[c.id] === oi ? C.amber : C.black20}`, background: submitted && oi === c.c ? C.greenBg : pick[c.id] === oi ? C.amberBg : C.white, color: submitted && oi === c.c ? C.green : pick[c.id] === oi ? C.amber : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, cursor: submitted ? 'default' : 'pointer', textAlign: 'left' }}>{o}</button>)}</div>
        </div>)}
        {!submitted ? <Btn onClick={submit} disabled={Object.keys(pick).length < checks.length}>Check decisions</Btn> : <P mb={0} color={score === checks.length ? C.green : C.amber}>{score}/{checks.length} correct</P>}
      </Card></Reveal>
      <NextBtn onClick={() => { completeTab('s5:robustness'); next(); }} label="Continue to Seminar 5 activity ->" />
    </Wrap>
  </div>;
}

function ActivityTab() {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);
  const tasks = [
    'Save your prepared data as a .dta file.',
    'Produce summary statistics for the main variables.',
    'Produce a correlation matrix for the main variables.',
    'Run at least three regression models.',
    'Run the same three models for at least one subsample split.',
    'Identify one event such as COVID or the GFC.',
    'Create the event dummy and interaction term.',
    'Export the main, subsample and event-study tables.',
  ];
  const count = Object.values(checked).filter(Boolean).length;
  const finish = () => { setDone(true); completeTab('s5:activity', 25); awardXpOnce('activity:s5:stata-output-plan', count * 8 + (count === tasks.length ? 30 : 0), `${count}/${tasks.length} Seminar 5 activity`, { allowImprovement: true }); if (count === tasks.length) awardBadge('s5-completionist'); };
  return <div style={{ paddingTop: 56 }}>
    <DarkWrap>
      <Reveal><Label>Seminar activity</Label><H color={C.white}>From Dataset to Results Package</H><P color="rgba(255,255,255,0.55)">This activity follows the final slide: summary statistics, correlation matrix, regression models, subsample analysis and an event study.</P></Reveal>
    </DarkWrap>
    <Wrap bg={C.black05}>
      <Reveal><Card>
        <P color={C.black} mb={12}><strong>Output checklist</strong></P>
        {tasks.map((t, i) => <label key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderTop: i ? `1px solid ${C.black10}` : 'none', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!checked[i]} onChange={e => setChecked(v => ({ ...v, [i]: e.target.checked }))} style={{ marginTop: 4 }} />
          <span style={text}>{t}</span>
        </label>)}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <Btn onClick={finish}>Submit checklist</Btn>
          <div style={{ fontSize: 14, color: C.black60 }}>{count}/{tasks.length} complete</div>
        </div>
        {done && <Callout accent={count === tasks.length ? C.green : C.amber} bg={count === tasks.length ? C.greenBg : C.amberBg}><strong>{count === tasks.length ? 'Seminar 5 complete.' : 'Progress saved.'}</strong> Students should now have the core outputs needed for an empirical results section.</Callout>}
      </Card></Reveal>
    </Wrap>
    <footer style={{ background: C.black, padding: '28px 0', borderTop: `4px solid ${C.red}` }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: C.red }}>SIT</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ACC3018 · Seminar 5 · AY2024/25 T3</span>
      </div>
    </footer>
  </div>;
}

export default function Seminar5() {
  const [tab, setTab] = useState('s5:overview');
  const idx = TABS.findIndex(t => t.id === tab);
  const nextTab = () => setTab(TABS[Math.min(idx + 1, TABS.length - 1)].id);
  return <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", minHeight: '100vh', background: C.white }}>
    <GlobalStyles />
    <TopNav tabs={TABS} activeTab={tab} setActiveTab={setTab} />
    <ProgressWidget tabs={TABS} />
    {tab === 's5:overview' && <OverviewTab next={nextTab} />}
    {tab === 's5:stata' && <StataBasicsTab next={nextTab} />}
    {tab === 's5:inspect' && <InspectDataTab next={nextTab} />}
    {tab === 's5:variables' && <VariablesTab next={nextTab} />}
    {tab === 's5:models' && <ModelsTab next={nextTab} />}
    {tab === 's5:robustness' && <RobustnessTab next={nextTab} />}
    {tab === 's5:activity' && <ActivityTab />}
  </div>;
}
