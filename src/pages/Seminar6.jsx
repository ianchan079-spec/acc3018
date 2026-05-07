import { useState } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card,
  Li, Num, NextBtn, NextBtnDark, TopNav, ProgressWidget,
} from '../shared/components';

const TABS = [
  { id: 's6:overview', label: 'Roadmap' },
  { id: 's6:s1', label: 'Seminar 1' },
  { id: 's6:s23', label: 'Seminars 2-3' },
  { id: 's6:s45', label: 'Seminars 4-5' },
  { id: 's6:submit', label: 'Submission' },
];

const text = { fontSize: 13.5, color: C.black80, lineHeight: 1.6 };
const panel = (accent = C.red) => ({
  background: C.white,
  border: `1px solid ${C.black10}`,
  borderLeft: `4px solid ${accent}`,
  borderRadius: 8,
  padding: 16,
});

function StepGrid({ items }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
    {items.map((item, i) => <div key={item.title} style={panel(item.color || [C.red, C.blue, C.green, C.amber, C.purple][i % 5])}>
      <div style={{ fontSize: 12, fontWeight: 900, color: item.color || [C.red, C.blue, C.green, C.amber, C.purple][i % 5], marginBottom: 5 }}>{item.k}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: C.black, marginBottom: 5 }}>{item.title}</div>
      <div style={text}>{item.desc}</div>
    </div>)}
  </div>;
}

export default function Seminar6() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const jump = id => { setActiveTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", background: C.white, minHeight: '100vh' }}>
    <GlobalStyles />
    <TopNav tabs={TABS} activeTab={activeTab} setActiveTab={jump} />
    <ProgressWidget tabs={TABS} />
    {activeTab === 's6:overview' && <OverviewTab next={() => jump('s6:s1')} />}
    {activeTab === 's6:s1' && <Seminar1Plan next={() => jump('s6:s23')} />}
    {activeTab === 's6:s23' && <Seminar23Plan next={() => jump('s6:s45')} />}
    {activeTab === 's6:s45' && <Seminar45Plan next={() => jump('s6:submit')} />}
    {activeTab === 's6:submit' && <SubmissionPlan />}
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
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 14 }}>ACC3018 | Assessment Roadmap</div>
          <h1 style={{ fontSize: 'clamp(32px,5.5vw,60px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', color: C.white, marginBottom: 14 }}>Seminar Activities<br />Across the Course</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 650, lineHeight: 1.6 }}>There is no longer one large paper-replication assignment. The work is now broken into smaller group activities that build from paper reading, to results interpretation, to data access, to Stata output.</p>
        </Reveal>
      </div>
    </div>
    <Wrap bg={C.black05} py={72}>
      <Reveal><Label>How It Works</Label><H size={30}>One paper pool, several staged activities</H><P>In Seminar 1, each student contributes one paper to the group. The group then uses that pool of papers for later seminar tasks. This keeps the work manageable and helps students learn the research process step by step.</P></Reveal>
      <Reveal delay={0.06}><StepGrid items={[
        { k: 'S1', title: 'Build the paper pool', desc: 'Form groups, each student finds one paper, and the group submits the collated responses with PDFs.' },
        { k: 'S2-S3', title: 'Present the results section', desc: 'Choose one paper from the group pool and explain the results using quantitative methods and endogeneity concepts.' },
        { k: 'S4', title: 'Find and download data', desc: 'Choose a dataset named in one paper, preferably from WRDS or CRSP, and attempt the download.' },
        { k: 'S5', title: 'Attempt Stata results', desc: 'Use the downloaded data to attempt the main results or a simplified version of the paper analysis.' },
      ]} /></Reveal>
      <NextBtn onClick={() => { completeTab('s6:overview', 10); next(); }} label="Continue to Seminar 1 plan" />
    </Wrap>
  </div>;
}

function Seminar1Plan({ next }) {
  const { completeTab } = useGame();
  return <div style={{ paddingTop: 56 }}>
    <Wrap py={84}>
      <Reveal><Label>Seminar 1 Activity</Label><H size={30}>Group paper pool</H><P>Students form groups in Seminar 1. Within each group, each student individually finds a different top-journal empirical paper and completes the prescribed paper walkthrough.</P></Reveal>
      <Reveal delay={0.06}><Card style={{ marginBottom: 16, borderLeft: `4px solid ${C.red}` }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: C.red, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Group submission</div>
        <Num n={1}>Each student completes an individual response for one different paper.</Num>
        <Num n={2}>The group collates all individual responses into one group submission.</Num>
        <Num n={3}>Attach PDF copies of all papers used by group members.</Num>
        <Num n={4}>Submit the collated package to the LMS as a group.</Num>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.blue} bg={C.blueBg}><strong>Why this matters:</strong> the group is not choosing one final paper yet. It is building a small library of possible papers that can be reused in Seminars 2-5.</Callout></Reveal>
      <NextBtn onClick={() => { completeTab('s6:s1', 10); next(); }} label="Continue to Seminars 2-3 plan" />
    </Wrap>
  </div>;
}

