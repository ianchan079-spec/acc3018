import { useState } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Li, Num, NextBtn, GamifiedQuiz, Formula, TopNav, ProgressWidget,
} from '../shared/components';

const TABS = [
  { id: 's4:overview', label: 'Overview' },
  { id: 's4:databases', label: 'Databases' },
  { id: 's4:identifiers', label: 'Identifiers' },
  { id: 's4:r-clean', label: 'R Workflow' },
  { id: 's4:sentiment', label: 'Sentiment' },
  { id: 's4:iv-cases', label: 'IV Cases' },
  { id: 's4:activity', label: 'Activity' },
];

const small = { fontSize: 13, color: C.black80, lineHeight: 1.6 };

function Pill({ children, color = C.red }) {
  return <span style={{ display: 'inline-block', padding: '4px 9px', borderRadius: 999, border: `1px solid ${color}`, color, fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{children}</span>;
}

function Code({ children }) {
  return <pre style={{ margin: '10px 0', padding: '14px 16px', borderRadius: 8, background: C.black, color: C.white, overflowX: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.65 }}>{children}</pre>;
}

function InfoGrid({ items, color = C.red }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12 }}>
    {items.map((it, i) => <Card key={i} style={{ borderTop: `3px solid ${it.color || color}` }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: it.color || color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{it.k}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 5 }}>{it.t}</div>
      <div style={small}>{it.d}</div>
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
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 14 }}>ACC3018 · Seminar 4</div>
          <h1 style={{ fontSize: 'clamp(32px,5.5vw,60px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', color: C.white, marginBottom: 14 }}>Data Acquisition<br />and Applied R Workflows</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 590, lineHeight: 1.6 }}>From WRDS, CRSP, Compustat and ESG data to cleaned panels, merged identifiers, sentiment measures, and applied IV cases.</p>
        </Reveal>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>Roadmap</Label><H size={30}>What this seminar builds</H><P>This session turns the methods from Seminars 2 and 3 into a practical data workflow: where data come from, how identifiers work, how to clean and merge panels, and how IV logic appears in real R examples.</P></Reveal>
      <Reveal delay={0.06}><InfoGrid items={[
        { k: '01', t: 'Find data', d: 'WRDS, CRSP, Compustat, LSEG ESG, World Bank, SingStat, URA and Bloomberg.' },
        { k: '02', t: 'Respect identifiers', d: 'Why PERMNO, PERMCO, GVKEY and IID are safer than tickers or company names.' },
        { k: '03', t: 'Clean and merge', d: 'Drop unsuitable observations, check duplicates, create panels, and merge by stable keys.' },
        { k: '04', t: 'Apply methods', d: 'Use gapminder, cigarette taxes, and schooling examples to connect data work to causal analysis.' },
      ]} /></Reveal>
      <Reveal delay={0.12}><Callout accent={C.amber} bg={C.amberBg}><strong>Student goal:</strong> by the end, students should be able to explain not just what code to run, but why each data decision matters for the credibility of a research design.</Callout></Reveal>
      <NextBtn onClick={() => { completeTab('s4:overview', 20); next(); }} label="Start with data sources ->" />
    </Wrap>
  </div>;
}

