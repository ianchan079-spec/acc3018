// SEMINAR 3 - Quantitative Research Methods II
import { useState, useEffect, useMemo, useCallback } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Li, Num, Accordion, NextBtn, GamifiedQuiz, Formula,
  TopNav, ProgressWidget,
} from '../shared/components';

const TABS=[{id:'s3:overview',label:'Overview'},{id:'s3:endogeneity',label:'Endogeneity'},{id:'s3:omitted',label:'Omitted Variables'},{id:'s3:simultaneous',label:'Simultaneous Eqs'},{id:'s3:selection',label:'Selection Bias'},{id:'s3:measurement',label:'Measurement Error'},{id:'s3:iv',label:'IV & 2SLS'},{id:'s3:apply',label:'Apply: Build IV'},{id:'s3:activity',label:'Activity'}];


// ═══════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW
// ═══════════════════════════════════════════════════════════════
function OverviewTab({next}){
  const{completeTab}=useGame();
  return <div>
    <div style={{background:C.black,minHeight:'52vh',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:56}}>
      <div style={{position:'absolute',top:0,right:0,width:380,height:380,background:C.red,borderRadius:'0 0 0 100%',opacity:0.08}}/>
      <div style={{position:'absolute',top:56,left:0,right:0,height:4,background:C.red}}/>
      <div style={{position:'absolute',bottom:40,right:60,fontSize:200,fontWeight:900,color:'rgba(228,0,43,0.06)',lineHeight:1,fontFamily:"'JetBrains Mono',monospace"}}>⊥</div>
      <div style={{maxWidth:840,margin:'0 auto',padding:'44px 36px',width:'100%',position:'relative'}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:14}}>ACC3018 · Seminar 3</div>
        <h1 style={{fontSize:'clamp(32px,5.5vw,60px)',fontWeight:900,lineHeight:1.06,letterSpacing:'-0.025em',color:C.white,marginBottom:14}}>Endogeneity<br/>& Causal Identification</h1>
        <p style={{fontSize:17,color:'rgba(255,255,255,0.45)',maxWidth:520,lineHeight:1.6}}>The most delicate assumption in regression — and the toolkit researchers use to recover causal effects when it fails.</p>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>Agenda</Label><H size={30}>What we'll cover today</H></Reveal>
      <Reveal delay={0.08}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {[{n:'01',t:'Endogeneity',d:'Orthogonality, why it matters, and why it cannot be tested'},{n:'02',t:'Omitted Variables',d:'The most common source — bias formula and direction'},{n:'03',t:'Simultaneous Equations',d:'Bidirectional causation: when X and Y move each other'},{n:'04',t:'Selection Bias',d:'Non-random treatment assignment distorts the estimate'},{n:'05',t:'Measurement Error',d:'Mismeasured Xs correlate with the error term'},{n:'06',t:'Instrumental Variables & 2SLS',d:'Natural experiments and the two-stage procedure'},{n:'07',t:'Apply: Build an IV Strategy',d:'Hands-on instrument selection exercise'},{n:'08',t:'Seminar Activity',d:'Find a 2SLS paper and dissect the design'}].map((item,i)=> <Card key={i}><div style={{display:'flex',gap:10}}><div style={{fontSize:20,fontWeight:900,color:C.red,flexShrink:0}}>{item.n}</div><div><div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:2}}>{item.t}</div><div style={{fontSize:12,color:C.black60,lineHeight:1.5}}>{item.d}</div></div></div></Card>)}
      </div></Reveal>
      <Reveal delay={0.15}><Card style={{background:C.goldBg,borderColor:C.gold,marginTop:18}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.gold,marginBottom:6}}>⬢ Gamification active</div>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.65}}>Your progress is <strong>shared with Seminars 1 & 2</strong> — XP, badges, and leaderboard position carry across all three seminars.</div>
      </Card></Reveal>
      <Reveal delay={0.2}><Card style={{background:C.redSubtle,borderColor:C.red,marginTop:14}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:6}}>The big question</div>
        <div style={{fontSize:15,color:C.black,lineHeight:1.6,fontWeight:600}}>"My regression coefficient is significant — does that mean X causes Y?"</div>
        <div style={{fontSize:13,color:C.black80,lineHeight:1.6,marginTop:6}}>By the end of this seminar, you'll know exactly when the answer is "no", and what to do about it.</div>
      </Card></Reveal>
      <NextBtn onClick={()=>{completeTab('s3:overview',20);next();}} label="Start: What is Endogeneity? →"/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: ENDOGENEITY — orthogonality, why it matters