function Seminar23Plan({ next }) {
  const { completeTab } = useGame();
  return <div style={{ paddingTop: 56 }}>
    <Wrap py={84}>
      <Reveal><Label>Seminars 2-3 Activity</Label><H size={30}>Results-section presentation</H><P>The group chooses one paper from the Seminar 1 paper pool and prepares a short presentation about the results section. The focus is not to replicate the paper, but to explain how the evidence is constructed and interpreted.</P></Reveal>
      <Reveal delay={0.06}><StepGrid items={[
        { k: 'S2', title: 'Quantitative method', desc: 'Identify the dependent variable, key independent variable, controls, sample, regression model, fixed effects and main coefficient.' },
        { k: 'S2', title: 'Results reading', desc: 'Explain summary statistics, correlations, coefficient sign, statistical significance and economic meaning.' },
        { k: 'S3', title: 'Endogeneity concerns', desc: 'Explain possible omitted variables, reverse causality, selection bias, measurement error, and whether the paper addresses them.' },
        { k: 'S3', title: 'Identification strategy', desc: 'If the paper uses IV/2SLS, explain the endogenous regressor, instrument, first stage and exclusion restriction. If not, explain what design it uses instead.' },
      ]} /></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Presentation rule:</strong> students should use the concepts already covered in Seminars 2 and 3. The goal is to show that they can read a results table like researchers.</Callout></Reveal>
      <NextBtn onClick={() => { completeTab('s6:s23', 10); next(); }} label="Continue to Seminars 4-5 plan" />
    </Wrap>
  </div>;
}

function Seminar45Plan({ next }) {
  const { completeTab } = useGame();
  return <div style={{ paddingTop: 56 }}>
    <Wrap py={84}>
      <Reveal><Label>Seminars 4-5 Activity</Label><H size={30}>From paper data source to Stata output</H><P>Students move from reading a published paper to handling research data. The aim is an honest attempt, not a perfect replication.</P></Reveal>
      <Reveal delay={0.06}><StepGrid items={[
        { k: 'S4', title: 'Identify a dataset', desc: 'Pick a dataset named in one of the group papers, preferably from WRDS or CRSP.' },
        { k: 'S4', title: 'Attempt the download', desc: 'Find the database, identify the file/table, select relevant variables and document the query choices.' },
        { k: 'S5', title: 'Use Stata', desc: 'Import or open the dataset, inspect variables, clean the file and construct the closest feasible analysis sample.' },
        { k: 'S5', title: 'Attempt main results', desc: 'Run the closest feasible Stata models for the paper main results, or explain clearly what cannot be reproduced.' },
      ]} /></Reveal>
      <Reveal delay={0.1}><Callout accent={C.red} bg={C.redSubtle}><strong>Important:</strong> failed downloads or imperfect Stata results are still useful if the group documents what they tried, what worked, what failed, and why.</Callout></Reveal>
      <NextBtn onClick={() => { completeTab('s6:s45', 10); next(); }} label="Continue to submission checklist" />
    </Wrap>
  </div>;
}

function SubmissionPlan() {
  const { completeTab } = useGame();
  return <div style={{ paddingTop: 56 }}>
    <DarkWrap>
      <Reveal><Label color={C.red}>Submission Checklist</Label><H color={C.white} size={34}>What The Group Should Keep</H><P color="rgba(255,255,255,0.55)">The course activities now create a portfolio of evidence: paper notes, presentation slides, data-access attempts and Stata outputs.</P></Reveal>
      <Reveal delay={0.06}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {[
            ['S1 package', 'All individual paper responses plus PDF copies of the papers.'],
            ['S2-S3 slides', 'Results-section presentation using quantitative methods and endogeneity concepts.'],
            ['S4 data notes', 'Dataset selected, database path, variables selected and download evidence.'],
            ['S5 Stata files', 'Do-file, output tables, screenshots or notes explaining the attempted main results.'],
          ].map((item, i) => <div key={item[0]} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: `4px solid ${[C.red, C.blue, C.green, C.amber][i]}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.white, marginBottom: 5 }}>{item[0]}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{item[1]}</div>
          </div>)}
        </div>
      </Reveal>
      <Reveal delay={0.1}><Callout accent={C.red} bg="rgba(228,0,43,0.12)"><span style={{ color: C.white }}><strong>Theme:</strong> every seminar turns a published paper into a more concrete research skill: reading, interpreting, accessing data and producing results.</span></Callout></Reveal>
      <NextBtnDark onClick={() => completeTab('s6:submit', 10)} label="Mark roadmap complete" />
    </DarkWrap>
  </div>;
}

