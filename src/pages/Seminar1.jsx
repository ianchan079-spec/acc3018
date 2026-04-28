// ═══════════════════════════════════════════════════════════════
// SEMINAR 1 — Essentials of Applied Research
// ═══════════════════════════════════════════════════════════════
// All UI primitives, game logic, and infrastructure are in /shared.
// This file contains ONLY seminar-specific content and tabs.

import { useState, useEffect, useCallback } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Dot, Li, Num, Accordion, NextBtn, NextBtnDark, GamifiedQuiz,
  TopNav, ProgressWidget,
} from '../shared/components';

// ── Tab definitions for Seminar 1 ──
const TABS = [
  { id: 's1:overview', label: 'Overview' },
  { id: 's1:research', label: 'Research' },
  { id: 's1:process', label: 'Process' },
  { id: 's1:ideas', label: 'Ideas' },
  { id: 's1:litreview', label: 'Lit Review' },
  { id: 's1:hypotheses', label: 'Hypotheses' },
  { id: 's1:design', label: 'Design' },
  { id: 's1:results', label: 'Results' },
  { id: 's1:thesis', label: 'Thesis' },
  { id: 's1:activity', label: 'Activity' },
];

// ═══════════════════════════════════════════════════════════════
// MAIN SEMINAR SHELL
// ═══════════════════════════════════════════════════════════════
export default function Seminar1() {
  const { progress, awardBadge } = useGame();
  const [tab, setTab] = useState('s1:overview');
  const goTo = useCallback((id) => { setTab(id); window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const nextTab = useCallback(() => {
    const idx = TABS.findIndex(t => t.id === tab);
    if (idx < TABS.length - 1) goTo(TABS[idx + 1].id);
  }, [tab, goTo]);

  useEffect(() => {
    const allDone = TABS.every(t => progress.completedTabs[t.id]);
    if (allDone && !progress.badges['completionist']) awardBadge('completionist');
  }, [progress.completedTabs, progress.badges, awardBadge]);

  return (
    <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", minHeight: '100vh', background: C.black05 }}>
      <GlobalStyles />
      <TopNav tabs={TABS} activeTab={tab} setActiveTab={goTo} />
      {tab === 's1:overview' && <OverviewTab next={nextTab} />}
      {tab === 's1:research' && <ResearchTab next={nextTab} />}
      {tab === 's1:process' && <ProcessTab next={nextTab} />}
      {tab === 's1:ideas' && <IdeasTab next={nextTab} />}
      {tab === 's1:litreview' && <LitReviewTab next={nextTab} />}
      {tab === 's1:hypotheses' && <HypothesesTab next={nextTab} />}
      {tab === 's1:design' && <DesignTab next={nextTab} />}
      {tab === 's1:results' && <ResultsTab next={nextTab} />}
      {tab === 's1:thesis' && <ThesisTab next={nextTab} />}
      {tab === 's1:activity' && <ActivityTab />}
      <footer style={{ background: C.black, padding: '36px 0', borderTop: `4px solid ${C.red}` }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 15, fontWeight: 900, color: C.red, textDecoration: 'none' }}>SIT</a>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ACC3018 · Seminar 1 · AY2024/25 T3</span>
        </div>
      </footer>
      <ProgressWidget tabs={TABS} />
    </div>
  );
}

function OverviewTab({next}){
  const { completeTab, awardBadge } = useGame();
  const phases=[
    {term:'AY2024/25 T3',weight:'15%',color:C.black05,border:C.black20,dark:false,
      items:['Research Methods (6 Seminars)','S1: Essentials of Applied Research','S2–S3: Research Methods','S4–S5: Data Application'],
      self:['IRB (Institutional Review Board)','SIT Library Search','How to write a Literature Review','How to write a Research Proposal','How to write a Final Report'],
      assess:['In-class Activity & Attendance (5%) — Individual S1–S5','S6: Mini Group Assignment (10%)']},
    {term:'AY2025/26 T1',weight:'35%',color:C.black,border:C.black,dark:true,
      items:['Conduct Capstone Project','Submit and Present Research Proposal','Consultation with Academic Supervisor & CPC team','During BTC workshops'],
      assess:['Research Proposal (35%):','→ Introduction','→ Literature Review & Hypotheses Development','→ Research Design']},
    {term:'AY2025/26 T2',weight:'50%',color:C.red,border:C.red,dark:true,
      items:['Conduct and Complete Capstone Project','Submit Research Final Report','Consultation with Academic Supervisor & CPC team during BTC workshops'],
      assess:['Research Final Report (50%):','→ Introduction','→ Lit Review & Hypotheses Development','→ Research Design','→ Results (incl. Robustness checks)','→ Conclusion']},
  ];

  const onContinue = () => {
    completeTab('s1:overview');
    awardBadge('first-step');
    next();
  };

  return <div>
    <div style={{background:C.black,minHeight:'55vh',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:56}}>
      <div style={{position:'absolute',top:0,right:0,width:400,height:400,background:C.red,borderRadius:'0 0 0 100%',opacity:0.09}}/>
      <div style={{position:'absolute',top:56,left:0,right:0,height:4,background:C.red}}/>
      <div style={{maxWidth:840,margin:'0 auto',padding:'48px 36px',width:'100%'}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:16}}>ACC3018 · Applied Analytics Capstone · Seminar 1</div>
        <h1 style={{fontSize:'clamp(34px,6vw,68px)',fontWeight:900,lineHeight:1.05,letterSpacing:'-0.025em',color:C.white,marginBottom:16}}>Essentials of<br/>Applied Research</h1>
        <p style={{fontSize:18,color:'rgba(255,255,255,0.5)',maxWidth:500,lineHeight:1.6}}>From research ideas to thesis structure. Everything you need to design a rigorous capstone project.</p>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>Module Briefing</Label><H>Your Capstone Journey</H><P>Group work of 5–6 students per group, with peer review via Sparkplus. The module spans three trimesters across your IWSP period.</P></Reveal>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
        {phases.map((p,i)=><Reveal key={i} delay={i*0.1}><div style={{background:p.color,border:`1px solid ${p.border}`,borderRadius:8,padding:'22px 20px',display:'flex',flexDirection:'column',gap:10,height:'100%'}}>
          <div><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:p.dark?'rgba(255,255,255,0.4)':C.black60,marginBottom:3}}>{p.term}</div><div style={{fontSize:32,fontWeight:900,color:p.dark?C.white:C.red}}>{p.weight}</div></div>
          <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:5}}>{p.items.map((item,j)=><li key={j} style={{display:'flex',gap:6,alignItems:'flex-start'}}><div style={{width:4,height:4,borderRadius:1,background:p.dark?'rgba(255,255,255,0.3)':C.red,marginTop:7,flexShrink:0}}/><span style={{fontSize:13,lineHeight:1.5,color:p.dark?'rgba(255,255,255,0.7)':C.black80}}>{item}</span></li>)}</ul>
          {p.self&&<div style={{borderTop:`1px solid ${C.black10}`,paddingTop:8}}><div style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:4}}>Self-Study</div>{p.self.map((s,j)=><div key={j} style={{fontSize:12,color:C.black60,lineHeight:1.5}}>• {s}</div>)}</div>}
          <div style={{borderTop:`1px solid ${p.dark?'rgba(255,255,255,0.1)':C.black10}`,paddingTop:8,marginTop:'auto'}}><div style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:p.dark?'rgba(255,255,255,0.3)':C.black60,marginBottom:4}}>Assessment</div>{p.assess.map((a,j)=><div key={j} style={{fontSize:12,lineHeight:1.5,color:p.dark?'rgba(255,255,255,0.6)':C.black80}}>{a}</div>)}</div>
        </div></Reveal>)}
      </div>
      <Reveal delay={0.3}><Callout><strong>Agenda for today:</strong> Module Briefing → Essentials of Research → Key Issues in Research → Thesis Structure → In-Class Activities (Literature Review, Hypotheses Development, Research Design).</Callout></Reveal>
      <Reveal delay={0.35}><Card style={{background:C.goldBg,borderColor:C.gold,marginTop:18}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.gold,marginBottom:6}}>⬢ New in this version</div>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.65}}>Earn XP as you work through each tab. Perfect scores and first-try answers earn badges. Your progress is saved automatically — look for the counter in the bottom-right corner.</div>
      </Card></Reveal>
      <NextBtn onClick={onContinue} label="Start: What is Research? →"/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: RESEARCH — gamified classify quiz
// ═══════════════════════════════════════════════════════════════
function ResearchTab({next}){
  const { completeTab } = useGame();
  const rows=[
    {p:'Type of knowledge',b:'Scientific Discovery (Science)',a:'Technological Application (Technology)'},
    {p:'Motivation',b:'Intellectual curiosity',a:'Solving problems'},
    {p:'Key question',b:'Is it true?',a:'Does it work?'},
    {p:'Objective',b:'To understand',a:'To come up with solutions'},
    {p:'Accuracy',b:'100% theoretical accuracy',a:'Works 95–99% of the time'},
  ];
  const basicExamples=['Investigation into how the universe began','A study searching for the causes of cancer','Understanding the components that make up human DNA','An examination into whether a vegetarian diet is healthier than one with meat','A study to learn more about which areas in the world get the most precipitation'];

  const classifyQs = [
    {id:'c1',q:'Investigating how the universe began through particle physics experiments.',opts:['Basic Research','Applied Research'],c:0,ex:'Pure intellectual curiosity about origins of the universe — knowledge for its own sake.'},
    {id:'c2',q:'Can machine learning models reliably predict corporate bankruptcy for Singapore-listed firms?',opts:['Basic Research','Applied Research'],c:1,ex:'Solves a specific, practical problem for investors and regulators using real-world data.'},
    {id:'c3',q:'Understanding the components that make up human DNA.',opts:['Basic Research','Applied Research'],c:0,ex:'Seeks fundamental understanding of life — basic research even though later applications may emerge.'},
    {id:'c4',q:'How does public sentiment of a company\'s ESG performance affect its stock returns?',opts:['Basic Research','Applied Research'],c:1,ex:'Directly addresses an industry-relevant financial question with actionable findings.'},
    {id:'c5',q:'A study searching for the fundamental causes of cancer at the cellular level.',opts:['Basic Research','Applied Research'],c:0,ex:'Aims to understand underlying mechanisms — basic research even though it may eventually lead to treatments.'},
    {id:'c6',q:'Evaluating ChatGPT\'s capabilities in CA Qualification Exams to determine if AI can assist accounting education.',opts:['Basic Research','Applied Research'],c:1,ex:'Tests a practical application (AI in professional education) with direct industry implications.'},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Essentials of Research</Label><H>What is Research?</H></Reveal>
      <Reveal delay={0.05}><P>Research is the systematic process of collecting and analyzing information (data) in order to increase our understanding of the phenomenon with which we are concerned or interested.</P></Reveal>
      <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
        {[{t:'Structured Inquiry',d:'Research is a structured inquiry that utilizes acceptable scientific methodology to solve problems and creates new knowledge that is generally applicable.',s:'Grinnell, 1993'},
          {t:'Systematic Investigation',d:'A systematic investigation to find answers to a problem.',s:'Burns, 1997'}
        ].map((d,i)=><Reveal key={i} delay={i*0.06}><Card><div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:5}}>Definition</div><div style={{fontSize:17,fontWeight:700,color:C.black,marginBottom:6}}>{d.t}</div><div style={{fontSize:14,color:C.black80,lineHeight:1.65}}>"{d.d}"</div><div style={{fontSize:12,color:C.black60,fontStyle:'italic',marginTop:6}}>— {d.s}</div></Card></Reveal>)}
      </div>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={32}>Basic vs Applied Research</H></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28}}>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:10}}>Basic Research — Examples</div>{basicExamples.map((e,i)=><Li key={i}>{e}</Li>)}</Card>
        <Card style={{background:C.red,borderColor:C.red}}><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:10}}>Applied Research — Your Capstone</div>
          <Li color="rgba(255,255,255,0.6)"><span style={{color:'rgba(255,255,255,0.85)'}}>Industry-relevant findings</span></Li>
          <Li color="rgba(255,255,255,0.6)"><span style={{color:'rgba(255,255,255,0.85)'}}>Informed by practical constraints</span></Li>
          <Li color="rgba(255,255,255,0.6)"><span style={{color:'rgba(255,255,255,0.85)'}}>Works 95–99% of the time</span></Li>
          <Li color="rgba(255,255,255,0.6)"><span style={{color:'rgba(255,255,255,0.85)'}}>Connects knowledge to action</span></Li>
        </Card>
      </div></Reveal>
      <Reveal delay={0.2}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:12}}>Comparison Table</div>
        <div style={{borderRadius:8,overflow:'hidden',border:`1px solid ${C.black10}`,marginBottom:24}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:C.black}}><div style={{padding:'12px 16px',fontSize:13,fontWeight:700,color:C.white}}>Parameter</div><div style={{padding:'12px 16px',fontSize:13,fontWeight:700,color:C.white}}>Basic</div><div style={{padding:'12px 16px',fontSize:13,fontWeight:700,color:C.white,background:C.red}}>Applied</div></div>
          {rows.map((r,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:i%2===0?C.white:C.black05}}><div style={{padding:'10px 16px',fontSize:13,fontWeight:700,color:C.black}}>{r.p}</div><div style={{padding:'10px 16px',fontSize:13,color:C.black80}}>{r.b}</div><div style={{padding:'10px 16px',fontSize:13,color:C.black80,background:i%2===0?C.redSubtle:'#FFF5F7'}}>{r.a}</div></div>)}
        </div>
      </Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label>Interactive Activity</Label><H size={30}>Classify: Basic or Applied?</H><P>Read each description and decide. First-try correct answers earn bonus streaks.</P></Reveal>
      <GamifiedQuiz
        quizId="s1:basic-applied"
        questions={classifyQs}
        xpPerQ={8}
        perfectBonus={16}
        badgeOnPerfect="research-ready"
      />
      <NextBtn onClick={()=>{completeTab('s1:research',40);next()}}/>
    </Wrap>
  </div>;
}