// ═══════════════════════════════════════════════════════════════
function EndogeneityTab({next}){
  const{completeTab}=useGame();
  // Slider state — controls correlation between x and ε
  const[corr,setCorr]=useState(0);

  // Helper to generate points with a given correlation, using a seeded RNG
  const genPoints=(corrVal,seed=42)=>{
    let s=seed;
    const rand=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};
    const norm=()=>{let u=0,v=0;while(u===0)u=rand();while(v===0)v=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
    const arr=[];
    for(let i=0;i<80;i++){
      const x=2+rand()*12;
      const eps=norm()*1.0 + corrVal*x;
      arr.push({x,y:6+0.3*x+eps});
    }
    return arr;
  };
  // Static demo points (slide 7-8 scenario): ε ~ N(-0.6x, 1)
  const staticPoints=useMemo(()=>genPoints(-0.6,7),[]);
  // Dynamic points reflect the slider
  const points=useMemo(()=>genPoints(corr),[corr]);

  // OLS slope from dynamic points
  const xBar=points.reduce((s,p)=>s+p.x,0)/points.length;
  const yBar=points.reduce((s,p)=>s+p.y,0)/points.length;
  const num=points.reduce((s,p)=>s+(p.x-xBar)*(p.y-yBar),0);
  const den=points.reduce((s,p)=>s+(p.x-xBar)**2,0);
  const bHat=den?num/den:0;
  const aHat=yBar-bHat*xBar;
  const bias=bHat-0.3;

  const qs=[
    {id:'e1',q:'When is x exogenous?',opts:['When x is large','When E[xε] = 0 (uncorrelated with the error term)','When x has no relationship with y','When the sample size is large'],c:1,ex:'Exogeneity = orthogonality. The independent variable must be uncorrelated with the error term so that variation in x identifies the effect cleanly.'},
    {id:'e2',q:'Why is endogeneity called "the most delicate" OLS assumption?',opts:['It is hard to compute','It cannot be reliably tested — only argued from theory or common sense','It only matters in large samples','It only affects the intercept'],c:1,ex:'Failures of other assumptions (heteroskedasticity, autocorrelation) can be detected and adjusted for. Endogeneity cannot be tested directly — endogenous data can look completely normal.'},
    {id:'e3',q:'Under endogeneity, what happens to your OLS estimate β̂₁?',opts:['It remains unbiased but with larger SE','It becomes inconsistent — even with infinite data, β̂₁ does not converge to β₁','It becomes exactly zero','Only the intercept is affected'],c:1,ex:'Endogeneity makes OLS inconsistent. More data does not fix it. This is why it is so dangerous — your model can be a poor description of reality, no matter how big the dataset.'},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Endogeneity</Label><H>Why Your Coefficient Might Be Lying To You</H><P>OLS gives you β̂₁, an estimate of the effect of x on y. For β̂₁ to mean anything causal, one assumption must hold above all others: <strong>orthogonality</strong> — the independent variable x must be <strong>uncorrelated</strong> with everything else that drives y (the error term ε).</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>The orthogonality condition</div>
        <Formula>E[ xᵢ · εᵢ ] = 0  ⇒  x is exogenous</Formula>
        <P mb={6}>If this fails — if x is correlated with ε — then x is <strong>endogenous</strong>, and OLS produces biased and inconsistent estimates of β₁.</P>
      </Card></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
        <Card style={{borderLeft:`3px solid ${C.green}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Exogenous</div>
          <P mb={6}>Variation in x is independent of all other determinants of y.</P>
          <Li><strong>E[xε] = 0</strong> holds</Li>
          <Li>OLS is <strong>unbiased</strong>: E[β̂₁] = β₁</Li>
          <Li>OLS is <strong>consistent</strong>: β̂₁ → β₁ as n → ∞</Li>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Endogenous</div>
          <P mb={6}>x is correlated with the error term — variation in x is contaminated by other things.</P>
          <Li><strong>E[xε] ≠ 0</strong></Li>
          <Li>OLS is <strong>biased</strong></Li>
          <Li>OLS is <strong>inconsistent</strong> — more data does not help</Li>
        </Card>
      </div></Reveal>
      <Reveal delay={0.15}><Callout accent={C.amber} bg={C.amberBg}><strong>Why this matters more than other assumption failures:</strong> Heteroskedasticity? Use robust SEs. Autocorrelation? Use Newey-West. But endogeneity poisons the coefficient itself. You can have a clean-looking regression with R² = 0.63 and confidently report the wrong sign on β₁.</Callout></Reveal>
    </Wrap>

    {/* Worked example from slides 7-8 — visualisation of endogenous case */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>The Hidden Disaster</H><P>Here is a simulated example where the <strong>true</strong> data-generating process is yᵢ = 6 + 0.3xᵢ + εᵢ. But εᵢ is correlated with xᵢ (specifically εᵢ ~ N(−0.6xᵢ, 1)). Watch what OLS reports.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,alignItems:'center'}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.black60,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Truth</div>
            <Formula>yᵢ = 6 + 0.3xᵢ + εᵢ</Formula>
            <div style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6,marginTop:14}}>OLS reports</div>
            <Formula>ŷᵢ = 6.04 − 0.31xᵢ</Formula>
            <div style={{fontSize:13,color:C.black80,marginTop:8,lineHeight:1.6}}>R² = 0.63 — looks like a great fit. But the <strong style={{color:C.red}}>sign is flipped</strong>. The true effect is positive (+0.3); OLS reports negative (−0.31). A policymaker acting on this would be misled.</div>
          </div>
          <div>
            <svg viewBox="0 0 320 240" style={{width:'100%',background:C.white,borderRadius:6,border:`1px solid ${C.black10}`}}>
              {/* axes */}
              <line x1="40" y1="200" x2="300" y2="200" stroke={C.black20} strokeWidth="1"/>
              <line x1="40" y1="20" x2="40" y2="200" stroke={C.black20} strokeWidth="1"/>
              <text x="170" y="225" fontSize="10" fill={C.black60} textAnchor="middle">x</text>
              <text x="22" y="110" fontSize="10" fill={C.black60} textAnchor="middle" transform="rotate(-90 22 110)">y</text>
              {/* True line: y = 6 + 0.3x — over x in [2,14], y goes 6.6 to 10.2 — map to chart */}
              <line x1={40+(2/16)*260} y1={200-((6.6)/12)*180} x2={40+(14/16)*260} y2={200-((10.2)/12)*180} stroke={C.green} strokeWidth="2" strokeDasharray="4 3"/>
              {/* OLS line: y = 6.04 - 0.31x */}
              <line x1={40+(2/16)*260} y1={200-((6.04-0.31*2)/12)*180} x2={40+(14/16)*260} y2={200-((6.04-0.31*14)/12)*180} stroke={C.red} strokeWidth="2.5"/>
              {/* points */}
              {staticPoints.slice(0,60).map((p,i)=> <circle key={i} cx={40+(p.x/16)*260} cy={200-(Math.max(0,Math.min(12,p.y))/12)*180} r="2.5" fill={C.red} opacity="0.55"/>)}
              <text x="280" y="40" fontSize="9" fill={C.green} textAnchor="end" fontWeight="700">— — true (+0.3)</text>
              <text x="280" y="54" fontSize="9" fill={C.red} textAnchor="end" fontWeight="700">— OLS (−0.31)</text>
            </svg>
          </div>
        </div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.red} bg={C.redSubtle}><strong>The real-world stakes:</strong> If x = number of police officers, y = crime rate, and ε = demographics. A naive OLS may show that more police → more crime (because police are deployed where crime is highest). A policy that <em>changes x</em> (deploy more officers) will not <em>change ε</em> (demographics). The OLS coefficient is descriptively useful but causally misleading.</Callout></Reveal>
    </Wrap>

    {/* Interactive: drag the X-error correlation and watch the OLS line break */}
    <Wrap bg={C.blueBg} py={40}>
      <Reveal><Label color={C.blue}>Try it yourself</Label><H size={26} color={C.blue}>Watch Endogeneity Break OLS</H><P color={C.blue} mb={14}>The slider controls how strongly x is correlated with the error ε. The <strong>true</strong> slope is always +0.3. Watch what OLS reports as you increase the correlation.</P></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:14}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,fontWeight:600,color:C.black}}>Correlation between x and ε</span><span style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:"'JetBrains Mono',monospace"}}>{corr.toFixed(2)}</span></div>
            <input type="range" min="-0.8" max="0.8" step="0.05" value={corr} onChange={e=>setCorr(parseFloat(e.target.value))} style={{width:'100%',accentColor:C.red}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.black60,marginTop:2}}><span>Negative</span><span>0 (exogenous)</span><span>Positive</span></div>
          </div>
        </div>
        <svg viewBox="0 0 600 280" style={{width:'100%',background:C.white,borderRadius:6,border:`1px solid ${C.black10}`,marginBottom:10}}>
          <line x1="50" y1="240" x2="570" y2="240" stroke={C.black20} strokeWidth="1"/>
          <line x1="50" y1="20" x2="50" y2="240" stroke={C.black20} strokeWidth="1"/>
          <text x="310" y="265" fontSize="11" fill={C.black60} textAnchor="middle">x</text>
          <text x="28" y="130" fontSize="11" fill={C.black60} textAnchor="middle" transform="rotate(-90 28 130)">y</text>
          {/* True line (always +0.3) */}
          <line x1={50+(2/16)*520} y1={240-((6+0.3*2)/14)*220} x2={50+(14/16)*520} y2={240-((6+0.3*14)/14)*220} stroke={C.green} strokeWidth="2" strokeDasharray="5 3"/>
          {/* OLS line */}
          <line x1={50+(2/16)*520} y1={240-Math.max(0,Math.min(14,aHat+bHat*2))/14*220} x2={50+(14/16)*520} y2={240-Math.max(0,Math.min(14,aHat+bHat*14))/14*220} stroke={C.red} strokeWidth="2.5"/>
          {points.map((p,i)=> <circle key={i} cx={50+(p.x/16)*520} cy={240-Math.max(0,Math.min(14,p.y))/14*220} r="3" fill={C.red} opacity="0.5"/>)}
          <text x="555" y="35" fontSize="10" fill={C.green} textAnchor="end" fontWeight="700">— — Truth (β = +0.30)</text>
          <text x="555" y="50" fontSize="10" fill={C.red} textAnchor="end" fontWeight="700">— OLS (β̂ = {bHat.toFixed(2)})</text>
        </svg>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          <div style={{background:C.black05,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:C.black60,marginBottom:2}}>True β₁</div><div style={{fontSize:20,fontWeight:900,color:C.green}}>+0.30</div></div>
          <div style={{background:C.redSubtle,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:C.red,marginBottom:2}}>OLS β̂₁</div><div style={{fontSize:20,fontWeight:900,color:C.red}}>{bHat.toFixed(3)}</div></div>
          <div style={{background:Math.abs(bias)<0.1?C.greenBg:C.amberBg,borderRadius:6,padding:'10px',textAlign:'center'}}><div style={{fontSize:10,color:Math.abs(bias)<0.1?C.green:C.amber,marginBottom:2}}>Bias</div><div style={{fontSize:20,fontWeight:900,color:Math.abs(bias)<0.1?C.green:C.amber}}>{bias>=0?'+':''}{bias.toFixed(3)}</div></div>
        </div>
        <div style={{padding:'10px 14px',background:Math.abs(corr)<0.05?C.greenBg:C.amberBg,borderRadius:6,fontSize:13,color:Math.abs(corr)<0.05?C.green:C.amber,lineHeight:1.6,borderLeft:`3px solid ${Math.abs(corr)<0.05?C.green:C.amber}`,marginTop:10}}><strong>Insight:</strong> {Math.abs(corr)<0.05?'When x and ε are uncorrelated, OLS recovers the true slope. This is the world we want to live in.':corr>0?'Positive correlation between x and ε pushes OLS upward — it overestimates the effect.':'Negative correlation between x and ε pulls OLS downward — it can even flip the sign, like in the slide example.'}</div>
      </Card></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Endogeneity Basics</H><P>Quick check on the orthogonality condition and why it cannot be ignored.</P></Reveal>
      <GamifiedQuiz quizId="s3:endogeneity" questions={qs} xpPerQ={10} perfectBonus={20} badgeOnPerfect="orthogonalist"/>
      <NextBtn onClick={()=>{completeTab('s3:endogeneity');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 3: OMITTED VARIABLES — formula, schooling example, GDP/LifeExp
// ═══════════════════════════════════════════════════════════════
function OmittedTab({next}){
  const{completeTab}=useGame();
  // Interactive: predict the direction of bias
  const[scenario,setScenario]=useState(0);const[guess,setGuess]=useState(null);const[revealed,setRevealed]=useState(false);
  const scenarios=[
    {title:'Schooling → Wages, omitting Skill',desc:'You estimate WAGE = β₀ + β₁·EDU + ε. You omit innate Skill, which has α₁ > 0 (skilled people stay in school longer) and β₂ > 0 (skill raises wages).',a1:'+',a2:'+',correct:'over',expl:'α₁ > 0 and β₂ > 0, so α₁β₂ > 0. The bias is positive — you overestimate the return to education.'},
    {title:'Police → Crime, omitting Demographics',desc:'You estimate CRIME = β₀ + β₁·POLICE + ε. You omit demographics. Police are deployed where crime risk is high (α₁ > 0 between demographics and police), and demographics independently raise crime (β₂ > 0).',a1:'+',a2:'+',correct:'over',expl:'Both α₁ and β₂ are positive. The bias is positive — you overestimate (or worse, you flip the sign of) the effect of police on crime.'},
    {title:'Exercise → Weight Loss, omitting Diet',desc:'You estimate WEIGHTLOSS = β₀ + β₁·EXERCISE + ε. You omit diet quality. Exercisers tend to also eat well (α₁ > 0), and good diet lowers weight (β₂ < 0).',a1:'+',a2:'−',correct:'under',expl:'α₁ > 0 but β₂ < 0, so α₁β₂ < 0. The bias is negative — you underestimate (or even reverse) the true effect of exercise.'},
  ];
  const sc=scenarios[scenario];
  const reset=()=>{setRevealed(false);setGuess(null);};

  const qs=[
    {id:'om1',q:'You estimate WAGE = β₀ + β₁·EDU + ε but omit innate skill (which raises both schooling and wages). What direction is your bias on β̂₁?',opts:['Negative — you underestimate the return to schooling','Positive — you overestimate the return to schooling','Zero — random unobservables average out','Cannot tell without the data'],c:1,ex:'Bias = α₁β₂. Skilled people stay in school (α₁ > 0) and earn more (β₂ > 0). The product is positive, so OLS overestimates β₁.'},
    {id:'om2',q:'When does omitted variable bias DISAPPEAR?',opts:['When the sample is large','When the omitted variable has no relation to y (β₂ = 0) OR no relation to x (α₁ = 0)','When R² is high','When you have many controls'],c:1,ex:'Bias = α₁β₂. If either factor is zero, the bias is zero. This is why "control variables" only matter if they correlate with both x and y.'},
    {id:'om3',q:'In the GDP → LifeExp example, what fixed the original m1 specification (lifeExp ~ gdpPercap)?',opts:['Adding more years of data','Adding continent fixed effects and year','Switching to a logit model','Increasing the significance threshold'],c:1,ex:'Continent FE absorb time-invariant continental differences (geography, history, institutions); year absorbs global trends. Both correlate with GDP and life expectancy.'},
    {id:'om4',q:'A "fixed effect" is just a way to:',opts:['Test whether your data is fixed','Drop outliers','Include dummy variables for every value of a category — absorbing all differences across that category','Make the regression run faster'],c:2,ex:'Continent FE = N−1 dummies for continents. They absorb every time-invariant continental difference at once, removing it as a possible omitted variable.'},
  ];

  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Source #1</Label><H>Omitted Variables</H><P>The most common source of endogeneity. The error term ε is a catch-all for everything else that drives y. If something in ε also correlates with x, you have a problem.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Setup</div>
        <P mb={8}>The true model has two regressors:</P>
        <Formula>yᵢ = β₀ + β₁x₁ᵢ + β₂x₂ᵢ + ηᵢ</Formula>
        <P mb={8}>But you only observe x₁, so you estimate:</P>
        <Formula>yᵢ = β₀ + β₁x₁ᵢ + εᵢ   ← ε now contains x₂</Formula>
      </Card></Reveal>
      <Reveal delay={0.1}><Card style={{marginBottom:18,background:C.black,borderColor:C.black}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>The omitted variable bias formula</div>
        <Formula dark>E[β̂₁] = β₁ + β₂ · α₁</Formula>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginTop:10}}>where α₁ comes from the auxiliary regression x₂ᵢ = α₀ + α₁x₁ᵢ + φᵢ. The bias is <strong style={{color:C.white}}>α₁ × β₂</strong> — the product of (1) how strongly the omitted variable is correlated with x₁ and (2) the omitted variable's true effect on y.</div>
        <div style={{background:'rgba(228,0,43,0.15)',borderLeft:`3px solid ${C.red}`,padding:'10px 14px',borderRadius:'0 6px 6px 0',marginTop:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:3,letterSpacing:'0.06em',textTransform:'uppercase'}}>OLS is consistent only if</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.85)'}}>β₂ = 0  (omitted variable doesn't affect y), <strong>or</strong> α₁ = 0 (omitted variable is uncorrelated with x₁).</div>
        </div>
      </Card></Reveal>
    </Wrap>

    {/* Worked example: schooling */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Worked Example: Returns to Schooling</H><P>One of the most-studied questions in labour economics: how much does an extra year of schooling raise wages?</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>The naïve regression</div>
        <Formula>WAGEᵢ = β₀ + β₁·EDUᵢ + γxᵢ + εᵢ</Formula>
        <P mb={8}>where xᵢ are observed controls (age, gender, parental education, etc.). The problem: <strong>innate skill</strong> is unobserved and goes into ε.</P>
      </Card></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:14}}>
        <Card style={{borderTop:`3px solid ${C.amber}`}}><div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Step 1: Skill ↔ Education</div><Formula>SKILLᵢ = α₀ + α₁·EDUᵢ + …</Formula><div style={{fontSize:13,color:C.black80,lineHeight:1.55}}>Skilled students enjoy and persist in education longer. Expect <strong>α₁ &gt; 0</strong>.</div></Card>
        <Card style={{borderTop:`3px solid ${C.amber}`}}><div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Step 2: Skill → Wages</div><Formula>WAGEᵢ = β₀ + β₁·EDU + β₂·SKILL + …</Formula><div style={{fontSize:13,color:C.black80,lineHeight:1.55}}>Skilled workers earn more, holding schooling fixed. Expect <strong>β₂ &gt; 0</strong>.</div></Card>
        <Card style={{borderTop:`3px solid ${C.red}`}}><div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Step 3: The bias</div><Formula>E[β̂₁] = β₁ + α₁·β₂ &gt; β₁</Formula><div style={{fontSize:13,color:C.black80,lineHeight:1.55}}>Both terms positive ⇒ OLS <strong>overestimates</strong> the return to schooling.</div></Card>
      </div></Reveal>
      <Reveal delay={0.15}><Callout accent={C.red} bg={C.redSubtle}><strong>The policy implication:</strong> If we read β̂₁ literally, we conclude that mass investment in schooling will produce huge wage gains. But part of β̂₁ is just innate skill leaking through. Building more schools doesn't change innate skill, so the actual return to schooling is smaller than OLS suggests.</Callout></Reveal>
    </Wrap>

    {/* GDP and LifeExp example */}
    <Wrap>
      <Reveal><H size={28}>Worked Example: GDP per Capita and Life Expectancy</H><P>The Gapminder dataset offers a cautionary tale about reading off coefficients without thinking about what the error term contains.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr',gap:12,marginBottom:14}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,flexWrap:'wrap',gap:8}}>
            <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase'}}>Model 1 — Naïve</div>
            <div style={{fontSize:11,fontWeight:700,color:C.black60}}>R² = 0.34</div>
          </div>
          <Formula>lifeExp = α + β·gdpPercap + ε</Formula>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:10,fontSize:12,marginTop:8,alignItems:'center'}}>
            <span style={{color:C.black60}}>gdpPercap:</span><span style={{color:C.black,fontFamily:"'JetBrains Mono',monospace"}}>7.65 × 10⁻⁴</span><span style={{color:C.red,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>***</span>
          </div>
          <div style={{fontSize:13,color:C.black80,marginTop:10,lineHeight:1.6}}>Highly significant. But continent and decade are stuffed into ε.</div>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.amber}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,flexWrap:'wrap',gap:8}}>
            <div style={{fontSize:12,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase'}}>Model 2 — + Continent FE + Year</div>
            <div style={{fontSize:11,fontWeight:700,color:C.black60}}>R² = 0.72</div>
          </div>
          <Formula>lifeExp = α + β·gdpPercap + Continent FE + Year + ε</Formula>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:10,fontSize:12,marginTop:8,alignItems:'center'}}>
            <span style={{color:C.black60}}>gdpPercap:</span><span style={{color:C.black,fontFamily:"'JetBrains Mono',monospace"}}>2.97 × 10⁻⁴</span><span style={{color:C.red,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>***</span>
          </div>
          <div style={{fontSize:13,color:C.black80,marginTop:10,lineHeight:1.6}}>The coefficient <strong>shrank to ~40%</strong> of Model 1 once we absorb continental differences and time trends. Most of the original effect was driven by which continent a country was in.</div>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.green}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:700,color:C.green,letterSpacing:'0.06em',textTransform:'uppercase'}}>Model 3 — + Continent × Year interactions</div>
          </div>
          <Formula>lifeExp = α + β·gdpPercap + Continent×Year FE + ε</Formula>
          <div style={{fontSize:13,color:C.black80,marginTop:10,lineHeight:1.6}}>The effect of GDP differs across continents. Once we allow continent-specific time trends, gdpPercap becomes <strong>less significant</strong> — and we realise the coefficient was averaging across very different continental experiences.</div>
        </Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout><strong>The lesson:</strong> Adding fixed effects is the most common (and often the most powerful) defence against omitted-variable bias. They absorb everything that's constant within the FE category — without you needing to observe it.</Callout></Reveal>
    </Wrap>

    {/* Interactive: predict the direction of bias */}
    <Wrap bg={C.blueBg} py={40}>
      <Reveal><Label color={C.blue}>Try it yourself</Label><H size={26} color={C.blue}>Predict the Direction of Bias</H><P color={C.blue} mb={14}>Read the scenario, decide the signs of α₁ and β₂, then predict whether OLS over- or underestimates the true effect.</P></Reveal>
      <Reveal delay={0.05}><Card>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>{scenarios.map((s,i)=> <button key={i} onClick={()=>{setScenario(i);reset();}} style={{padding:'7px 14px',border:`1px solid ${scenario===i?C.red:C.black20}`,borderRadius:5,background:scenario===i?C.redSubtle:C.white,color:scenario===i?C.red:C.black80,fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer'}}>Case {i+1}</button>)}</div>
        <div style={{background:C.black05,padding:'14px 16px',borderRadius:6,marginBottom:14,borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:6}}>{sc.title}</div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>{sc.desc}</div>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:C.black,marginBottom:8,letterSpacing:'0.06em',textTransform:'uppercase'}}>Direction of bias on β̂₁?</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
          {[{key:'over',label:'Overestimate (positive bias)'},{key:'under',label:'Underestimate (negative bias)'}].map(opt=>{
            const sel=guess===opt.key;const isC=opt.key===sc.correct;
            let bg=C.white,bd=C.black20,cl=C.black80;
            if(revealed){if(isC){bg=C.greenBg;bd=C.green;cl=C.green}else if(sel){bg='#FDECEA';bd=C.red;cl=C.red}}
            else if(sel){bg=C.redSubtle;bd=C.red;cl=C.red}
            return <button key={opt.key} onClick={()=>!revealed&&setGuess(opt.key)} disabled={revealed} style={{padding:'12px 14px',border:`1.5px solid ${bd}`,borderRadius:6,background:bg,cursor:revealed?'default':'pointer',fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,color:cl,textAlign:'left'}}>{opt.label}</button>;
          })}
        </div>
        {!revealed&&guess&&<button onClick={()=>setRevealed(true)} style={{background:C.red,color:'#fff',border:'none',borderRadius:6,padding:'10px 22px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Check answer</button>}
        {revealed&&<div style={{padding:'12px 16px',background:guess===sc.correct?C.greenBg:C.amberBg,borderRadius:6,fontSize:13,color:C.black80,lineHeight:1.65,borderLeft:`3px solid ${guess===sc.correct?C.green:C.amber}`}}>
          <strong style={{color:guess===sc.correct?C.green:C.amber}}>{guess===sc.correct?'✓ Correct.':'× Not quite.'}</strong> α₁ is <strong>{sc.a1}</strong>, β₂ is <strong>{sc.a2}</strong>, so α₁·β₂ is {sc.correct==='over'?'positive':'negative'}. {sc.expl}
        </div>}
      </Card></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Omitted Variables Quiz</H></Reveal>
      <GamifiedQuiz quizId="s3:omitted" questions={qs} xpPerQ={10} perfectBonus={20} badgeOnPerfect="omitted-spotter"/>
      <NextBtn onClick={()=>{completeTab('s3:omitted');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 4: SIMULTANEOUS EQUATIONS
// ═══════════════════════════════════════════════════════════════
function SimultaneousTab({next}){
  const{completeTab}=useGame();
  const qs=[
    {id:'sim1',q:'You regress GDP on civil war intensity. Why is the civil-war coefficient endogenous?',opts:['GDP is poorly measured','Civil war and GDP affect each other — bad economy fuels conflict, conflict wrecks the economy','Civil wars are rare events','GDP is correlated with population'],c:1,ex:'This is reverse / simultaneous causation. y₁ (GDP) and y₂ (war) feed back into each other, so a change in ε ripples through both equations and contaminates the regressor.'},
    {id:'sim2',q:'Two equations: y₁ = β₀ + β₁y₂ + ε  and  y₂ = α₀ + α₁y₁ + η. What is the consequence?',opts:['ε and y₂ become correlated, breaking orthogonality in the first equation','Nothing — OLS handles this fine','The second equation can be ignored','The system has no solution'],c:0,ex:'A shock in ε changes y₁, which changes y₂ (via the second equation). So y₂ is correlated with ε — endogenous.'},
    {id:'sim3',q:'Education and income may have a circular relationship. Which is the BEST description?',opts:['Education increases income — the relationship is one-way','Income may also enable more education — the relationship is bidirectional, so OLS of income on education is biased','Education has no real effect on income','OLS will produce unbiased estimates as long as the sample is random'],c:1,ex:'Higher income lets families afford more education, which in turn raises lifetime income — a feedback loop. OLS cannot disentangle the two directions without an instrument.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Source #2</Label><H>Simultaneous Equations</H><P>What if y doesn't just depend on x — but x also depends on y? When the dependent and independent variables move each other, the OLS coefficient is no longer the causal effect of x on y. It is a tangled mix of both directions.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>The system</div>
        <Formula>y₁ᵢ = β₀ + β₁ y₂ᵢ + γxᵢ + εᵢ</Formula>
        <Formula>y₂ᵢ = α₀ + α₁ y₁ᵢ + θzᵢ + ηᵢ</Formula>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.65,marginTop:10}}>A shock to εᵢ raises y₁ᵢ. But the second equation says y₁ feeds back into y₂. So y₂ moves with ε. <strong>Hence y₂ is correlated with ε — endogenous.</strong></div>
      </Card></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Worked Example: Welfare and Political Stability</H><P>Civil wars are still common in many parts of the world. A natural question: does economic prosperity reduce political instability?</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card style={{borderLeft:`3px solid ${C.green}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.green,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Direction A: GDP → War</div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.65}}>In prosperous times, citizens are less discontented and have more to lose. So <strong>higher GDP → less conflict</strong>. β₁ is expected to be negative.</div>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Direction B: War → GDP</div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.65}}>Civil conflict destroys infrastructure and frightens off investors. So <strong>more war → lower GDP</strong>. The relationship runs the other way too.</div>
        </Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Why simple OLS fails:</strong> If you regress war on GDP, you cannot tell which direction the negative coefficient is picking up — the deterrent effect of prosperity, or the destructive effect of war on the economy. The IV approach in the next section is the standard fix.</Callout></Reveal>
      <Reveal delay={0.15}>
        <Card style={{marginTop:14,background:C.black,borderColor:C.black}}>
          <div style={{fontSize:12,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:10}}>Visualising the feedback loop</div>
          <svg viewBox="0 0 540 200" style={{width:'100%'}}>
            <rect x="50" y="70" width="140" height="60" rx="8" fill="rgba(228,0,43,0.18)" stroke={C.red} strokeWidth="2"/>
            <text x="120" y="98" fontSize="14" fontWeight="700" fill={C.white} textAnchor="middle">GDP (y₁)</text>
            <text x="120" y="118" fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle">economy</text>
            <rect x="350" y="70" width="140" height="60" rx="8" fill="rgba(228,0,43,0.18)" stroke={C.red} strokeWidth="2"/>
            <text x="420" y="98" fontSize="14" fontWeight="700" fill={C.white} textAnchor="middle">War (y₂)</text>
            <text x="420" y="118" fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle">conflict</text>
            <path d="M 195 90 Q 270 50 345 90" stroke={C.red} strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
            <path d="M 345 115 Q 270 155 195 115" stroke={C.red} strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
            <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M 0,0 L 0,6 L 9,3 z" fill={C.red}/></marker></defs>
            <text x="270" y="42" fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle" fontStyle="italic">prosperity reduces war?</text>
            <text x="270" y="178" fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle" fontStyle="italic">war wrecks the economy?</text>
          </svg>
        </Card>
      </Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Simultaneity Quiz</H></Reveal>
      <GamifiedQuiz quizId="s3:simultaneous" questions={qs} xpPerQ={10} perfectBonus={15}/>
      <NextBtn onClick={()=>{completeTab('s3:simultaneous');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 5: SELECTION BIAS
// ═══════════════════════════════════════════════════════════════
function SelectionTab({next}){
  const{completeTab}=useGame();
  const qs=[
    {id:'sel1',q:'You estimate the wage effect of military service using a sample of voluntary enlistees. Why is this likely biased?',opts:['Volunteers tend to be young','Volunteers may have weaker outside options — so E[ε|MS=1] ≠ E[ε|MS=0]','Military pay is fixed','The sample is too large'],c:1,ex:'Selection on unobservables. People with worse civilian prospects are more likely to enlist, and they would have had lower wages anyway. So E[ε|MS=1] < E[ε|MS=0], biasing β̂ downward.'},
    {id:'sel2',q:'When does selection bias DISAPPEAR?',opts:['When sample is large','When the selection criterion is orthogonal to ε — e.g., random assignment','When you add controls','When p < 0.01'],c:1,ex:'If treatment is randomly assigned (or assigned by some variable independent of ε, like a draft lottery), then E[ε|d=1] = E[ε|d=0] and β̂ is unbiased.'},
    {id:'sel3',q:'A researcher surveys only people who volunteer for the survey. The findings show that respondents are very engaged citizens. The conclusion that "the population is highly engaged" is:',opts:['Valid — large sample','Likely biased — only engaged people responded (self-selection)','Always correct for surveys','Only biased if n < 100'],c:1,ex:'Classic self-selection. Engaged citizens are more likely to respond, so the sample is not representative of the broader population. The bias is in the sampling, not in the model.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Source #3</Label><H>Selection Bias</H><P>If your sample is not random — or if treatment status is not random within your sample — the relationship between x and y can be distorted by who got selected, not by the causal effect of x.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Setup with a treatment dummy</div>
        <Formula>yᵢ = β₀ + β₁ dᵢ + εᵢ</Formula>
        <P mb={6}>where dᵢ = 1 if treated, 0 otherwise. Take the difference in means:</P>
        <Formula>E[β̂₁] = E[y|d=1] − E[y|d=0] = β₁ + (E[ε|d=1] − E[ε|d=0])</Formula>
        <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginTop:10}}>The second term is the <strong>selection bias</strong>. It is zero only if the type of person who gets treated is no different (in unobservables) from the type who doesn't.</div>
      </Card></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Worked Example: Military Service and Wages</H><P>What is the long-term wage effect of military service for those who do <em>not</em> pursue a military career?</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:14}}>
        <Formula>WAGEᵢ = β₀ + β₁·MSᵢ + β₂·MSᵢ·AGEᵢ + β₃·MSᵢ·AGE²ᵢ + γxᵢ + εᵢ</Formula>
        <div style={{fontSize:14,color:C.black80,lineHeight:1.65,marginTop:8}}>The model looks fine — but enlistment is voluntary. Who self-selects into military service?</div>
      </Card></Reveal>
      <Reveal delay={0.1}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Card style={{borderLeft:`3px solid ${C.amber}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Who enlists?</div>
          <Li>People with weaker civilian outside options</Li>
          <Li>People from regions with fewer job opportunities</Li>
          <Li>Lower opportunity cost of military pay/training</Li>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>The bias</div>
          <Li>These same people would earn less even without service</Li>
          <Li>So <strong>E[ε|MS=1] &lt; E[ε|MS=0]</strong></Li>
          <Li>OLS <strong>underestimates</strong> the true effect of service on wages</Li>
        </Card>
      </div></Reveal>
      <Reveal delay={0.15}><Callout accent={C.green} bg={C.greenBg} style={{marginTop:14}}><strong>The classic fix:</strong> Use the <strong>Vietnam-era draft lottery</strong> as an instrument. The lottery number was random — so it affects military service but is uncorrelated with the person's outside options. This is the "draft lottery" entry in the IV table you'll see later.</Callout></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Selection Bias Quiz</H></Reveal>
      <GamifiedQuiz quizId="s3:selection" questions={qs} xpPerQ={10} perfectBonus={15}/>
      <NextBtn onClick={()=>{completeTab('s3:selection');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 6: MEASUREMENT ERROR
// ═══════════════════════════════════════════════════════════════
function MeasurementTab({next}){
  const{completeTab,awardBadge,progress}=useGame();
  // Award the bias-detective badge here once they reach this tab and have all 4 sources visited
  useEffect(()=>{const tabs=progress.completedTabs;if(tabs['s3:omitted']&&tabs['s3:simultaneous']&&tabs['s3:selection']&&!progress.badges['bias-detective'])awardBadge('bias-detective');},[progress.completedTabs,progress.badges,awardBadge]);

  const qs=[
    {id:'me1',q:'You observe x* = x + μ instead of the true x. The error term in your regression now contains:',opts:['Only μ','A function of μ that is correlated with x* — breaking orthogonality','Nothing — measurement error cancels out','Only the variance of x'],c:1,ex:'Substituting x = x* − μ creates a new effective error that contains μ, and μ is mechanically correlated with x* (since x* = x + μ). Hence E[x*·η] ≠ 0.'},
    {id:'me2',q:'In the wealth/health example, why might E[x·μ] < 0 (μ correlated with reported wealth)?',opts:['Reporting errors are random','Wealthier people may underreport for privacy reasons, and the size of the misreport tends to grow with true wealth','Healthier people lie more','Older respondents underreport'],c:1,ex:'Both the absolute size and the privacy motive for misreporting tend to grow with wealth. So errors are not classical (random) — they are correlated with the true value.'},
    {id:'me3',q:'Classical measurement error in x typically biases the OLS slope toward:',opts:['Zero (attenuation bias)','Infinity','The intercept','It does not bias the slope'],c:0,ex:'Classical (random) measurement error in x adds noise that is uncorrelated with the true x. This dilutes the signal and biases β̂₁ toward zero — known as attenuation bias.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Source #4</Label><H>Measurement Error</H><P>If x is mismeasured, the variable that <em>actually enters</em> your regression isn't the true x — and the difference (the measurement error) typically ends up correlated with the regressor itself. Endogeneity again.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Setup</div>
        <P mb={6}>True model:</P>
        <Formula>yᵢ = β₀ + β₁ xᵢ + εᵢ</Formula>
        <P mb={6}>But we only observe x* = x + μ where μ is the measurement error. Substituting x = x* − μ:</P>
        <Formula>yᵢ = β₀ + β₁ x*ᵢ + (εᵢ − β₁μᵢ)</Formula>
        <div style={{fontSize:13,color:C.black80,lineHeight:1.65,marginTop:8}}>The new error contains −β₁μ, which is correlated with x* (because x* itself contains μ). Orthogonality fails.</div>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout><strong>Classical vs. non-classical:</strong> If μ is uncorrelated with the true x, the bias is <em>attenuation</em> — β̂₁ shrinks toward zero. If μ is correlated with x (very common in self-reported data), the direction of bias depends on the sign of that correlation.</Callout></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Worked Example: Health and Wealth</H><P>Wealthier people tend to be healthier — better nutrition, better medical access. But measuring wealth is hard.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card style={{borderLeft:`3px solid ${C.amber}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Why wealth is mismeasured</div>
          <Li>Most people don't know the exact value of their assets</Li>
          <Li>Some intentionally distort responses for privacy</Li>
          <Li>Both effects are <strong>larger for wealthier people</strong></Li>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>The implication</div>
          <Li><strong>E[xᵢ μᵢ] &lt; 0</strong> (rich people tend to underreport)</Li>
          <Li>Measurement error is <em>not</em> classical here</Li>
          <Li>OLS coefficient on wealth is <strong>biased</strong> in a predictable direction</Li>
        </Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>The detection problem:</strong> Like all endogeneity, measurement error cannot be reliably tested from the data alone. You need outside knowledge of how the variable was measured. Always ask: how was this collected? Self-report? Administrative records? Estimated by the researcher?</Callout></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>Measurement Error Quiz</H></Reveal>
      <GamifiedQuiz quizId="s3:measurement" questions={qs} xpPerQ={10} perfectBonus={15}/>
    </Wrap>

    {/* Spot-the-source recap activity */}
    <Wrap bg={C.purpleBg} py={48}>
      <Reveal><Label color={C.purple}>Recap Activity</Label><H size={28} color={C.purple}>Diagnose the Source of Endogeneity</H><P color={C.purple}>You've now seen all four sources. Read each scenario and pick which kind of endogeneity is the primary culprit.</P></Reveal>
      <Reveal delay={0.05}><SourceDiagnosis next={next}/></Reveal>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// SOURCE DIAGNOSIS — interactive: match scenario → source
// ═══════════════════════════════════════════════════════════════
const DIAG_SCENARIOS=[
  {id:'d1',scenario:'A study finds that countries with more democratic institutions have higher GDP per capita. The author concludes "democracy causes growth." But richer countries can also afford to maintain democratic institutions.',correct:'s3:simultaneous',hint:'GDP and democracy plausibly affect each other.'},
  {id:'d2',scenario:'An economist regresses earnings on years of schooling. There is no measure of innate ability, motivation, or family connections in the dataset.',correct:'s3:omitted',hint:'Things in ε that drive both schooling and earnings.'},
  {id:'d3',scenario:'A researcher studies the effect of a new gym membership programme on health outcomes, using only people who voluntarily signed up for the programme.',correct:'s3:selection',hint:'Who chose to participate?'},
  {id:'d4',scenario:'Consumer spending is regressed on self-reported household income. Lower-income households tend to overstate their income (social desirability), while higher-income households understate it.',correct:'s3:measurement',hint:'How was the variable collected?'},
  {id:'d5',scenario:'A study of police presence on crime rates. Police are deployed to neighbourhoods where crime risk is rising, and crime levels also affect how many officers are sent.',correct:'s3:simultaneous',hint:'Two-way relationship between police and crime.'},
  {id:'d6',scenario:'A clinical trial enrols only patients whose doctors recommended the new drug. The trial finds the drug is highly effective.',correct:'s3:selection',hint:'Doctors recommend based on prognosis.'},
];
const SOURCES=[
  {key:'s3:omitted',label:'Omitted Variable',color:C.red},
  {key:'s3:simultaneous',label:'Simultaneous Eq.',color:C.amber},
  {key:'s3:selection',label:'Selection Bias',color:C.blue},
  {key:'s3:measurement',label:'Measurement Error',color:C.purple},
];
function SourceDiagnosis({next}){
  const{awardXpOnce,awardBadge,recordQuiz,recordAnswer,completeTab}=useGame();
  const[answers,setAnswers]=useState({});const[submitted,setSubmitted]=useState(false);const[showHint,setShowHint]=useState({});
  const allAnswered=DIAG_SCENARIOS.every(s=>answers[s.id]);
  const correctCount=DIAG_SCENARIOS.filter(s=>answers[s.id]===s.correct).length;
  const submit=()=>{setSubmitted(true);DIAG_SCENARIOS.forEach(s=>recordAnswer(`s3:diag:${s.id}`,answers[s.id]===s.correct));const xp=correctCount*10+(correctCount===DIAG_SCENARIOS.length?30:0);awardXpOnce('quiz:s3:diag',xp,correctCount===DIAG_SCENARIOS.length?'Perfect diagnosis!':`${correctCount} correct`,{allowImprovement:true});recordQuiz('s3:diag',correctCount,DIAG_SCENARIOS.length);if(correctCount===DIAG_SCENARIOS.length)awardBadge('bias-detective');};
  const reset=()=>{setAnswers({});setSubmitted(false);setShowHint({});};
  return <Card>
    <div style={{fontSize:13,color:C.black80,lineHeight:1.6,marginBottom:14}}>For each scenario, select the dominant source of endogeneity. Click <strong>Hint</strong> if you're stuck — it costs no XP, but you'll learn more by trying first.</div>
    {DIAG_SCENARIOS.map((s,i)=>{
      const ans=answers[s.id];const isC=ans===s.correct;
      return <div key={s.id} style={{borderTop:i>0?`1px solid ${C.black10}`:'none',paddingTop:i>0?14:0,marginBottom:14,paddingBottom:14}}>
        <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:10}}>
          <div style={{width:24,height:24,background:submitted?(isC?C.green:C.red):C.purple,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#fff',flexShrink:0,marginTop:2}}>{i+1}</div>
          <div style={{flex:1,fontSize:14,color:C.black,lineHeight:1.6}}>{s.scenario}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginLeft:34}}>
          {SOURCES.map(src=>{
            const sel=ans===src.key;const isThisC=src.key===s.correct;
            let bg=C.white,bd=C.black20,cl=C.black80;
            if(submitted){if(isThisC){bg=C.greenBg;bd=C.green;cl=C.green}else if(sel){bg='#FDECEA';bd=C.red;cl=C.red}}
            else if(sel){bg=src.color+'18';bd=src.color;cl=src.color}
            return <button key={src.key} onClick={()=>!submitted&&setAnswers(a=>({...a,[s.id]:src.key}))} disabled={submitted} style={{padding:'8px 12px',border:`1.5px solid ${bd}`,borderRadius:5,background:bg,cursor:submitted?'default':'pointer',fontFamily:"'Source Sans 3',sans-serif",fontSize:12.5,fontWeight:600,color:cl,textAlign:'left'}}>{src.label}</button>;
          })}
        </div>
        {!submitted&&<div style={{marginLeft:34,marginTop:6}}>
          {showHint[s.id]?<div style={{fontSize:12,color:C.purple,fontStyle:'italic'}}>💡 {s.hint}</div>:<button onClick={()=>setShowHint(h=>({...h,[s.id]:true}))} style={{background:'none',border:'none',color:C.purple,fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif",padding:0,textDecoration:'underline'}}>Show hint</button>}
        </div>}
        {submitted&&(()=>{const correctSrc=SOURCES.find(x=>x.key===s.correct);return <div style={{marginLeft:34,marginTop:6,fontSize:12.5,color:isC?C.green:C.amber,lineHeight:1.6}}><strong>{isC?'✓ Correct':`× The right answer was: ${correctSrc?correctSrc.label:s.correct}`}.</strong> {s.hint}</div>;})()}
      </div>;
    })}
    <div style={{display:'flex',gap:10,marginTop:8}}>
      {!submitted?<Btn onClick={submit} disabled={!allAnswered}>Submit ({Object.keys(answers).length}/{DIAG_SCENARIOS.length})</Btn>:<>
        <div style={{flex:1,padding:'12px 16px',background:correctCount===DIAG_SCENARIOS.length?C.greenBg:C.amberBg,borderRadius:6,fontSize:14,color:correctCount===DIAG_SCENARIOS.length?C.green:C.amber,fontWeight:700,borderLeft:`3px solid ${correctCount===DIAG_SCENARIOS.length?C.green:C.amber}`}}>{correctCount}/{DIAG_SCENARIOS.length} correct {correctCount===DIAG_SCENARIOS.length?'· badge unlocked!':''}</div>
        <Btn onClick={reset} style={{background:C.black}}>Retry</Btn>
      </>}
    </div>
    {submitted&&<div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${C.black10}`}}>
      <NextBtn onClick={()=>{completeTab('s3:measurement');next();}} label="Continue: IV & 2SLS →"/>
    </div>}
  </Card>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 7: INSTRUMENTAL VARIABLES & 2SLS
// ═══════════════════════════════════════════════════════════════
function IvTab({next}){
  const{completeTab}=useGame();
  // Interactive: judge whether each candidate is a valid instrument
  const candidates=[
    {id:'cand1',context:'Studying effect of education on wages.',cand:'Parental education',rel:true,exo:true,verdict:'valid',expl:'Plausibly relevant (educated parents → educated kids) and arguably exogenous (parental education does not directly affect the child\'s wage once we control for parental income).'},
    {id:'cand2',context:'Studying effect of education on wages.',cand:'Distance to nearest college at age 16',rel:true,exo:true,verdict:'valid',expl:'Affects schooling decisions (relevance) and is plausibly random conditional on region (exogeneity). Used in Card (1995).'},
    {id:'cand3',context:'Studying effect of education on wages.',cand:'Family income',rel:true,exo:false,verdict:'invalid',expl:'Relevant (richer families educate longer) but NOT exogenous — family income directly affects the child\'s wage through networks and starting capital.'},
    {id:'cand4',context:'Studying effect of police on crime.',cand:'Mayoral electoral cycles',rel:true,exo:true,verdict:'valid',expl:'Mayors hire more police before elections (relevance), and electoral cycles do not directly cause crime (exogeneity). Used in Levitt (1997).'},
    {id:'cand5',context:'Studying effect of GDP on civil conflict.',cand:'Annual rainfall (in agrarian economies)',rel:true,exo:true,verdict:'valid',expl:'Rainfall affects agricultural output → GDP (relevance) but does not directly cause war (exogeneity) — except via the GDP channel.'},
    {id:'cand6',context:'Studying effect of military service on earnings.',cand:'Voluntary enlistment status',rel:true,exo:false,verdict:'invalid',expl:'Voluntary enlistment is NOT exogenous — people self-select based on outside options. Use the Vietnam draft lottery instead (random).'},
  ];
  const[picks,setPicks]=useState({});const[checked,setChecked]=useState({});
  const pick=(id,v)=>{if(checked[id])return;setPicks(p=>({...p,[id]:v}));};
  const check=id=>setChecked(c=>({...c,[id]:true}));

  const qs=[
    {id:'iv1',q:'What two conditions must a valid instrument z satisfy?',opts:['z must be large and z must be random','z must be relevant (correlated with x) and exogenous (uncorrelated with ε)','z must equal x and z must equal y','z must be observable and z must be binary'],c:1,ex:'Relevance: z explains some variation in x (testable — first-stage F-statistic). Exogeneity: z affects y only through x, not directly (NOT testable — argued from theory).'},
    {id:'iv2',q:'What does the FIRST stage of 2SLS do?',opts:['Run y on z directly','Regress x on z and use the predicted x̂ — capturing only the part of x explained by z','Take the difference of y and z','Compute a t-test'],c:1,ex:'Stage 1: x = α₀ + α₁z + η. Get x̂ = α̂₀ + α̂₁z. This x̂ contains only the variation in x that comes from z, which is (assumed) exogenous.'},
    {id:'iv3',q:'What does the SECOND stage of 2SLS do?',opts:['Regress y on x̂ from the first stage to estimate β₁','Regress z on y','Test for heteroskedasticity','Compute R²'],c:0,ex:'Stage 2: y = β₀ + β₁x̂ + φ. The coefficient β̂₁ is the IV estimate — using only the exogenous variation in x.'},
    {id:'iv4',q:'Why is the exogeneity of an instrument NOT testable in general?',opts:['Software cannot compute it','It requires data on ε, which is unobserved','It depends on theoretical knowledge of how the instrument relates to other unobservables','All of the above except the first'],c:2,ex:'Exogeneity is about z being uncorrelated with ε — but ε is unobserved. We can only argue from theory and design why z should not affect y except through x.'},
    {id:'iv5',q:'A "weak instrument" is one where:',opts:['z has many missing values','z is uncorrelated with x — first-stage F is small','z equals x exactly','z is a dummy variable'],c:1,ex:'Weak instruments produce 2SLS estimates with huge variance and large finite-sample bias. Rule of thumb: first-stage F > 10. If F is small, your instrument is too weak to identify β₁.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>The Solution</Label><H>Instrumental Variables & 2SLS</H><P>So far we've seen four ways orthogonality can fail. Now: how to fix it. The big idea — find a variable that affects x but is otherwise unrelated to y. Use only the variation in x that comes from this clean source.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18,background:C.black,borderColor:C.black}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:8}}>The core problem, restated</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.85)',lineHeight:1.7}}>The variation in x is contaminated by other things in ε. We cannot disentangle them. <strong style={{color:C.white}}>If only we could observe variation in x that is independent of ε</strong>, we could estimate β₁ cleanly. That's exactly what an instrument does.</div>
      </Card></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Natural Experiments</H><P>Controlled lab experiments are rare in economics. The next best thing: <strong>natural experiments</strong> — situations where some external event creates random variation in x.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card style={{borderLeft:`3px solid ${C.green}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.green,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Controlled experiment</div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Researcher manipulates x, holding everything else constant. Gold standard for causality but rare in real-world economics. Often criticised for lack of external validity.</div>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.amber}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Natural experiment</div>
          <div style={{fontSize:13,color:C.black80,lineHeight:1.6}}>Real-world events create random-ish variation in x. The researcher exploits this variation as if x had been randomly assigned. Materialised through <strong>instrumental variables</strong>.</div>
        </Card>
      </div></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><H size={28}>What is an Instrument?</H><P>An instrumental variable z is a variable that:</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
        <Card style={{borderTop:`3px solid ${C.green}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.green,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>1. Relevance</div>
          <div style={{fontSize:14,color:C.black80,lineHeight:1.65,marginBottom:8}}>z is correlated with x (it moves x around).</div>
          <Formula>Cov(z, x) ≠ 0</Formula>
          <div style={{fontSize:12,color:C.black60,lineHeight:1.6,marginTop:6}}><strong>Testable:</strong> first-stage regression x = α₀ + α₁z + η. The coefficient α̂₁ should be statistically significant (rule of thumb: F-statistic &gt; 10).</div>
        </Card>
        <Card style={{borderTop:`3px solid ${C.red}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>2. Exogeneity</div>
          <div style={{fontSize:14,color:C.black80,lineHeight:1.65,marginBottom:8}}>z is uncorrelated with ε — z affects y <em>only through x</em>.</div>
          <Formula>Cov(z, ε) = 0</Formula>
          <div style={{fontSize:12,color:C.black60,lineHeight:1.6,marginTop:6}}><strong>NOT testable</strong> in general — must be argued from theory and the design of the natural experiment.</div>
        </Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>The exclusion restriction:</strong> "z affects y only through x" is the most demanding part. If you can think of any other path from z to y that doesn't go through x, your instrument is suspect. This is why finding good instruments is so hard.</Callout></Reveal>
    </Wrap>

    {/* The 2SLS procedure visualised */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Two-Stage Least Squares (2SLS)</H><P>The mechanical procedure for using an instrument. Two ordinary OLS regressions, run in sequence.</P></Reveal>
      <Reveal delay={0.05}>
        <Card style={{marginBottom:14,background:C.black,borderColor:C.black}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Stage 1 · Filter the regressor</div>
              <Formula dark>xᵢ = α₀ + α₁ zᵢ + ηᵢ</Formula>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.65,marginTop:8}}>OLS gives α̂₀ and α̂₁. Compute predicted values:</div>
              <Formula dark>x̂ᵢ = α̂₀ + α̂₁ zᵢ</Formula>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.6,marginTop:6}}>x̂ contains <strong style={{color:C.white}}>only the variation in x explained by z</strong>. If z is exogenous, so is x̂.</div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:C.green,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Stage 2 · Run the cleaned regression</div>
              <Formula dark>yᵢ = β₀ + β₁ x̂ᵢ + φᵢ</Formula>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.65,marginTop:8}}>OLS on this gives the IV estimators:</div>
              <Formula dark>β̂₀ᴵⱽ , β̂₁ᴵⱽ</Formula>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.6,marginTop:6}}>β̂₁ᴵⱽ is the causal effect of x on y, identified using only the exogenous variation captured by z.</div>
            </div>
          </div>
        </Card>
      </Reveal>
      <Reveal delay={0.1}><Callout accent={C.red} bg={C.redSubtle}><strong>Practical note:</strong> Software (Stata's <code>ivreg2</code>, R's <code>AER::ivreg</code>, Python's <code>linearmodels</code>) does both stages and reports correct standard errors automatically. Never run the two stages by hand and use the second-stage SE — they'll be wrong.</Callout></Reveal>
    </Wrap>

    {/* Real examples table */}
    <Wrap>
      <Reveal><H size={28}>Famous Instruments in Economics</H><P>The hard part of IV is finding a credible z. Here are some celebrated examples — each pairs an endogenous regressor with a natural-experiment instrument.</P></Reveal>
      <Reveal delay={0.05}><div style={{overflowX:'auto',marginBottom:14}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13,background:C.white,borderRadius:8,overflow:'hidden'}}>
        <thead><tr style={{background:C.black}}>{['Response (y)','Regressor (x)','Endogeneity','Instrument (z)'].map((h,i)=> <th key={i} style={{padding:'10px 14px',color:C.white,fontWeight:700,textAlign:'left',fontSize:12,letterSpacing:'0.04em'}}>{h}</th>)}</tr></thead>
        <tbody>{[
          {y:'Earnings',x:'Schooling',endo:'Omitted (skill)',iv:'Quarter of birth · school construction · proximity to college'},
          {y:'Newborn weight',x:'Maternal smoking',endo:'Omitted',iv:'Random assignment · state cigarette taxes'},
          {y:'Demand',x:'Price',endo:'Simultaneity',iv:'Supply shifters'},
          {y:'Supply',x:'Price',endo:'Simultaneity',iv:'Demand shifters'},
          {y:'Crime',x:'Police surveillance',endo:'Simultaneity',iv:'Electoral cycles · papal trajectory'},
          {y:'Civil conflict',x:'GDP',endo:'Simultaneity',iv:'Rainfall'},
          {y:'Labor supply',x:'Fertility',endo:'Simultaneity',iv:'Gender composition of children'},
          {y:'Earnings',x:'Military service',endo:'Selection',iv:'Vietnam-era draft lottery'},
        ].map((r,i)=> <tr key={i} style={{background:i%2===0?C.white:C.black05,borderBottom:`1px solid ${C.black10}`}}>
          <td style={{padding:'9px 14px',fontWeight:600,color:C.black}}>{r.y}</td>
          <td style={{padding:'9px 14px',color:C.black80}}>{r.x}</td>
          <td style={{padding:'9px 14px',color:C.amber,fontWeight:600,fontSize:12}}>{r.endo}</td>
          <td style={{padding:'9px 14px',color:C.green,fontFamily:"'Source Sans 3',sans-serif",fontSize:12.5}}>{r.iv}</td>
        </tr>)}</tbody>
      </table></div></Reveal>
      <Reveal delay={0.1}><Callout><strong>Note the pattern:</strong> Good instruments are usually <em>quasi-random shocks</em> — weather, lottery numbers, geographic distance, electoral timing. They affect x but have no direct path to y.</Callout></Reveal>
    </Wrap>

    {/* Market equilibrium example — supply/demand shifters */}
    <Wrap bg={C.black05}>
      <Reveal><H size={28}>Worked Case: Market Equilibrium</H><P>Demand and supply both depend on price — that's classic simultaneity. The fix: instrument demand-side regressions with supply shifters, and supply-side regressions with demand shifters.</P></Reveal>
      <Reveal delay={0.05}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Card style={{borderLeft:`3px solid ${C.blue}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.blue,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Demand shifters</div>
          <Li>Population</Li>
          <Li>Income</Li>
          <Li>Preferences (ads, fads)</Li>
          <Li>Expectations</Li>
          <Li>Prices of substitutes / complements</Li>
        </Card>
        <Card style={{borderLeft:`3px solid ${C.amber}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Supply shifters</div>
          <Li>Number of competitors</Li>
          <Li>Technological shocks</Li>
          <Li>Prices of inputs</Li>
          <Li>Expectations</Li>
          <Li>Prices of alternative goods</Li>
        </Card>
      </div></Reveal>
      <Reveal delay={0.1}><Callout accent={C.green} bg={C.greenBg}><strong>The trick:</strong> A supply shifter (e.g. a tax on producers) moves price without directly moving the demand curve — so it's a valid instrument for price in a demand equation. Same logic in reverse for supply equations.</Callout></Reveal>
    </Wrap>

    {/* Interactive: judge instruments */}
    <Wrap bg={C.blueBg} py={40}>
      <Reveal><Label color={C.blue}>Try it yourself</Label><H size={26} color={C.blue}>Valid Instrument or Not?</H><P color={C.blue} mb={14}>Each card shows a candidate instrument for a research question. Decide whether you'd accept it.</P></Reveal>
      <Reveal delay={0.05}><Card>
        {candidates.map((c,i)=>{
          const p=picks[c.id];const ch=checked[c.id];
          return <div key={c.id} style={{borderTop:i>0?`1px solid ${C.black10}`:'none',paddingTop:i>0?14:0,paddingBottom:14,marginBottom:i<candidates.length-1?0:0}}>
            <div style={{fontSize:11,color:C.black60,fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:4}}>{c.context}</div>
            <div style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:10}}>Proposed instrument: <span style={{color:C.blue}}>{c.cand}</span></div>
            {!ch?<div style={{display:'flex',gap:8}}>
              <button onClick={()=>pick(c.id,'valid')} style={{flex:1,padding:'10px',border:`1.5px solid ${p==='valid'?C.green:C.black20}`,borderRadius:5,background:p==='valid'?C.greenBg:C.white,color:p==='valid'?C.green:C.black80,fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer'}}>✓ Valid</button>
              <button onClick={()=>pick(c.id,'invalid')} style={{flex:1,padding:'10px',border:`1.5px solid ${p==='invalid'?C.red:C.black20}`,borderRadius:5,background:p==='invalid'?'#FDECEA':C.white,color:p==='invalid'?C.red:C.black80,fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer'}}>× Invalid</button>
              {p&&<button onClick={()=>check(c.id)} style={{padding:'10px 18px',background:C.blue,color:'#fff',border:'none',borderRadius:5,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Lock</button>}
            </div>:<div style={{padding:'12px 16px',background:p===c.verdict?C.greenBg:C.amberBg,borderRadius:6,fontSize:13,color:C.black80,lineHeight:1.65,borderLeft:`3px solid ${p===c.verdict?C.green:C.amber}`}}>
              <div style={{display:'flex',gap:14,marginBottom:8,flexWrap:'wrap'}}>
                <div style={{fontSize:11,fontWeight:700,color:c.rel?C.green:C.red,letterSpacing:'0.04em',textTransform:'uppercase'}}>{c.rel?'✓':'×'} Relevant</div>
                <div style={{fontSize:11,fontWeight:700,color:c.exo?C.green:C.red,letterSpacing:'0.04em',textTransform:'uppercase'}}>{c.exo?'✓':'×'} Exogenous</div>
                <div style={{fontSize:11,fontWeight:700,color:c.verdict==='valid'?C.green:C.red,letterSpacing:'0.04em',textTransform:'uppercase',marginLeft:'auto'}}>{c.verdict==='valid'?'Valid IV':'Invalid IV'}</div>
              </div>
              {c.expl}
            </div>}
          </div>;
        })}
      </Card></Reveal>
    </Wrap>

    <Wrap>
      <Reveal><Label color={C.blue}>Now test yourself</Label><H size={26}>IV & 2SLS Quiz</H></Reveal>
      <GamifiedQuiz quizId="s3:iv" questions={qs} xpPerQ={10} perfectBonus={20} badgeOnPerfect="instrument-judge"/>
      <NextBtn onClick={()=>{completeTab('s3:iv');next();}}/>
    </Wrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// IV BUILDER — slot-based interactive (modeled on S2 RegressionBuilder)
// ═══════════════════════════════════════════════════════════════
const IV_SCENARIOS=[
  {
    id:'edu-wages',topic:'Education → Wages',
    prompt:"You want to estimate the causal effect of years of schooling on wages. The naïve OLS estimate is biased — let's design a 2SLS strategy instead.",
    template:p=>`Stage 1: ${p.endo} = α₀ + α₁ · ${p.iv} + η\nStage 2: WAGE = β₀ + β₁ · ${p.endo}̂ + φ`,
    slots:[
      {key:'endo',label:'Endogenous regressor',options:['EDUCATION (years of schooling)','PARENTAL INCOME','REGION','OCCUPATION'],correct:[0],explain:{
        0:'Schooling is the variable whose causal effect on wages we want — and it is endogenous (correlated with unobserved skill).',
        1:'Parental income is a candidate IV or control, not the regressor of interest here.',
        2:'Region is typically a control variable, not the focal regressor.',
        3:'Occupation is a downstream outcome of schooling, not the regressor in this study.'}},
      {key:'source',label:'Source of endogeneity',options:['Omitted variable: innate ability','Measurement error in wages','Reverse causation: wages → schooling','None — OLS is unbiased'],correct:[0],explain:{
        0:'Innate ability raises both schooling and wages, so it sits in ε and biases the OLS coefficient on EDUCATION.',
        1:'Measurement error in y mostly affects standard errors, not bias on β₁.',
        2:'Reverse causation is plausible at the margin but the dominant problem here is omitted ability.',
        3:'OLS is biased — that is exactly why we need an instrument.'}},
      {key:'s3:iv',label:'Instrumental variable',options:['QUARTER OF BIRTH','PARENTAL INCOME','TEST SCORES','HOURS WORKED'],correct:[0],explain:{
        0:'Quarter of birth (Angrist & Krueger) creates random variation in schooling via compulsory-schooling laws — relevant and arguably exogenous.',
        1:'Parental income is correlated with both schooling and wages directly (networks, capital). Fails the exclusion restriction.',
        2:'Test scores are themselves a measure of ability — they are part of ε, not a clean source of variation in schooling.',
        3:'Hours worked is downstream of schooling (and endogenous), not an instrument.'}},
      {key:'check',label:'Validity check',options:['Test exogeneity by regressing IV on ε','Verify first-stage F-statistic > 10 and argue exclusion restriction from theory','Check R² of stage 2','Increase sample size'],correct:[1],explain:{
        0:'You cannot regress on ε — it is unobserved.',
        1:'Correct. Relevance is testable (F > 10); exogeneity must be argued from the design.',
        2:'R² is not the diagnostic for IV validity.',
        3:'A larger sample does not fix a bad instrument.'}},
    ],
  },
  {
    id:'gdp-conflict',topic:'GDP → Civil Conflict',
    prompt:"You want to estimate the causal effect of GDP on civil conflict in agrarian economies. Naïve OLS suffers from simultaneity (war wrecks GDP). Design a 2SLS strategy.",
    template:p=>`Stage 1: ${p.endo} = α₀ + α₁ · ${p.iv} + η\nStage 2: CONFLICT = β₀ + β₁ · ${p.endo}̂ + φ`,
    slots:[
      {key:'endo',label:'Endogenous regressor',options:['GDP per capita','RAINFALL','POPULATION','POLITICAL REGIME'],correct:[0],explain:{
        0:'GDP is the regressor whose effect we want — and it is endogenous due to reverse causation.',
        1:'Rainfall is a candidate IV here, not the regressor of interest.',
        2:'Population is typically a control variable.',
        3:'Political regime is a separate determinant, not the focal regressor.'}},
      {key:'source',label:'Source of endogeneity',options:['Selection bias','Simultaneity (war reduces GDP, GDP affects war)','Pure measurement error','Omitted variable: weather'],correct:[1],explain:{
        0:'No self-selection issue here — countries do not choose to be in conflict for measurement.',
        1:'Correct. The bidirectional relationship is the dominant problem — war destroys GDP just as low GDP fuels war.',
        2:'Measurement matters but is not the primary culprit.',
        3:'Weather is the IV, not the source of bias.'}},
      {key:'s3:iv',label:'Instrumental variable',options:['ANNUAL RAINFALL','MILITARY SPENDING','UNEMPLOYMENT','ETHNIC FRACTIONALIZATION'],correct:[0],explain:{
        0:'Rainfall (Miguel, Satyanath, Sergenti 2004) shifts agricultural GDP in agrarian economies — relevant — and has no direct effect on conflict.',
        1:'Military spending is an outcome of conflict — endogenous.',
        2:'Unemployment is jointly determined with GDP, not an external shock.',
        3:'Ethnic fractionalization is a control, not a quasi-random shock.'}},
      {key:'check',label:'Exclusion restriction argument',options:['Rainfall affects conflict only through agricultural GDP — no direct path','Rainfall is correlated with everything','Test by regressing conflict directly on rainfall','Use OLS instead'],correct:[0],explain:{
        0:'Correct. The argument is that rainfall affects livelihoods (and thus opportunity cost of conflict) only through its effect on agricultural output.',
        1:'Too vague — IV requires a specific design argument.',
        2:'That is the reduced form, not a test of exclusion.',
        3:'OLS is biased — the whole point of IV is to escape that bias.'}},
    ],
  },
];
function IvBuilder(){
  const{awardXpOnce,awardBadge,markIv}=useGame();
  const[scIdx,setScIdx]=useState(0);const[answers,setAnswers]=useState({});const[revealed,setRevealed]=useState({});const[submitted,setSubmitted]=useState(false);
  const sc=IV_SCENARIOS[scIdx];
  const pick=(sk,oi)=>{if(revealed[sk])return;setAnswers(a=>({...a,[sk]:oi}));};const lock=sk=>{setRevealed(r=>({...r,[sk]:true}));};
  const allRevealed=sc.slots.every(s=>revealed[s.key]);const allCorrect=sc.slots.every(s=>s.correct.includes(answers[s.key]));
  const submitIv=()=>{setSubmitted(true);const cc=sc.slots.filter(s=>s.correct.includes(answers[s.key])).length;awardXpOnce(`builder:s3:${sc.id}`,cc*15+(allCorrect?30:0),allCorrect?'Valid IV strategy built!':`${cc}/${sc.slots.length} correct`,{allowImprovement:true});if(allCorrect)awardBadge('iv-architect');markIv(`s3:${sc.id}`);};
  const loadSc=i=>{setScIdx(i);setAnswers({});setRevealed({});setSubmitted(false);};
  const preview={};sc.slots.forEach(s=>{const ai=answers[s.key];preview[s.key]=ai!==undefined?s.options[ai]:`[${s.label}]`;});
  return <div style={{maxWidth:800,margin:'0 auto'}}>
    <Reveal><div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.red,marginBottom:12}}>Interactive · Build a 2SLS Strategy</div><h2 style={{fontSize:34,fontWeight:900,color:C.white,lineHeight:1.1,marginBottom:12}}>Specify Your Identification Strategy</h2><p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.65,marginBottom:24}}>You've seen the four sources of endogeneity and the IV solution. Now: pick the right endogenous regressor, identify the source, choose a credible instrument, and justify the design.</p></Reveal>
    <Reveal delay={0.08}>
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>{IV_SCENARIOS.map((s,i)=> <button key={s.id} onClick={()=>loadSc(i)} style={{background:i===scIdx?C.red:'rgba(255,255,255,0.05)',color:i===scIdx?'#fff':'rgba(255,255,255,0.55)',border:`1px solid ${i===scIdx?C.red:'rgba(255,255,255,0.1)'}`,borderRadius:6,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>{s.topic}</button>)}</div>
      <div style={{background:'rgba(255,255,255,0.04)',borderLeft:`3px solid ${C.red}`,borderRadius:'0 8px 8px 0',padding:'14px 18px',marginBottom:24}}><div style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.65}}>{sc.prompt}</div></div>
      <div style={{background:'rgba(228,0,43,0.1)',border:`1px dashed ${C.red}`,borderRadius:8,padding:'18px 20px',marginBottom:24,fontFamily:"'JetBrains Mono',monospace"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red,marginBottom:8}}>Your 2SLS strategy</div><div style={{fontSize:13,color:C.white,lineHeight:1.7,whiteSpace:'pre-line'}}>{sc.template(preview)}</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>{sc.slots.map((slot,si)=>{const ai=answers[slot.key];const isR=revealed[slot.key];const isC=slot.correct.includes(ai);return <div key={slot.key} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${isR?(isC?C.green:C.red):'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'16px 18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.red}}>Slot {si+1} · {slot.label}</div>{isR&&<div style={{fontSize:11,fontWeight:700,color:isC?C.green:C.amber}}>{isC?'✓ +15 XP':'× Review'}</div>}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>{slot.options.map((opt,oi)=>{const sel=ai===oi;const thisC=slot.correct.includes(oi);let bg='rgba(255,255,255,0.04)',bd='rgba(255,255,255,0.1)',cl='rgba(255,255,255,0.7)';if(isR){if(thisC){bg='rgba(26,127,75,0.15)';bd=C.green;cl=C.green;}else if(sel){bg='rgba(228,0,43,0.12)';bd=C.red;cl=C.red;}}else if(sel){bg='rgba(228,0,43,0.15)';bd=C.red;cl='#fff';}return <button key={oi} onClick={()=>pick(slot.key,oi)} disabled={isR} style={{background:bg,border:`1px solid ${bd}`,color:cl,padding:'9px 12px',fontSize:12.5,fontWeight:600,borderRadius:6,cursor:isR?'default':'pointer',fontFamily:"'Source Sans 3',sans-serif",textAlign:'left'}}>{opt}</button>;})}</div>
        {!isR&&ai!==undefined&&<button onClick={()=>lock(slot.key)} style={{background:C.red,color:'#fff',border:'none',borderRadius:4,padding:'7px 14px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Lock in</button>}
        {isR&&ai!==undefined&&<div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.6,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'10px 14px',marginTop:4}}><strong style={{color:isC?C.green:C.amber}}>{isC?'Good:':'Why not:'}</strong> {slot.explain[ai]}</div>}
      </div>;})}</div>
      {allRevealed&&!submitted&&<button onClick={submitIv} style={{background:allCorrect?C.green:C.amber,color:'#fff',border:'none',borderRadius:6,padding:'14px 28px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Submit ({sc.slots.filter(s=>s.correct.includes(answers[s.key])).length}/{sc.slots.length} correct)</button>}
      {submitted&&<div style={{background:allCorrect?'rgba(26,127,75,0.12)':'rgba(230,119,0,0.12)',border:`1px solid ${allCorrect?C.green:C.amber}`,borderRadius:10,padding:'18px 22px'}}><div style={{fontSize:11,fontWeight:700,color:allCorrect?C.green:C.amber,marginBottom:8}}>{allCorrect?'★ IV Strategy Locked In':'Revise and retry'}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:C.white,lineHeight:1.7,background:'rgba(0,0,0,0.3)',borderRadius:6,padding:'14px 16px',marginBottom:10,whiteSpace:'pre-line'}}>{sc.template(preview)}</div><button onClick={()=>loadSc(scIdx)} style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>Retry</button></div>}
    </Reveal>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 8: APPLY — wraps IvBuilder
// ═══════════════════════════════════════════════════════════════
function ApplyTab({next}){
  const{completeTab}=useGame();
  return <div style={{paddingTop:56}}>
    <DarkWrap py={64}>
      <IvBuilder/>
      <div style={{maxWidth:800,margin:'48px auto 0',padding:'0 0',borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:28,display:'flex',justifyContent:'center'}}>
        <button onClick={()=>{completeTab('s3:apply');next();}} style={{background:C.red,color:'#fff',border:'none',borderRadius:6,padding:'13px 30px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif",boxShadow:'0 4px 16px rgba(228,0,43,0.3)'}}>Continue to Activity →</button>
      </div>
    </DarkWrap>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// TAB 9: ACTIVITY — final quiz + take-home assignment
// ═══════════════════════════════════════════════════════════════
function ActivityTab(){
  const{completeTab}=useGame();
  const[done,setDone]=useState(false);
  const finalQs=[
    {id:'fin1',q:'The orthogonality assumption requires:',opts:['Cov(x, y) = 0','E[x · ε] = 0 — x uncorrelated with the error term','x must be normally distributed','y must be normally distributed'],c:1,ex:'Orthogonality / exogeneity is the requirement that x is uncorrelated with the error term ε. When this fails, OLS is inconsistent.'},
    {id:'fin2',q:'You omit a variable that has α₁ > 0 (positively correlated with included x) and β₂ < 0 (negative effect on y). The bias on β̂₁ is:',opts:['Positive — overestimate','Negative — underestimate','Zero','Cannot tell'],c:1,ex:'Bias = α₁ · β₂ = (+) · (−) < 0. So OLS underestimates the true effect.'},
    {id:'fin3',q:'GDP and civil conflict affect each other. The endogeneity here is:',opts:['Selection bias','Simultaneous equations / reverse causation','Measurement error','None — this is a clean experiment'],c:1,ex:'Two-way causation: low GDP fuels conflict; conflict reduces GDP. This is the textbook simultaneity case — best fixed by IV.'},
    {id:'fin4',q:'A valid instrumental variable z must satisfy which TWO conditions?',opts:['Random and observable','Relevant (Cov(z,x) ≠ 0) and Exogenous (Cov(z,ε) = 0)','Binary and continuous','Significant in stage 1 and stage 2'],c:1,ex:'Relevance is testable via the first-stage F-statistic. Exogeneity (the exclusion restriction) must be argued from theory — it cannot be tested in general.'},
    {id:'fin5',q:'Rule of thumb for first-stage strength: F-statistic should exceed:',opts:['1','5','10','100'],c:2,ex:'Stock & Yogo (2005): F < 10 indicates a weak instrument. Weak instruments produce 2SLS estimates with severe bias and unreliable inference.'},
  ];
  return <div style={{paddingTop:56}}>
    <Wrap>
      <Reveal><Label>Activity</Label><H>Find a 2SLS Paper</H><P>The take-home portion of this seminar — apply what you've learnt by dissecting a published paper.</P></Reveal>
      <Reveal delay={0.05}><Card style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:C.red,marginBottom:10}}>Tasks</div>
        <Num n="1">Find <strong>one</strong> empirical paper in <strong>Accounting or Finance</strong> that uses a Two-Stage Least Squares (2SLS) estimator. Cite it in <strong>APA format</strong>.</Num>
        <Num n="2">Identify the <strong>instrumental variable(s)</strong> the author chose. Why did they pick those instruments? Argue both relevance and the exclusion restriction.</Num>
        <Num n="3">State the model specification, the main results, and the discussion as the author presents them.</Num>
        <Num n="4">Identify the <strong>limitations</strong> the author mentions and the <strong>future research directions</strong> proposed.</Num>
      </Card></Reveal>
      <Reveal delay={0.1}><Callout accent={C.amber} bg={C.amberBg}><strong>Tip:</strong> Search Google Scholar for "2SLS" + "Journal of Accounting Research" / "Journal of Finance" / "Review of Financial Studies". Look for papers using rainfall, distance, lottery, regulatory changes, or natural disasters as instruments.</Callout></Reveal>
      <Reveal delay={0.14}><Callout accent={C.blue} bg={C.blueBg}><strong>Exit ticket:</strong> For your chosen paper, write five bullets: endogenous regressor, source of endogeneity, instrument, first-stage evidence, and the strongest remaining threat to the exclusion restriction.</Callout></Reveal>
    </Wrap>

    <Wrap bg={C.black05}>
      <Reveal><Label color={C.blue}>Final Quiz</Label><H size={26}>Putting It All Together</H><P>Five questions covering the key ideas of the entire seminar. Perfect score earns the <strong>Endogeneity Ace</strong> badge.</P></Reveal>
      <GamifiedQuiz quizId="s3:final" questions={finalQs} xpPerQ={12} perfectBonus={30} badgeOnPerfect="endogeneity-ace" onComplete={()=>{completeTab('s3:activity');setDone(true);}}/>
    </Wrap>

    {done&&<Wrap bg={C.greenBg} py={40}>
      <Reveal><Card style={{background:C.white,borderColor:C.green,borderWidth:2}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.green,marginBottom:8}}>★ Seminar 3 Complete</div>
        <H size={26} mb={10}>You've finished Seminar 3</H>
        <P mb={10}>You now have a complete toolkit for thinking about causality: the four sources of endogeneity, the orthogonality condition, and the IV / 2SLS solution. These are the foundations that every modern empirical paper builds on.</P>
        <P mb={0} color={C.black80}><strong>Next steps:</strong> Bring your chosen 2SLS paper to the next class for discussion. Try replicating the first-stage F-statistic if data is available.</P>
      </Card></Reveal>
    </Wrap>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════

export default function Seminar3(){
  const{progress,awardBadge}=useGame();
  const[tab,setTab]=useState('s3:overview');
  const goTo=useCallback((id)=>{setTab(id);window.scrollTo({top:0,behavior:'instant'});},[]);
  const nextTab=useCallback(()=>{const idx=TABS.findIndex(t=>t.id===tab);if(idx<TABS.length-1)goTo(TABS[idx+1].id);},[tab,goTo]);
  useEffect(()=>{if(TABS.every(t=>progress.completedTabs[t.id])&&!progress.badges['s3-completionist'])awardBadge('s3-completionist');},[progress.completedTabs,progress.badges,awardBadge]);

  return <div style={{fontFamily:"'Source Sans 3','Helvetica Neue',sans-serif",minHeight:'100vh',background:C.black05}}>
    <GlobalStyles/>
    <TopNav tabs={TABS} activeTab={tab} setActiveTab={goTo}/>
    {tab==='s3:overview'&&<OverviewTab next={nextTab}/>}
    {tab==='s3:endogeneity'&&<EndogeneityTab next={nextTab}/>}
    {tab==='s3:omitted'&&<OmittedTab next={nextTab}/>}
    {tab==='s3:simultaneous'&&<SimultaneousTab next={nextTab}/>}
    {tab==='s3:selection'&&<SelectionTab next={nextTab}/>}
    {tab==='s3:measurement'&&<MeasurementTab next={nextTab}/>}
    {tab==='s3:iv'&&<IvTab next={nextTab}/>}
    {tab==='s3:apply'&&<ApplyTab next={nextTab}/>}
    {tab==='s3:activity'&&<ActivityTab/>}
    <footer style={{background:C.black,padding:'36px 0',borderTop:`4px solid ${C.red}`}}>
      <div style={{maxWidth:840,margin:'0 auto',padding:'0 36px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{fontSize:15,fontWeight:900,color:C.red,textDecoration:'none'}}>SIT</a>
        <span style={{fontSize:13,color:'rgba(255,255,255,0.3)'}}>ACC3018 · Seminar 3 · AY2024/25 T3</span>
      </div>
    </footer>
    <ProgressWidget tabs={TABS}/>
  </div>;
}
