// ═══════════════════════════════════════════════════════════════
// SEMINAR 2 — Research Methods (Quantitative Toolkit)
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Dot, Li, Num, Accordion, NextBtn, NextBtnDark, GamifiedQuiz, Formula,
  TopNav, ProgressWidget,
} from '../shared/components';

const TABS = [
  { id: 's2:overview', label: 'Overview' },
  { id: 's2:stats', label: 'Summary Stats' },
  { id: 's2:correlation', label: 'Correlation' },
  { id: 's2:hypothesis', label: 'Hypothesis Testing' },
  { id: 's2:regression', label: 'Linear Regression' },
  { id: 's2:datatypes', label: 'Data Types' },
  { id: 's2:advanced', label: 'Advanced Methods' },
  { id: 's2:apply', label: 'Apply' },
  { id: 's2:activity', label: 'Activity' },
];

export default function Seminar2() {
  const { progress, awardBadge } = useGame();
  const [tab, setTab] = useState('s2:overview');
  const goTo = useCallback((id) => { setTab(id); window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const nextTab = useCallback(() => {
    const idx = TABS.findIndex(t => t.id === tab);
    if (idx < TABS.length - 1) goTo(TABS[idx + 1].id);
  }, [tab, goTo]);

  useEffect(() => {
    if (TABS.every(t => progress.completedTabs[t.id]) && !progress.badges['s2-completionist'])
      awardBadge('s2-completionist');
  }, [progress.completedTabs, progress.badges, awardBadge]);

  return (
    <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", minHeight: '100vh', background: C.black05 }}>
      <GlobalStyles />
      <TopNav tabs={TABS} activeTab={tab} setActiveTab={goTo} />
      {tab === 's2:overview' && <OverviewTab next={nextTab} />}
      {tab === 's2:stats' && <StatsTab next={nextTab} />}
      {tab === 's2:correlation' && <CorrelationTab next={nextTab} />}
      {tab === 's2:hypothesis' && <HypothesisTab next={nextTab} />}
      {tab === 's2:regression' && <RegressionTab next={nextTab} />}
      {tab === 's2:datatypes' && <DataTypesTab next={nextTab} />}
      {tab === 's2:advanced' && <AdvancedTab next={nextTab} />}
      {tab === 's2:apply' && <ApplyTab next={nextTab} />}
      {tab === 's2:activity' && <ActivityTab />}
      <footer style={{ background: C.black, padding: '36px 0', borderTop: `4px solid ${C.red}` }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 15, fontWeight: 900, color: C.red, textDecoration: 'none' }}>SIT</a>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ACC3018 · Seminar 2 · AY2024/25 T3</span>
        </div>
      </footer>
      <ProgressWidget tabs={TABS} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW
// ═══════════════════════════════════════════════════════════════
function OverviewTab({next}){
  const{completeTab}=useGame();
  return <div>
    <div style={{background:C.black,minHeight:'48vh',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:56}}>
      <div style={{position:'absolute',top:0,right:0,width:380,height:380,background:C.red,borderRadius:'0 0 0 100%',opacity:0.08}}/>
      <div style={{position:'absolute',top:56,left:0,right:0,height:4,background:C.red}}/>
      <div style={{maxWidth:840,margin:'0 auto',padding:'44px 36px',width:'100%'}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:14}}>ACC3018 · Seminar 2</div>
        <h1 style={{fontSize:'clamp(32px,5.5vw,60px)',fontWeight:900,lineHeight:1.06,letterSpacing:'-0.025em',color:C.white,marginBottom:14}}>Research<br/>Methods</h1>
        <p style={{fontSize:17,color:'rgba(255,255,255,0.45)',maxWidth:480,lineHeight:1.6}}>The quantitative toolkit for your capstone project — from descriptive statistics to advanced regression techniques.</p>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>Agenda</Label><H size={30}>What we'll cover today</H></Reveal>
      <Reveal delay={0.08}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {[{n:'01',t:'Summary Statistics',d:'Mean, SD, interpreting descriptive tables'},{n:'02',t:'Correlation & Covariance',d:'Measuring linear relationships, multicollinearity'},{n:'03',t:'Hypothesis Testing',d:'Z-tests, t-tests, p-values, significance levels'},{n:'04',t:'Linear Regression',d:'OLS, coefficients, SSE/SST/SSR, R²'},{n:'05',t:'Data Types',d:'Time series, cross-section, panel data, dummy variables'},{n:'06',t:'Advanced Methods',d:'Fixed effects, DiD, logit, Fama-Macbeth, survey'},{n:'07',t:'Apply: Build a Regression',d:'Hands-on model specification exercise'},{n:'08',t:'Seminar Activity',d:'Apply concepts to your chosen paper'}].map((item,i)=> <Card key={i}><div style={{display:'flex',gap:10}}><div style={{fontSize:20,fontWeight:900,color:C.red,flexShrink:0}}>{item.n}</div><div><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:2}}>{item.t}</div><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>{item.d}</div></div></div></Card>)}
      </div></Reveal>
      <Reveal delay={0.15}><Card style={{background:C.goldBg,borderColor:C.gold,marginTop:18}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.gold,marginBottom:6}}>⬢ Gamification active</div>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.65}}>Your progress is <strong>shared with Seminar 1</strong> — XP, badges, and leaderboard position carry across both seminars.</div>
      </Card></Reveal>
      <NextBtn onClick={()=>{completeTab('s2:overview',20);next();}} label="Start: Summary Statistics →"/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: SUMMARY STATS (unchanged — already has good conceptual content)
