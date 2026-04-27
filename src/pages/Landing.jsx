import { Link } from 'react-router-dom';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import { GlobalStyles, Reveal } from '../shared/components';

const SEMINARS = [
  { n: 1, title: 'Essentials of Applied Research', desc: 'Research ideas to thesis structure. Basic vs applied research, the research process, literature reviews, and hypothesis building.', ready: true },
  { n: 2, title: 'Quantitative Research Methods I', desc: 'Regression analysis fundamentals. OLS assumptions, variable types, model specification, and interpretation.', ready: true },
  { n: 3, title: 'Quantitative Research Methods II', desc: 'Endogeneity, omitted variables, simultaneous equations, selection bias, measurement error, and IV/2SLS identification.', ready: true },
  { n: 4, title: 'Data Application I', desc: 'Hands-on data work with Compustat, CRSP, and Bloomberg. Sample construction and descriptive statistics.', draft: 'Planned interactives: sample filter builder, variable dictionary check, missing data triage.', ready: false },
  { n: 5, title: 'Data Application II', desc: 'Running regressions, interpreting output, robustness checks. From raw data to publishable results tables.', draft: 'Planned interactives: regression output reader, table formatter, robustness decision tree.', ready: false },
  { n: 6, title: 'Mini Group Assignment', desc: 'Collaborative research exercise. Apply everything from Seminars 1–5 in a team-based mini project.', draft: 'Planned interactives: team role board, proposal rubric self-check, peer feedback workflow.', ready: false },
];

export default function Landing() {
  const { progress, identity } = useGame();

  return (
    <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", minHeight: '100vh', background: C.black }}>
      <GlobalStyles />

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 60px' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 500, height: 500, background: C.red, borderRadius: '0 0 0 100%', opacity: 0.08 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: C.red }} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 36px', position: 'relative' }}>
          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 16 }}>
              ACC3018 · Applied Analytics Capstone
            </div>
            <h1 style={{ fontSize: 'clamp(38px,7vw,72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.white, marginBottom: 16 }}>
              Research Methods<br />Seminars
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>
              Six interactive seminars covering everything from research fundamentals to your final capstone presentation. Earn XP, unlock badges, and track your progress.
            </p>
          </Reveal>

          {identity.name && (
            <Reveal delay={0.15}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '12px 18px',
              }}>
                <div style={{ width: 36, height: 36, background: C.red, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>
                  {identity.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{identity.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{progress.xp} XP · {Object.keys(progress.badges).length} badges</div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* Seminar grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 36px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {SEMINARS.map((s, i) => {
            const completedTabs = Object.keys(progress.completedTabs).length;
            return (
              <Reveal key={s.n} delay={i * 0.06}>
                {s.ready ? (
                  <Link to={`/seminar/${s.n}`} style={{ textDecoration: 'none' }}>
                    <SeminarCard seminar={s} />
                  </Link>
                ) : (
                  <SeminarCard seminar={s} />
                )}
              </Reveal>
            );
          })}
        </div>

        {/* Info */}
        <Reveal delay={0.4}>
          <div style={{
            marginTop: 40, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
            padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start',
          }}>
            <div style={{ width: 44, height: 44, background: C.red, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📋</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>AY2024/25 T3 · Research Methods</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                These seminars form the research methods component (15%) of your capstone module. Complete all activities, earn XP, and track your progress on the class leaderboard. Your work here builds the foundation for your research proposal (35%) and final report (50%).
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer style={{ background: C.black, padding: '36px 0', borderTop: `4px solid ${C.red}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: C.red }}>SIT</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ACC3018 · Applied Analytics Capstone · AY2024/25 T3</span>
        </div>
      </footer>
    </div>
  );
}

function SeminarCard({ seminar: s }) {
  const isReady = s.ready;
  return (
    <div style={{
      background: isReady ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isReady ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 10, padding: '24px 22px', height: '100%',
      display: 'flex', flexDirection: 'column',
      cursor: isReady ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      opacity: isReady ? 1 : 0.5,
    }}
    onMouseEnter={e => { if (isReady) { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.background = 'rgba(228,0,43,0.06)'; } }}
    onMouseLeave={e => { if (isReady) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, background: isReady ? C.red : 'rgba(255,255,255,0.1)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: '#fff',
        }}>{s.n}</div>
        {!isReady && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 99 }}>Coming soon</span>
        )}
        {isReady && (
          <span style={{ fontSize: 11, fontWeight: 600, color: C.green, border: `1px solid ${C.green}`, padding: '3px 10px', borderRadius: 99 }}>Available</span>
        )}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 8, lineHeight: 1.25 }}>
        S{s.n}: {s.title}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, flex: 1 }}>
        {s.desc}
      </div>
      {!isReady && s.draft && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
          {s.draft}
        </div>
      )}
      {isReady && (
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: C.red }}>
          Open seminar →
        </div>
      )}
    </div>
  );
}