function DatabasesTab({ next }) {
  const { completeTab } = useGame();
  const [step, setStep] = useState(null);
  const qs = [
    { id: 'db1', q: 'Which database is the main source for U.S. daily and monthly stock returns and prices?', opts: ['Compustat', 'CRSP', 'World Bank', 'SingStat'], c: 1, ex: 'CRSP is the core source for historical U.S. security prices, returns, delisting returns, splits and distributions.' },
    { id: 'db2', q: 'Which source is most natural for accounting fundamentals such as assets, income and cash flow items?', opts: ['CRSP', 'Compustat', 'URA', 'Gapminder'], c: 1, ex: 'Compustat contains firm fundamentals from statements, including annual and quarterly accounting data.' },
    { id: 'db3', q: 'Why should a researcher care about inactive firms in databases?', opts: ['They make the file smaller', 'They reduce survivorship bias', 'They remove missing data', 'They replace identifiers'], c: 1, ex: 'Keeping delisted or inactive firms helps avoid a sample that only contains survivors.' },
  ];
  const steps = [
    ['Home page', 'Open WRDS, review subscriptions, locate CRSP, then enter the CRSP dataset.'],
    ['Stock/Security files', 'Choose Stock/Security Files, then the monthly stock file for a monthly price exercise.'],
    ['Date range', 'Enter the sample window, such as 2020-01 to 2020-12.'],
    ['Company input', 'Enter ticker symbols such as IBM, AMZN and WMT, making sure ticker is selected.'],
    ['Variables', 'Select Ticker and Price for a simple first query.'],
    ['Output and run', 'Choose fixed-width text, submit the form, then open the output link when the query succeeds.'],
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Databases</Label><H>Where Accounting and Finance Data Come From</H><P>Before students run models, they need to know what each database is built for. The wrong source, wrong identifier, or wrong coverage choice can quietly damage the analysis.</P></Reveal>
      <Reveal delay={0.05}><InfoGrid color={C.blue} items={[
        { k: 'WRDS', t: 'Research data portal', d: 'The access point for many subscription datasets, including CRSP, Compustat and LSEG ESG.' },
        { k: 'CRSP', t: 'Market data', d: 'Daily and monthly security records for U.S. listed securities, including returns, prices, splits, delistings and trading activity.' },
        { k: 'Compustat', t: 'Firm fundamentals', d: 'Income statement, balance sheet, cash flow and supplemental accounting items across annual and quarterly files.' },
        { k: 'LSEG ESG', t: 'ESG scores', d: 'ESG score products on WRDS, with yearly date fields and quarterly updates; students should inspect definitions carefully.' },
        { k: 'Public sources', t: 'Macro and local data', d: 'World Bank, SingStat and URA property data can support country, Singapore and property-market research designs.' },
        { k: 'Bloomberg', t: 'Market terminal data', d: 'Useful for firm, security and market information, but students must document extraction choices clearly.' },
      ]} /></Reveal>
      <Reveal delay={0.08}><Card style={{ marginTop: 14, borderLeft: `4px solid ${C.blue}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>How to choose the right database</div>
        <P mb={8}>Students should not start by asking "Where can I download something?" They should start by translating the research question into the kind of data they need.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>What is the unit?</strong><br /><span style={small}>Country-year, firm-year, security-month, article, property transaction?</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>What is the variable?</strong><br /><span style={small}>Price, return, accounting item, ESG score, GDP, property value?</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>What is the frequency?</strong><br /><span style={small}>Daily, monthly, quarterly, annual, or event-level?</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.blueBg }}><strong>What is the coverage?</strong><br /><span style={small}>Which countries, firms, exchanges, years and active/inactive observations?</span></div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout><strong>Plain-English warning:</strong> databases are not neutral spreadsheets. Each one has a coverage rule, update schedule, identifier system and survivorship issue. Good research begins by understanding those choices.</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>WRDS walkthrough</Label><H size={28}>The CRSP Query Path</H><P>The slides walk through a simple WRDS extraction for IBM, Amazon and Walmart monthly stock prices in 2020. Click each step to see what students should notice.</P></Reveal>
      <Reveal delay={0.03}><Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Before clicking: what a WRDS query is</div>
        <P mb={8}>A WRDS query is just a structured request: "Give me these variables, for these entities, over this time period, from this file, in this output format."</P>
        <Formula>dataset + date range + entity list + variables + output format = reproducible extract</Formula>
        <div style={small}>Once students understand that structure, the screenshots become less intimidating: every page is asking for one part of the request.</div>
      </Card></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {steps.map((s, i) => <button key={s[0]} onClick={() => setStep(i)} style={{ padding: '8px 12px', border: `1px solid ${step === i ? C.blue : C.black20}`, background: step === i ? C.blueBg : C.white, color: step === i ? C.blue : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{i + 1}. {s[0]}</button>)}
        </div>
        {step === null ? <div style={small}>Select a WRDS step above. The point is not to memorise screenshots; it is to understand the logic of a reproducible data query.</div> : <div style={{ padding: 14, background: C.blueBg, borderLeft: `4px solid ${C.blue}`, borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.black, marginBottom: 5 }}>{steps[step][0]}</div>
          <div style={small}>{steps[step][1]}</div>
        </div>}
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Pop-up blocker note:</strong> if the browser blocks the output window, students should use the query number or summary page to reach the output file. The data are not lost just because a tab did not open.</Callout></Reveal>
    </Wrap>
    <Wrap>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>Database Quiz</H></Reveal>
      <GamifiedQuiz quizId="s4:databases" questions={qs} xpPerQ={10} perfectBonus={15} badgeOnPerfect="wrds-navigator" />
      <NextBtn onClick={() => { completeTab('s4:databases'); next(); }} label="Continue to identifiers ->" />
    </Wrap>
  </div>;
}

function IdentifiersTab({ next }) {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const tasks = [
    { id: 'security', q: 'You need a permanent CRSP security-level key.', opts: ['Ticker', 'PERMNO', 'Company name'], c: 1, ex: 'PERMNO is permanent and unique at the security level.' },
    { id: 'firm', q: 'You need a permanent CRSP firm-level key.', opts: ['PERMCO', 'NCUSIP', 'Ticker'], c: 0, ex: 'PERMCO identifies the company rather than a specific security.' },
    { id: 'compfirm', q: 'You need the main Compustat firm identifier.', opts: ['GVKEY', 'PERMNO', 'CIK'], c: 0, ex: 'GVKEY is Compustat’s permanent firm identifier.' },
    { id: 'class', q: 'You need to distinguish multiple share classes in Compustat.', opts: ['IID', 'SIC', 'fyear'], c: 0, ex: 'GVKEY + IID identifies securities when a company has multiple issues.' },
    { id: 'unsafe', q: 'You are tempted to merge using company names. What is the best answer?', opts: ['Good idea', 'Usually risky', 'Always required'], c: 1, ex: 'Names are abbreviated, vendor-edited and historically change. They are weak merge keys.' },
  ];
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const score = tasks.filter(t => ans[t.id] === t.c).length;
  const submit = () => { setDone(true); awardXpOnce('activity:s4:identifier-match', score * 8 + (score === tasks.length ? 20 : 0), `${score}/${tasks.length} identifier decisions`, { allowImprovement: true }); if (score === tasks.length) awardBadge('key-master'); };
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Identifiers</Label><H>Why Tickers and Names Are Not Enough</H><P>Many student data problems are not statistical problems; they are merge problems. This tab makes explicit which identifiers are stable, which are not, and why the merge key must match the level of analysis.</P></Reveal>
      <Reveal delay={0.05}><InfoGrid items={[
        { k: 'PERMNO', t: 'CRSP security key', d: 'Permanent, unique and not recycled. Use it when each security is the unit.' },
        { k: 'PERMCO', t: 'CRSP company key', d: 'Permanent firm-level identifier. Useful when rolling multiple securities into one company.' },
        { k: 'GVKEY', t: 'Compustat firm key', d: 'Permanent Compustat company identifier for accounting fundamentals.' },
        { k: 'IID', t: 'Compustat security issue', d: 'Used with GVKEY to distinguish securities such as Alphabet class A and class C shares.' },
        { k: 'Ticker', t: 'Convenient but unstable', d: 'Exchange-specific, recyclable and can change over time. Good for lookup, weaker for merging.' },
        { k: 'CUSIP / CIK', t: 'Useful but imperfect', d: 'CUSIP can change; CIK is an SEC filing identifier. Always inspect whether it fits the merge task.' },
      ]} /></Reveal>
      <Reveal delay={0.08}><Card style={{ marginTop: 14, borderLeft: `4px solid ${C.red}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.red, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Start with the unit of observation</div>
        <P mb={8}>The same company can have multiple securities, different tickers over time, and different records across databases. That is why the first question is always: what does one row represent?</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Security-month</strong><br /><span style={small}>Use a security-level key such as PERMNO, then align by month.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Firm-year</strong><br /><span style={small}>Use a firm-level key such as GVKEY or a vetted CRSP-Compustat link, then align by fiscal year.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.redSubtle }}><strong>Danger zone</strong><br /><span style={small}>Company names and tickers are readable, but they are not stable research keys.</span></div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.11}><Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.amber, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>The merge sentence</div>
        <P mb={8}>Before any merge, students should be able to say the sentence below out loud.</P>
        <Formula>I am merging [left dataset] to [right dataset] at the [unit] level using [key] and [time].</Formula>
        <div style={small}>Example: "I am merging annual CRSP market variables to Compustat fundamentals at the firm-year level using a CRSP-Compustat link key and fiscal year."</div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.red} bg={C.redSubtle}><strong>Research habit:</strong> before merging, write one sentence: "My unit of observation is ___, so my merge key is ___." If that sentence is vague, the merge is not ready.</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Interactive</Label><H size={28}>Choose the Right Key</H><P>Pick the safest identifier for each research task.</P></Reveal>
      <Reveal delay={0.05}><Card>
        {tasks.map((t, i) => {
          const selected = ans[t.id];
          return <div key={t.id} style={{ borderTop: i ? `1px solid ${C.black10}` : 'none', paddingTop: i ? 14 : 0, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 8 }}>{i + 1}. {t.q}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{t.opts.map((o, oi) => <button key={o} onClick={() => !done && setAns(a => ({ ...a, [t.id]: oi }))} style={{ padding: '8px 12px', border: `1.5px solid ${done && oi === t.c ? C.green : selected === oi ? C.red : C.black20}`, background: done && oi === t.c ? C.greenBg : selected === oi ? C.redSubtle : C.white, borderRadius: 6, color: done && oi === t.c ? C.green : selected === oi ? C.red : C.black80, cursor: done ? 'default' : 'pointer', fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700 }}>{o}</button>)}</div>
            {done && <div style={{ ...small, marginTop: 7 }}>{t.ex}</div>}
          </div>;
        })}
        {!done ? <Btn onClick={submit} disabled={Object.keys(ans).length < tasks.length}>Check keys</Btn> : <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><P mb={0} color={score === tasks.length ? C.green : C.amber}>{score}/{tasks.length} correct</P><Btn onClick={() => { setDone(false); setAns({}); }} style={{ background: C.black }}>Retry</Btn></div>}
      </Card></Reveal>
      <NextBtn onClick={() => { completeTab('s4:identifiers'); next(); }} label="Continue to R workflow ->" />
    </Wrap>
  </div>;
}