function ProcessTab({next}){
  const { completeTab } = useGame();
  const[active,setActive]=useState(null);

  const PROCESS_STEPS = [
    {
      id: 'think', n: '01', t: 'Begin Thinking About Research', color: '#4A90A4',
      d: 'Observe a gap, inconsistency, or phenomenon in existing literature or industry practice. Ask: What is unknown? What is worth knowing?',
      detail: 'Every research journey begins with curiosity. You might notice a contradiction in published findings, encounter a real-world puzzle in your internship, or read a paper that left an important question unanswered. At this stage, keep a research journal — jot down observations, clippings, and half-formed questions. The goal is not precision yet; it is volume and variety of ideas.',
      tips: ['Read broadly across accounting and finance journals', 'Follow industry news for emerging issues', 'Talk to practitioners about unsolved problems'],
    },
    {
      id: 'topic', n: '02', t: 'Choose a Research Topic & Develop Your Proposal', color: '#4A90A4',
      d: 'Select a topic and develop your research proposal. Consider appropriateness, capability, novelty, and testability.',
      detail: 'Narrow your broad interest into a feasible research topic. A good topic sits at the intersection of what interests you, what matters to the field, and what you can realistically investigate within your constraints. Your proposal should articulate the research question, its significance, an initial literature frame, and a rough methodology.',
      tips: ['Use the "Goldilocks" test — not too broad, not too narrow', 'Check SIT\'s past capstone topics for scope calibration', 'Discuss feasibility with your supervisor early'],
    },
    {
      id: 's1:litreview', n: '03', t: 'Critically Review the Literature', color: '#4A90A4',
      d: 'Survey existing research. Understand what is known, what is debated, and what gaps remain.',
      detail: 'A critical literature review is not a book report — it is an argument. You synthesise prior research to show where knowledge stands and where the gap lies that your study will fill. Organise thematically, not chronologically. Evaluate methodological strengths and weaknesses of prior work. The literature review directly shapes your hypotheses and research design.',
      tips: ['Use Google Scholar citation chains to trace key debates', 'Organise papers in a reference manager (Zotero, Mendeley)', 'Create a concept matrix mapping authors to themes'],
    },
    {
      id: 'philosophy', n: '04', t: 'Understand Your Philosophy & Approach', color: '#4A90A4',
      d: 'Position your study within a research philosophy (positivism, interpretivism, pragmatism) and choose deductive or inductive reasoning.',
      detail: 'Your research philosophy shapes everything — from what counts as valid evidence to how you interpret findings. Most quantitative accounting research sits within a positivist, deductive framework: you derive hypotheses from theory and test them against data. Understanding this explicitly strengthens your methodology chapter and helps you defend your design choices.',
      tips: ['Positivism dominates archival accounting research', 'Interpretivism suits qualitative case studies', 'Be explicit about your ontological and epistemological stance'],
    },
    {
      id: 's1:design', n: '05', t: 'Formulate Your Research Design', color: '#4A90A4',
      d: 'Specify your variables, model form, sample selection criteria, and data sources.',
      detail: 'Research design is your blueprint. Define your dependent variable (Y), independent variables (X), and controls. Specify the functional form of your model (e.g., OLS regression, logit, fixed-effects panel). Justify every design choice with reference to prior literature. Consider threats to internal and external validity and how you will address them through your sample selection and robustness tests.',
      tips: ['Draw a clear diagram of your variable relationships', 'Document your sample selection filters step-by-step', 'Pre-register your hypotheses if possible'],
    },
    {
      id: 'ethics', n: '06', t: 'Negotiate Access & Address Ethical Issues', color: '#4A90A4',
      d: 'Ensure you can access the data you need and that your research meets ethical standards.',
      detail: 'Even with publicly available databases, ethical considerations apply. Are you using proprietary data that requires permission? Does your study involve human participants (e.g., surveys, interviews)? If so, you need SIT IRB approval. For archival studies, ensure compliance with data licensing terms. Document your ethical framework in your methodology chapter.',
      tips: ['Apply for database access early — it can take weeks', 'Check if your data license permits academic research use', 'Complete SIT\'s ethics review process if required'],
    },
  ];

  const DATA_METHODS = [
    { id: 'sampling', label: 'Sampling', desc: 'Define your population and sample. Justify inclusion/exclusion criteria. Consider survivorship bias and selection effects.' },
    { id: 'secondary', label: 'Secondary Data', desc: 'Use existing databases (Compustat, CRSP, Bloomberg, Capital IQ). Most ACC3018 research uses archival secondary data.' },
    { id: 'observation', label: 'Observation', desc: 'Systematic observation of phenomena in natural settings. Less common in accounting but useful for field studies.' },
    { id: 'interviews', label: 'Interviews & Diaries', desc: 'Semi-structured interviews or research diaries. Useful for qualitative studies exploring practitioner perspectives.' },
    { id: 'questionnaires', label: 'Questionnaires', desc: 'Survey instruments with validated scales. Requires careful design, pilot testing, and sufficient response rates.' },
  ];

  const ANALYSIS_STEPS = [
    {
      id: 'analyse', n: '08', t: 'Analyse Your Data', color: '#5B9E6F',
      d: 'Run regressions, conduct robustness checks. Interpret coefficients — do they support your hypotheses?',
      detail: 'Analysis is where your hypotheses meet reality. Run your main regressions and examine whether coefficients are statistically significant and in the predicted direction. Then stress-test your findings: use alternative variable definitions, different sample periods, additional controls, and subsample analyses. Honest, thorough analysis — including null results — is the hallmark of good research.',
      tips: ['Report descriptive statistics and correlations first', 'Always check for multicollinearity (VIF)', 'Present robustness tests alongside main results'],
      subTypes: [
        { label: 'Quantitatively', desc: 'Statistical analysis using regression models, hypothesis testing, and econometric techniques.' },
        { label: 'Qualitatively', desc: 'Thematic analysis, content analysis, or discourse analysis of textual or interview data.' },
      ],
    },
    {
      id: 'writeup', n: '09', t: 'Write Your Project Report & Prepare Presentation', color: '#6AAE7D',
      d: 'Structure findings into the standard thesis format. Discuss implications, limitations, and future directions.',
      detail: 'Your write-up follows the standard five-chapter structure: Introduction, Literature Review, Methodology, Results, and Conclusion. Each chapter should flow logically into the next. The Results chapter presents findings objectively; the Conclusion chapter interprets, discusses implications, acknowledges limitations, and suggests directions for future research.',
      tips: ['Write the Methodology chapter first — it\'s the most concrete', 'Use tables and figures to present results clearly', 'Have your supervisor review each chapter iteratively'],
    },
    {
      id: 'submit', n: '10', t: 'Submit Your Report & Give Your Presentation', color: '#4A90A4',
      d: 'Submit the final thesis and defend your work in the oral presentation.',
      detail: 'The final submission is the culmination of your research journey. Ensure your report is professionally formatted, properly referenced, and free of errors. Your oral presentation should tell the story of your research: the gap you found, how you investigated it, what you discovered, and why it matters. Prepare for questions by anticipating challenges to your methodology and findings.',
      tips: ['Proofread with fresh eyes — or have a peer review it', 'Practice your presentation with a timer', 'Prepare backup slides for anticipated questions'],
    },
  ];

  const allClickable = [...PROCESS_STEPS, ...ANALYSIS_STEPS];
  const activeStep = active !== null ? allClickable.find(s => s.id === active) : null;
  const [activeMethod, setActiveMethod] = useState(null);

  const StepNode = ({ step, isActive, onClick, width = '100%', compact = false }) => (
    <button onClick={onClick} style={{
      width, textAlign: 'center', background: isActive ? C.white : step.color,
      border: isActive ? `2px solid ${C.red}` : `2px solid ${step.color}`,
      borderRadius: 8, padding: compact ? '10px 14px' : '14px 18px', cursor: 'pointer',
      fontFamily: "'Source Sans 3',sans-serif", transition: 'all 0.25s ease',
      boxShadow: isActive ? `0 4px 20px rgba(228,0,43,0.2)` : '0 2px 8px rgba(0,0,0,0.1)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      position: 'relative',
    }}>
      <div style={{
        fontSize: compact ? 12 : 13, fontWeight: 800, color: isActive ? C.red : 'rgba(255,255,255,0.7)',
        letterSpacing: '0.08em', marginBottom: compact ? 2 : 4,
      }}>STEP {step.n}</div>
      <div style={{
        fontSize: compact ? 13 : 15, fontWeight: 700,
        color: isActive ? C.black : C.white, lineHeight: 1.3,
      }}>{step.t}</div>
    </button>
  );

  const DownArrow = ({ dashed = false }) => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <svg width="20" height="24" viewBox="0 0 20 24">
        <line x1="10" y1="0" x2="10" y2="18" stroke={C.red} strokeWidth="2"
          strokeDasharray={dashed ? '4,3' : 'none'} />
        <polygon points="4,16 10,23 16,16" fill={C.red} />
      </svg>
    </div>
  );

  const DetailPanel = ({ step, onClose }) => {
    if (!step) return null;
    return (
      <div style={{
        background: C.white, border: `1px solid ${C.black10}`, borderLeft: `4px solid ${C.red}`,
        borderRadius: '0 10px 10px 0', padding: '24px 28px', marginTop: 8, marginBottom: 8,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        animation: 'fadeSlideIn 0.3s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, marginBottom: 4 }}>Step {step.n} · Detail</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.black, lineHeight: 1.2 }}>{step.t}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.black60, padding: '0 4px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ fontSize: 15, color: C.black80, lineHeight: 1.75, marginBottom: 18 }}>{step.detail}</div>
        {step.tips && <div style={{ background: C.black05, borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 10 }}>Practical tips</div>
          {step.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < step.tips.length - 1 ? 8 : 0 }}>
              <span style={{ color: C.red, fontSize: 14, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>→</span>
              <span style={{ fontSize: 14, color: C.black80, lineHeight: 1.55 }}>{tip}</span>
            </div>
          ))}
        </div>}
        {step.subTypes && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          {step.subTypes.map((st, i) => (
            <div key={i} style={{ background: C.black05, borderRadius: 8, padding: '14px 16px', borderTop: `3px solid ${i === 0 ? C.blue : C.green}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? C.blue : C.green, marginBottom: 6 }}>{st.label}</div>
              <div style={{ fontSize: 13, color: C.black80, lineHeight: 1.55 }}>{st.desc}</div>
            </div>
          ))}
        </div>}
      </div>
    );
  };

  return <div style={{paddingTop:56}}>
    <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulseArrow{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
    <Wrap bg={C.black05}>
      <Reveal><Label>The Research Process</Label><H>The Iterative Research Process</H>
        <P>Based on Saunders, Lewis & Thornhill (2018). Click any step to see details. Notice how the process is <strong>iterative</strong> — you continuously reflect, revise, and loop back as your understanding deepens.</P>
      </Reveal>

      <Reveal delay={0.1}>
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto 32px' }}>

          {/* ── "Forward Planning" left-side label ── */}
          <div style={{
            position: 'absolute', left: -8, top: 60, bottom: 180,
            width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}>
            <div style={{
              writingMode: 'vertical-lr', transform: 'rotate(180deg)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.red, opacity: 0.7, whiteSpace: 'nowrap',
            }}>
              Forward Planning
            </div>
            <svg style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 20, height: '100%', overflow: 'visible' }}>
              <defs>
                <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
                  <polygon points="0,0 8,0 4,6" fill={C.red} opacity="0.35" />
                </marker>
              </defs>
              <line x1="10" y1="10" x2="10" y2="100%" stroke={C.red} strokeWidth="2" opacity="0.25" markerEnd="url(#arrowDown)" />
            </svg>
          </div>

          {/* ── "Reflection & Revision" right-side label ── */}
          <div style={{
            position: 'absolute', right: -8, top: 60, bottom: 180,
            width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}>
            <div style={{
              writingMode: 'vertical-lr',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.black60, opacity: 0.7, whiteSpace: 'nowrap',
            }}>
              Reflection & Revision
            </div>
            <svg style={{ position: 'absolute', right: 8, top: 0, bottom: 0, width: 20, height: '100%', overflow: 'visible' }}>
              <defs>
                <marker id="arrowUp" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
                  <polygon points="0,6 8,6 4,0" fill={C.black60} opacity="0.35" />
                </marker>
              </defs>
              <line x1="10" y1="100%" x2="10" y2="10" stroke={C.black60} strokeWidth="2" opacity="0.25" strokeDasharray="6,4" markerEnd="url(#arrowUp)" />
            </svg>
          </div>

          {/* ── Main flowchart column ── */}
          <div style={{ padding: '0 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Steps 1–6 (planning & design phase) */}
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.id} style={{ width: '100%' }}>
                <StepNode step={step} isActive={active === step.id}
                  onClick={() => setActive(active === step.id ? null : step.id)} />
                {active === step.id && <DetailPanel step={step} onClose={() => setActive(null)} />}
                {i < PROCESS_STEPS.length - 1 && <DownArrow />}
              </div>
            ))}

            <DownArrow />

            {/* ── Data Collection zone ── */}
            <div style={{
              width: '100%', background: 'rgba(26,95,160,0.06)', border: `1.5px solid rgba(26,95,160,0.2)`,
              borderRadius: 12, padding: '20px 18px 16px', marginBottom: 0,
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: C.blue, marginBottom: 6, textAlign: 'center',
              }}>Plan your data collection and collect data considering one or more of:</div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
                {DATA_METHODS.map((m) => (
                  <button key={m.id} onClick={() => setActiveMethod(activeMethod === m.id ? null : m.id)} style={{
                    flex: '1 1 auto', minWidth: 100, maxWidth: 140,
                    background: activeMethod === m.id ? C.blue : C.white,
                    color: activeMethod === m.id ? C.white : C.blue,
                    border: `1.5px solid ${C.blue}`, borderRadius: 6, padding: '10px 12px',
                    cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif",
                    fontSize: 13, fontWeight: 700, textAlign: 'center', transition: 'all 0.2s',
                  }}>{m.label}</button>
                ))}
              </div>

              {activeMethod && (() => {
                const m = DATA_METHODS.find(d => d.id === activeMethod);
                return m ? <div style={{
                  marginTop: 12, background: C.white, borderRadius: 8, padding: '14px 16px',
                  borderLeft: `3px solid ${C.blue}`, fontSize: 14, color: C.black80, lineHeight: 1.65,
                }}><strong style={{ color: C.blue }}>{m.label}:</strong> {m.desc}</div> : null;
              })()}
            </div>

            <DownArrow />

            {/* ── Analysis & final steps ── */}
            {ANALYSIS_STEPS.map((step, i) => (
              <div key={step.id} style={{ width: '100%' }}>
                <StepNode step={step} isActive={active === step.id}
                  onClick={() => setActive(active === step.id ? null : step.id)} />
                {active === step.id && <DetailPanel step={step} onClose={() => setActive(null)} />}
                {i < ANALYSIS_STEPS.length - 1 && <DownArrow />}
              </div>
            ))}
          </div>

          {/* ── Iterative loop-back arrows (decorative SVG overlay) ── */}
          <svg style={{ position: 'absolute', top: 0, right: 28, width: 30, height: '85%', pointerEvents: 'none', overflow: 'visible' }} viewBox="0 0 30 600" preserveAspectRatio="none">
            {[120, 250, 400].map((y, i) => (
              <path key={i} d={`M 2 ${y} C 25 ${y}, 25 ${y - 70}, 2 ${y - 70}`}
                fill="none" stroke={C.black60} strokeWidth="1.2" strokeDasharray="4,3" opacity="0.3">
              </path>
            ))}
          </svg>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <Callout accent={C.blue} bg={C.blueBg}>
          <strong>Key insight:</strong> Research is never purely linear. You will revisit your literature review after data analysis reveals unexpected patterns, refine your hypotheses as you understand the data better, and revise your research design as practical constraints emerge. This iterative refinement is a feature of good research, not a sign of failure.
        </Callout>
      </Reveal>

      <Reveal delay={0.25}>
        <div style={{ fontSize: 12, color: C.black60, textAlign: 'center', marginTop: 12, marginBottom: 8, fontStyle: 'italic' }}>
          Adapted from Saunders, Lewis & Thornhill (2018), Figure 1.2
        </div>
      </Reveal>

      <NextBtn onClick={()=>{completeTab('s1:process');next()}}/>
    </Wrap>
  </div>;
}

function IdeasTab({next}){
  const { completeTab } = useGame();
  const rational=['Examining your own strengths and interests','Looking at past projects','Discussions','Searching existing literature','Scanning media and current events','Exploring personal preferences using past projects'];
  const creative=['Keeping a notebook of ideas','Exploring personal preferences using past projects','Relevance trees (branching off a theme)','Brainstorming with peers'];
  const areas=[
    {title:'Financial Reporting & Auditing',items:['International Financial Reporting Standards (IFRS)','Earnings quality & earnings management','Audit quality & auditor independence','Key Audit Matters (KAMs) disclosures','Integrated reporting & sustainability disclosure']},
    {title:'Corporate Governance',items:['Board composition and effectiveness','Executive compensation','CEO characteristics and firm outcomes','Institutional ownership']},
    {title:'Taxation',items:['Corporate tax avoidance and aggressiveness','Tax and financial reporting','International taxation']},
    {title:'Management Accounting',items:['Performance measurement','Cost management','Balanced scorecard and non-financial measures']},
    {title:'Finance',items:['Asset Pricing and Risk Management','Corporate Finance','Banking and Financial Intermediation','Sustainable and ESG Finance','Behavioural Finance','Household and personal finance']},
    {title:'Accounting Information Systems (AIS)',items:['ERP systems and accounting practices','Blockchain and digital ledger technology in accounting','Data analytics and artificial intelligence in auditing']},
  ];
  const checklist=[
    {cat:'Appropriateness',qs:['Does the topic fit the specifications and standards set by SIT?','Does it contain issues with a clear link to theory?','Can you state your research question(s), aim and objectives clearly?','Will it provide fresh insights and valuable findings?','Are findings likely to be symmetrical (valuable whatever the outcome)?']},
    {cat:'Capability',qs:['Do you have the necessary research skills within the timeframe?','Is it achievable within the available time?','Is it achievable within the financial resources available?','Are you reasonably certain of being able to gain access to the data you need?']},
    {cat:'Fulfilment',qs:['Does the topic really interest and motivate you?','Will it help towards the achievement of your future aspirations or career goals?']},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap bg={C.black05}>
      <Reveal><Label>Generating Research Ideas</Label><H>How to Generate Research Ideas</H><P>Use a combination of rational and creative thinking techniques to find your research topic (Saunders et al., 2018).</P></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}}>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:12}}>Rational Thinking</div>{rational.map((r,i)=><Li key={i}color={C.black}>{r}</Li>)}</Card>
        <Card style={{background:C.red,borderColor:C.red}}><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:12}}>Creative Thinking</div>{creative.map((r,i)=><Li key={i}color="rgba(255,255,255,0.5)"><span style={{color:'rgba(255,255,255,0.85)'}}>{r}</span></Li>)}</Card>
      </div></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label>Brainstorming</Label><H size={30}>Topic Areas for ACC3018</H><P>Six broad accounting and finance domains. Expand each to explore potential research directions.</P></Reveal>
      <Reveal delay={0.1}><Accordion items={areas.map(a=>({title:a.title,content:<ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:6}}>{a.items.map((item,i)=><li key={i}><Li>{item}</Li></li>)}</ul>}))}/></Reveal>
    </Wrap>

    {/* ─── SCENARIO: The PhD Journey ─── */}
    <Wrap bg={C.black} py={56}>
      <PhDJourneyScenario/>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={30}>Characteristics of a Good Research Topic</H><P>Use this Box 2.1 checklist to evaluate your potential topic.</P></Reveal>
      {checklist.map((c,ci)=><Reveal key={ci} delay={ci*0.08}><div style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,color:C.red,marginBottom:8}}>{c.cat}</div>{c.qs.map((q,qi)=><div key={qi} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:5}}><span style={{color:C.green,fontSize:16,flexShrink:0,marginTop:1}}>✓</span><span style={{fontSize:14,color:C.black80,lineHeight:1.6}}>{q}</span></div>)}</div></Reveal>)}
      <NextBtn onClick={()=>{completeTab('s1:ideas');next()}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// PHD JOURNEY SCENARIO — branching narrative
// ═══════════════════════════════════════════════════════════════
const PHD_JOURNEY = {
  start: {
    narration: "It's Week 1. You need a research topic. Your supervisor asks, 'What interests you?' You have three instincts:",
    choices: [
      { label: "Pick something trendy — AI in accounting", next: 'ai-broad', insight: null },
      { label: "Pick something personal — your SIT library experience", next: 'library-narrow', insight: null },
      { label: "Pick something safe — replicate a famous paper", next: 'replicate', insight: null },
    ],
  },
  'ai-broad': {
    feedback: { tone: 'warn', title: 'Too broad', text: "'AI in accounting' is a whole field, not a research question. You'll spend weeks narrowing it down. That said, it's an active literature with plenty of gaps." },
    narration: "Your supervisor nods slowly. 'Good instinct, but narrow it down. Which of these feels more like a testable question?'",
    choices: [
      { label: "Does ChatGPT pass CA exam questions as well as humans?", next: 'ai-testable', insight: 'Specific, testable, has a measurable outcome.' },
      { label: "How will AI change the accounting profession?", next: 'ai-still-broad', insight: null },
      { label: "Is AI making auditors obsolete?", next: 'ai-still-broad', insight: null },
    ],
  },
  'ai-testable': {
    feedback: { tone: 'good', title: 'Sharp narrowing', text: "You have a specific, measurable question with a clear dependent variable (accuracy score). This could work." },
    narration: "Now your supervisor asks the hard question: 'What's the gap? Why hasn't someone already answered this?'",
    choices: [
      { label: "No one has tested a specific exam (CA Qualification) — context is new", next: 'ending-strong', insight: 'Context as gap: a valid and common strategy in applied research.' },
      { label: "I'm not sure — I just think it's interesting", next: 'ending-weak', insight: null },
    ],
  },
  'ai-still-broad': {
    feedback: { tone: 'warn', title: 'Still too broad', text: "These are essay questions, not research questions. You need a specific, measurable outcome variable (Y) and a specific input (X)." },
    narration: "Try again: which is a proper research question?",
    choices: [
      { label: "Does ChatGPT pass CA exam questions as well as humans?", next: 'ai-testable', insight: 'Specific, testable, has a measurable outcome.' },
      { label: "Is AI the future of accounting?", next: 'ending-weak', insight: null },
    ],
  },
  'library-narrow': {
    feedback: { tone: 'neutral', title: 'Personal = motivating, but…', text: "Personal relevance fuels persistence. But be careful — single-institution studies can have generalisability issues. What angle are you taking?" },
    narration: "Your supervisor asks: 'What's the theoretical basis? What construct are you studying?'",
    choices: [
      { label: "Measuring library 'greenness' — a carbon footprint study of publishers", next: 'ending-strong', insight: 'Concrete, measurable, with industry relevance (procurement).' },
      { label: "Students' feelings about the library", next: 'library-vague', insight: null },
      { label: "How the library could improve — general feedback study", next: 'library-vague', insight: null },
    ],
  },
  'library-vague': {
    feedback: { tone: 'warn', title: 'No theory, no hypothesis', text: "General feedback or feelings studies are hard to publish — no theoretical anchor, no falsifiable hypothesis. You need a construct from the literature." },
    narration: "What about this instead?",
    choices: [
      { label: "Measuring library 'greenness' — a carbon footprint study of publishers", next: 'ending-strong', insight: 'Concrete, measurable, with industry relevance.' },
      { label: "Keep it as a general feedback study", next: 'ending-weak', insight: null },
    ],
  },
  replicate: {
    feedback: { tone: 'neutral', title: 'Replication has value — with a twist', text: "Pure replication is hard to publish in top journals. But extending or testing a famous result in a new context (e.g., Singapore, post-COVID) is a legitimate strategy." },
    narration: "Which extension angle appeals to you?",
    choices: [
      { label: "Test Roychowdhury (2006) on Singapore-listed firms", next: 'ending-strong', insight: 'New context + established method = safe but rigorous.' },
      { label: "Just re-run the original analysis", next: 'ending-weak', insight: null },
      { label: "Test Roychowdhury (2006) on a post-IFRS sample", next: 'ending-strong', insight: 'Natural experiment framing — exploits a regulatory change.' },
    ],
  },
  'ending-strong': {
    ending: true,
    result: 'strong',
    title: 'Supervisor-Approved Topic ✓',
    text: 'You now have a topic that is (1) specific and measurable, (2) theoretically grounded, and (3) has a clear contribution — either new context, new method, or new data. This is how research topics actually get chosen.',
    takeaway: 'A good topic emerges from iteration, not inspiration. Expect 2–3 rounds of narrowing before your supervisor gives a green light.',
  },
  'ending-weak': {
    ending: true,
    result: 'weak',
    title: 'Try again — this won\'t fly',
    text: 'Your topic lacks a clear gap, measurable outcome, or theoretical basis. Your supervisor sends you back to re-read more literature.',
    takeaway: 'When choosing a topic, always be able to answer: What is the gap? What is Y? What is X? Why does this matter?',
  },
};

function PhDJourneyScenario() {
  const { awardXpOnce, awardBadge, recordScenario, progress } = useGame();
  const [node, setNode] = useState('start');
  const [path, setPath] = useState([]);
  const [insights, setInsights] = useState([]);
  const [done, setDone] = useState(false);

  const current = PHD_JOURNEY[node];

  const choose = (c) => {
    const newPath = [...path, { from: node, choice: c.label }];
    setPath(newPath);
    if (c.insight) setInsights([...insights, c.insight]);
    if (PHD_JOURNEY[c.next].ending) {
      setNode(c.next);
      setDone(true);
      const ending = PHD_JOURNEY[c.next];
      const xp = ending.result === 'strong' ? 60 : 25;
      awardXpOnce('scenario:s1:phd-journey', xp, ending.result === 'strong' ? 'Strong topic path' : 'Completed scenario', { allowImprovement: true });
      awardBadge('path-chooser');
      recordScenario('s1:phd-journey', { path: newPath, ending: c.next, result: ending.result });
    } else {
      setNode(c.next);
    }
  };

  const restart = () => { setNode('start'); setPath([]); setInsights([]); setDone(false); };

  return <div style={{maxWidth:800,margin:'0 auto'}}>
    <Reveal>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Scenario · The PhD Journey</div>
      <h2 style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1.1,marginBottom:12,letterSpacing:'-0.02em'}}>Pick Your Research Path</h2>
      <p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.65,marginBottom:28}}>Play through a topic selection conversation with your supervisor. Every choice has consequences — some lead to approved topics, others to rejection. Multiple paths lead to success.</p>
    </Reveal>

    <Reveal delay={0.1}>
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'28px 30px',marginBottom:20}}>
        {/* Path breadcrumbs */}
        {path.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          {path.map((p,i)=><span key={i} style={{fontSize:11,color:'rgba(255,255,255,0.45)',background:'rgba(255,255,255,0.05)',padding:'4px 10px',borderRadius:99}}>{i+1}. {p.choice.length>38?p.choice.slice(0,38)+'…':p.choice}</span>)}
        </div>}

        {/* Feedback on last choice */}
        {current.feedback && <div style={{background:current.feedback.tone==='good'?'rgba(26,127,75,0.12)':current.feedback.tone==='warn'?'rgba(230,119,0,0.12)':'rgba(255,255,255,0.04)',borderLeft:`3px solid ${current.feedback.tone==='good'?C.green:current.feedback.tone==='warn'?C.amber:'rgba(255,255,255,0.3)'}`,borderRadius:'0 8px 8px 0',padding:'14px 18px',marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:current.feedback.tone==='good'?C.green:current.feedback.tone==='warn'?C.amber:'rgba(255,255,255,0.5)',marginBottom:4}}>{current.feedback.title}</div>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.65}}>{current.feedback.text}</div>
        </div>}

        {/* Ending screen */}
        {current.ending ? <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:current.result==='strong'?C.gold:C.amber,marginBottom:10}}>{current.result==='strong'?'★ Successful Path':'Retry — Path Led Nowhere'}</div>
          <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:12,letterSpacing:'-0.01em'}}>{current.title}</div>
          <div style={{fontSize:15,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:18}}>{current.text}</div>
          <div style={{background:'rgba(228,0,43,0.1)',borderLeft:`3px solid ${C.red}`,padding:'12px 16px',borderRadius:'0 6px 6px 0',marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:4,letterSpacing:'0.06em',textTransform:'uppercase'}}>Takeaway</div>
            <div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.65}}>{current.takeaway}</div>
          </div>
          {insights.length > 0 && <div style={{marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:8}}>Insights you earned along the way</div>
            {insights.map((ins,i)=><div key={i} style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.55,marginBottom:4}}>→ {ins}</div>)}
          </div>}
          <button onClick={restart} style={{background:C.red,color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Try a different path</button>
        </div> : <div>
          {/* Narration */}
          <div style={{fontSize:16,color:'rgba(255,255,255,0.82)',lineHeight:1.7,marginBottom:18,fontStyle:'italic'}}>"{current.narration}"</div>

          {/* Choices */}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {current.choices.map((c,i)=><button key={i} onClick={()=>choose(c)} style={{textAlign:'left',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'14px 16px',color:'rgba(255,255,255,0.85)',fontFamily:"'Source Sans 3',sans-serif",fontSize:14,cursor:'pointer',transition:'all 0.2s',display:'flex',gap:12,alignItems:'flex-start'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(228,0,43,0.12)';e.currentTarget.style.borderColor=C.red}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
              <div style={{width:22,height:22,border:'1px solid rgba(255,255,255,0.3)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{String.fromCharCode(65+i)}</div>
              <span style={{lineHeight:1.5}}>{c.label}</span>
            </button>)}
          </div>
        </div>}
      </div>
    </Reveal>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 5: LIT REVIEW
// ═══════════════════════════════════════════════════════════════
function LitReviewTab({next}){
  const { completeTab, awardBadge } = useGame();
  const whyItems=['To conduct a \'preliminary\' search of existing material to help generate and refine your research ideas and draft your research proposal.','To develop a critical perspective — provides the context and theoretical framework for your research.','To identify other research that may be in progress and to place your research findings within the wider body of knowledge (forms part of your discussion chapter).','It can tell you if a research question has already been answered.','It can help you evaluate the interestingness of a research question.','It can give you ideas for how to conduct your own study.','It can tell you how your study fits into the research literature.'];
  const questions=[{q:'What types of research have been done in the area?',p:'Understand the landscape'},{q:'What has been found in previous studies?',p:'Build on prior evidence'},{q:'What suggestions do other researchers make for further study?',p:'Find future directions'},{q:'What has not been investigated?',p:'→ The GAP → identify your Research Question → Develop your hypotheses'},{q:'How can the proposed study add to our knowledge of the area?',p:'→ The CONTRIBUTION of your study'},{q:'What research methods were used in previous studies?',p:'→ Develop your Research Design'}];
  const sourceTypes=['Refereed (peer-reviewed) academic journal','Non-refereed academic journal','Professional journal','Trade journals/magazines','Books and e-books','Newspapers','Conference proceedings','Reports','Theses'];
  const journals=['Journal of Accounting & Economics (JAE)','Journal of Accounting Research (JAR)','The Accounting Review (TAR)','Journal of Finance (JF)','Journal of Financial Economics (JFE)','Review of Financial Studies (RFS)','Contemporary Accounting Research (CAR)','Accounting Horizons (AH)'];
  const eqTable=[{attr:'Accrual Quality',measure:'Mapping current accrual towards past, present and future cash flow',refs:'Dechow & Dichev (2002); Largay III (2002); Francis et al. (2003a, 2003b, 2004); Chambers (2003)'},{attr:'Persistence',measure:'Regression coefficient of current earnings towards future earnings (Model AR1)',refs:'Francis et al. (2003b, 2004); Sloan (1996)'},{attr:'Predictability',measure:'Standard deviation of model AR1 error',refs:'Lougee & Marquardt (2002); Francis et al. (2003a); Brown & Sivakumar (2001)'},{attr:'Smoothness',measure:'Ratio of earnings variability towards cash flow variability',refs:'Francis et al. (2003b, 2004)'}];

  const onContinue = () => { completeTab('s1:litreview'); awardBadge('lit-scholar'); next(); };

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Literature Review</Label><H>Why Do We Need a Literature Review?</H></Reveal>
      <Reveal delay={0.1}><div style={{marginBottom:32}}>{whyItems.map((item,i)=><Num key={i} n={i+1}>{item}</Num>)}</div></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={30}>Key Questions Your Lit Review Should Answer</H><P>Answers to these questions will usually help define a specific hypothesis or research question.</P></Reveal>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {questions.map((q,i)=><Reveal key={i} delay={i*0.05}><Card><div style={{fontSize:14,fontWeight:600,color:C.black,marginBottom:4}}>Q. {q.q}</div><div style={{fontSize:13,color:C.red,fontWeight:600}}>{q.p}</div></Card></Reveal>)}
      </div>
    </Wrap>

    <DarkWrap py={48}>
      <Reveal><div style={{fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:14}}>Literature Review & Hypotheses Development — Expected Sub-sections</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
          {[{n:'01',t:'Theoretical Basis',d:'Foundation theory for your RQ'},{n:'02',t:'Past Findings',d:'Relevant results from prior studies'},{n:'03',t:'Hypothesis Development',d:'How EACH hypothesis is developed'},{n:'04',t:'Linkage',d:'Establish connections between topics'},{n:'05',t:'State Hypotheses',d:'Clear H₀ and Hₐ statements'}].map((s,i)=><div key={i} style={{borderLeft:`3px solid ${C.red}`,paddingLeft:10}}><div style={{fontSize:10,fontWeight:700,color:C.red}}>{s.n}</div><div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{s.d}</div></div>)}
        </div></Reveal>
    </DarkWrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={30}>Literature Sources (ranked by reliability)</H></Reveal>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:28}}>{sourceTypes.map((s,i)=><Reveal key={i} delay={i*0.03}><div style={{display:'flex',gap:10,alignItems:'center',padding:'8px 12px',background:C.white,borderRadius:4,border:`1px solid ${C.black10}`}}><div style={{width:24,height:24,background:i===0?C.red:C.black05,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:i===0?'#fff':C.black60,flexShrink:0}}>{i+1}</div><span style={{fontSize:14,fontWeight:i===0?700:400,color:C.black}}>{s}</span></div></Reveal>)}</div>

      <Reveal><div style={{fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:10}}>Top Journals for ACC3018</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:28}}>{journals.map((j,i)=><span key={i} style={{background:i===0?C.red:C.white,color:i===0?C.white:C.black80,border:`1px solid ${i===0?C.red:C.black20}`,padding:'5px 12px',borderRadius:4,fontSize:12,fontWeight:600}}>{j}</span>)}</div></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><H size={30}>Example: Earnings Quality Literature</H><P>This table shows how a literature review maps attributes to measurements and key researchers — a model for your own lit review.</P></Reveal>
      <Reveal delay={0.1}><div style={{borderRadius:8,overflow:'hidden',border:`1px solid ${C.black10}`,marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'0.8fr 1.5fr 1.5fr',background:C.black}}>{['Attribute','Measurement','Key Researchers'].map(h=><div key={h} style={{padding:'10px 14px',fontSize:12,fontWeight:700,color:C.white}}>{h}</div>)}</div>
        {eqTable.map((r,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'0.8fr 1.5fr 1.5fr',background:i%2===0?C.white:C.black05}}><div style={{padding:'10px 14px',fontSize:13,fontWeight:600,color:C.black}}>{r.attr}</div><div style={{padding:'10px 14px',fontSize:13,color:C.black80,fontStyle:'italic'}}>{r.measure}</div><div style={{padding:'10px 14px',fontSize:12,color:C.black60}}>{r.refs}</div></div>)}
      </div></Reveal>
      <Reveal delay={0.15}><Card style={{borderLeft:`4px solid ${C.blue}`,marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,color:C.blue,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Mini Activity: Source Quality Check</div>
        <P mb={12}>Before citing a paper, decide whether it is strong enough to support your argument.</P>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>
          {['Peer-reviewed journal or credible working paper','Clear research question and method','Relevant context, sample, and variables','Findings you can connect to your hypothesis'].map((item,i)=><Li key={i} color={C.blue}>{item}</Li>)}
        </div>
        <Callout accent={C.amber} bg={C.amberBg}><strong>Academic integrity:</strong> Use AI tools only to clarify your thinking or improve expression. Do not invent citations, outsource analysis, or submit generated text that you cannot explain and verify from the original sources.</Callout>
      </Card></Reveal>
      <NextBtn onClick={onContinue}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 6: HYPOTHESES — with HYPOTHESIS BUILDER
// ═══════════════════════════════════════════════════════════════
function HypothesesTab({next}){
  const { completeTab } = useGame();
  return <div style={{paddingTop:56}}>
    <Wrap bg={C.black05}>
      <Reveal><Label>Hypotheses Development</Label><H>How to Formulate Hypotheses</H></Reveal>
      <Reveal delay={0.1}><div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
        {[{s:'01',t:'Make a Prediction',d:'Based on previous observations or research. Provide theoretical argument, reasoning, etc. For example: "ESG improves firm performance. Why? Because stakeholder theory suggests that firms attending to broader stakeholder needs build reputational capital..."'},
          {s:'02',t:'Define Variables',d:'Define objective independent variable (X, e.g. ESG score) and dependent variable (Y, e.g. Performance measured by ROA). Be specific about how each is measured.'},
          {s:'03',t:'Ensure Testability',d:'Make sure the hypothesis is testable (you need to develop regression models to test it) and falsifiable (you must be able to state both Null and Alternative Hypotheses).'}
        ].map((s,i)=><div key={i} style={{display:'flex',gap:14,alignItems:'flex-start',background:C.white,borderRadius:8,padding:'18px 20px',border:`1px solid ${C.black10}`}}><div style={{width:38,height:38,background:C.red,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:C.white,flexShrink:0}}>{s.s}</div><div><div style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:4}}>{s.t}</div><div style={{fontSize:14,color:C.black80,lineHeight:1.65}}>{s.d}</div></div></div>)}
      </div></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><H size={30}>When Formulating the Hypothesis, Consider:</H></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:28}}>
        {['Express a relation between X and Y variables','Wording should be clear and unambiguous','Imply possibilities for testing (from research design)','Type of dataset: cross-sectional, time-series, or panel','Unit of observation: firm, individual, country, etc.','Nature of variables: Continuous (e.g. ROA), Dummy (e.g. gender), Index, etc.','Distinguish: independent vs dependent vs control variables','Nature of research methodology: Linear or non-linear'].map((c,i)=><div key={i} style={{display:'flex',gap:6,alignItems:'flex-start'}}><Dot/><span style={{fontSize:13,color:C.black80,lineHeight:1.55}}>{c}</span></div>)}
      </div></Reveal>

      <Reveal delay={0.2}><Card style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Stating the Hypothesis</div>
        <P mb={12}>Either state both the null (H₀) and alternate hypothesis (Hₐ), OR just the alternate hypothesis (Hₐ).</P>
        <div style={{background:C.black05,borderRadius:6,padding:'14px 18px',marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>Example:</div>
          <div style={{fontSize:14,color:C.black80,lineHeight:1.65}}><strong>Hypothesis 1 (Hₐ):</strong> Firms with higher (lower) ESG scores performed better (poorer), <em>ceteris paribus</em>.</div>
        </div>
        <Li>Expect a <strong>positive relationship</strong> between X and Y in regression analysis.</Li>
        <Li><em>Ceteris paribus</em>: all else equal — which includes other Xs that are statistically significant in explaining Y in the literature (your control variables).</Li>
      </Card></Reveal>
    </Wrap>

    {/* ─── HYPOTHESIS BUILDER ─── */}
    <Wrap bg={C.black} py={56}>
      <HypothesisBuilder/>
    </Wrap>

    <Wrap>
      <NextBtn onClick={()=>{completeTab('s1:hypotheses');next()}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// HYPOTHESIS BUILDER — guided construction with validation
// ═══════════════════════════════════════════════════════════════
const BUILDER_SCENARIOS = [
  {
    id: 's1:esg-performance',
    topic: 'ESG & Firm Performance',
    prompt: "You want to test whether better ESG ratings lead to better firm performance. Build the alternate hypothesis (Hₐ) step by step.",
    slots: [
      { key: 'iv', label: 'Independent Variable (X)', hint: 'What are you predicting explains Y?', options: ['ESG score (Refinitiv)', 'CEO age', 'Firm size', 'Stock ticker'], correct: [0], explain: { 0: 'ESG score is the X we care about.', 1: 'CEO age is a control variable here, not your key predictor.', 2: 'Firm size is a control.', 3: 'A stock ticker is an identifier — it cannot be a variable.' }},
      { key: 'dv', label: 'Dependent Variable (Y)', hint: 'What outcome do you want to explain?', options: ['Return on Assets (ROA)', 'Stakeholder theory', 'Sample size', 'Year dummy'], correct: [0], explain: { 0: 'ROA is a standard, measurable performance metric.', 1: 'A theory is a framework, not a measurable variable.', 2: 'Sample size is a property of your data, not an outcome variable.', 3: 'Year dummies are typically controls, not the main Y.' }},
      { key: 'direction', label: 'Direction', hint: 'How should X relate to Y according to your theory?', options: ['Higher X → higher Y (positive)', 'Higher X → lower Y (negative)', 'No relationship', "Can't tell without data"], correct: [0], explain: { 0: 'Matches stakeholder theory — reputational capital improves performance.', 1: 'This would support the "ESG is a distraction" view — a valid alternative, but not what we predicted.', 2: 'Stating no relationship is the null, not your prediction.', 3: 'The whole point of Hₐ is to state a direction a priori.' }},
      { key: 'controls', label: 'Ceteris paribus clause', hint: 'What phrase signals you are controlling for other factors?', options: ['"ceteris paribus"', '"on average"', '"without controls"', '"in theory"'], correct: [0], explain: { 0: 'Ceteris paribus = all else equal. This is the standard phrase for declaring you\'ll include controls.', 1: '"On average" is weaker and does not imply controls.', 2: 'Directly opposite of what you want.', 3: 'Hₐ should be empirical, not purely theoretical.' }},
    ],
    template: (a) => `Hₐ: Firms with higher ${a.iv} exhibit higher ${a.dv}, ${a.controls}.`,
  },
  {
    id: 's1:board-diversity',
    topic: 'Board Gender Diversity & Risk-Taking',
    prompt: "Build a hypothesis testing whether greater board gender diversity is associated with lower corporate risk-taking.",
    slots: [
      { key: 'iv', label: 'Independent Variable (X)', hint: 'What feature of the board are you measuring?', options: ['% of women on board', 'CEO duality', 'Board size', 'Shareholder identity'], correct: [0], explain: { 0: '% of female directors is the direct measure of gender diversity.', 1: 'CEO duality is a different governance variable.', 2: 'Board size captures structure, not diversity.', 3: 'Shareholder identity is ownership, not board composition.' }},
      { key: 'dv', label: 'Dependent Variable (Y)', hint: 'How do you operationalise "corporate risk-taking"?', options: ['Stock return volatility', 'Board size', 'ESG score', 'Annual report length'], correct: [0], explain: { 0: 'Return volatility is a standard, empirically validated proxy for risk.', 1: 'Size is not a risk measure.', 2: 'ESG is a separate construct.', 3: 'Report length is not a risk proxy.' }},
      { key: 'direction', label: 'Direction', hint: 'Prior literature suggests women directors are more risk-averse — what direction follows?', options: ['Higher X → higher Y (positive)', 'Higher X → lower Y (negative)', 'No relationship', 'Non-linear (U-shape)'], correct: [1], explain: { 0: 'Positive direction contradicts the risk-aversion literature.', 1: 'More diverse boards → more risk-averse → lower volatility.', 2: 'That would be the null, not Hₐ.', 3: 'A U-shape is possible but needs a separate theoretical argument.' }},
      { key: 'controls', label: 'Ceteris paribus clause', hint: 'Standard phrase to signal controls are included?', options: ['"ceteris paribus"', '"in most cases"', '"roughly"', 'No clause needed'], correct: [0], explain: { 0: 'Ceteris paribus = all else equal. Standard academic phrasing.', 1: 'Too informal for an Hₐ.', 2: 'Too informal.', 3: 'Always signal controls explicitly when they exist.' }},
    ],
    template: (a) => `Hₐ: Firms with higher ${a.iv} exhibit lower ${a.dv}, ${a.controls}.`,
  },
];

function HypothesisBuilder() {
  const { awardXpOnce, awardBadge, markHypothesis } = useGame();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const scenario = BUILDER_SCENARIOS[scenarioIdx];

  const pickOption = (slotKey, optionIdx) => {
    if (revealed[slotKey]) return;
    setAnswers(a => ({ ...a, [slotKey]: optionIdx }));
  };

  const checkSlot = (slotKey) => {
    setRevealed(r => ({ ...r, [slotKey]: true }));
  };

  const allRevealed = scenario.slots.every(s => revealed[s.key]);
  const allCorrect = scenario.slots.every(s => s.correct.includes(answers[s.key]));

  const submitHypothesis = () => {
    setSubmitted(true);
    const correctCount = scenario.slots.filter(s => s.correct.includes(answers[s.key])).length;
    const xp = correctCount * 15 + (allCorrect ? 30 : 0);
    awardXpOnce(`builder:${scenario.id}`, xp, allCorrect ? 'Valid hypothesis constructed!' : `${correctCount}/${scenario.slots.length} slots correct`, { allowImprovement: true });
    awardBadge('hypothesis-smith');
    markHypothesis(scenario.id);
  };

  const loadScenario = (idx) => {
    setScenarioIdx(idx);
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
  };

  // Build the preview string
  const previewAnswers = {};
  scenario.slots.forEach(s => {
    const ansIdx = answers[s.key];
    previewAnswers[s.key] = ansIdx !== undefined ? scenario.slots.find(x=>x.key===s.key).options[ansIdx] : `[${s.label}]`;
  });
  const previewText = scenario.template(previewAnswers);

  return <div style={{maxWidth:800,margin:'0 auto'}}>
    <Reveal>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Interactive · Hypothesis Builder</div>
      <h2 style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1.1,marginBottom:12,letterSpacing:'-0.02em'}}>Build a Valid Hypothesis</h2>
      <p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.65,marginBottom:24}}>Pick the right variables, direction, and phrasing to assemble a proper alternate hypothesis (Hₐ). Each correct slot earns XP.</p>
    </Reveal>

    <Reveal delay={0.08}>
      {/* Scenario tabs */}
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
        {BUILDER_SCENARIOS.map((s,i)=><button key={s.id} onClick={()=>loadScenario(i)} style={{background:i===scenarioIdx?C.red:'rgba(255,255,255,0.05)',color:i===scenarioIdx?'#fff':'rgba(255,255,255,0.55)',border:`1px solid ${i===scenarioIdx?C.red:'rgba(255,255,255,0.1)'}`,borderRadius:6,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>
          Scenario {i+1}: {s.topic}
        </button>)}
      </div>

      {/* Prompt */}
      <div style={{background:'rgba(255,255,255,0.04)',borderLeft:`3px solid ${C.red}`,borderRadius:'0 8px 8px 0',padding:'14px 18px',marginBottom:24}}>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.65}}>{scenario.prompt}</div>
      </div>

      {/* Live preview */}
      <div style={{background:'rgba(228,0,43,0.1)',border:`1px dashed ${C.red}`,borderRadius:8,padding:'18px 20px',marginBottom:24,fontFamily:"'JetBrains Mono',monospace"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Your hypothesis so far</div>
        <div style={{fontSize:15,color:C.white,lineHeight:1.6}}>{previewText}</div>
      </div>

      {/* Slots */}
      <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>
        {scenario.slots.map((slot,si)=>{
          const ansIdx = answers[slot.key];
          const isRevealed = revealed[slot.key];
          const isCorrect = slot.correct.includes(ansIdx);
          return <div key={slot.key} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${isRevealed?(isCorrect?C.green:C.red):'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'16px 18px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red}}>Slot {si+1} · {slot.label}</div>
              {isRevealed && <div style={{fontSize:11,fontWeight:700,color:isCorrect?C.green:C.amber}}>{isCorrect?'✓ Correct (+15 XP)':'× Review'}</div>}
            </div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:10}}>{slot.hint}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
              {slot.options.map((opt,oi)=>{
                const selected = ansIdx === oi;
                const isThisCorrect = slot.correct.includes(oi);
                let bg='rgba(255,255,255,0.04)', bd='rgba(255,255,255,0.1)', cl='rgba(255,255,255,0.7)';
                if (isRevealed) {
                  if (isThisCorrect) { bg='rgba(26,127,75,0.15)'; bd=C.green; cl=C.green; }
                  else if (selected) { bg='rgba(228,0,43,0.12)'; bd=C.red; cl=C.red; }
                } else if (selected) { bg='rgba(228,0,43,0.15)'; bd=C.red; cl='#fff'; }
                return <button key={oi} onClick={()=>pickOption(slot.key,oi)} disabled={isRevealed} style={{background:bg,border:`1px solid ${bd}`,color:cl,padding:'9px 12px',fontSize:12.5,fontWeight:600,borderRadius:6,cursor:isRevealed?'default':'pointer',fontFamily:"'Source Sans 3',sans-serif",textAlign:'left'}}>{opt}</button>;
              })}
            </div>
            {!isRevealed && ansIdx !== undefined && <button onClick={()=>checkSlot(slot.key)} style={{background:C.red,color:'#fff',border:'none',borderRadius:4,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Lock in choice</button>}
            {isRevealed && ansIdx !== undefined && <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.6,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'10px 14px',marginTop:4}}>
              <strong style={{color:isCorrect?C.green:C.amber}}>{isCorrect?'Good choice:':'Why not:'}</strong> {slot.explain[ansIdx]}
            </div>}
          </div>;
        })}
      </div>

      {/* Submit */}
      {allRevealed && !submitted && <button onClick={submitHypothesis} style={{background:allCorrect?C.green:C.amber,color:'#fff',border:'none',borderRadius:6,padding:'14px 28px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif",display:'flex',alignItems:'center',gap:10}}>
        Submit Hypothesis ({scenario.slots.filter(s=>s.correct.includes(answers[s.key])).length}/{scenario.slots.length} correct)
      </button>}

      {submitted && <div style={{background:allCorrect?'rgba(26,127,75,0.12)':'rgba(230,119,0,0.12)',border:`1px solid ${allCorrect?C.green:C.amber}`,borderRadius:10,padding:'18px 22px'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:allCorrect?C.green:C.amber,marginBottom:8}}>{allCorrect?'★ Hypothesis Locked In':'Hypothesis — revise then retry'}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.white,lineHeight:1.6,background:'rgba(0,0,0,0.3)',borderRadius:6,padding:'14px 16px',marginBottom:10}}>{previewText}</div>
        {allCorrect && <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.65,marginBottom:10}}>This is a well-formed Hₐ: it specifies X, Y, a theoretical direction, and a ceteris paribus clause. You can now write a regression model to test it.</div>}
        <button onClick={()=>loadScenario(scenarioIdx)} style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Retry this scenario</button>
      </div>}
    </Reveal>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 7: DESIGN
// ═══════════════════════════════════════════════════════════════
function DesignTab({next}){
  const { completeTab } = useGame();
  const [cleaningView, setCleaningView] = useState('raw');
  const rawData = [
    { firm: 'A', x: 1, y: 3 },
    { firm: 'B', x: 2, y: 5 },
    { firm: 'C', x: 3, y: 6 },
    { firm: 'D', x: 4, y: 8 },
    { firm: 'E', x: 5, y: 10 },
    { firm: 'F', x: 6, y: 28, outlier: true },
  ];
  const dataByView = {
    raw: rawData,
    winsor: rawData.map(d => d.outlier ? { ...d, y: 14, note: 'winsorised' } : d),
    exclude: rawData.filter(d => !d.outlier),
  };
  const cleanData = dataByView[cleaningView];
  const slope = (() => {
    const meanX = cleanData.reduce((s, d) => s + d.x, 0) / cleanData.length;
    const meanY = cleanData.reduce((s, d) => s + d.y, 0) / cleanData.length;
    const cov = cleanData.reduce((s, d) => s + ((d.x - meanX) * (d.y - meanY)), 0);
    const varX = cleanData.reduce((s, d) => s + ((d.x - meanX) ** 2), 0);
    return cov / varX;
  })();
  const cleaningNotes = {
    raw: 'The extreme firm-year is kept as-is. The slope becomes much steeper, so one observation can dominate the story.',
    winsor: 'The extreme value is capped at a reasonable upper bound. The observation remains, but its influence is reduced.',
    exclude: 'The unusual firm-year is removed after a documented rule. The slope reflects the typical pattern more closely.',
  };
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Research Design</Label><H>Building Your Regression Model</H><P>The research design translates your hypotheses into testable models. Every variable must be precisely defined.</P></Reveal>
      <Reveal delay={0.1}><div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:32}}>
        {[{t:'Develop Regression Models',d:'Build regression models to test each hypothesis. The model specification should directly map to your Hₐ.'},
          {t:'Explain Key & Control Variables',d:'State variable name, type (continuous/dummy/index), definition, and data source. Include ALL variable definitions in the Appendix.'},
          {t:'State Expected Coefficient',d:'For each hypothesis, state the expected coefficient estimate (positive or negative) for your key X. This is the testable prediction.'},
          {t:'Describe Your Sample',d:'Data sources (Compustat, CRSP, Bloomberg, etc.), time horizon, selection criteria, final sample size. Use precise notation: i (firm), t (year).'}
        ].map((s,i)=><div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:C.black05,borderRadius:8,padding:'14px 16px'}}><div style={{width:26,height:26,background:C.red,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#fff',flexShrink:0}}>{i+1}</div><div><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:3}}>{s.t}</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>{s.d}</div></div></div>)}
      </div></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label color={C.amber}>Before Regression</Label><H size={30}>Data Cleaning Can Change the Result</H><P>Regression is not just typing a model into software. Before estimating, researchers need to check whether unusual observations, miscoded values, missing data, or inconsistent units are shaping the result.</P></Reveal>
      <Reveal delay={0.08}><div style={{display:'grid',gridTemplateColumns:'1.05fr 0.95fr',gap:16,alignItems:'stretch'}}>
        <Card style={{height:'100%'}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Mini-lab: one outlier, three choices</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
            {[
              { id: 'raw', label: 'Raw data' },
              { id: 'winsor', label: 'Winsorise' },
              { id: 'exclude', label: 'Exclude' },
            ].map(opt => <button key={opt.id} onClick={()=>setCleaningView(opt.id)} style={{background:cleaningView===opt.id?C.red:C.white,color:cleaningView===opt.id?C.white:C.black80,border:`1px solid ${cleaningView===opt.id?C.red:C.black20}`,borderRadius:6,padding:'8px 12px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{opt.label}</button>)}
          </div>
          <div style={{position:'relative',height:220,background:C.white,border:`1px solid ${C.black10}`,borderRadius:8,overflow:'hidden',marginBottom:12}}>
            <div style={{position:'absolute',left:34,right:14,bottom:30,height:1,background:C.black20}}/>
            <div style={{position:'absolute',left:34,top:16,bottom:30,width:1,background:C.black20}}/>
            <div style={{position:'absolute',left:8,bottom:7,fontSize:11,color:C.black60}}>Low X</div>
            <div style={{position:'absolute',right:12,bottom:7,fontSize:11,color:C.black60}}>High X</div>
            <div style={{position:'absolute',left:6,top:10,fontSize:11,color:C.black60}}>High Y</div>
            {cleanData.map(d => {
              const left = 34 + ((d.x - 1) / 5) * 250;
              const top = 184 - ((d.y - 2) / 26) * 160;
              return <div key={d.firm} title={`${d.firm}: X=${d.x}, Y=${d.y}`} style={{position:'absolute',left,top,width:d.outlier?18:14,height:d.outlier?18:14,borderRadius:'50%',background:d.outlier?C.amber:C.red,border:`2px solid ${C.white}`,boxShadow:'0 2px 8px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:C.white}}>{d.firm}</div>;
            })}
          </div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.65}}>{cleaningNotes[cleaningView]}</div>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Card style={{background:C.black,color:C.white,borderColor:C.black}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:6}}>Estimated relationship</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,background:'rgba(255,255,255,0.07)',borderRadius:6,padding:'10px 12px',marginBottom:10}}>Y = a + {slope.toFixed(2)}X + error</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.62)',lineHeight:1.6}}>A higher slope makes the key variable look more powerful. If that comes from one odd observation, the conclusion may not be robust.</div>
          </Card>
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>What to report</div>
            <Li>State the cleaning rule before seeing the final result.</Li>
            <Li>Explain whether outliers are errors, real but unusual cases, or theoretically meaningful observations.</Li>
            <Li>Run a robustness check: raw sample, winsorised sample, and/or excluded outliers.</Li>
            <Li>Never quietly delete observations just because they weaken your hypothesis.</Li>
          </Card>
        </div>
      </div></Reveal>
      <Reveal delay={0.16}><Callout accent={C.amber} bg={C.amberBg}><strong>Link to the activity:</strong> Roychowdhury-style regressions estimate "normal" activity first, then treat the residual as abnormal. If the estimation sample contains extreme sales, CFO, inventory, or production-cost values, the fitted "normal" benchmark can move, changing which firm-years look abnormal.</Callout></Reveal>
    </Wrap>
    <DarkWrap py={48}>
      <Reveal><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:12}}>Example: General Regression Form</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color:C.white,background:'rgba(255,255,255,0.06)',padding:'12px 16px',borderRadius:4,marginBottom:16}}>Y = a + bX₁ + cX₂ + dX₃ + ε</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.6,marginBottom:20}}>Where X₁ is your key independent variable (clearly defined to explain Y), and X₂, X₃ are control variables from the literature.</div>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:10}}>Applied Example: CAPM → Fama-French 3-Factor Model</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.white,background:'rgba(255,255,255,0.06)',padding:'10px 14px',borderRadius:4,marginBottom:8}}>E(Rᵢ) = Rꜰ + βᵢ(Rₘ − Rꜰ)</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:C.white,background:'rgba(255,255,255,0.06)',padding:'10px 14px',borderRadius:4,marginBottom:8}}>Rᵢ − Rꜰ = β₁(Rₘ−Rꜰ) + β₂SMB + β₃HML + ε</div>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>The contribution: SMB and HML are significant (β₂, β₃) in explaining excess return, <em>after controlling for</em> expected market risks.</div></Reveal>
      <NextBtnDark onClick={()=>{completeTab('s1:design');next()}}/>
    </DarkWrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 8: RESULTS
// ═══════════════════════════════════════════════════════════════
function ResultsTab({next}){
  const { completeTab } = useGame();
  return <div style={{paddingTop:56}}>
    <Wrap bg={C.black05}>
      <Reveal><Label>Results & Conclusion</Label><H>Interpreting and Wrapping Up</H></Reveal>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Reveal><Card style={{height:'100%'}}><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Results Section</div>
          <Num n={1}>Summary statistics and/or Data Analytics (Descriptives, Correlation Matrix)</Num>
          <Num n={2}>Baseline/Main results — Interpret the evidence. Does it support or go against your hypotheses? What are the implications?</Num>
          <Num n={3}>Robustness tests — Check for Multicollinearity. Check for Endogeneity. Alternative specifications.</Num>
          <Callout accent={C.black60}><strong>Note:</strong> All tables should be standalone (readable without the main text). Analyses that are not central to the RQ should be included in the Appendix.</Callout>
        </Card></Reveal>
        <Reveal delay={0.1}><Card style={{height:'100%'}}><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Conclusion Section</div>
          <Num n={1}>Reiterate what your study is about</Num>
          <Num n={2}>What you have done to address the RQ</Num>
          <Num n={3}>Did you find support for each hypothesis? If yes — why? If no — why not?</Num>
          <Num n={4}>Highlight the practical implications from the results in your study</Num>
          <Num n={5}>Suggest limitations and/or avenues for future research</Num>
        </Card></Reveal>
      </div>
    </Wrap>
    <Wrap>
      <Reveal><H size={30}>References and Appendices</H></Reveal>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>ONE Reference List</div>
          <Li>Using APA style</Li><Li>Arranged in alphabetical order</Li><Li>According to the last name of the first author</Li>
        </Card>
        <Card><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>Appendices</div>
          <Li>All additional analyses should be supported with brief explanations of rationale and result</Li>
          <Li>Variable definitions table</Li><Li>Additional robustness checks</Li>
        </Card>
      </div>
      <NextBtn onClick={()=>{completeTab('s1:results');next()}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 9: THESIS
// ═══════════════════════════════════════════════════════════════
function ThesisTab({next}){
  const { completeTab } = useGame();
  const[active,setActive]=useState(null);
  const secs=[
    {name:'Abstract',note:'Written LAST',desc:'This is usually the LAST of all sections to be written. One paragraph to outline:',tips:['Research question (RQ)','Main finding(s)','Robustness of finding(s) through various tests','A neatly written abstract should be short and crisp but still communicates clearly why the study is a worthy read.']},
    {name:'Introduction',note:'Most revisions',desc:'This is usually the section that sees the HIGHEST number of revisions. It communicates the scope of your study and outlines the basis of this research. A well-structured introduction contains:',tips:['a) Theoretical basis of your RQ and/or the observed phenomenon that underpins the RQ','b) Motivations — How does (a) lead to the RQ? Industry relevance? Overlooked topic? Literature gap? Conflicting results? → Provide strong reasons to justify why this study is worth doing!','c) Your approach to address the RQ — briefly mention data sources','d) What does your main finding(s) suggest in relation to (a) and the RQ?','e) Alternative explanations that may bias your finding(s) and robustness tests','f) Contributions — How does your study add value? Novelty? Relate to your motivations','g) Implications — So what? Key takeaway(s)? Who would be interested? Industry players? Why? → Applied research','h) Highlight studies of a similar nature (if applicable) — How is yours different? Superior?','i) The last paragraph guides readers to relevant sections: "The remainder of this study is organised as follows. The next section provides... Section 3..."']},
    {name:'Literature Review & Hypotheses',desc:'A thoroughly researched literature review is expected to contain sub-sections that include:',tips:['Theoretical basis to the RQ','Relevant findings of past studies','How EACH hypothesis is developed (one sub-section per hypothesis)','Establish linkage between topics','State the hypothesis clearly']},
    {name:'Research Design',desc:'Regression models, variable definitions, data/sample selection, model specifications.',tips:['Develop regression models to test hypotheses','State variable name, type, definition, and source','Include all variable definitions in Appendix','State expected coefficient estimate for each hypothesis','Data sources, time horizon, selection criteria, sample size','Use precise notations e.g., i (firm), t (year)']},
    {name:'Results',desc:'Present and interpret your findings.',tips:['Summary statistics (Descriptives, Correlation Matrix)','Baseline/Main results — interpret, evidence for/against hypotheses','Robustness tests (Multicollinearity, Endogeneity)','All tables standalone; non-central analyses in Appendix']},
    {name:'Conclusion',tips:['Reiterate your study','What you did to address the RQ','Support for each hypothesis? Why or why not?','Practical implications','Limitations and future research']},
    {name:'References',tips:['APA style','Alphabetical by first author\'s last name','ONE unified list']},
    {name:'Appendices',tips:['Additional analyses with brief rationale','Variable definitions table','Label A, B, C…']},
  ];

  return <div style={{paddingTop:56}}>
    <DarkWrap>
      <Reveal><Label color="rgba(255,255,255,0.3)">Thesis Structure</Label><H color={C.white}>Your Research Report</H><P color="rgba(255,255,255,0.4)">Click any section for detailed writing guidance.</P></Reveal>

      <Reveal delay={0.1}><div style={{background:C.red,borderRadius:8,padding:'18px 22px',marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:6}}>Research Proposal (Submit AY2025/26 T1 — 35%)</div>
        <div style={{fontSize:15,color:'rgba(255,255,255,0.9)',lineHeight:1.6}}>A research proposal maps out what is to be done <strong><em>without</em></strong> the actual data collection, findings, discussion and conclusion. It includes: <strong>Introduction</strong>, <strong>Literature Review & Hypothesis Development</strong>, and <strong>Research Design</strong>.</div>
      </div></Reveal>

      <div style={{display:'flex',flexWrap:'wrap',gap:0,marginBottom:24}}>{secs.map((s,i)=><button key={i} onClick={()=>setActive(active===i?null:i)} style={{padding:'8px 14px',border:'none',borderRadius:4,margin:'0 5px 5px 0',background:active===i?C.red:'rgba(255,255,255,0.07)',color:active===i?C.white:'rgba(255,255,255,0.5)',fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer'}}>{s.name}{s.note&&<span style={{marginLeft:4,fontSize:10,opacity:0.5}}>({s.note})</span>}</button>)}</div>

      {active!==null&&<Reveal><div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'22px',border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontSize:18,fontWeight:700,color:C.white,marginBottom:10}}>{secs[active].name}</div>
        {secs[active].desc&&<div style={{fontSize:14,color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:14}}>{secs[active].desc}</div>}
        {secs[active].tips.map((t,i)=><div key={i} style={{display:'flex',gap:7,marginBottom:5}}><Dot color={C.red}/><span style={{fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.6}}>{t}</span></div>)}
      </div></Reveal>}

      <Reveal delay={0.15}><div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'20px 22px',border:`1px solid ${C.red}`,marginTop:20}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Proposal Readiness Check</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:8}}>
          {['One sentence research question','Named theory or mechanism','At least three anchor papers','Clear X, Y, controls, and data source','Expected sign for each key coefficient','Main limitation and mitigation plan'].map((item,i)=><div key={i} style={{fontSize:13,color:'rgba(255,255,255,0.75)',lineHeight:1.5}}>□ {item}</div>)}
        </div>
      </div></Reveal>

      <NextBtnDark onClick={()=>{completeTab('s1:thesis');next()}} label="Start In-Class Activities →"/>
    </DarkWrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 10: ACTIVITY
// ═══════════════════════════════════════════════════════════════
function ActivityTab(){
  const[phase,setPhase]=useState('intro');
  return <div style={{paddingTop:56}}>
    <div style={{background:C.white,borderBottom:`1px solid ${C.black10}`,position:'sticky',top:56,zIndex:90}}><div style={{maxWidth:840,margin:'0 auto',padding:'0 36px',display:'flex',gap:0,flexWrap:'wrap'}}>
      {[{id:'intro',label:'Overview'},{id:'a1',label:'1: Lit Review'},{id:'a2',label:'2: Hypotheses'},{id:'a3',label:'3: Design'},{id:'reviewer',label:'4: Peer Reviewer'}].map(p=><button key={p.id} onClick={()=>setPhase(p.id)} style={{padding:'12px 16px',border:'none',background:'none',fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:phase===p.id?700:400,color:phase===p.id?C.red:C.black60,borderBottom:phase===p.id?`2px solid ${C.red}`:'2px solid transparent',cursor:'pointer'}}>{p.label}</button>)}
    </div></div>
    <div style={{maxWidth:840,margin:'0 auto',padding:'44px 36px'}}>
      {phase==='intro'&&<ActIntro onStart={()=>setPhase('a1')}/>}
      {phase==='a1'&&<Act1 onNext={()=>setPhase('a2')}/>}
      {phase==='a2'&&<Act2 onNext={()=>setPhase('a3')}/>}
      {phase==='a3'&&<Act3 onNext={()=>setPhase('reviewer')}/>}
      {phase==='reviewer'&&<PeerReviewerScenario/>}
    </div>
  </div>;
}

function ActIntro({onStart}){
  return <div>
    <Reveal><Label>In-Class Activities — Individual Work</Label><H>Roychowdhury (2006) Walkthrough</H>
      <P>Find a paper <strong>different</strong> from the example "Earnings Management Through Real Activities Manipulation" (Roychowdhury 2006, JAE) from the top journals. Type the journal name in OneSearch, find the latest issue, and select one paper (choose a different paper from your team/friends) to download.</P></Reveal>
    <Reveal delay={0.1}><Card style={{marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Your Task for Each Activity</div>
      <Li><strong>Cite the paper</strong> and copy the abstract. Identify its keywords.</Li>
      <Li><strong>Activity 1 — Literature Review:</strong> Identify your areas of literature. Identify the paragraph where the gap is identified.</Li>
      <Li><strong>Activity 2 — Hypotheses:</strong> Motivation of the hypotheses. Identify the hypotheses.</Li>
      <Li><strong>Activity 3 — Research Design:</strong> How to measure the key concept in the hypotheses. How to test the hypotheses. Any limitations.</Li>
      <Li><strong>Activity 4 — Peer Reviewer:</strong> Play reviewer. Spot the weaknesses in a mock introduction.</Li>
    </Card></Reveal>
    <Reveal delay={0.15}><div style={{background:C.black,borderRadius:8,padding:'22px 24px',marginBottom:24}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Key Concept: Earnings Management</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:12}}>Healy and Wahlen (1999): "Earnings management occurs when managers use judgment in financial reporting and in structuring transactions to alter financial reports to either mislead some stakeholders about the underlying economic performance of the company or to influence contractual outcomes that depend on reported accounting practices."</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.white,background:'rgba(255,255,255,0.06)',padding:'10px 14px',borderRadius:4,marginBottom:8}}>Earnings = Accruals (ACC) + Cash Flow from Operations (CFO)</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>Companies use earnings management to present consistent profits and smooth fluctuations. Methods include accrual management (e.g. LIFO/FIFO, bad expense underprovision, delaying write-offs) and real activity management (e.g. cutting R&D, overproduction).</div>
    </div></Reveal>
    <Reveal delay={0.2}><Callout><strong>Discussion:</strong> What is the research topic of Roychowdhury (2006)? Is it a good research topic? Consider: Appropriateness (worthwhile? clear link to theory? fresh insights?) and Capability (feasible? data availability? solid methodology?).</Callout></Reveal>
    <Reveal delay={0.22}><Callout accent={C.blue} bg={C.blueBg}><strong>Exit ticket:</strong> By the end, write one sentence for your research gap, one sentence for your proposed hypothesis, and one sentence naming the data you need.</Callout></Reveal>
    <Reveal delay={0.25}><Btn onClick={onStart}>Begin Activity 1: Literature Review →</Btn></Reveal>
  </div>;
}

function Act1({onNext}){
  const emLit=['Healy (1985): The effect of bonus schemes on accounting decisions (JAE)','DeFond and Jiambalvo (1994): Debt covenant violation and manipulation of accruals (JAE)','Teoh et al. (1998a): Earnings management and long-run underperformance of SEOs (JFE)','Teoh et al. (1998b): Earnings management and long-run underperformance of IPOs (JF)','Kasznik (1999): Voluntary disclosure and earnings management (JAR)','Kothari (2001): Capital markets research in accounting (JAE)','Fields et al. (2001): Empirical research on accounting choice (JAE)','Healy and Wahlen (1999): Review of the earnings management literature — implications for standard setting (AH)'];
  const qs=[
    {id:'q1',q:'What is the main research topic of Roychowdhury (2006)?',opts:['The effect of bonus schemes on accounting decisions','Earnings management through manipulation of real business activities','The long-run underperformance of seasoned equity offerings','Debt covenant violations and manipulation of accruals'],c:1,ex:'The paper focuses on real activities manipulation (sales manipulation, overproduction, cutting discretionary expenses) — distinct from accrual-based manipulation.'},
    {id:'q2',q:'Which is NOT one of the three real earnings manipulation methods?',opts:['Sales manipulation (price discounts, lenient credit terms)','Reduction of discretionary expenditures (R&D, advertising, SG&A)','Change in depreciation method from straight-line to declining balance','Overproduction to report lower COGS'],c:2,ex:'Changing depreciation methods is accrual-based manipulation. The three real methods are: (1) sales manipulation, (2) reduction of discretionary expenditures, and (3) overproduction.'},
    {id:'q3',q:'What gap in existing literature does Roychowdhury (2006) identify?',opts:['No prior research exists on earnings management','Burgstahler & Dichev (1997) provided limited evidence that did not conclusively indicate real activities manipulation — no statistical significance tests, no controls for firm size/performance','Healy (1985) failed to study bonus schemes','Prior studies only focused on non-manufacturing firms'],c:1,ex:'B&D (1997) plotted CFO percentiles near zero earnings but did not test statistical significance or impose controls for size/performance.'},
    {id:'q4',q:'Discretionary expenses are defined as the sum of:',opts:['COGS, operating expenses, and depreciation','Advertising expenses, R&D expenses, and SG&A expenses','Salary, rent, and insurance expenses','Interest expense and tax expense'],c:1,ex:'Discretionary expenses = (a) advertising + (b) R&D + (c) selling, general and administrative (SG&A). These are "discretionary" because managers can cut them in the short run.'},
  ];

  return <div>
    <Reveal><Label>Activity 1</Label><H size={30}>Literature Review</H><P>First, let's review the two streams of literature that Roychowdhury (2006) builds upon.</P></Reveal>
    <Reveal delay={0.05}><Card style={{marginBottom:24}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Earnings Management Literature</div>
      {emLit.map((l,i)=><Li key={i}>{l}</Li>)}
    </Card></Reveal>
    <Reveal delay={0.1}><Card style={{marginBottom:24,background:C.amberBg,borderColor:C.amber}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.amber,marginBottom:10}}>Gap in Existing Literature</div>
      <div style={{fontSize:14,color:C.black80,lineHeight:1.7}}>Burgstahler and Dichev (1997) provide some limited evidence on whether executives manage real activities to meet the zero earnings threshold. They plot the 25th, 50th, and 75th percentiles of unscaled CFO for each earnings interval and find that the distribution of CFO shifts upward in the first interval to the right of zero. However, this preliminary evidence does not conclusively indicate real activities manipulation nor does it yield any insights into the activities underlying the patterns in CFO. They do not test whether the shifts are statistically significant, nor do they impose controls for firm size/performance.</div>
    </Card></Reveal>

    <Reveal delay={0.15}><H size={28}>Quiz: Test Your Understanding</H></Reveal>
    <GamifiedQuiz quizId="s1:roych-a1" questions={qs} xpPerQ={12} perfectBonus={24} badgeOnPerfect="roychowdhury" onComplete={(s,t)=>{}}/>
    <div style={{marginTop:20}}><NextBtn onClick={onNext} label="Continue to Activity 2 →"/></div>
  </div>;
}

function Act2({onNext}){
  const methods=[
    {n:'01',t:'Sales Manipulation',d:'Accelerating the timing of sales and/or generating additional unsustainable sales through increased price discounts or more lenient credit terms. Effect: abnormally low CFO relative to sales.'},
    {n:'02',t:'Reduction of Discretionary Expenditures',d:'Cutting advertising expenses, R&D expenses, and/or SG&A expenses below normal levels. Effect: abnormally low discretionary expenses. May boost short-term earnings but harms long-run value.'},
    {n:'03',t:'Overproduction',d:'Increasing production to report lower COGS. When more units are produced than needed, fixed overhead is spread over more units, reducing per-unit cost. Effect: abnormally high production costs relative to sales.'},
  ];
  const hypotheses=[
    {l:'H1A',t:'After controlling for sales levels, suspect firm-years exhibit at least one of: unusually low CFO OR unusually low discretionary expenses.',m:'Excessive price discounts and overproduction → abnormally high production costs. Reduction of discretionary expenditures → abnormally low expenses.', cat:'Main'},
    {l:'H2A',t:'After controlling for sales levels, suspect firm-years exhibit unusually high production costs.',m:'Price discounts, channel stuffing, and overproduction have a negative effect on contemporaneous abnormal CFO, while reduction of discretionary expenditures has a positive effect.', cat:'Main'},
    {l:'H3A',t:'Ceteris paribus, suspect firm-years in manufacturing industries exhibit higher abnormal production costs than other suspect firm-years.',m:'Both manufacturing and non-manufacturing firms can offer price discounts, but overproduction as an EM strategy is only available to manufacturing firms.', cat:'Industry'},
    {l:'H4A',t:'Ceteris paribus, suspect firm-years with debt outstanding exhibit higher abnormal production costs and lower abnormal discretionary expenses.',m:'Debt contracts include covenants that become tighter when firms incur losses. Losses would make these covenants more binding.', cat:'Debt'},
    {l:'H5A',t:'Ceteris paribus, suspect firm-years with high market-to-book exhibit higher abnormal production costs and lower discretionary expenses.',m:'Skinner & Sloan (2002): growth firms are penalized more by the stock market when they miss earnings thresholds.', cat:'Growth'},
    {l:'H6A',t:'Ceteris paribus, suspect firm-years with high current liabilities (% of total assets) exhibit higher abnormal production costs and lower discretionary expenses.',m:'Graham et al. (2005) and B&D (1997): stakeholders (suppliers, lenders, employees, customers) use heuristic cut-offs at zero to evaluate performance. If earnings fall below zero, ability to pay suppliers is in doubt → suppliers tighten credit terms.', cat:'Suppliers'},
    {l:'H7A',t:'Ceteris paribus, suspect firm-years with high inventories and receivables (% of assets) exhibit higher abnormal production costs.',m:'Excess production to absorb fixed costs is easier when the firm traditionally maintains high inventory. Firms with substantial credit sales can more easily engage in channel stuffing.', cat:'Flexibility'},
    {l:'H8A',t:'Ceteris paribus, suspect firm-years with high institutional ownership exhibit lower abnormal production costs and higher discretionary expenses.',m:'On one hand, institutional investors\' focus on short-term earnings pressures managers to avoid losses. On the other hand, sophisticated institutional investors can analyze long-term implications, acting as a disincentive for value-destroying real activities manipulation.', cat:'Inst. Ownership'},
  ];

  return <div>
    <Reveal><Label>Activity 2</Label><H size={30}>Hypotheses Development</H>
      <P>Understand how Roychowdhury (2006) motivates and states each hypothesis. Apply the same structure to your own paper.</P></Reveal>
    <Reveal delay={0.05}><Callout><strong>Earnings = Sales – Expenses (COGS + other expenses)</strong>. Three methods of real earnings manipulation target different components of this equation.</Callout></Reveal>
    <Reveal delay={0.1}><div style={{marginBottom:28}}><div style={{fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:12}}>Three Real Earnings Manipulation Methods</div>
      {methods.map((m,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:10}}><div style={{width:34,height:34,background:C.red,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#fff',flexShrink:0}}>{m.n}</div><Card style={{flex:1,padding:'14px 16px'}}><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:3}}>{m.t}</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>{m.d}</div></Card></div>)}
    </div></Reveal>

    <Reveal delay={0.15}><div style={{fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.black60,marginBottom:10}}>Cross-Sectional Variation: All 8 Hypotheses (H1A–H8A)</div>
      <P mb={12}>Click each to see the full hypothesis and its motivation. Note the cross-sectional factors: A) industry membership, B) incentives to meet zero earnings (debt, growth, short-term creditors), C) earnings management flexibility, D) institutional ownership.</P>
      <Accordion items={hypotheses.map(h=>({title:<span><span style={{fontWeight:900,color:C.red,marginRight:6}}>{h.l}</span><span style={{fontSize:12,color:C.black60,marginRight:6}}>({h.cat})</span>{h.t.substring(0,60)}…</span>,content:<div><div style={{fontSize:14,fontWeight:600,color:C.black,marginBottom:10,lineHeight:1.6}}>{h.t}</div><div style={{borderLeft:`3px solid ${C.red}`,paddingLeft:12}}><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:3}}>Motivation</div><div style={{fontSize:13,color:C.black80,lineHeight:1.65}}>{h.m}</div></div></div>}))}/></Reveal>
    <Reveal delay={0.2}><Callout><strong>Your task:</strong> Find your own paper. Identify the hypotheses (there could be 2–5). Explain what motivated each one — does the motivation come from theory, prior empirical evidence, or observed anomalies?</Callout></Reveal>
    <NextBtn onClick={onNext} label="Continue to Activity 3 →"/>
  </div>;
}

function Act3({onNext}){
  const[show,setShow]=useState({});
  const qs=[
    {id:'d1',q:'How to measure Normal Cash Flow from Operations (CFO)?',h:'Think about deflating by lagged assets and regressing on sales and change in sales.',a:'Normal CFO is estimated cross-sectionally for each industry-year using: CFO/A(t-1) = α₁(1/A(t-1)) + β₁(S/A(t-1)) + β₂(ΔS/A(t-1)) + ε. Abnormal CFO = actual CFO minus the fitted normal CFO from this regression.'},
    {id:'d2',q:'How to measure Normal Production Costs (PROD)?',h:'Production costs = COGS + change in inventory. Regress deflated PROD on sales, change in sales, and lagged change in sales.',a:'PROD = COGS + ΔINV. Normal PROD: PROD/A(t-1) = α₁(1/A(t-1)) + β₁(S/A(t-1)) + β₂(ΔS/A(t-1)) + β₃(ΔS(t-1)/A(t-1)) + ε. Abnormal PROD = actual − normal.'},
    {id:'d3',q:'How to measure Normal Discretionary Expenses?',h:'Discretionary = advertising + R&D + SG&A. Regress deflated DISC on lagged sales (not current, because cutting expenses affects current sales).',a:'DISC/A(t-1) = α₁(1/A(t-1)) + β₁(S(t-1)/A(t-1)) + ε. Note the use of lagged sales S(t-1) rather than current sales. Abnormal DISC = actual − normal.'},
    {id:'d4',q:'How are "suspect firm-years" selected?',h:'Suspect firms are those that just barely meet the zero earnings threshold.',a:'Suspect firm-years are those with net income scaled by lagged total assets between 0 and 0.005 — firms that have the strongest incentive to avoid reporting a loss.'},
    {id:'d5',q:'How to increase the power of tests to detect real activities manipulation?',h:'Think about comparing suspect firm-years with the rest of the sample.',a:'Compare suspect firm-years with the rest of the sample using cross-sectional regressions. Estimate normal levels for each industry-year (minimum 15 observations). The power comes from the cross-sectional variation in incentives (debt, growth, suppliers, etc.).'},
    {id:'d6',q:'What are the key limitations of this research design?',h:'Measurement error, joint testing, alternative explanations.',a:'(1) Measurement error — estimation models may not perfectly capture normal levels. (2) Joint testing — hard to isolate each manipulation method independently. (3) Endogeneity — real activities may reflect operational decisions rather than manipulation. (4) Industry-year controls may not fully capture firm-specific factors.'},
  ];

  return <div>
    <Reveal><Label>Activity 3</Label><H size={30}>Research Design</H>
      <P>How does Roychowdhury (2006) operationalise and test his hypotheses? Three key questions: (1) How to measure the key concept in the hypotheses, (2) How to test the hypotheses, (3) Any limitations.</P></Reveal>
    <Reveal delay={0.1}><div style={{background:C.black,borderRadius:8,padding:'20px 22px',marginBottom:24}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>General Approach</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:10}}>All estimation models follow the same pattern: deflate by lagged total assets, include an intercept term (1/A(t-1)) to control for heteroskedasticity, and estimate cross-sectionally for each industry-year (minimum 15 observations).</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.06)',padding:'10px 14px',borderRadius:4}}>Abnormal Metric = Actual − Normal (fitted from cross-sectional regression)</div>
    </div></Reveal>
    {qs.map((dq,i)=><Reveal key={dq.id} delay={0.15+i*0.04}><Card style={{marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:700,color:C.black60,marginBottom:4}}>Q{i+1}</div>
      <div style={{fontSize:14,fontWeight:600,color:C.black,lineHeight:1.5,marginBottom:6}}>{dq.q}</div>
      <div style={{fontSize:12,color:C.black60,fontStyle:'italic',marginBottom:10}}>Hint: {dq.h}</div>
      <button onClick={()=>setShow(s=>({...s,[dq.id]:!s[dq.id]}))} style={{background:show[dq.id]?C.black05:C.red,color:show[dq.id]?C.black:C.white,border:`1px solid ${show[dq.id]?C.black20:C.red}`,borderRadius:4,padding:'6px 14px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{show[dq.id]?'Hide Answer':'Reveal Answer'}</button>
      {show[dq.id]&&<div style={{marginTop:10,borderTop:`1px solid ${C.black10}`,paddingTop:10,fontSize:14,color:C.black80,lineHeight:1.7}}><strong>Answer:</strong> {dq.a}</div>}
    </Card></Reveal>)}
    <Reveal delay={0.4}><Callout><strong>Your task:</strong> For your chosen paper, identify (1) how the key concept from the hypotheses is measured, (2) what regression model is used to test it, and (3) what are the main limitations acknowledged by the authors.</Callout></Reveal>
    <NextBtn onClick={onNext} label="Continue to Activity 4: Peer Reviewer →"/>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// PEER REVIEWER SCENARIO — spot the flaws
// ═══════════════════════════════════════════════════════════════
const REVIEW_INTRO = `We study whether ESG is good. ESG means Environmental, Social, and Governance. Many people think ESG matters. We run regressions on some data from 100 firms in 2022. We find that ESG firms are better. This is important because sustainability is important.`;

const REVIEW_FLAWS = [
  { id: 'f1', phrase: "We study whether ESG is good", issue: 'Vague research question', explain: 'A research question needs a specific, measurable Y — not "good". What outcome variable? Performance? Risk? Firm value?' },
  { id: 'f2', phrase: "Many people think ESG matters", issue: 'No theoretical basis or citations', explain: 'Introductions require a theoretical anchor (e.g., stakeholder theory, shareholder theory) with citations — not appeals to popular opinion.' },
  { id: 'f3', phrase: "some data from 100 firms in 2022", issue: 'No data source; tiny sample; no panel', explain: 'You must name the data source (Refinitiv? WRDS?), justify the sample size, and typically use a multi-year panel for causal claims.' },
  { id: 'f4', phrase: "We find that ESG firms are better", issue: 'No operationalisation; no magnitude; no controls mentioned', explain: '"Better" is not a result. You need a coefficient sign, magnitude, significance level, and a statement about what was controlled for.' },
  { id: 'f5', phrase: "This is important because sustainability is important", issue: 'Circular justification — no contribution stated', explain: 'Introductions must state a specific contribution: what is new relative to existing literature? New data, new method, new context, resolving conflicting findings?' },
];

const REVIEW_DISTRACTORS = [
  { id: 'd1', phrase: "We study", issue: 'Present tense verb choice', explain: 'The verb tense is standard for introductions — not a flaw.' },
  { id: 'd2', phrase: "2022", issue: 'Recent year', explain: 'A recent year is fine as long as the time period is justified.' },
  { id: 'd3', phrase: "run regressions", issue: 'Uses the word "regressions"', explain: 'Stating that regressions are used is expected and appropriate for the method section.' },
];

function PeerReviewerScenario() {
  const { awardXpOnce, awardBadge, recordScenario, progress } = useGame();
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const allItems = [...REVIEW_FLAWS, ...REVIEW_DISTRACTORS];

  const toggle = (id) => {
    if (submitted) return;
    const copy = new Set(selected);
    if (copy.has(id)) copy.delete(id); else copy.add(id);
    setSelected(copy);
  };

  const onSubmit = () => {
    setSubmitted(true);
    const correctlyFlagged = REVIEW_FLAWS.filter(f => selected.has(f.id)).length;
    const falseFlagged = REVIEW_DISTRACTORS.filter(d => selected.has(d.id)).length;
    const missed = REVIEW_FLAWS.length - correctlyFlagged;
    // Scoring: +15 per hit, -5 per false flag
    const xp = Math.max(0, correctlyFlagged * 15 - falseFlagged * 5);
    awardXpOnce('scenario:s1:peer-reviewer', xp, `${correctlyFlagged}/${REVIEW_FLAWS.length} flaws caught${falseFlagged>0?`, ${falseFlagged} false flag${falseFlagged>1?'s':''}`:''}`, { allowImprovement: true });
    if (correctlyFlagged === REVIEW_FLAWS.length && falseFlagged === 0) awardBadge('sharp-reviewer');
    recordScenario('s1:peer-reviewer', { correctlyFlagged, falseFlagged, missed });
  };

  const retry = () => { setSelected(new Set()); setSubmitted(false); };

  // Render the intro with clickable highlighted spans
  const renderIntro = () => {
    let text = REVIEW_INTRO;
    const spans = [];
    const allPhrases = [...REVIEW_FLAWS, ...REVIEW_DISTRACTORS].map(item => ({ ...item, start: text.indexOf(item.phrase) }));
    allPhrases.sort((a, b) => a.start - b.start);
    let cursor = 0;
    allPhrases.forEach(item => {
      if (item.start < 0) return;
      if (item.start > cursor) spans.push({ type: 'text', content: text.slice(cursor, item.start) });
      spans.push({ type: 'phrase', ...item });
      cursor = item.start + item.phrase.length;
    });
    if (cursor < text.length) spans.push({ type: 'text', content: text.slice(cursor) });
    return spans.map((s, i) => {
      if (s.type === 'text') return <span key={i}>{s.content}</span>;
      const isSelected = selected.has(s.id);
      const isFlaw = REVIEW_FLAWS.some(f => f.id === s.id);
      let bg = 'rgba(0,0,0,0.04)', color = C.black80, borderColor = 'transparent';
      if (submitted) {
        if (isFlaw && isSelected) { bg = C.greenBg; color = C.green; borderColor = C.green; }
        else if (isFlaw && !isSelected) { bg = C.amberBg; color = C.amber; borderColor = C.amber; }
        else if (!isFlaw && isSelected) { bg = '#FDECEA'; color = C.red; borderColor = C.red; }
      } else if (isSelected) { bg = C.redSubtle; color = C.red; borderColor = C.red; }
      return <span key={i} onClick={()=>toggle(s.id)} style={{background:bg,color,borderBottom:`2px solid ${borderColor}`,cursor:submitted?'default':'pointer',padding:'2px 3px',borderRadius:3,transition:'all 0.15s',fontWeight:isSelected?700:400}}>{s.phrase}</span>;
    });
  };

  const correctlyFlagged = REVIEW_FLAWS.filter(f => selected.has(f.id)).length;
  const falseFlagged = REVIEW_DISTRACTORS.filter(d => selected.has(d.id)).length;

  return <div>
    <Reveal><Label>Activity 4 · Scenario</Label><H size={30}>You Are the Peer Reviewer</H>
      <P>A student has submitted this introduction for review. <strong>Click any phrase you think is flawed</strong> — then submit your critique. Sharp reviewers find every flaw without false flags.</P></Reveal>

    <Reveal delay={0.08}><Card style={{marginBottom:24,padding:'24px 28px',background:C.white}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.black60,marginBottom:10}}>Manuscript · Introduction draft</div>
      <div style={{fontFamily:'Georgia, serif',fontSize:17,color:C.black80,lineHeight:1.8,letterSpacing:'0.005em'}}>
        {renderIntro()}
      </div>
    </Card></Reveal>

    <Reveal delay={0.15}><div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
      <div style={{background:C.black05,borderRadius:8,padding:'10px 16px'}}>
        <div style={{fontSize:10,color:C.black60,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>Flagged</div>
        <div style={{fontSize:20,fontWeight:900,color:C.red}}>{selected.size}</div>
      </div>
      {!submitted ?
        <Btn onClick={onSubmit} disabled={selected.size === 0}>Submit Review</Btn>
        :
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{background:C.black,borderRadius:8,padding:'10px 16px',color:'#fff'}}>
            <div style={{fontSize:10,color:C.red,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>Flaws caught</div>
            <div style={{fontSize:20,fontWeight:900}}>{correctlyFlagged}/{REVIEW_FLAWS.length}</div>
          </div>
          {falseFlagged>0 && <div style={{background:'#FDECEA',borderRadius:8,padding:'10px 16px'}}>
            <div style={{fontSize:10,color:C.red,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>False flags</div>
            <div style={{fontSize:20,fontWeight:900,color:C.red}}>{falseFlagged}</div>
          </div>}
          <Btn onClick={retry} style={{background:C.black05,color:C.black}}>Try again</Btn>
        </div>
      }
    </div></Reveal>

    {submitted && <Reveal delay={0.1}>
      <div style={{background:C.black05,borderRadius:10,padding:'22px 24px',marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:C.red,marginBottom:14}}>Reviewer's Report · Flaws in the Manuscript</div>
        {REVIEW_FLAWS.map((f,i)=>{
          const caught = selected.has(f.id);
          return <div key={f.id} style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:14,paddingBottom:14,borderBottom:i<REVIEW_FLAWS.length-1?`1px solid ${C.black10}`:'none'}}>
            <div style={{width:28,height:28,background:caught?C.green:C.amber,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,flexShrink:0}}>{caught?'✓':'!'}</div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:caught?C.green:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:3}}>{caught?'You caught this':'You missed this'}</div>
              <div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:4}}>{f.issue}</div>
              <div style={{fontSize:13,color:C.black80,lineHeight:1.65}}><span style={{background:C.amberBg,padding:'1px 5px',borderRadius:3,fontStyle:'italic'}}>"{f.phrase}"</span> — {f.explain}</div>
            </div>
          </div>;
        })}
        {falseFlagged > 0 && <div style={{marginTop:4,paddingTop:14,borderTop:`1px solid ${C.black10}`}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>False flags — these aren't actually flaws</div>
          {REVIEW_DISTRACTORS.filter(d=>selected.has(d.id)).map(d=><div key={d.id} style={{fontSize:13,color:C.black80,lineHeight:1.6,marginBottom:4}}><span style={{background:'#FDECEA',padding:'1px 5px',borderRadius:3}}>"{d.phrase}"</span> — {d.explain}</div>)}
        </div>}
      </div>
      <Callout accent={C.gold} bg={C.goldBg}><strong>Reviewer's takeaway:</strong> A weak introduction lacks theory, lacks specificity, lacks a clear contribution. When you write your own, ask yourself: theoretical anchor? Measurable Y? Named data source? Magnitude of result? Specific contribution? If all five answers are "no," you're writing like this student.</Callout>
    </Reveal>}

    <div style={{borderTop:`1px solid ${C.black10}`,marginTop:44,paddingTop:28,textAlign:'center'}}>
      <div style={{fontSize:22,fontWeight:900,color:C.black,marginBottom:6}}>End of Seminar 1</div>
      <div style={{fontSize:15,color:C.black60}}>Well done! Review any section using the tabs above. Your XP and badges persist across seminars.</div>
    </div>
  </div>;
}