// ═══════════════════════════════════════════════════════════════
function StatsTab({next}){
  const{completeTab,awardBadge}=useGame();
  const medallion=[{y:1988,g:16.30,n:9.04},{y:1989,g:1.00,n:-3.20},{y:1990,g:77.80,n:58.24},{y:1991,g:54.30,n:39.44},{y:1992,g:47.00,n:33.60},{y:1993,g:53.90,n:39.12},{y:1994,g:93.40,n:70.72},{y:1995,g:52.90,n:38.32},{y:1996,g:44.40,n:31.52},{y:1997,g:31.50,n:21.20},{y:1998,g:57.10,n:41.68},{y:1999,g:35.60,n:24.48},{y:2000,g:128.10,n:98.48},{y:2001,g:56.60,n:33.02},{y:2002,g:51.10,n:25.82},{y:2003,g:44.10,n:21.90},{y:2004,g:49.50,n:24.92},{y:2005,g:57.70,n:29.51},{y:2006,g:84.10,n:44.30},{y:2007,g:136.10,n:73.42},{y:2008,g:152.10,n:82.38},{y:2009,g:74.60,n:38.98},{y:2010,g:57.50,n:29.40},{y:2011,g:71.10,n:37.02},{y:2012,g:56.80,n:29.01},{y:2013,g:88.80,n:46.93},{y:2014,g:75.00,n:39.20},{y:2015,g:69.30,n:36.01},{y:2016,g:68.60,n:35.62},{y:2017,g:85.40,n:45.02},{y:2018,g:76.40,n:39.98}];
  const avgG=(medallion.reduce((s,d)=>s+d.g,0)/medallion.length).toFixed(2);
  const avgN=(medallion.reduce((s,d)=>s+d.n,0)/medallion.length).toFixed(2);
  const disasters=[{type:'Earthquake',n:806,fat:4.7455,pc:0.0605,dam:87.677},{type:'Hurricane',n:9665,fat:2.4280,pc:0.0482,dam:17.376},{type:'Severe Weather',n:237930,fat:0.0581,pc:0.0004,dam:0.400},{type:'Urban Fire',n:2466,fat:6.0815,pc:0.0164,dam:10.295},{type:'Volcano',n:9,fat:0.5556,pc:0.1370,dam:17.742},{type:'Weather',n:404837,fat:0.0490,pc:0.0003,dam:0.505},{type:'Wild Fire',n:2206,fat:0.0633,pc:0.0002,dam:7.949},{type:'All',n:657919,fat:0.115,pc:0.001,dam:0.884}];
  const presets=[{label:'Set A: Tightly clustered',data:'28, 29, 30, 31, 32',insight:'All values are close to 30 — low SD.'},{label:'Set B: Widely spread',data:'10, 20, 30, 40, 50',insight:'Same mean (30), but values are far apart — high SD.'},{label:'Set C: Extreme outlier',data:'5, 5, 5, 5, 130',insight:'Mean is still 30, but one outlier (130) inflates the SD enormously.'},{label:'Custom',data:''}];
  const[activePreset,setActivePreset]=useState(0);const[vals,setVals]=useState(presets[0].data);
  const parsed=useMemo(()=>vals.split(',').map(v=>parseFloat(v.trim())).filter(v=>!isNaN(v)),[vals]);
  const mean=parsed.length?(parsed.reduce((a,b)=>a+b,0)/parsed.length):0;
  const sd=parsed.length>1?Math.sqrt(parsed.reduce((s,v)=>s+Math.pow(v-mean,2),0)/(parsed.length-1)):0;
  const selectPreset=(i)=>{setActivePreset(i);if(presets[i].data)setVals(presets[i].data);};
  const dotMin=parsed.length?Math.min(...parsed):0;const dotMax=parsed.length?Math.max(...parsed):100;const dotRange=dotMax-dotMin||1;

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Summary Statistics</Label><H>Describing Your Data</H><P>Before running regressions, you need to understand your data. Summary statistics provide a snapshot — the <strong>mean</strong> tells you the centre, the <strong>standard deviation</strong> tells you the spread.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}}>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Sample Mean (x̄)</div><P mb={8}>The numerical average — sum of data values divided by the number of values. "If all values were the same, what would they be?"</P><Formula>x̄ = (x₁ + x₂ + ... + xₙ) / n</Formula></Card>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Standard Deviation (s)</div><P mb={8}>How far, on average, each data point sits from the mean. Higher SD = more variability = more risk.</P><Formula>s = √[Σ(xᵢ − x̄)² / (n − 1)]</Formula></Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout><strong>Sample variance</strong> (s²) is the SD squared. We divide by (n−1) rather than n to correct for the bias introduced by estimating the population mean from the sample (Bessel's correction).</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.blueBg} py={40}>
      <Reveal><Label color={C.blue}>Try it yourself</Label><H size={26} color={C.blue}>Same Mean, Different Spread</H><P color={C.blue} mb={14}>These three datasets all have a mean of 30 — but very different standard deviations.</P></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>{presets.map((p,i)=> <button key={i} onClick={()=>selectPreset(i)} style={{padding:'7px 14px',border:`1px solid ${activePreset===i?C.red:C.black20}`,borderRadius:5,background:activePreset===i?C.redSubtle:C.white,color:activePreset===i?C.red:C.black80,fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer'}}>{p.label}</button>)}</div>
        <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:4}}>Values:</div>
        <input value={vals} onChange={e=>{setVals(e.target.value);setActivePreset(3)}} style={{width:'100%',padding:'10px 14px',border:`1px solid ${C.black20}`,borderRadius:6,fontSize:14,fontFamily:"'JetBrains Mono',monospace",color:C.black,marginBottom:12,outline:'none'}}/>
        {parsed.length>0&&<div style={{position:'relative',height:48,background:C.black05,borderRadius:6,marginBottom:14,overflow:'hidden'}}><div style={{position:'absolute',left:`${((mean-dotMin)/dotRange)*100}%`,top:0,bottom:0,width:2,background:C.red,zIndex:2}}/><div style={{position:'absolute',left:`${((mean-dotMin)/dotRange)*100}%`,top:2,transform:'translateX(-50%)',fontSize:9,fontWeight:700,color:C.red,zIndex:3}}>x̄={mean.toFixed(1)}</div><div style={{position:'absolute',left:`${Math.max(0,((mean-sd-dotMin)/dotRange)*100)}%`,width:`${Math.min(100,((2*sd)/dotRange)*100)}%`,top:16,height:18,background:'rgba(228,0,43,0.08)',borderRadius:4,border:'1px dashed rgba(228,0,43,0.2)'}}/>{parsed.map((v,i)=> <div key={i} style={{position:'absolute',left:`${((v-dotMin)/dotRange)*100}%`,top:22,transform:'translateX(-50%)',width:10,height:10,borderRadius:'50%',background:C.red,opacity:0.6,border:'2px solid #fff',zIndex:1}}/>)}</div>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}><div style={{background:C.black05,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:C.black60,marginBottom:2}}>N</div><div style={{fontSize:22,fontWeight:900,color:C.black}}>{parsed.length}</div></div><div style={{background:C.redSubtle,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:C.red,marginBottom:2}}>Mean</div><div style={{fontSize:22,fontWeight:900,color:C.red}}>{mean.toFixed(2)}</div></div><div style={{background:C.black05,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:C.black60,marginBottom:2}}>SD</div><div style={{fontSize:22,fontWeight:900,color:C.black}}>{sd.toFixed(2)}</div></div></div>
        {activePreset<3&&presets[activePreset].insight&&<div style={{padding:'10px 14px',background:C.amberBg,borderRadius:6,fontSize:13,color:C.amber,lineHeight:1.6,borderLeft:`3px solid ${C.amber}`}}><strong>Insight:</strong> {presets[activePreset].insight}</div>}
      </Card></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Example: Medallion Fund Performance (1988–2018)</H><P>Renaissance Technologies' Medallion Fund — extraordinarily high average returns but also large standard deviation.</P></Reveal>
      <Reveal delay={0.05}><div style={{overflowX:'auto',marginBottom:16}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12,background:C.white,borderRadius:8}}><thead><tr style={{background:C.black}}>{['Year','Gross Return','Net Return'].map((h,i)=> <th key={i} style={{padding:'8px 12px',color:C.white,fontWeight:700,textAlign:i===0?'left':'right',fontSize:11}}>{h}</th>)}</tr></thead><tbody>{medallion.map((d,i)=> <tr key={i} style={{background:i%2===0?C.white:C.black05}}><td style={{padding:'5px 12px',fontWeight:600,color:C.black}}>{d.y}</td><td style={{padding:'5px 12px',textAlign:'right',color:d.g>=66?C.green:C.black80}}>{d.g.toFixed(2)}%</td><td style={{padding:'5px 12px',textAlign:'right',color:d.n<0?C.red:C.black80}}>{d.n.toFixed(2)}%</td></tr>)}</tbody><tfoot><tr style={{background:C.redSubtle,fontWeight:700}}><td style={{padding:'8px 12px',color:C.red}}>Average</td><td style={{padding:'8px 12px',textAlign:'right',color:C.red}}>{avgG}%</td><td style={{padding:'8px 12px',textAlign:'right',color:C.red}}>{avgN}%</td></tr></tfoot></table></div></Reveal>
    </Wrap>
    <Wrap>
      <Reveal><H size={28}>Example: U.S. Natural Disasters (1900–2010)</H><P>Severe weather events are the most frequent (N=237,930) but cause the least damage per event. Less frequent events (earthquakes, fires, hurricanes) have the most devastating consequences. Always report both mean AND count.</P></Reveal>
      <Reveal delay={0.05}><div style={{overflowX:'auto',marginBottom:16}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12,background:C.white,borderRadius:8}}><thead><tr style={{background:C.black}}>{['Disaster Type','N','Mean Fatalities','Mean Fat./Capita','Mean Dmg ($M)'].map((h,i)=> <th key={i} style={{padding:'7px 10px',color:C.white,fontWeight:700,textAlign:i===0?'left':'right',fontSize:10.5}}>{h}</th>)}</tr></thead><tbody>{disasters.map((d,i)=> <tr key={i} style={{background:i%2===0?C.white:C.black05,fontWeight:d.type==='All'?700:400}}><td style={{padding:'6px 10px',color:C.black}}>{d.type}</td><td style={{padding:'6px 10px',textAlign:'right',color:C.black80}}>{d.n.toLocaleString()}</td><td style={{padding:'6px 10px',textAlign:'right',color:d.fat>1?C.red:C.black80}}>{d.fat.toFixed(4)}</td><td style={{padding:'6px 10px',textAlign:'right'}}>{d.pc.toFixed(4)}</td><td style={{padding:'6px 10px',textAlign:'right',color:d.dam>10?C.red:C.black80}}>{d.dam.toFixed(3)}</td></tr>)}</tbody></table></div></Reveal>
      <NextBtn onClick={()=>{completeTab('s2:stats');awardBadge('stats-savvy');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 3: CORRELATION — NEW: explains multicollinearity, spurious
// correlation, covariance vs correlation BEFORE the quiz
// ═══════════════════════════════════════════════════════════════
function CorrelationTab({next}){
  const{completeTab}=useGame();
  const corrQs=[
    {id:'c1',q:'r = 0.95 between Sales and Production Costs. This means:',opts:['Sales cause production costs to rise','As sales increase, production costs tend to increase strongly','There is no relationship','Production costs are exactly 95% of sales'],c:1,ex:'r=0.95 is a very strong positive correlation — but correlation does NOT mean causation. There could be an omitted variable (firm size) driving both.'},
    {id:'c2',q:'r = −0.17 between CFO and Accruals. This suggests:',opts:['A strong negative relationship','A weak negative relationship — slightly opposite movement','No relationship at all','Perfect negative correlation'],c:1,ex:'r=−0.17 is weak and negative — only a slight tendency to move oppositely. This is expected: accruals and cash flows are partial substitutes.'},
    {id:'c3',q:'Two independent variables in your regression have r = 0.92. Should you worry?',opts:['No, high correlation between X variables is fine','Yes — this suggests multicollinearity, which inflates standard errors','Only if they are both significant','It depends on the sample size only'],c:1,ex:'r=0.92 between two Xs signals multicollinearity. Standard errors become inflated, coefficients become unstable. Consider dropping one variable or using a combined index.'},
    {id:'c4',q:'Ice cream sales and drowning deaths are highly correlated. Ice cream causes drowning?',opts:['Yes — the data shows causation','No — this is a spurious correlation driven by a confounding variable (hot weather)','Maybe — we need more data','The correlation is probably wrong'],c:1,ex:'This is the classic example of spurious correlation. Hot weather drives BOTH ice cream sales and swimming (which leads to drowning). The correlation is real, but the causal link is not.'},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Correlation & Covariance</Label><H>Measuring Linear Relationships</H><P>Correlation is a statistical measure that expresses the extent to which two variables are linearly related — meaning they change together at a constant rate. It ranges from −1 (perfect negative) to +1 (perfect positive).</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Sample Correlation (r)</div>
        <Formula>r = [1/(n−1)] × Σ[(xᵢ − x̄)/sₓ] × [(yᵢ − ȳ)/sᵧ]</Formula>
        <div style={{position:'relative',height:60,margin:'20px 0 10px',background:`linear-gradient(to right, ${C.red}, ${C.black10}, ${C.green})`,borderRadius:8,display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:'0 16px 8px'}}><div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:900,color:'#fff'}}>−1</div><div style={{fontSize:10,color:'rgba(255,255,255,0.7)'}}>Perfect negative</div></div><div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:900,color:C.black80}}>0</div><div style={{fontSize:10,color:C.black60}}>No linear relationship</div></div><div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:900,color:'#fff'}}>+1</div><div style={{fontSize:10,color:'rgba(255,255,255,0.7)'}}>Perfect positive</div></div></div>
        <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginTop:12}}>Correlation standardises covariance so it is unitless and bounded between −1 and +1. Unlike covariance, it allows you to compare the strength of relationships across different variable pairs. A correlation of ±0.5 is moderate; ±0.7 is strong; ±0.9 is very strong.</div>
      </Card></Reveal>
    </Wrap>

    {/* NEW: Correlation ≠ causation + spurious correlation */}
    <Wrap bg={C.redSubtle} py={40}>
      <Reveal><Label>Critical Concept</Label><H size={28}>Correlation ≠ Causation</H></Reveal>
      <Reveal delay={0.05}><P mb={16}>A high correlation only tells you two variables <strong>move together</strong>. It does NOT tell you that one <strong>causes</strong> the other. Three reasons why:</P>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
          <Card><div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:6}}>Reverse Causality</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Maybe Y causes X, not the other way around. Does ESG improve performance, or do well-performing firms invest more in ESG?</div></Card>
          <Card><div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:6}}>Omitted Variable</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>A hidden third variable drives both X and Y. Firm size might drive both ESG scores and performance.</div></Card>
          <Card><div style={{fontSize:12,fontWeight:700,color:C.amber,marginBottom:6}}>Spurious Correlation</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Two variables correlate by coincidence or through a confounding factor. Ice cream sales and drowning deaths both rise in summer — but ice cream doesn't cause drowning.</div></Card>
        </div>
      </Reveal>
    </Wrap>

    {/* NEW: Multicollinearity explanation */}
    <Wrap>
      <Reveal><Label>Key Concept</Label><H size={28}>Multicollinearity</H><P>When two or more <strong>independent variables</strong> (Xs) in your regression are highly correlated with each other, you have multicollinearity. This is a problem for your regression, not just a curiosity in the correlation matrix.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
        <Card style={{borderLeft:`3px solid ${C.red}`}}><div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:8}}>What goes wrong</div><Li>Standard errors become <strong>inflated</strong> — coefficients look insignificant even when the variables matter</Li><Li>Coefficient estimates become <strong>unstable</strong> — small changes in the sample flip signs</Li><Li>Hard to tell which X is actually driving Y</Li></Card>
        <Card style={{borderLeft:`3px solid ${C.green}`}}><div style={{fontSize:12,fontWeight:700,color:C.green,marginBottom:8}}>How to detect and fix it</div><Li><strong>Detect:</strong> Check the correlation matrix for r {'>'} |0.7| between any pair of Xs</Li><Li><strong>Detect:</strong> Calculate VIF (Variance Inflation Factor) — VIF {'>'} 10 signals a problem</Li><Li><strong>Fix:</strong> Drop one of the correlated variables, or combine them into an index</Li></Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Important distinction:</strong> High correlation between X and Y is what you <em>want</em> — it means X explains Y. High correlation between two Xs is what you want to <em>avoid</em> — it means they are redundant and will mess up your standard errors.</Callout></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Example: Correlation Matrix (Roychowdhury 2006)</H><P>Scan this table for pairs of Xs with high correlation. Sales/A and PROD/A have r=0.95 — but these are on different sides of the regression, so it's expected. Look for problematic correlations among your independent variables only.</P></Reveal>
      <Reveal delay={0.05}><div style={{overflowX:'auto',marginBottom:16}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:11,background:C.white,borderRadius:8}}><thead><tr style={{background:C.black}}>{['','Sales/A','IBEI/A','CFO/A','Accruals/A','PROD/A','DISEXP/A','Abn CFO','Abn PROD','Abn DISEXP'].map((h,i)=> <th key={i} style={{padding:'6px 8px',color:C.white,fontWeight:700,textAlign:i===0?'left':'right',fontSize:10}}>{h}</th>)}</tr></thead><tbody>{[{l:'IBEI/A',v:['0.22']},{l:'CFO/A',v:['0.11','0.71']},{l:'Accruals/A',v:['0.18','0.57','−0.17']},{l:'PROD/A',v:['0.95','0.13','0.01','0.17']},{l:'DISEXP/A',v:['0.39','−0.16','−0.18','−0.01','0.15']},{l:'Abn CFO',v:['−0.01','0.46','0.74','−0.22','−0.10','−0.10']},{l:'Abn PROD',v:['−0.02','−0.22','−0.28','0.02','0.22','−0.48','−0.35']},{l:'Abn DISEXP',v:['0.11','−0.08','−0.06','−0.04','−0.06','0.66','−0.17','−0.63']},{l:'Abn accruals',v:['0.04','0.42','−0.18','0.81','0.04','−0.05','−0.22','0.03','−0.11']}].map((row,ri)=> <tr key={ri} style={{background:ri%2===0?C.white:C.black05}}><td style={{padding:'5px 8px',fontWeight:700,fontSize:10,color:C.black}}>{row.l}</td>{row.v.map((v,vi)=> <td key={vi} style={{padding:'5px 8px',textAlign:'right',fontSize:11,color:v.startsWith('−')?C.red:parseFloat(v)>0.5?C.green:C.black80,fontWeight:Math.abs(parseFloat(v))>0.5?700:400}}>{v}</td>)}{Array(9-row.v.length).fill(null).map((_,i)=> <td key={'e'+i} style={{padding:'5px 8px',textAlign:'right',color:C.black20}}>—</td>)}</tr>)}</tbody></table></div></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Interpret the Correlation</H><P>Now that you understand what correlation measures, what spurious correlation is, and why multicollinearity matters, apply those concepts.</P></Reveal>
      <GamifiedQuiz quizId="s2:correlation-quiz" questions={corrQs} xpPerQ={10} perfectBonus={15}/>
      <NextBtn onClick={()=>{completeTab('s2:correlation');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 4: HYPOTHESIS TESTING — expanded with p-value explanation
// ═══════════════════════════════════════════════════════════════
function HypothesisTab({next}){
  const{completeTab}=useGame();
  const[pVal,setPVal]=useState('0.03');const p=parseFloat(pVal);
  const sig=isNaN(p)?'—':p<=0.01?'*** (1%)':p<=0.05?'** (5%)':p<=0.10?'* (10%)':'Not significant';
  const sigColor=isNaN(p)?C.black60:p<=0.05?C.red:p<=0.10?C.amber:C.black60;

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Hypothesis Testing</Label><H>Is Your Result Real or Just Noise?</H><P>In research, we never "prove" anything. Instead, we ask: <strong>"If there were truly no effect (H₀), how likely is it that we'd see data this extreme?"</strong> That probability is the p-value.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Z-test (σ known)</div><P mb={6}>Rare in practice — used only when the population standard deviation (σ) is known in advance.</P><Formula>Z = (X̄ − μ) / (σ / √n)</Formula></Card>
        <Card><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>t-test (σ unknown)</div><P mb={6}>The standard approach — uses the sample standard deviation (S) as an estimate of σ. Follows a t-distribution with n−1 degrees of freedom.</P><Formula>t = (X̄ − μ) / (S / √n)</Formula></Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout><strong>Two-sample t-test:</strong> To compare means of two groups (e.g., treated vs control), you test whether their difference is significantly different from zero. The test statistic uses the pooled standard error of the difference. This is the foundation for Difference-in-Differences.</Callout></Reveal>
    </Wrap>

    {/* NEW: What a p-value actually means */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>What Does a p-value Actually Mean?</H><P>The p-value is the probability of obtaining a test statistic <strong>at least as extreme</strong> as the one observed, <strong>assuming the null hypothesis (H₀) is true</strong>.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:16}}>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.7,marginBottom:14}}>If we get a p-value of 0.03, it means: <strong>"There is only a 3% chance of seeing a result this extreme if H₀ were true."</strong> Since 3% is small, we conclude the result is unlikely to be noise — we reject H₀.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div style={{background:C.greenBg,padding:'12px 14px',borderRadius:6,borderLeft:`3px solid ${C.green}`}}><div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4}}>Small p-value (e.g. 0.01)</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Strong evidence <strong>against</strong> H₀. Your result is unlikely to be noise. Reject H₀.</div></div>
          <div style={{background:C.amberBg,padding:'12px 14px',borderRadius:6,borderLeft:`3px solid ${C.amber}`}}><div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:4}}>Large p-value (e.g. 0.45)</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Weak evidence against H₀. Your result could easily be noise. Do not reject H₀.</div></div>
        </div>
      </Card></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Card style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Two-Tail Hypothesis Test: H₀: μ = 0 vs H₁: μ ≠ 0</div>
        <svg viewBox="0 0 500 160" style={{width:'100%',display:'block'}}><path d="M40 140 Q40 140 80 130 Q120 100 160 50 Q200 10 250 5 Q300 10 340 50 Q380 100 420 130 Q460 140 460 140" fill="none" stroke={C.black20} strokeWidth="2"/><path d="M40 140 Q40 140 80 130 Q100 118 115 100 L115 140 Z" fill={C.redSubtle} stroke={C.red} strokeWidth="0.5"/><path d="M385 100 Q400 118 420 130 Q460 140 460 140 L385 140 Z" fill={C.redSubtle} stroke={C.red} strokeWidth="0.5"/><line x1="250" y1="5" x2="250" y2="145" stroke={C.black20} strokeWidth="0.5" strokeDasharray="3 2"/><text x="78" y="155" textAnchor="middle" fontSize="10" fill={C.red} fontWeight="700">Reject H₀</text><text x="250" y="155" textAnchor="middle" fontSize="10" fill={C.black60}>Do not reject H₀</text><text x="422" y="155" textAnchor="middle" fontSize="10" fill={C.red} fontWeight="700">Reject H₀</text><text x="115" y="95" textAnchor="middle" fontSize="9" fill={C.red}>α/2</text><text x="385" y="95" textAnchor="middle" fontSize="9" fill={C.red}>α/2</text></svg>
        <div style={{fontSize:12,color:C.black60,marginTop:8,lineHeight:1.6}}>If your test statistic lands in the shaded red region (the "tails"), you reject H₀. The size of these regions is set by your chosen significance level (α). At α=0.05, each tail contains 2.5% of the distribution.</div>
      </Card></Reveal>
    </Wrap>

    <DarkWrap py={44}>
      <Reveal><H size={26} color={C.white}>Significance Levels in Academic Papers</H><P color="rgba(255,255,255,0.4)" mb={16}>Papers use star notation to flag significance. Here is the convention:</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:20}}>{[{p:'p > 0.10',stars:'ns',meaning:'Not significant — cannot reject H₀',color:'rgba(255,255,255,0.15)'},{p:'0.05 < p ≤ 0.10',stars:'*',meaning:'Marginally significant (10% level) — weak evidence',color:C.amber},{p:'0.01 < p ≤ 0.05',stars:'**',meaning:'Significant (5% level) — standard threshold in accounting/finance',color:C.red},{p:'p ≤ 0.01',stars:'***',meaning:'Highly significant (1% level) — very strong evidence',color:C.red}].map((item,i)=> <div key={i} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 14px',background:'rgba(255,255,255,0.03)',borderRadius:6,borderLeft:`3px solid ${item.color}`}}><div style={{fontSize:13,fontWeight:700,color:C.white,minWidth:100,fontFamily:"'JetBrains Mono',monospace"}}>{item.p}</div><div style={{fontSize:16,fontWeight:900,color:item.color,minWidth:30,textAlign:'center'}}>{item.stars}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.55)'}}>{item.meaning}</div></div>)}</div></Reveal>
    </DarkWrap>

    <Wrap bg={C.blueBg} py={40}>
      <Reveal><Label color={C.blue}>Try it yourself</Label><H size={24} color={C.blue}>P-Value Significance Checker</H></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:14}}><span style={{fontSize:14,fontWeight:600,color:C.black}}>Enter p-value:</span><input value={pVal} onChange={e=>setPVal(e.target.value)} style={{width:120,padding:'8px 12px',border:`1px solid ${C.black20}`,borderRadius:6,fontSize:16,fontFamily:"'JetBrains Mono',monospace",textAlign:'center'}}/></div>
        <div style={{display:'flex',gap:14,alignItems:'center'}}><div style={{fontSize:28,fontWeight:900,color:sigColor}}>{sig}</div>{!isNaN(p)&&p<=0.10&&<div style={{fontSize:13,color:C.black60}}>→ Reject H₀ at the {p<=0.01?'1%':p<=0.05?'5%':'10%'} level</div>}</div>
      </Card></Reveal>
      <NextBtn onClick={()=>{completeTab('s2:hypothesis');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 5: LINEAR REGRESSION — expanded with SSE/SST/SSR, OLS
// derivation, coefficient interpretation
// ═══════════════════════════════════════════════════════════════
function RegressionTab({next}){
  const{completeTab}=useGame();
  const initPts=[{x:1,y:2.1},{x:1.5,y:2.8},{x:2,y:3.0},{x:2.5,y:3.5},{x:3,y:3.2},{x:3.5,y:4.1},{x:4,y:4.8},{x:4.5,y:4.3},{x:5,y:5.5},{x:5.5,y:5.1},{x:6,y:6.0},{x:6.5,y:6.5},{x:7,y:6.8}];
  const outlierPts=[...initPts.slice(0,-1),{x:7,y:8.4}];
  const winsorPts=[...initPts.slice(0,-1),{x:7,y:7.1}];
  const[pts,setPts]=useState(initPts);const[showLine,setShowLine]=useState(true);const[dragging,setDragging]=useState(null);const[preset,setPreset]=useState('typical');const svgRef=useRef(null);
  const nn=pts.length,xBar=pts.reduce((s,p)=>s+p.x,0)/nn,yBar=pts.reduce((s,p)=>s+p.y,0)/nn;
  const b1Den=pts.reduce((s,p)=>s+Math.pow(p.x-xBar,2),0);const b1=b1Den?pts.reduce((s,p)=>s+(p.x-xBar)*(p.y-yBar),0)/b1Den:0;const b0=yBar-b1*xBar;
  const sst=pts.reduce((s,p)=>s+Math.pow(p.y-yBar,2),0);const sse=pts.reduce((s,p)=>s+Math.pow(p.y-(b0+b1*p.x),2),0);const r2=sst>0?(1-sse/sst):0;
  const W=460,HH=280,pad=52,padR=50,padB=38;const xMin=0,xMax=8,yMin=0,yMax=9;
  const tx=x=>pad+(x-xMin)/(xMax-xMin)*(W-pad-padR);const ty=y=>HH-padB-(y-yMin)/(yMax-yMin)*(HH-padB-20);
  const fromSvgX=sx=>xMin+(sx-pad)/(W-pad-padR)*(xMax-xMin);const fromSvgY=sy=>yMin+((HH-padB-sy)/(HH-padB-20))*(yMax-yMin);
  const onDown=(i,e)=>{e.preventDefault();setDragging(i)};
  const onMove=e=>{if(dragging===null||!svgRef.current)return;const r=svgRef.current.getBoundingClientRect();const sx=(e.clientX-r.left)*(W/r.width);const sy=(e.clientY-r.top)*(HH/r.height);let nx=fromSvgX(sx),ny=fromSvgY(sy);nx=Math.max(0.3,Math.min(7.7,nx));ny=Math.max(0.3,Math.min(8.5,ny));setPts(prev=>prev.map((p,i)=>i===dragging?{x:Math.round(nx*10)/10,y:Math.round(ny*10)/10}:p))};
  const onUp=()=>setDragging(null);
  const loadPreset=(id)=>{
    setPreset(id);
    if(id==='typical')setPts(initPts);
    if(id==='outlier')setPts(outlierPts);
    if(id==='winsor')setPts(winsorPts);
  };

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Linear Regression</Label><H>The Core Analytical Tool</H><P>Regression models the relationship between a dependent variable Y (what you want to explain) and one or more independent variables X (what explains it). The goal: find the line that best fits the data.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Simple Linear Regression Model</div>
        <Formula>Yᵢ = β₀ + β₁Xᵢ + εᵢ</Formula>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>{[{l:'β₀ (intercept)',d:'Expected value of Y when X = 0'},{l:'β₁ (slope)',d:'Change in Y for each 1-unit increase in X'},{l:'εᵢ (error term)',d:'Random noise the model cannot explain'},{l:'Ŷᵢ (fitted value)',d:'The model\'s prediction: β₀ + β₁Xᵢ'}].map((v,i)=> <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start'}}><div style={{width:5,height:5,background:C.red,borderRadius:1,marginTop:6,flexShrink:0}}/><span style={{fontSize:13,color:C.black80}}><strong>{v.l}</strong> — {v.d}</span></div>)}</div>
      </Card></Reveal>
    </Wrap>

    {/* NEW: OLS derivation explanation */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Ordinary Least Squares (OLS)</H><P>OLS finds the β₀ and β₁ that <strong>minimise the sum of squared residuals</strong> — the total squared distance between each observed Y and the fitted line Ŷ.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:8}}>The minimisation problem</div>
        <Formula>min Q(β₀, β₁) = Σᵢ εᵢ² = Σᵢ (Yᵢ − β₀ − β₁Xᵢ)²</Formula>
        <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginTop:10}}>Taking partial derivatives and setting them to zero gives the OLS estimators:</div>
        <Formula>β̂₁ = Σ(Xᵢ − X̄)(Yᵢ − Ȳ) / Σ(Xᵢ − X̄)²     β̂₀ = Ȳ − β̂₁X̄</Formula>
      </Card></Reveal>

      {/* NEW: SSE/SST/SSR decomposition */}
      <Reveal delay={0.1}><H size={26}>Decomposing Variation: SST = SSR + SSE</H><P>The total variation in Y can be split into the part explained by your model (SSR) and the part left unexplained (SSE).</P></Reveal>
      <Reveal delay={0.15}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
        <Card style={{borderTop:`3px solid ${C.black}`}}><div style={{fontSize:11,fontWeight:700,color:C.black,marginBottom:4}}>SST (Total)</div><Formula>Σ(Yᵢ − Ȳ)²</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>Total variation of Y around its mean. How spread out are the actual data?</div></Card>
        <Card style={{borderTop:`3px solid ${C.red}`}}><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:4}}>SSR (Regression)</div><Formula>Σ(Ŷᵢ − Ȳ)²</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>Variation <strong>explained</strong> by your model. How much does the line improve on just guessing Ȳ?</div></Card>
        <Card style={{borderTop:`3px solid ${C.amber}`}}><div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:4}}>SSE (Error)</div><Formula>Σ(Yᵢ − Ŷᵢ)²</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>Variation <strong>not explained</strong> — the residuals. This is what OLS minimises.</div></Card>
      </div></Reveal>
      <Reveal delay={0.2}><Callout><strong>R² = SSR / SST = 1 − SSE/SST.</strong> It tells you the proportion of total variation in Y that is explained by X. R²=0.75 means 75% of Y's variation is captured by the model.</Callout></Reveal>
      <Reveal delay={0.24}><Card style={{marginTop:16}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:10}}>What these pieces mean in plain English</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
          <Li><strong>Y:</strong> the outcome you want to explain, such as ROA, stock return, or earnings quality.</Li>
          <Li><strong>X:</strong> the factor you think explains Y, such as ESG score, leverage, or board independence.</Li>
          <Li><strong>Fitted value (Ŷ):</strong> the model's predicted Y for one observation.</Li>
          <Li><strong>Residual/error:</strong> actual Y minus predicted Y. Big residuals are cases the model struggles to explain.</Li>
          <Li><strong>SST:</strong> how much Y varies before using the model.</Li>
          <Li><strong>SSR:</strong> how much of that variation the model explains.</Li>
          <Li><strong>SSE:</strong> how much variation is left unexplained after fitting the model.</Li>
          <Li><strong>R²:</strong> the share of variation explained. High R² is not proof of causality; it only means the model fits Y better.</Li>
        </div>
      </Card></Reveal>
    </Wrap>
    {/* Interactive drag scatter */}
    <Wrap>
      <Reveal><Card style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,flexWrap:'wrap',gap:6}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red}}>Interactive: Drag to Explore OLS</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[
              { id:'typical', label:'Typical data' },
              { id:'outlier', label:'Add outlier' },
              { id:'winsor', label:'Winsorise' },
            ].map(opt=><button key={opt.id} onClick={()=>loadPreset(opt.id)} style={{background:preset===opt.id?C.red:C.black05,color:preset===opt.id?'#fff':C.black,border:`1px solid ${preset===opt.id?C.red:C.black20}`,borderRadius:4,padding:'5px 10px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{opt.label}</button>)}
            <button onClick={()=>setShowLine(!showLine)} style={{background:showLine?C.red:C.black05,color:showLine?'#fff':C.black,border:`1px solid ${showLine?C.red:C.black20}`,borderRadius:4,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{showLine?'Hide line':'Show line'}</button>
            <button onClick={()=>loadPreset('typical')} style={{background:C.black05,color:C.black60,border:`1px solid ${C.black20}`,borderRadius:4,padding:'5px 12px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Reset</button>
          </div>
        </div>
                <div style={{background:C.blueBg,border:'1px solid rgba(26,95,160,0.15)',borderRadius:6,padding:'7px 12px',marginBottom:8,fontSize:12,color:C.blue,lineHeight:1.5}}><strong>Drag any red dot</strong> to move it - the OLS line, equation, and R-squared recalculate instantly. Use the outlier and winsorise buttons to see why researchers disclose data-cleaning choices before interpreting results.</div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${HH}`} style={{width:'100%',display:'block',background:C.black05,borderRadius:8,cursor:dragging!==null?'grabbing':'default',touchAction:'none',userSelect:'none'}} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
          {[1,2,3,4,5,6,7].map(x=> <line key={'gx'+x} x1={tx(x)} y1={ty(yMin)} x2={tx(x)} y2={ty(yMax)} stroke={C.black10} strokeWidth="0.4"/>)}
          {[1,2,3,4,5,6,7,8].map(y=> <line key={'gy'+y} x1={tx(xMin)} y1={ty(y)} x2={tx(xMax)} y2={ty(y)} stroke={C.black10} strokeWidth="0.4"/>)}
          <line x1={tx(xMin)} y1={ty(yMin)} x2={tx(xMax)} y2={ty(yMin)} stroke={C.black20} strokeWidth="1"/><line x1={tx(xMin)} y1={ty(yMin)} x2={tx(xMin)} y2={ty(yMax)} stroke={C.black20} strokeWidth="1"/>
          {[1,2,3,4,5,6,7].map(x=> <text key={'ax'+x} x={tx(x)} y={ty(yMin)+13} textAnchor="middle" fontSize="9" fill={C.black60}>{x}</text>)}
          {[2,4,6,8].map(y=> <text key={'ay'+y} x={tx(xMin)-7} y={ty(y)+3} textAnchor="end" fontSize="9" fill={C.black60}>{y}</text>)}
          {showLine&&<line x1={tx(xMin)} y1={ty(yBar)} x2={tx(xMax)} y2={ty(yBar)} stroke={C.black20} strokeWidth="0.8" strokeDasharray="5 3"/>}
          {showLine&&<line x1={tx(0.2)} y1={ty(b0+b1*0.2)} x2={tx(7.8)} y2={ty(b0+b1*7.8)} stroke={C.red} strokeWidth="2.5" opacity="0.85" strokeLinecap="round"/>}
          {showLine&&pts.map((p,i)=> <line key={'res'+i} x1={tx(p.x)} y1={ty(p.y)} x2={tx(p.x)} y2={ty(b0+b1*p.x)} stroke={C.amber} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>)}
          {pts.map((p,i)=>{const active=dragging===i;const isAdjusted=preset!=='typical'&&i===pts.length-1;return <g key={i} onPointerDown={e=>onDown(i,e)} style={{cursor:'grab'}}><circle cx={tx(p.x)} cy={ty(p.y)} r="14" fill="transparent"/><circle cx={tx(p.x)} cy={ty(p.y)} r={active?7:5.5} fill={isAdjusted?C.amber:C.red} opacity={active?1:0.75} stroke="#fff" strokeWidth={active?2.5:1.5}/></g>})}
          {showLine&&<g><rect x="52" y="4" width="190" height="18" rx="4" fill="rgba(255,255,255,0.85)"/><text x="56" y="16" fontSize="10.5" fill={C.red} fontWeight="700">Ŷ = {b0.toFixed(2)} {b1>=0?'+ ':'− '}{Math.abs(b1).toFixed(3)}X    R²={r2.toFixed(3)}</text></g>}
        </svg>
        <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}><div style={{background:C.black05,borderRadius:6,padding:'7px',textAlign:'center'}}><div style={{fontSize:9,color:C.black60}}>β₀</div><div style={{fontSize:15,fontWeight:900,color:C.black}}>{b0.toFixed(2)}</div></div><div style={{background:C.redSubtle,borderRadius:6,padding:'7px',textAlign:'center'}}><div style={{fontSize:9,color:C.red}}>β₁</div><div style={{fontSize:15,fontWeight:900,color:C.red}}>{b1.toFixed(3)}</div></div><div style={{background:r2>0.7?C.greenBg:r2>0.3?C.amberBg:C.redSubtle,borderRadius:6,padding:'7px',textAlign:'center'}}><div style={{fontSize:9,color:r2>0.7?C.green:r2>0.3?C.amber:C.red}}>R²</div><div style={{fontSize:15,fontWeight:900,color:r2>0.7?C.green:r2>0.3?C.amber:C.red}}>{(r2*100).toFixed(1)}%</div></div><div style={{background:C.black05,borderRadius:6,padding:'7px',textAlign:'center'}}><div style={{fontSize:9,color:C.black60}}>Mean Ȳ</div><div style={{fontSize:15,fontWeight:900,color:C.black}}>{yBar.toFixed(2)}</div></div></div>
      </Card></Reveal>
    </Wrap>

    {/* NEW: Coefficient interpretation walkthrough */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Interpreting Coefficients</H><P>Every regression table reports coefficients (β), standard errors, and t-statistics. Here's how to read them.</P></Reveal>
      <Reveal delay={0.05}><Card style={{background:C.black,borderColor:C.black,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Worked Example: Medallion Fund Returns</div>
        <Formula dark>Fund Return = 0.741 − 0.009 × (Market Excess Return)</Formula>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.65,marginTop:10,marginBottom:10}}>
          <strong style={{color:C.white}}>β₀ = 0.741:</strong> When the market excess return is zero, the fund's expected gross return is 0.741%. This is the fund's "alpha" — return independent of the market.<br/>
          <strong style={{color:C.white}}>β₁ = −0.009:</strong> For each 1% increase in market excess return, the fund's gross return <strong style={{color:C.white}}>decreases by 0.009%</strong> on average. The negative sign means the fund is slightly market-neutral.
        </div>
        <div style={{background:'rgba(255,255,255,0.05)',borderLeft:`3px solid ${C.red}`,padding:'10px 14px',borderRadius:'0 6px 6px 0'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:3}}>Is β₁ significant?</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.6}}>We test H₀: β₁ = 0 vs H₁: β₁ ≠ 0. If the p-value on β₁ is {'<'} 0.05, then market excess return significantly explains fund returns. If not, the fund's returns are independent of the market.</div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.15}><Card style={{borderLeft:`4px solid ${C.blue}`}}>
        <div style={{fontSize:12,fontWeight:700,color:C.blue,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Reading Regression Tables Like A Researcher</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
          <Li color={C.blue}><strong>Effect size:</strong> ask whether the coefficient is economically meaningful, not only statistically significant.</Li>
          <Li color={C.blue}><strong>Robust or clustered SEs:</strong> use them when errors may be heteroskedastic or correlated within firms/countries.</Li>
          <Li color={C.blue}><strong>Outliers:</strong> inspect extreme values, explain winsorisation, and report whether results survive alternatives.</Li>
          <Li color={C.blue}><strong>Missing data:</strong> document filters and compare included versus excluded observations.</Li>
        </div>
      </Card></Reveal>
      <NextBtn onClick={()=>{completeTab('s2:regression');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 6: DATA TYPES — expanded with raw data examples, dummy
// variable event study models from slides 26-27
// ═══════════════════════════════════════════════════════════════
function DataTypesTab({next}){
  const{completeTab}=useGame();
  const matchQs=[
    {id:'dt1',q:'Monthly stock returns for Apple (AAPL) from January 2007 to December 2019.',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:0,ex:'Same subject (AAPL) observed across different months = time series.'},
    {id:'dt2',q:'Returns of 21 different stocks all on December 31, 2019.',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:1,ex:'Many subjects (21 stocks) observed at one time point = cross-sectional.'},
    {id:'dt3',q:'Annual financial data for MSFT, AAPL, BABA, and GOOG from 2012 to 2019.',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:2,ex:'Multiple firms × multiple years = panel data. This is the most common structure in accounting/finance research.'},
    {id:'dt4',q:'Whether each stock outperformed the S&P 500 (Yes=1, No=0).',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:3,ex:'Binary (0/1) encoding of a categorical condition = dummy variable.'},
    {id:'dt5',q:'Daily trading volume for Tesla over the past 5 years.',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:0,ex:'One firm (Tesla) across daily time points = time series.'},
    {id:'dt6',q:'CEO age, gender, and education for 500 firms in 2023.',opts:['Time Series','Cross-Sectional','Panel Data','Dummy Variable'],c:1,ex:'Many firms, one snapshot in time = cross-sectional.'},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Data Types & Structures</Label><H>Time Series, Cross-Section, and Panel Data</H><P>The structure of your data determines which regression method is appropriate. There are three fundamental types, plus dummy variables which encode categories.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
        <Card style={{borderTop:`3px solid ${C.blue}`}}><div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:6}}>Time Series</div><P mb={6}>Same subject, different time points.</P><div style={{fontSize:12,color:C.black60,lineHeight:1.5,marginBottom:8}}>Example: AAPL monthly returns from Jan 2007 to Dec 2019. Used for forecasting (can past returns predict future returns?).</div><Formula>Rₜ = β₀ + β₁Rₜ₋₁ + ε</Formula></Card>
        <Card style={{borderTop:`3px solid ${C.green}`}}><div style={{fontSize:12,fontWeight:700,color:C.green,marginBottom:6}}>Cross-Sectional</div><P mb={6}>Many subjects, one time point.</P><div style={{fontSize:12,color:C.black60,lineHeight:1.5,marginBottom:8}}>Example: Returns of 21 stocks on Dec 31, 2019. Used to compare across firms at a snapshot.</div><Formula>Rᵢ = β₀ + β₁Turnoverᵢ + ε</Formula></Card>
        <Card style={{borderTop:`3px solid ${C.red}`}}><div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:6}}>Panel Data</div><P mb={6}>Many subjects × many time points.</P><div style={{fontSize:12,color:C.black60,lineHeight:1.5,marginBottom:8}}>Example: MSFT, AAPL, BABA, GOOG annual data from 2012–2019. Most common in accounting/finance research.</div><Formula>Yᵢₜ = β₀ + β₁Xᵢₜ + β₂Zᵢ + uᵢₜ</Formula></Card>
      </div></Reveal>
    </Wrap>

    {/* NEW: Dummy variables + event study models from slides 26-27 */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Dummy Variables & Interaction Terms</H><P>A dummy variable equals 1 if a condition is true, 0 otherwise. Dummies encode qualitative categories (gender, industry, pre/post-event) as numbers that can enter a regression. When you multiply a dummy by a continuous variable, you get an <strong>interaction term</strong>.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:20}}>
        <Card><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:6}}>Level Shift (Intercept)</div><Formula>y = a₀ + b₁D + b₂X + ε</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>D shifts the intercept up or down. When D=0, intercept is a₀. When D=1, intercept is a₀+b₁. The <strong>slope stays the same</strong>.</div></Card>
        <Card><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:6}}>Slope Shift</div><Formula>y = a₀ + b₁(D×X) + b₂X + ε</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>The interaction D×X changes the slope. When D=0, slope is b₂. When D=1, slope is b₁+b₂. The <strong>intercept stays the same</strong>.</div></Card>
        <Card><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:6}}>Both (Full Interaction)</div><Formula>y = a₀ + b₁D + b₂X + b₃(D×X) + ε</Formula><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>Both intercept and slope change. When D=1: intercept = a₀+b₁, slope = b₂+b₃. This is the most flexible specification.</div></Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout><strong>Why this matters for DiD:</strong> The DiD regression y = β₀ + β₁T + β₂S + β₃(T×S) + ε is exactly the "full interaction" model above, where T is a time dummy and S is a group dummy. β₃ is the treatment effect.</Callout></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={24}>Match the Data Type</H><P>Now that you understand the three data structures and dummy variables, classify each scenario.</P></Reveal>
      <GamifiedQuiz quizId="s2:datatypes-quiz" questions={matchQs} xpPerQ={8} perfectBonus={16} badgeOnPerfect="data-typist"/>
      <NextBtn onClick={()=>{completeTab('s2:datatypes');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 7: ADVANCED METHODS — expanded with panel data, FE,
// DiD 2×2 table, logit, Fama-Macbeth, subsample, survey
// ═══════════════════════════════════════════════════════════════
function AdvancedTab({next}){
  const{completeTab}=useGame();
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Advanced Regression Methods</Label><H>Beyond Simple OLS</H><P>Your capstone will likely use one or more of these techniques. Each addresses a specific problem with simple OLS. Click each to learn more.</P></Reveal>
      <Reveal delay={0.05}><Accordion items={[
        {title:'Panel Data Regression',content:<div>
          <P mb={8}>Panel data models provide information on individual behaviour both across individuals and over time. The data has both cross-sectional and time-series dimensions. Panels can be <strong>balanced</strong> (all individuals observed in all periods) or <strong>unbalanced</strong>.</P>
          <Formula>Yᵢₜ = β₀ + β₁Xᵢₜ + β₂Zᵢ + uᵢₜ</Formula>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.6,marginTop:8}}>where Zᵢ are unobserved time-invariant heterogeneities across assets i=1,…,n. The problem: if Zᵢ correlates with Xᵢₜ, OLS estimates of β₁ are biased. Solution: fixed effects.</div>
        </div>},
        {title:'Fixed Effects (Firm FE + Year FE)',content:<div>
          <P mb={8}>Fixed effects control for unobserved characteristics that don't change over time (firm FE) or that are common to all firms in a given period (year FE).</P>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginBottom:10}}>Letting αᵢ = β₀ + β₂Zᵢ, the panel model becomes Yᵢₜ = αᵢ + β₁Xᵢₜ + uᵢₜ. Each αᵢ is the fixed effect for firm i — equivalent to n−1 firm dummies plus a constant.</div>
          <Li><strong>Firm FE (αᵢ)</strong> — absorbs all time-invariant differences: industry, country, management culture, founding year. Equivalent to including 999 dummy variables for 1,000 firms.</Li>
          <Li><strong>Year FE (δₜ)</strong> — absorbs macro shocks common to all firms: recessions, regulatory changes, market crashes. Equivalent to T−1 year dummies.</Li>
          <Li><strong>Both together (two-way FE)</strong> — the gold standard in accounting/finance panel research. Controls for both unobserved firm heterogeneity AND common time shocks.</Li>
          <Callout><strong>Practical tip:</strong> For a panel with 1,000 firms over 20 years, firm FE = 999 dummy variables and year FE = 19 dummy variables. Software (Stata, R, Python) handles this automatically using "within" estimation — you never manually create 999 dummies.</Callout>
        </div>},
        {title:'Difference-in-Differences (DiD)',content:<div>
          <P mb={8}>DiD estimates the <strong>causal effect</strong> of a treatment/event by comparing changes between a treated group and a control group, before vs after the event.</P>
          <Formula>y = β₀ + β₁T + β₂S + β₃(T × S) + ε</Formula>
          <Li><strong>T</strong> = time dummy (1 for post-event, 0 for pre)</Li>
          <Li><strong>S</strong> = group dummy (1 for treated, 0 for control)</Li>
          <Li><strong>β₁</strong> captures common time trends (what would have happened anyway)</Li>
          <Li><strong>β₂</strong> captures baseline differences between treated and control groups</Li>
          <Li><strong>β₃ (the DiD estimator)</strong> = the causal treatment effect, net of both trends and baseline differences</Li>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.6,margin:'12px 0',background:C.black05,padding:'12px 14px',borderRadius:6}}>
            <strong>The 2×2 table derivation:</strong> β₃ = (ȳ_treated,post − ȳ_treated,pre) − (ȳ_control,post − ȳ_control,pre). First difference within each group, then difference between those differences.
          </div>
          <Li><strong>Key assumption: Parallel trends</strong> — absent treatment, both groups would have followed the same trajectory. Testable with pre-treatment data by running the same regression on pre-event periods (interaction should be insignificant).</Li>
          <Callout accent={C.amber} bg={C.amberBg}><strong>Example:</strong> Did mandatory IFRS adoption improve earnings quality? Treated = countries that adopted IFRS. Control = countries that didn't. Pre = before adoption. Post = after. β₃ = causal effect of IFRS on earnings quality.</Callout>
        </div>},
        {title:'Sub-sample Analysis',content:<div>
          <P mb={8}>Run your regression on subsets of the data to examine whether relationships differ across groups. This tests the <strong>cross-sectional heterogeneity</strong> of your main effect.</P>
          <Li>Split by firm characteristics: large vs small, high vs low leverage, growth vs value</Li>
          <Li>Split by industry: manufacturing vs services, financial vs non-financial</Li>
          <Li>Split by time period: pre-crisis vs post-crisis, pre-regulation vs post-regulation</Li>
          <P mb={0} color={C.black60}>Example: Hirshleifer & Shumway (2003, JF) test if weather affects stock returns by running separate regressions for 26 cities worldwide — finding the effect in some but not all locations.</P>
        </div>},
        {title:'Logit Regression',content:<div>
          <P mb={8}>Used when Y is <strong>binary</strong> (0 or 1). OLS on a binary Y can predict values outside [0,1], which makes no sense for probabilities. Logit constrains predictions to [0,1] using the logistic function.</P>
          <Formula>P(Y=1|X₁,...,Xₖ) = 1 / (1 + e^(−(β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ)))</Formula>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginTop:8,marginBottom:8}}>The logistic function F(x) = 1/(1+e⁻ˣ) is an S-shaped curve that maps any real number to (0,1). This is the CDF of the standard logistic distribution. Probit regression is similar but uses the normal CDF instead.</div>
          <Li>Example: What predicts whether a firm commits fraud? Y=1 if fraud, Y=0 if no fraud.</Li>
          <Li>Coefficients are in <strong>log-odds</strong> — not directly interpretable as marginal effects. Use "marginal effects at means" to convert to probability changes.</Li>
        </div>},
        {title:'Fama-Macbeth (1973) Regression',content:<div>
          <P mb={8}>A two-step procedure for panel data that handles <strong>cross-sectional correlation in errors</strong>. Standard in asset pricing and widely used in accounting research.</P>
          <Num n={1}><strong>Step 1 — Time-series regressions:</strong> For each asset i, regress returns on proposed risk factors across all T time periods. This gives you each asset's exposure (beta) to each factor.</Num>
          <Num n={2}><strong>Step 2 — Cross-sectional regressions:</strong> For each time period t, regress all asset returns on the betas estimated in Step 1. This gives you the risk premium (γ) for each factor at each time.</Num>
          <Li>The final coefficient estimates are the <strong>time-series averages</strong> of the γₜ's from Step 2.</Li>
          <Li>Standard errors come from the <strong>time-series variation</strong> in the γₜ estimates, which naturally accounts for cross-sectional correlation.</Li>
          <P mb={0} color={C.black60}>Used in Roychowdhury (2006): cross-sectional regressions for each industry-year, then averaging coefficients.</P>
        </div>},
        {title:'Survey Data Analysis',content:<div>
          <Li><strong>Visualization:</strong> Charts, frequency tables, word clouds for open-ended responses</Li>
          <Li><strong>Content analysis:</strong> Identify recurring themes and patterns in qualitative data</Li>
          <Li><strong>Thematic analysis:</strong> Group similar ideas and concepts together</Li>
          <Li><strong>Structural Equation Modeling (SEM):</strong> Investigate causal relationships among survey variables. SEM combines factor analysis (measurement model) with path analysis (structural model) to test complex theoretical frameworks. Path loadings indicate the strength and direction of each relationship.</Li>
          <P mb={0} color={C.black60}>Draw conclusions: What are the key findings? How can these insights inform decision-making?</P>
        </div>},
      ]}/></Reveal>
    </Wrap>

    {/* ID Strategy Scenario */}
    <DarkWrap py={56}><IdStrategyScenario/></DarkWrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={26}>Example: CEO Disaster Experience (Bernile et al. 2017, JF)</H><P>Panel regression with firm + year fixed effects. Shows how dummy variables, panel data, and fixed effects work together in a real paper.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><div style={{background:C.white,borderRadius:8,padding:'14px',borderLeft:`3px solid ${C.red}`}}><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:4}}>Medium fatality CEOs</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>3.3% higher leverage, 1.2% less cash. More risk-tolerant — "what doesn't kill you makes you stronger."</div></div><div style={{background:C.white,borderRadius:8,padding:'14px',borderLeft:`3px solid ${C.black20}`}}><div style={{fontSize:11,fontWeight:700,color:C.black60,marginBottom:4}}>Extreme fatality CEOs</div><div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>3.5% lower leverage, 2.2% more cash. More cautious — "scarred" by extreme events.</div></div></div></Reveal>
      <NextBtn onClick={()=>{completeTab('s2:advanced');next();}} label="Now Apply: Build a Regression →"/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// ID STRATEGY SCENARIO
// ═══════════════════════════════════════════════════════════════
const ID_STRATEGY = {
  start: { narration: "Your capstone team wants to test whether IFRS adoption improved earnings quality. Your supervisor says: 'How will you isolate the causal effect?'", choices: [{ label: "Run a simple before-and-after comparison (pre/post)", next: 'naive', insight: null },{ label: "Use Difference-in-Differences with a control group", next: 'did', insight: null },{ label: "Run a fixed-effects panel regression", next: 'fe', insight: null }] },
  naive: { feedback: { tone: 'warn', title: 'Confounded', text: "A simple pre/post comparison can't distinguish IFRS from other concurrent changes (economic cycle, regulatory shifts). You need a counterfactual — what would have happened without IFRS?" }, narration: "Your supervisor asks: 'You need a control group. How will you construct the counterfactual?'", choices: [{ label: "Add a control group of non-adopting countries → DiD", next: 'did', insight: 'A control group lets you construct the counterfactual.' },{ label: "Just add more control variables", next: 'ending-weak', insight: null }] },
  did: { feedback: { tone: 'good', title: 'Strong identification', text: "DiD compares change in earnings quality for IFRS adopters vs non-adopters. β₃ on Post × Treated captures the treatment effect." }, narration: "Good. But DiD has a key assumption. What is it, and how will you test it?", choices: [{ label: "Parallel trends — test with pre-treatment placebo regressions", next: 'ending-strong', insight: 'Parallel trends: testable by running DiD on pre-treatment data — interaction should be insignificant.' },{ label: "Homogeneous treatment effects across all countries", next: 'did-partial', insight: null },{ label: "Random assignment of IFRS adoption", next: 'did-partial', insight: null }] },
  'did-partial': { feedback: { tone: 'warn', title: 'Not quite', text: "DiD requires parallel trends, not random assignment or homogeneity." }, narration: "Try again — what's the identifying assumption?", choices: [{ label: "Parallel trends — test with pre-treatment placebos", next: 'ending-strong', insight: 'Parallel trends can be tested with placebo regressions.' },{ label: "I'm not sure — skip it", next: 'ending-weak', insight: null }] },
  fe: { feedback: { tone: 'neutral', title: 'Necessary but not sufficient', text: "FE controls unobserved heterogeneity, but alone doesn't isolate the causal effect of a time-varying event like IFRS adoption." }, narration: "FE is important but not enough. How do you exploit the fact that not all countries adopted IFRS simultaneously?", choices: [{ label: "Combine FE with DiD: use staggered adoption as a natural experiment", next: 'ending-strong', insight: 'Staggered adoption creates variation exploitable with DiD + FE.' },{ label: "Keep FE as-is", next: 'ending-weak', insight: null }] },
  'ending-strong': { ending: true, result: 'strong', title: 'Credible ID Strategy ✓', text: 'Your approach combines a treatment design (DiD) with proper controls (FE), and you know how to test parallel trends.', takeaway: 'Identification = answering "what would have happened without the treatment?" Best designs exploit natural variation and rigorously test assumptions.' },
  'ending-weak': { ending: true, result: 'weak', title: 'Back to the drawing board', text: 'Without a credible counterfactual, your results are correlational. Reviewers will push back.', takeaway: 'Correlation ≠ causation. Need: (1) treatment/control design, (2) identifying assumption, (3) evidence assumption holds.' },
};

function IdStrategyScenario(){
  const{awardXpOnce,awardBadge,recordScenario}=useGame();
  const[node,setNode]=useState('start');const[path,setPath]=useState([]);const[insights,setInsights]=useState([]);const[done,setDone]=useState(false);
  const current=ID_STRATEGY[node];
  const choose=c=>{const np=[...path,{from:node,choice:c.label}];setPath(np);if(c.insight)setInsights([...insights,c.insight]);if(ID_STRATEGY[c.next].ending){setNode(c.next);setDone(true);const ending=ID_STRATEGY[c.next];awardXpOnce('scenario:s2:id-strategy',ending.result==='strong'?60:25,ending.result==='strong'?'Strong ID strategy':'Completed scenario',{allowImprovement:true});awardBadge('causal-thinker');recordScenario('s2:id-strategy',{path:np,ending:c.next,result:ending.result});}else setNode(c.next);};
  const restart=()=>{setNode('start');setPath([]);setInsights([]);setDone(false);};
  return <div style={{maxWidth:800,margin:'0 auto'}}>
    <Reveal><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Scenario · Choose Your ID Strategy</div><h2 style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1.1,marginBottom:12,letterSpacing:'-0.02em'}}>Can You Prove Causality?</h2><p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.65,marginBottom:28}}>Isolate the causal effect of IFRS adoption on earnings quality. Your supervisor will react to each choice.</p></Reveal>
    <Reveal delay={0.1}><div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'28px 30px'}}>
      {path.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>{path.map((p,i)=> <span key={i} style={{fontSize:11,color:'rgba(255,255,255,0.45)',background:'rgba(255,255,255,0.05)',padding:'4px 10px',borderRadius:99}}>{i+1}. {p.choice.length>38?p.choice.slice(0,38)+'…':p.choice}</span>)}</div>}
      {current.feedback&&<div style={{background:current.feedback.tone==='good'?'rgba(26,127,75,0.12)':current.feedback.tone==='warn'?'rgba(230,119,0,0.12)':'rgba(255,255,255,0.04)',borderLeft:`3px solid ${current.feedback.tone==='good'?C.green:current.feedback.tone==='warn'?C.amber:'rgba(255,255,255,0.3)'}`,borderRadius:'0 8px 8px 0',padding:'14px 18px',marginBottom:20}}><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:current.feedback.tone==='good'?C.green:current.feedback.tone==='warn'?C.amber:'rgba(255,255,255,0.5)',marginBottom:4}}>{current.feedback.title}</div><div style={{fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.65}}>{current.feedback.text}</div></div>}
      {current.ending?<div><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:current.result==='strong'?C.gold:C.amber,marginBottom:10}}>{current.result==='strong'?'★ Successful Path':'Retry'}</div><div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:12}}>{current.title}</div><div style={{fontSize:15,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:18}}>{current.text}</div><div style={{background:'rgba(228,0,43,0.1)',borderLeft:`3px solid ${C.red}`,padding:'12px 16px',borderRadius:'0 6px 6px 0',marginBottom:18}}><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:4,letterSpacing:'0.06em',textTransform:'uppercase'}}>Takeaway</div><div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.65}}>{current.takeaway}</div></div>{insights.length>0&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.4)',marginBottom:8}}>Insights earned</div>{insights.map((ins,i)=> <div key={i} style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.55,marginBottom:4}}>→ {ins}</div>)}</div>}<button onClick={restart} style={{background:C.red,color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Try a different path</button></div>
      :<div><div style={{fontSize:16,color:'rgba(255,255,255,0.82)',lineHeight:1.7,marginBottom:18,fontStyle:'italic'}}>"{current.narration}"</div><div style={{display:'flex',flexDirection:'column',gap:8}}>{current.choices.map((c,i)=> <button key={i} onClick={()=>choose(c)} style={{textAlign:'left',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'14px 16px',color:'rgba(255,255,255,0.85)',fontFamily:"'Source Sans 3',sans-serif",fontSize:14,cursor:'pointer',display:'flex',gap:12,alignItems:'flex-start'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(228,0,43,0.12)';e.currentTarget.style.borderColor=C.red}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}><div style={{width:22,height:22,border:'1px solid rgba(255,255,255,0.3)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{String.fromCharCode(65+i)}</div><span style={{lineHeight:1.5}}>{c.label}</span></button>)}</div></div>}
    </div></Reveal>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 8: APPLY — Build-a-Regression (MOVED from Regression tab)
// ═══════════════════════════════════════════════════════════════
const REG_SCENARIOS = [
  { id:'s2:esg-roa', topic:'ESG Score → Firm Performance', prompt:"Build a regression to test whether firms with higher ESG scores have better performance (ROA). Pick Y, X, controls, and fixed effects.",
    slots:[ {key:'dv',label:'Dependent Variable (Y)',options:['ROA','ESG score','Industry','Year'],correct:[0],explain:{0:'ROA is the outcome — firm performance.',1:'ESG score is your X, not Y.',2:'Industry is a fixed effect.',3:'Year is a time dimension.'}}, {key:'iv',label:'Key Independent Variable (X)',options:['Firm size (log assets)','ESG score','Leverage','Board size'],correct:[1],explain:{0:'Firm size is typically a control.',1:'ESG score is what you want to test.',2:'Leverage is a control.',3:'Board size is a governance control.'}}, {key:'controls',label:'Control Variables',options:['Leverage, firm size, age','None — bivariate OLS','Only industry dummies','CEO name and ticker'],correct:[0],explain:{0:'Standard controls in performance regressions.',1:'Omitting controls → omitted variable bias.',2:'Industry dummies are FE, not controls.',3:'Identifiers, not variables.'}}, {key:'fe',label:'Fixed Effects',options:['Firm FE + Year FE','No FE needed','Only Year FE','City FE'],correct:[0],explain:{0:'Gold standard — absorbs both firm heterogeneity and macro shocks.',1:'Without FE, omitted variable bias.',2:'Doesn\'t control for firm-level differences.',3:'Rarely used in corporate finance.'}} ],
    template: a => `ROAᵢₜ = β₀ + β₁ESGᵢₜ + Controls + αᵢ + δₜ + εᵢₜ` },
  { id:'s2:did-ifrs', topic:'IFRS Adoption → Earnings Quality (DiD)', prompt:"Design a DiD regression to test whether mandatory IFRS adoption improved earnings quality.",
    slots:[ {key:'dv',label:'Dependent Variable (Y)',options:['Accrual quality','IFRS dummy','Country GDP','Adoption year'],correct:[0],explain:{0:'Accrual quality is the outcome.',1:'IFRS dummy is the treatment indicator.',2:'GDP is macro, not Y.',3:'Year is time.'}}, {key:'iv',label:'Key Interaction (T × S)',options:['Post × Treated','Post only','Treated only','IFRS × Size'],correct:[0],explain:{0:'The DiD estimator — causal effect of treatment.',1:'Captures time trends only.',2:'Captures baseline group differences only.',3:'Tests heterogeneity, not the main effect.'}}, {key:'controls',label:'What T and S control for',options:['T absorbs time trends; S absorbs baseline group differences','T absorbs group diffs; S absorbs trends','Both absorb the treatment effect','Neither — β₃ does it all'],correct:[0],explain:{0:'Correct. T=time trends, S=group baselines. β₃ = clean treatment effect.',1:'Reversed.',2:'Only β₃ captures treatment.',3:'T and S each absorb confounds.'}}, {key:'assumption',label:'Key identification assumption',options:['Parallel trends','Random assignment','Large sample','Stationarity'],correct:[0],explain:{0:'Absent treatment, groups would follow the same trajectory. Testable pre-treatment.',1:'Applies to RCTs, not DiD.',2:'About power, not identification.',3:'Time-series concept.'}} ],
    template: a => `AQ_it = β₀ + β₁Postₜ + β₂Treatedᵢ + β₃(Post × Treated) + Controls + εᵢₜ` },
];

function ApplyTab({next}){
  const{completeTab}=useGame();
  return <div style={{paddingTop:56}}>
    <DarkWrap py={56}><RegressionBuilder/></DarkWrap>
    <Wrap><NextBtn onClick={()=>{completeTab('s2:apply');next();}} label="Final: Seminar Activity →"/></Wrap>
  </div>;
}

function RegressionBuilder(){
  const{awardXpOnce,awardBadge,markRegression}=useGame();
  const[scIdx,setScIdx]=useState(0);const[answers,setAnswers]=useState({});const[revealed,setRevealed]=useState({});const[submitted,setSubmitted]=useState(false);
  const sc=REG_SCENARIOS[scIdx];
  const pick=(sk,oi)=>{if(revealed[sk])return;setAnswers(a=>({...a,[sk]:oi}));};const lock=sk=>{setRevealed(r=>({...r,[sk]:true}));};
  const allRevealed=sc.slots.every(s=>revealed[s.key]);const allCorrect=sc.slots.every(s=>s.correct.includes(answers[s.key]));
  const submitReg=()=>{setSubmitted(true);const cc=sc.slots.filter(s=>s.correct.includes(answers[s.key])).length;awardXpOnce(`builder:${sc.id}`,cc*15+(allCorrect?30:0),allCorrect?'Valid regression built!':`${cc}/${sc.slots.length} correct`,{allowImprovement:true});awardBadge('regression-ready');markRegression(sc.id);};
  const loadSc=i=>{setScIdx(i);setAnswers({});setRevealed({});setSubmitted(false);};
  const preview={};sc.slots.forEach(s=>{const ai=answers[s.key];preview[s.key]=ai!==undefined?s.options[ai]:`[${s.label}]`;});

  return <div style={{maxWidth:800,margin:'0 auto'}}>
    <Reveal><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Interactive · Build a Regression</div><h2 style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1.1,marginBottom:12}}>Specify Your Model</h2><p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.65,marginBottom:24}}>Now that you know OLS, fixed effects, and DiD — put it all together. Pick the right Y, X, controls, and method for each scenario.</p></Reveal>
    <Reveal delay={0.08}>
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>{REG_SCENARIOS.map((s,i)=> <button key={s.id} onClick={()=>loadSc(i)} style={{background:i===scIdx?C.red:'rgba(255,255,255,0.05)',color:i===scIdx?'#fff':'rgba(255,255,255,0.55)',border:`1px solid ${i===scIdx?C.red:'rgba(255,255,255,0.1)'}`,borderRadius:6,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{s.topic}</button>)}</div>
      <div style={{background:'rgba(255,255,255,0.04)',borderLeft:`3px solid ${C.red}`,borderRadius:'0 8px 8px 0',padding:'14px 18px',marginBottom:24}}><div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.65}}>{sc.prompt}</div></div>
      <div style={{background:'rgba(228,0,43,0.1)',border:`1px dashed ${C.red}`,borderRadius:8,padding:'18px 20px',marginBottom:24,fontFamily:"'JetBrains Mono',monospace"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Your model</div><div style={{fontSize:14,color:C.white,lineHeight:1.6}}>{sc.template(preview)}</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>{sc.slots.map((slot,si)=>{const ai=answers[slot.key];const isR=revealed[slot.key];const isC=slot.correct.includes(ai);return <div key={slot.key} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${isR?(isC?C.green:C.red):'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'16px 18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red}}>Slot {si+1} · {slot.label}</div>{isR&&<div style={{fontSize:11,fontWeight:700,color:isC?C.green:C.amber}}>{isC?'✓ +15 XP':'× Review'}</div>}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>{slot.options.map((opt,oi)=>{const sel=ai===oi;const thisC=slot.correct.includes(oi);let bg='rgba(255,255,255,0.04)',bd='rgba(255,255,255,0.1)',cl='rgba(255,255,255,0.7)';if(isR){if(thisC){bg='rgba(26,127,75,0.15)';bd=C.green;cl=C.green;}else if(sel){bg='rgba(228,0,43,0.12)';bd=C.red;cl=C.red;}}else if(sel){bg='rgba(228,0,43,0.15)';bd=C.red;cl='#fff';}return <button key={oi} onClick={()=>pick(slot.key,oi)} disabled={isR} style={{background:bg,border:`1px solid ${bd}`,color:cl,padding:'9px 12px',fontSize:12.5,fontWeight:600,borderRadius:6,cursor:isR?'default':'pointer',fontFamily:"'Source Sans 3',sans-serif",textAlign:'left'}}>{opt}</button>;})}</div>
        {!isR&&ai!==undefined&&<button onClick={()=>lock(slot.key)} style={{background:C.red,color:'#fff',border:'none',borderRadius:4,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Lock in</button>}
        {isR&&ai!==undefined&&<div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.6,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'10px 14px',marginTop:4}}><strong style={{color:isC?C.green:C.amber}}>{isC?'Good:':'Why not:'}</strong> {slot.explain[ai]}</div>}
      </div>;})}</div>
      {allRevealed&&!submitted&&<button onClick={submitReg} style={{background:allCorrect?C.green:C.amber,color:'#fff',border:'none',borderRadius:6,padding:'14px 28px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Submit ({sc.slots.filter(s=>s.correct.includes(answers[s.key])).length}/{sc.slots.length} correct)</button>}
      {submitted&&<div style={{background:allCorrect?'rgba(26,127,75,0.12)':'rgba(230,119,0,0.12)',border:`1px solid ${allCorrect?C.green:C.amber}`,borderRadius:10,padding:'18px 22px'}}><div style={{fontSize:11,fontWeight:700,color:allCorrect?C.green:C.amber,marginBottom:8}}>{allCorrect?'★ Model Locked In':'Revise and retry'}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.white,lineHeight:1.6,background:'rgba(0,0,0,0.3)',borderRadius:6,padding:'14px 16px',marginBottom:10}}>{sc.template(preview)}</div><button onClick={()=>loadSc(scIdx)} style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Retry</button></div>}
    </Reveal>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 9: ACTIVITY — gamified final quiz
// ═══════════════════════════════════════════════════════════════
function ActivityTab(){
  const{completeTab}=useGame();
  const qs=[
    {id:'a1',q:'What does R² = 0.75 mean?',opts:['75% of observations are correctly predicted','75% of the variation in Y is explained by the model','The slope coefficient is 0.75','The model has 75 observations'],c:1,ex:'R² = SSR/SST = 1 − SSE/SST. It measures the proportion of total variation in Y captured by X.'},
    {id:'a2',q:'In a DiD design, what does β₃ (the coefficient on T × S) estimate?',opts:['The overall time trend','The pre-treatment group difference','The causal treatment effect (difference of differences)','The control group\'s change over time'],c:2,ex:'β₃ = (change in treated) − (change in control). It nets out both time trends and baseline differences.'},
    {id:'a3',q:'When should you use logit instead of OLS?',opts:['When your sample is small','When Y is binary (0 or 1)','When you have many controls','When X is categorical'],c:1,ex:'Logit models P(Y=1). OLS on binary Y can predict outside [0,1], which makes no sense for probabilities.'},
    {id:'a4',q:'What do firm fixed effects control for?',opts:['Changes over time common to all firms','Unobserved time-invariant firm characteristics','The relationship between X and Y','Measurement error'],c:1,ex:'Firm FE absorb all cross-sectional heterogeneity that is constant over time (industry, culture, location, etc.).'},
    {id:'a5',q:'Two Xs in your regression have r = 0.89. What problem does this cause?',opts:['Autocorrelation','Multicollinearity — inflated SEs and unstable coefficients','Heteroskedasticity','Omitted variable bias'],c:1,ex:'High correlation between Xs = multicollinearity. Standard errors inflate, making it hard to determine which X matters. Fix: drop one or combine into an index.'},
    {id:'a6',q:'A coefficient is statistically significant but tiny in economic terms. What should you do?',opts:['Report it as important because p < 0.05','Discuss the effect size and practical importance','Drop it from the table','Change the dependent variable'],c:1,ex:'Research interpretation needs both statistical significance and economic magnitude. A small coefficient can be precise but not practically meaningful.'},
    {id:'a7',q:'Why might you cluster standard errors by firm?',opts:['To increase R²','To handle repeated observations from the same firm','To remove outliers automatically','To make coefficients larger'],c:1,ex:'Panel observations for the same firm can have correlated errors. Clustering adjusts the standard errors for that dependence.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Seminar Activity</Label><H>Apply What You've Learned</H><P>Continue with the paper you identified in Seminar 1. Focus on the quantitative results tables.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:20,background:C.redSubtle,borderColor:C.red}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Your tasks</div>
        <Num n={1}>Check for tables on <strong>summary statistics, correlation matrix, and regression</strong>. Identify the <strong style={{background:'#FFEF00',padding:'1px 4px',borderRadius:2}}>NEW variable(s)</strong>.</Num>
        <Num n={2}>In <strong>summary statistics</strong>, discuss Y and the NEW variable(s). What are their means and SDs?</Num>
        <Num n={3}>In the <strong>correlation matrix</strong>, check for multicollinearity (r {'>'} |0.7|) among independent variables.</Num>
        <Num n={4}>In the <strong>first regression table</strong>, is the key coefficient significant? What sign? At what level?</Num>
        <Num n={5}>In the <strong>robustness checks</strong>, do the results hold under alternative specifications?</Num>
      </Card></Reveal>
      <Reveal delay={0.12}><Callout accent={C.blue} bg={C.blueBg}><strong>Exit ticket:</strong> Write one sentence each for the main coefficient, its economic meaning, one diagnostic concern, and one robustness test you would want to see.</Callout></Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Final Quiz</H><P>Test your understanding of all the methods covered today.</P></Reveal>
      <GamifiedQuiz quizId="s2:final" questions={qs} xpPerQ={12} perfectBonus={24} badgeOnPerfect="methods-master" onComplete={()=>completeTab('s2:activity',40)}/>
    </Wrap>
    <Wrap><div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:900,color:C.black,marginBottom:6}}>End of Seminar 2</div><div style={{fontSize:15,color:C.black60}}>Well done! Your XP and badges persist across both seminars.</div></div></Wrap>
  </div>;
}