function RWorkflowTab({ next }) {
  const { completeTab } = useGame();
  const qs = [
    { id: 'r1', q: 'Why check duplicates before merging?', opts: ['To make the file prettier', 'Because duplicated keys can multiply rows and distort results', 'Because R requires no duplicates anywhere', 'Because duplicates remove missing data'], c: 1, ex: 'If a merge key is duplicated unexpectedly, the merge can create extra rows and fake observations.' },
    { id: 'r2', q: 'Why might the slides drop utility and financial firms?', opts: ['They are always wrong', 'They often have different accounting and regulatory structures', 'They have no stock prices', 'They cannot be merged'], c: 1, ex: 'Utilities and financial firms often have different balance sheets and regulation, so many accounting studies exclude them.' },
    { id: 'r3', q: 'When converting daily data to annual data, returns are often:', opts: ['Summed or compounded depending on definition', 'Always averaged', 'Always deleted', 'Always converted to strings'], c: 0, ex: 'Spreads and turnover may be averaged; returns need careful aggregation such as summing log returns or compounding simple returns.' },
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>R programming</Label><H>From Raw Files to a Research Panel</H><P>The slides emphasise practical R tasks: set the folder, inspect size, remove inappropriate observations, create variables, aggregate daily to monthly or annual values, merge datasets and build subsamples.</P></Reveal>
      <Reveal delay={0.05}><InfoGrid color={C.green} items={[
        { k: '1', t: 'Set the workspace', d: 'Keep code, data and output in a reproducible folder structure.' },
        { k: '2', t: 'Audit the raw data', d: 'Check dimensions, duplicates, missing values and obvious coding errors before modelling.' },
        { k: '3', t: 'Clean the sample', d: 'Drop funds, penny stocks, utilities or financial firms when the research design requires it.' },
        { k: '4', t: 'Create variables', d: 'Use stable formulas for spreads, turnover, returns, size, leverage, profitability and lags/leads.' },
        { k: '5', t: 'Merge carefully', d: 'Merge CRSP and Compustat by appropriate firm/security identifiers and aligned time periods.' },
        { k: '6', t: 'Define subsamples', d: 'Create groups such as small vs large firms or risky vs safer firms for heterogeneity tests.' },
      ]} /></Reveal>
      <Reveal delay={0.08}><Card style={{ marginTop: 14, borderLeft: `4px solid ${C.green}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.green, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>How to think like R</div>
        <P mb={8}>R is not a spreadsheet. Students should think of each dataset as a table object, each variable as a column, and each cleaning step as a line of code that creates a new, reproducible version of the data.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Rows are observations</strong><br /><span style={small}>A row might be a firm-year, security-day, country-year or article.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Columns are variables</strong><br /><span style={small}>Variables include raw fields and constructed measures such as Size or RET1.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.greenBg }}><strong>Code is the audit trail</strong><br /><span style={small}>Every filter, merge and variable definition should be visible in the script.</span></div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.11}><Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.amber, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>The cleaning pipeline before code</div>
        <P mb={8}>Students should understand the pipeline before they read individual R commands.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 }}>
          {['Import', 'Inspect', 'Filter', 'Create variables', 'Merge', 'Validate', 'Model'].map((s, i) => <div key={s} style={{ padding: 12, borderRadius: 8, background: i === 6 ? C.amberBg : C.black05 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: i === 6 ? C.amber : C.black60, marginBottom: 4 }}>STEP {i + 1}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: C.black }}>{s}</div>
          </div>)}
        </div>
      </Card></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Code Patterns Students Should Recognise</H><P>These are not meant as copy-paste recipes; they show the intent behind common R operations from the slides.</P></Reveal>
      <Reveal delay={0.05}><div style={{ display: 'grid', gap: 12 }}>
        <Card><P mb={6} color={C.black}><strong>Check data size and duplication</strong></P><Code>{`setwd("your/data/folder")
dim(raw_data)
raw_data[, .N, by = .(firm_id, year)][N > 1]`}</Code><div style={small}>If firm-year keys repeat unexpectedly, a later merge may create duplicated observations.</div></Card>
        <Card><P mb={6} color={C.black}><strong>Drop industries when the design requires it</strong></P><Code>{`# Example logic: remove utilities and financials
sample <- sample[!(sic2 %in% c("49", "60", "61", "62", "63", "64", "65", "67"))]`}</Code><div style={small}>The purpose is comparability, not convenience. Students should state the exclusion rule in the methods section.</div></Card>
        <Card><P mb={6} color={C.black}><strong>Create panel variables</strong></P><Code>{`panel[, size := log(market_cap)]
panel[, leverage := total_liabilities / total_assets]
panel[, ret1 := shift(ret, type = "lead"), by = firm_id]`}</Code><div style={small}>Lead variables such as future return must be created within firm, after sorting by time.</div></Card>
        <Card><P mb={6} color={C.black}><strong>Merge by keys and time</strong></P><Code>{`merged <- merge(crsp_annual, compustat,
  by = c("firm_key", "year"),
  all = FALSE
)`}</Code><div style={small}>A good merge uses the correct firm/security key and aligned year or year-month fields.</div></Card>
      </div></Reveal>
    </Wrap>
    <Wrap>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>R Workflow Quiz</H></Reveal>
      <GamifiedQuiz quizId="s4:r-clean" questions={qs} xpPerQ={10} perfectBonus={15} badgeOnPerfect="data-engineer" />
      <NextBtn onClick={() => { completeTab('s4:r-clean'); next(); }} label="Continue to sentiment ->" />
    </Wrap>
  </div>;
}

function SentimentTab({ next }) {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const [choice, setChoice] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const checks = [
    { id: 'source', q: 'You scrape one online article. What should you save?', opts: ['Only the sentiment score', 'The URL, date, text and cleaning choices'], c: 1 },
    { id: 'clean', q: 'Before scoring text, what should happen?', opts: ['Tokenise and remove irrelevant symbols/boilerplate', 'Convert it to a stock ticker'], c: 0 },
    { id: 'interpret', q: 'A positive sentiment score means:', opts: ['The article is definitely true', 'The text uses more positive than negative language under the chosen dictionary/model'], c: 1 },
  ];
  const score = checks.filter(c => choice[c.id] === c.c).length;
  const submit = () => { setSubmitted(true); awardXpOnce('activity:s4:sentiment-check', score * 10 + (score === checks.length ? 15 : 0), `${score}/${checks.length} sentiment checks`, { allowImprovement: true }); if (score === checks.length) awardBadge('sentiment-scout'); };
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Sentiment analysis</Label><H>Turning Text into Data</H><P>The Seminar 4 slides introduce reading an article from a website and running sentiment analysis. Students should see this as a measurement task: the text must be collected, cleaned, scored and interpreted carefully.</P></Reveal>
      <Reveal delay={0.05}><InfoGrid color={C.amber} items={[
        { k: 'Collect', t: 'Capture the source', d: 'Record URL, date, article title and the exact text used in the analysis.' },
        { k: 'Clean', t: 'Remove noise', d: 'Strip navigation text, adverts, repeated boilerplate, punctuation choices and irrelevant tokens.' },
        { k: 'Score', t: 'Apply a dictionary or model', d: 'Compute positive, negative or net sentiment using a documented method.' },
        { k: 'Validate', t: 'Read examples', d: 'Check whether high and low scores make sense in actual articles.' },
      ]} /></Reveal>
      <Reveal delay={0.08}><Card style={{ marginTop: 14, borderLeft: `4px solid ${C.amber}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.amber, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>What students must understand first</div>
        <P mb={8}>Sentiment analysis is a measurement method. It turns words into a number, but that number is only meaningful if students can explain the measurement choices.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>The text sample matters</strong><br /><span style={small}>One article, all articles, headlines only, or full text can produce different scores.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>The dictionary/model matters</strong><br /><span style={small}>A finance-specific dictionary may classify words differently from a general dictionary.</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.amberBg }}><strong>The interpretation matters</strong><br /><span style={small}>A score measures language tone, not whether the claim is correct or economically important.</span></div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Plain-English warning:</strong> sentiment is not the same as truth, tone is not the same as impact, and a dictionary score is only as credible as the text cleaning behind it.</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Interactive</Label><H size={28}>Sentiment Measurement Check</H></Reveal>
      <Reveal delay={0.05}><Card>
        {checks.map((c, i) => <div key={c.id} style={{ borderTop: i ? `1px solid ${C.black10}` : 'none', paddingTop: i ? 14 : 0, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.black, marginBottom: 8 }}>{c.q}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{c.opts.map((o, oi) => <button key={o} onClick={() => !submitted && setChoice(v => ({ ...v, [c.id]: oi }))} style={{ padding: '10px 12px', border: `1.5px solid ${submitted && oi === c.c ? C.green : choice[c.id] === oi ? C.amber : C.black20}`, background: submitted && oi === c.c ? C.greenBg : choice[c.id] === oi ? C.amberBg : C.white, color: submitted && oi === c.c ? C.green : choice[c.id] === oi ? C.amber : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, cursor: submitted ? 'default' : 'pointer', textAlign: 'left' }}>{o}</button>)}</div>
        </div>)}
        {!submitted ? <Btn onClick={submit} disabled={Object.keys(choice).length < checks.length}>Check</Btn> : <P mb={0} color={score === checks.length ? C.green : C.amber}>{score}/{checks.length} correct. The key habit is to document the measurement process, not just report the score.</P>}
      </Card></Reveal>
      <NextBtn onClick={() => { completeTab('s4:sentiment'); next(); }} label="Continue to applied IV cases ->" />
    </Wrap>
  </div>;
}

function IvCasesTab({ next }) {
  const { completeTab } = useGame();
  const [active, setActive] = useState('gapminder');
  const cases = {
    gapminder: {
      title: 'Case 1: GDP and life expectancy',
      badge: 'Gapminder',
      story: 'The gapminder library provides country-year data on life expectancy, GDP per capita and population. It is useful for practising panel thinking and omitted-variable concerns.',
      steps: ['Load gapminder and inspect country-year structure.', 'Plot or regress life expectancy on GDP per capita.', 'Ask what country, continent and year differences may be hidden in the error term.'],
      takeaway: 'A strong relationship is not automatically a causal claim; it may reflect geography, institutions, healthcare systems and time trends.',
    },
    cigarettes: {
      title: 'Case 2: Cigarette prices and consumption',
      badge: '2SLS',
      story: 'The slides use cigarette panel data where log packs is the outcome, log real price is the endogenous regressor, and real sales tax per pack is the instrument.',
      steps: ['Create real price as price divided by CPI.', 'Create log real price and log packs.', 'Use sales tax as an instrument for price.', 'First stage: predict log real price using sales tax.', 'Second stage: regress log packs on predicted log real price.'],
      takeaway: 'Sales tax helps isolate price variation that is less driven by demand for cigarettes, making it a practical IV example.',
    },
    schooling: {
      title: 'Case 3: Schooling and earnings',
      badge: 'Wages',
      story: 'The wage example uses education, experience, demographics and proximity to college instruments to compare ordinary regression with IV estimates.',
      steps: ['Model wage as a function of education and controls.', 'Use polynomial experience terms to allow nonlinear labour-market experience effects.', 'Use near-college variables as instruments for education.', 'Compare the OLS education coefficient with the IV education coefficient.'],
      takeaway: 'The slides report a larger IV education coefficient than OLS, reinforcing that the identifying variation matters.',
    },
  };
  const c = cases[active];
  const qs = [
    { id: 'case1', q: 'In the cigarette example, what is the instrument?', opts: ['Log packs', 'Real sales tax per pack', 'Population', 'CPI'], c: 1, ex: 'Sales tax is used to move price in the first stage.' },
    { id: 'case2', q: 'In the wage example, why use near-college variables?', opts: ['They help predict education', 'They directly measure wages', 'They remove all missing values', 'They are firm identifiers'], c: 0, ex: 'Living near a college can shift education decisions, making it a candidate instrument for schooling.' },
    { id: 'case3', q: 'What does vcovHC address in the cigarette case?', opts: ['Heteroskedasticity-consistent standard errors', 'Missing tickers', 'Company name changes', 'Sentiment scoring'], c: 0, ex: 'vcovHC is used for heteroskedasticity-consistent covariance estimation.' },
  ];
  return <div style={{ paddingTop: 56 }}>
    <Wrap>
      <Reveal><Label>Applied cases</Label><H>Connecting Data Work Back to Identification</H><P>The later Seminar 4 slides revisit endogeneity and IV through applied R cases. This tab keeps the causal logic visible while students think through the data steps.</P></Reveal>
      <Reveal delay={0.04}><Card style={{ marginBottom: 14, borderLeft: `4px solid ${C.red}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.red, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>How to read an applied methods case</div>
        <P mb={8}>Each case combines two questions: a data question and an identification question. Students should separate them before reading code or coefficients.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Data question</strong><br /><span style={small}>What are Y, X, controls, identifiers, time period and sample?</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.black05 }}><strong>Endogeneity question</strong><br /><span style={small}>Why might ordinary regression be biased or misleading?</span></div>
          <div style={{ padding: 12, borderRadius: 8, background: C.redSubtle }}><strong>Design question</strong><br /><span style={small}>What variation is being used to make the estimate more credible?</span></div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.05}><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.entries(cases).map(([k, v]) => <button key={k} onClick={() => setActive(k)} style={{ padding: '9px 13px', border: `1px solid ${active === k ? C.red : C.black20}`, background: active === k ? C.redSubtle : C.white, color: active === k ? C.red : C.black80, borderRadius: 6, fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, cursor: 'pointer' }}>{v.badge}</button>)}
      </div></Reveal>
      <Reveal delay={0.08}><Card style={{ borderLeft: `4px solid ${C.red}` }}>
        <Pill>{c.badge}</Pill>
        <H size={26} mb={10}>{c.title}</H>
        <P mb={10}>{c.story}</P>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>{c.steps.map((s, i) => <Num key={s} n={i + 1}>{s}</Num>)}</div>
        <Callout accent={C.green} bg={C.greenBg}><strong>Takeaway:</strong> {c.takeaway}</Callout>
      </Card></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Check</Label><H size={26}>Applied IV Quiz</H></Reveal>
      <GamifiedQuiz quizId="s4:iv-cases" questions={qs} xpPerQ={10} perfectBonus={20} badgeOnPerfect="case-analyst" />
      <NextBtn onClick={() => { completeTab('s4:iv-cases'); next(); }} label="Continue to Seminar 4 activity ->" />
    </Wrap>
  </div>;
}

function ActivityTab() {
  const { completeTab, awardXpOnce, awardBadge } = useGame();
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);
  const tasks = [
    'Download 10 companies daily spread, turnover and return data.',
    'Aggregate annual Spread and Turnover using means, and RET using a documented annual return rule.',
    'Download annual SIZE, leverage, revenue and SIC data.',
    'Merge the market and accounting data by firm and year.',
    'Create future return, RET1, after sorting by firm and year.',
    'Create a correlation matrix for RET1, RET, Spread, Turnover, SIZE, TLTA, SALETA and SIC.',
    'Run three regression models and explain why each specification is different.',
  ];
  const count = Object.values(checked).filter(Boolean).length;
  const finish = () => { setDone(true); completeTab('s4:activity', 25); awardXpOnce('activity:s4:capstone-data-plan', count * 8 + (count === tasks.length ? 30 : 0), `${count}/${tasks.length} activity checklist`, { allowImprovement: true }); if (count === tasks.length) awardBadge('s4-completionist'); };
  return <div style={{ paddingTop: 56 }}>
    <DarkWrap>
      <Reveal><Label>Seminar activity</Label><H color={C.white}>Build the Dataset for the Capstone Analysis</H><P color="rgba(255,255,255,0.55)">This activity translates the slide instructions into a structured research workflow. Students should leave with a dataset that can support descriptive statistics, correlations and regressions.</P></Reveal>
    </DarkWrap>
    <Wrap bg={C.black05}>
      <Reveal><Card>
        <P color={C.black} mb={12}><strong>Activity checklist</strong></P>
        {tasks.map((t, i) => <label key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderTop: i ? `1px solid ${C.black10}` : 'none', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!checked[i]} onChange={e => setChecked(v => ({ ...v, [i]: e.target.checked }))} style={{ marginTop: 4 }} />
          <span style={small}>{t}</span>
        </label>)}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <Btn onClick={finish}>Submit checklist</Btn>
          <div style={{ fontSize: 14, color: C.black60 }}>{count}/{tasks.length} complete</div>
        </div>
        {done && <Callout accent={count === tasks.length ? C.green : C.amber} bg={count === tasks.length ? C.greenBg : C.amberBg}><strong>{count === tasks.length ? 'Seminar 4 complete.' : 'Progress saved.'}</strong> The next step is to use this prepared dataset in Seminar 5 for Stata regressions, robustness checks and event-study analysis.</Callout>}
      </Card></Reveal>
    </Wrap>
    <footer style={{ background: C.black, padding: '28px 0', borderTop: `4px solid ${C.red}` }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: C.red }}>SIT</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ACC3018 · Seminar 4 · AY2024/25 T3</span>
      </div>
    </footer>
  </div>;
}

export default function Seminar4() {
  const [tab, setTab] = useState('s4:overview');
  const idx = TABS.findIndex(t => t.id === tab);
  const nextTab = () => setTab(TABS[Math.min(idx + 1, TABS.length - 1)].id);
  return <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", minHeight: '100vh', background: C.white }}>
    <GlobalStyles />
    <TopNav tabs={TABS} activeTab={tab} setActiveTab={setTab} />
    <ProgressWidget tabs={TABS} />
    {tab === 's4:overview' && <OverviewTab next={nextTab} />}
    {tab === 's4:databases' && <DatabasesTab next={nextTab} />}
    {tab === 's4:identifiers' && <IdentifiersTab next={nextTab} />}
    {tab === 's4:r-clean' && <RWorkflowTab next={nextTab} />}
    {tab === 's4:sentiment' && <SentimentTab next={nextTab} />}
    {tab === 's4:iv-cases' && <IvCasesTab next={nextTab} />}
    {tab === 's4:activity' && <ActivityTab />}
  </div>;
}
