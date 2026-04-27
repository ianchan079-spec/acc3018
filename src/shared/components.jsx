// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { C, BADGES, levelFromXp } from './theme';
import { useGame, IdentityModal } from './GameProvider';
import { currentUserIsInstructor, loadAllRoster, loadDetail, signInInstructor } from './storage';

// ── Global styles (inject once) ──
export function GlobalStyles() {
  return (
    <style>{`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:#E4002B #1D1D1B}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:#1D1D1B}
      ::-webkit-scrollbar-thumb{background:#E4002B;border-radius:4px}
      .nav-links::-webkit-scrollbar{display:none}
      @keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulseArrow{0%,100%{opacity:0.5}50%{opacity:1}}
      @media(max-width:640px){div[style*="max-width: 840"]{padding:0 18px!important}}
    `}</style>
  );
}

// ── Reveal on scroll ──
export function useInView(th = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

export function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useInView(0.06);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Typography & Layout ──
export const Label = ({ children, color = C.red }) => (
  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 10 }}>{children}</div>
);

export const H = ({ children, size = 38, color = C.black, mb = 18 }) => (
  <h2 style={{ fontSize: size, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em', color, margin: `0 0 ${mb}px`, textWrap: 'balance' }}>{children}</h2>
);

export const P = ({ children, color = C.black60, mb = 32 }) => (
  <p style={{ fontSize: 16, color, lineHeight: 1.7, marginBottom: mb }}>{children}</p>
);

export const Wrap = ({ children, bg = C.white, py = 64 }) => (
  <div style={{ background: bg, padding: `${py}px 0` }}>
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px' }}>{children}</div>
  </div>
);

export const DarkWrap = ({ children, py = 64 }) => (
  <div style={{ background: C.black, padding: `${py}px 0` }}>
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 36px', color: C.white }}>{children}</div>
  </div>
);

export const Callout = ({ children, accent = C.red, bg = C.black05 }) => (
  <div style={{
    borderLeft: `4px solid ${accent}`, background: bg, borderRadius: '0 6px 6px 0',
    padding: '16px 20px', margin: '18px 0', fontSize: 15, lineHeight: 1.65, color: C.black80,
  }}>{children}</div>
);

export const Card = ({ children, style: s = {} }) => (
  <div style={{
    background: C.white, border: `1px solid ${C.black10}`, borderRadius: 8,
    padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...s,
  }}>{children}</div>
);

export const Btn = ({ children, onClick, disabled = false, style: s = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? C.black20 : C.red, color: '#fff', border: 'none', borderRadius: 4,
    padding: '12px 26px', fontSize: 16, fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: "'Source Sans 3',sans-serif", ...s,
  }}>{children}</button>
);

export const Dot = ({ color = C.red }) => (
  <div style={{ width: 5, height: 5, background: color, borderRadius: 1, marginTop: 7, flexShrink: 0 }} />
);

export const Li = ({ children, color = C.red }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
    <Dot color={color} /><span style={{ fontSize: 14, color: C.black80, lineHeight: 1.6 }}>{children}</span>
  </div>
);

export const Formula = ({ children, dark }) => (
  <div style={{
    fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
    color: dark ? C.white : C.black,
    background: dark ? 'rgba(255,255,255,0.06)' : C.black05,
    padding: '10px 14px', borderRadius: 6, margin: '10px 0',
    border: dark ? 'none' : `1px solid ${C.black10}`, overflowX: 'auto',
  }}>{children}</div>
);

export const Num = ({ n, children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{
      width: 24, height: 24, background: C.red, borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0,
    }}>{n}</div>
    <span style={{ fontSize: 14, color: C.black80, lineHeight: 1.6, paddingTop: 2 }}>{children}</span>
  </div>
);

// ── Accordion ──
export function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ borderTop: `1px solid ${C.black10}` }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.black10}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, fontWeight: 600,
            color: C.black, textAlign: 'left', gap: 12,
          }}>
            <span>{item.title}</span>
            <span style={{
              fontSize: 18, color: C.red, flexShrink: 0,
              transform: open === i ? 'rotate(45deg)' : 'none',
              transition: 'transform 0.25s', display: 'inline-block',
            }}>+</span>
          </button>
          <div style={{
            maxHeight: open === i ? 1400 : 0, overflow: 'hidden',
            transition: 'max-height 0.4s ease',
          }}>
            <div style={{ padding: '0 0 16px', fontSize: 15, color: C.black80, lineHeight: 1.65 }}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Navigation buttons ──
export function NextBtn({ onClick, label = 'Continue to next section →' }) {
  return (
    <div style={{ borderTop: `1px solid ${C.black10}`, marginTop: 44, paddingTop: 28, display: 'flex', justifyContent: 'center' }}>
      <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 10, background: C.red, color: '#fff',
        border: 'none', borderRadius: 6, padding: '14px 32px', fontSize: 16, fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif",
        boxShadow: '0 4px 16px rgba(228,0,43,0.25)',
      }}>{label}</button>
    </div>
  );
}

export function NextBtnDark({ onClick, label = 'Continue to next section →' }) {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 44, paddingTop: 28, display: 'flex', justifyContent: 'center' }}>
      <button onClick={onClick} style={{
        background: C.red, color: '#fff', border: 'none', borderRadius: 6,
        padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Source Sans 3',sans-serif", boxShadow: '0 4px 16px rgba(228,0,43,0.3)',
      }}>{label}</button>
    </div>
  );
}

// ── Gamified Quiz ──
export function GamifiedQuiz({ quizId, questions, xpPerQ = 10, perfectBonus = 20, badgeOnPerfect = null, onComplete }) {
  const { awardXpOnce, awardBadge, recordQuiz, recordAnswer, progress } = useGame();
  const [ans, setAns] = useState({});
  const [sub, setSub] = useState(false);

  const score = sub ? questions.filter(q => ans[q.id] === q.c).length : 0;

  const onSubmit = () => {
    setSub(true);
    questions.forEach(q => {
      const correct = ans[q.id] === q.c;
      recordAnswer(`${quizId}:${q.id}`, correct);
    });
    const correctCount = questions.filter(q => ans[q.id] === q.c).length;
    let totalXp = correctCount * xpPerQ;
    if (correctCount === questions.length) {
      totalXp += perfectBonus;
      if (badgeOnPerfect) awardBadge(badgeOnPerfect);
    }
    if (progress.streak + correctCount >= 5) awardBadge('streak-5');
    awardXpOnce(`quiz:${quizId}`, totalXp, correctCount === questions.length ? 'Perfect score!' : `${correctCount} correct`, { allowImprovement: true });
    recordQuiz(quizId, correctCount, questions.length);
    onComplete?.(correctCount, questions.length);
  };

  const retry = () => { setAns({}); setSub(false); };

  return (
    <div>
      {questions.map((q, qi) => (
        <Reveal key={q.id} delay={qi * 0.04}>
          <Card style={{
            marginBottom: 12,
            borderColor: sub && ans[q.id] === q.c ? C.green : sub && ans[q.id] !== undefined && ans[q.id] !== q.c ? C.red : C.black10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.black60 }}>Q{qi + 1}</div>
              <div style={{ fontSize: 11, color: C.black60 }}>{xpPerQ} XP</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.black, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
            {q.opts.map((opt, oi) => {
              const sel = ans[q.id] === oi;
              const correct = sub && q.c === oi;
              const wrong = sub && sel && q.c !== oi;
              return (
                <button key={oi} onClick={() => !sub && setAns({ ...ans, [q.id]: oi })} style={{
                  display: 'block', width: '100%', textAlign: 'left', marginBottom: 5,
                  padding: '10px 14px', borderRadius: 5,
                  border: `1.5px solid ${correct ? C.green : wrong ? C.red : sel ? C.red : C.black10}`,
                  background: correct ? C.greenBg : wrong ? C.redSubtle : sel ? C.redSubtle : 'transparent',
                  cursor: sub ? 'default' : 'pointer',
                  fontFamily: "'Source Sans 3',sans-serif", fontSize: 14, color: C.black80,
                  transition: 'all 0.15s',
                }}>{opt}</button>
              );
            })}
            {sub && q.ex && (
              <div style={{
                marginTop: 8, padding: '10px 14px', background: C.black05, borderRadius: 5,
                fontSize: 13, color: C.black80, lineHeight: 1.6,
                borderLeft: `3px solid ${ans[q.id] === q.c ? C.green : C.red}`,
              }}>{q.ex}</div>
            )}
          </Card>
        </Reveal>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {!sub ? (
          <Btn onClick={onSubmit} disabled={Object.keys(ans).length < questions.length}>Submit Answers</Btn>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: C.black, borderRadius: 8, padding: '10px 16px', color: '#fff' }}>
              <div style={{ fontSize: 10, color: C.red, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Score</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                {questions.filter(q => ans[q.id] === q.c).length}/{questions.length}
              </div>
            </div>
            <Btn onClick={retry} style={{ background: C.black05, color: C.black }}>Try again</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TopNav (tab navigation within a seminar) ──
export function TopNav({ tabs, activeTab, setActiveTab }) {
  const { progress } = useGame();
  const completedCount = tabs.filter(t => progress.completedTabs[t.id]).length;
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(29,29,27,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)', height: 56,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 36px',
        display: 'flex', alignItems: 'center',
      }}>
        <a href="/" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 18px 0 0', borderRight: '1px solid rgba(255,255,255,0.1)',
          marginRight: 14, flexShrink: 0, fontSize: 15, fontWeight: 900, color: C.red,
          fontFamily: "'Source Sans 3',sans-serif", textDecoration: 'none',
        }}>SIT</a>
        <div className="nav-links" style={{
          display: 'flex', gap: 0, overflow: 'auto', flex: 1, scrollbarWidth: 'none',
        }}>
          {tabs.map(t => {
            const done = progress.completedTabs[t.id];
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '0 10px', height: 56, background: 'none', border: 'none',
                fontFamily: "'Source Sans 3',sans-serif", fontSize: 13,
                fontWeight: activeTab === t.id ? 700 : 400,
                color: activeTab === t.id ? C.red : done ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: activeTab === t.id ? `2px solid ${C.red}` : '2px solid transparent',
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {done && <span style={{ color: C.green, fontSize: 11 }}>✓</span>}
                {t.label}
              </button>
            );
          })}
        </div>
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
          color: 'rgba(255,255,255,0.3)', fontSize: 12, marginLeft: 10,
        }}>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{completedCount}</span>
          <span>/</span>
          <span>{tabs.length}</span>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${(completedCount / tabs.length) * 100}%`,
        height: 2, background: C.red, transition: 'width 0.3s ease',
      }} />
    </nav>
  );
}

// ── Progress Widget (floating pill) ──
export function ProgressWidget({ tabs }) {
  const { progress, identity, loaded, resetProgress, resetIdentity, setStudentIdentity, syncStatus } = useGame();
  const [open, setOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [showChangeId, setShowChangeId] = useState(false);
  if (!loaded) return null;

  const lvl = levelFromXp(progress.xp);
  const pct = lvl.isMax ? 100 : ((progress.xp - lvl.min) / (lvl.nextMin - lvl.min)) * 100;
  const badgeCount = Object.keys(progress.badges).length;
  const totalBadges = Object.keys(BADGES).length;

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 300,
        background: C.black, color: '#fff', border: `2px solid ${C.red}`, borderRadius: 999,
        padding: '10px 16px', fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 6px 24px rgba(0,0,0,0.3)', letterSpacing: '0.02em',
      }}>
        <span style={{
          background: C.red, width: 26, height: 26, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900,
        }}>{lvl.lvl}</span>
        <span>{progress.xp} XP</span>
        {progress.streak >= 2 && <span style={{ color: C.gold, fontSize: 12 }}>▲{progress.streak}</span>}
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 2 }}>{open ? '×' : '↗'}</span>
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 72, right: 20, zIndex: 300,
          background: C.white, border: `1px solid ${C.black10}`, borderRadius: 12,
          padding: 20, width: 320, boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          fontFamily: "'Source Sans 3',sans-serif", maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
        }}>
          {identity.name && (
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.black10}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.black60 }}>Signed in as</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{identity.name}</div>
                  <div style={{ fontSize: 11, color: C.black60, fontFamily: "'JetBrains Mono',monospace" }}>{identity.studentId}</div>
                </div>
                <button onClick={() => setShowChangeId(true)} title="Change identity" style={{
                  background: 'none', border: `1px solid ${C.black20}`, borderRadius: 4,
                  padding: '4px 8px', fontSize: 11, color: C.black60, cursor: 'pointer',
                  fontFamily: "'Source Sans 3',sans-serif", flexShrink: 0,
                }}>Edit</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.black60 }}>Your Progress</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.black, marginTop: 2 }}>{lvl.name}</div>
            </div>
            <div style={{
              background: C.red, color: '#fff', width: 40, height: 40, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18,
            }}>{lvl.lvl}</div>
          </div>

          <div style={{ background: C.black05, borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.red}, ${C.redDark})`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.black60, marginBottom: 16 }}>
            <span>{progress.xp} XP</span>
            <span>{lvl.isMax ? 'MAX LEVEL' : `${lvl.nextMin - progress.xp} XP to next`}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div style={{ background: C.black05, borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: C.black60 }}>Streak</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: progress.streak >= 3 ? C.gold : C.black }}>▲ {progress.streak}</div>
            </div>
            <div style={{ background: C.black05, borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: C.black60 }}>Best</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.black }}>{progress.bestStreak}</div>
            </div>
          </div>

          {syncStatus?.state === 'offline' && (
            <div style={{
              background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: 6,
              padding: '9px 11px', fontSize: 12, color: C.black80, lineHeight: 1.45,
              marginBottom: 12,
            }}>
              {syncStatus.message}
            </div>
          )}

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 8 }}>Badges · {badgeCount}/{totalBadges}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
            {Object.entries(BADGES).map(([id, b]) => {
              const earned = !!progress.badges[id];
              return (
                <div key={id} title={`${b.name}: ${b.desc}`} style={{
                  aspectRatio: '1', borderRadius: 8,
                  background: earned ? C.goldBg : C.black05,
                  border: `1px solid ${earned ? C.gold : C.black10}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: 4, opacity: earned ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: 18, color: earned ? C.gold : C.black60, lineHeight: 1 }}>{b.icon}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: earned ? C.black : C.black60, textAlign: 'center', marginTop: 3, lineHeight: 1.2 }}>{b.name}</div>
                </div>
              );
            })}
          </div>

          <button onClick={() => setShowLeaderboard(true)} style={{
            width: '100%', padding: '10px', background: C.red, border: 'none', borderRadius: 6,
            color: '#fff', fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, fontWeight: 700,
            cursor: 'pointer', marginBottom: 8, letterSpacing: '0.02em',
          }}>View Class Leaderboard</button>

          <button onClick={() => setShowInstructor(true)} style={{
            width: '100%', padding: '7px', background: 'none', border: `1px solid ${C.black20}`,
            borderRadius: 6, color: C.black60, fontFamily: "'Source Sans 3',sans-serif", fontSize: 11,
            cursor: 'pointer', marginBottom: 8,
          }}>Instructor Access</button>

          <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }} style={{
            width: '100%', padding: '7px', background: 'none', border: `1px solid ${C.black20}`,
            borderRadius: 6, color: C.black60, fontFamily: "'Source Sans 3',sans-serif", fontSize: 11, cursor: 'pointer',
          }}>Reset progress</button>
        </div>
      )}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showInstructor && <InstructorDashboard tabs={tabs} onClose={() => setShowInstructor(false)} />}
      {showChangeId && <IdentityModal isChange onSubmit={setStudentIdentity} onClose={() => setShowChangeId(false)} />}
    </>
  );
}

// ── Leaderboard ──
function Leaderboard({ onClose }) {
  const { identity } = useGame();
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [anon, setAnon] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const entries = await loadAllRoster();
        setRoster(entries.sort((a, b) => b.xp - a.xp));
      } catch (e) { setErr(e.message || 'Failed to load'); }
      setLoading(false);
    })();
  }, []);

  const myRank = roster.findIndex(r => r.hashedId === identity.hashedId) + 1;
  const displayName = (r) => {
    if (!anon) return r.name;
    const parts = r.name.split(' ');
    return parts.map(p => p[0] || '').join('') + '.';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(29,29,27,0.8)',
      backdropFilter: 'blur(8px)', zIndex: 9000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'Source Sans 3',sans-serif",
    }}>
      <div style={{
        background: C.white, borderRadius: 12, maxWidth: 560, width: '100%',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)', border: `3px solid ${C.red}`,
      }}>
        <div style={{
          padding: '22px 26px 16px', borderBottom: `1px solid ${C.black10}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 4 }}>Class Leaderboard</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.black, letterSpacing: '-0.01em' }}>Top of the Class</div>
            {!loading && myRank > 0 && <div style={{ fontSize: 13, color: C.black60, marginTop: 4 }}>You're ranked <strong style={{ color: C.red }}>#{myRank}</strong> of {roster.length}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.black60, padding: 4, lineHeight: 1 }}>×</button>
        </div>

        <div style={{
          padding: '10px 26px', borderBottom: `1px solid ${C.black10}`, background: C.black05,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <label style={{ fontSize: 13, color: C.black80, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} style={{ cursor: 'pointer' }} />
            Show initials only
          </label>
          <div style={{ fontSize: 11, color: C.black60 }}>{roster.length} student{roster.length !== 1 ? 's' : ''}</div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 26px 22px' }}>
          {loading && <div style={{ padding: '40px 0', textAlign: 'center', color: C.black60 }}>Loading class data…</div>}
          {err && <div style={{ padding: 20, background: C.redSubtle, borderLeft: `3px solid ${C.red}`, borderRadius: '0 6px 6px 0', color: C.black80, fontSize: 14 }}>⚠ {err}</div>}
          {!loading && !err && roster.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', color: C.black60, fontSize: 14 }}>No classmates yet — you're the first!</div>}
          {!loading && roster.map((r, i) => {
            const isMe = r.hashedId === identity.hashedId;
            const medal = i === 0 ? C.gold : i === 1 ? '#B8B8B8' : i === 2 ? '#CD7F32' : null;
            return (
              <div key={r.hashedId} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '11px 12px', borderRadius: 8,
                background: isMe ? C.redSubtle : (i < 3 ? C.goldBg : 'transparent'),
                border: isMe ? `1.5px solid ${C.red}` : `1px solid ${i < 3 ? C.gold : 'transparent'}`,
                marginBottom: 4,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: medal || C.black05,
                  color: medal ? C.white : C.black60, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayName(r)}{isMe && <span style={{ color: C.red, fontSize: 11, marginLeft: 6, fontWeight: 600 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.black60 }}>{r.levelName} · {r.badgeCount} badge{r.badgeCount !== 1 ? 's' : ''}{r.bestStreak >= 3 ? ` · streak ${r.bestStreak}` : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.red }}>{r.xp}</div>
                  <div style={{ fontSize: 10, color: C.black60, letterSpacing: '0.06em' }}>XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Instructor Dashboard ──
function InstructorDashboard({ tabs, onClose }) {
  const [unlocked, setUnlocked] = useState(false);
  const [accessErr, setAccessErr] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roster, setRoster] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('xp');
  const [filter, setFilter] = useState('');

  const tryUnlock = async () => {
    try {
      if (email && password) await signInInstructor(email, password);
      if (await currentUserIsInstructor()) {
        setUnlocked(true);
        setAccessErr('');
        loadData();
      } else {
        setAccessErr('Instructor access requires a Firebase account with the instructor custom claim.');
      }
    } catch (e) {
      setAccessErr(e.message || 'Instructor access could not be verified.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    const entries = await loadAllRoster();
    setRoster(entries);
    setLoading(false);
  };

  const fetchDetailForStudent = async (hashedId) => {
    if (details[hashedId]) { setExpanded(expanded === hashedId ? null : hashedId); return; }
    const d = await loadDetail(hashedId);
    if (d) { setDetails(prev => ({ ...prev, [hashedId]: d })); setExpanded(hashedId); }
  };

  const exportCsv = () => {
    const headers = ['Name', 'Hashed ID', 'XP', 'Level', 'Badges', 'Tabs Done', 'Best Streak', 'Last Seen'];
    const rows = roster.map(r => [r.name, r.hashedId, r.xp, r.levelName, r.badgeCount, r.tabsDone, r.bestStreak, new Date(r.lastSeen).toISOString()]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `acc3018-roster-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const sorted = [...roster]
    .filter(r => !filter || r.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'xp') return b.xp - a.xp;
      if (sortBy === 'tabs') return b.tabsDone - a.tabsDone;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return b.lastSeen - a.lastSeen;
      return 0;
    });

  const stats = {
    count: roster.length,
    avgXp: roster.length ? Math.round(roster.reduce((s, r) => s + r.xp, 0) / roster.length) : 0,
    avgTabs: roster.length ? (roster.reduce((s, r) => s + r.tabsDone, 0) / roster.length).toFixed(1) : 0,
    active24h: roster.filter(r => Date.now() - r.lastSeen < 86400000).length,
  };

  if (!unlocked) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(29,29,27,0.9)', backdropFilter: 'blur(10px)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Source Sans 3',sans-serif" }}>
        <div style={{ background: C.white, borderRadius: 12, maxWidth: 420, width: '100%', padding: '32px 32px 26px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: `3px solid ${C.black}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.black, marginBottom: 8 }}>Restricted</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: C.black, lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em' }}>Instructor Dashboard</h2>
          <p style={{ fontSize: 14, color: C.black60, lineHeight: 1.6, marginBottom: 18 }}>Instructor data is protected by Firebase Auth custom claims. Sign in with an instructor account, or ask the Firebase project owner to grant the <strong>instructor</strong> claim.</p>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setAccessErr(''); }} placeholder="Instructor email" style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.black20}`, borderRadius: 6, fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: 'none', marginBottom: 8 }} autoFocus />
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setAccessErr(''); }} onKeyDown={e => e.key === 'Enter' && tryUnlock()} placeholder="Password" style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.black20}`, borderRadius: 6, fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: 'none', marginBottom: 8 }} />
          {accessErr && <div style={{ fontSize: 13, color: C.red, fontWeight: 600, marginBottom: 10 }}>Access check failed: {accessErr}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
            <button onClick={onClose} style={{ background: 'none', border: `1px solid ${C.black20}`, borderRadius: 6, padding: '10px 18px', fontSize: 14, fontWeight: 600, color: C.black60, cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif" }}>Cancel</button>
            <button onClick={tryUnlock} style={{ background: C.black, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif" }}>Unlock</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(29,29,27,0.9)', backdropFilter: 'blur(6px)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Source Sans 3',sans-serif" }}>
      <div style={{ background: C.white, borderRadius: 12, maxWidth: 900, width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: `3px solid ${C.black}` }}>
        <div style={{ padding: '20px 26px 16px', borderBottom: `1px solid ${C.black10}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, background: C.black, borderRadius: '9px 9px 0 0' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 4 }}>Instructor Console</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.white, letterSpacing: '-0.01em' }}>ACC3018 Class Dashboard</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '16px 26px', background: C.black, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[{ l: 'Students', v: stats.count, c: C.red }, { l: 'Avg XP', v: stats.avgXp, c: C.gold }, { l: 'Avg Tabs Done', v: stats.avgTabs, c: C.green }, { l: 'Active 24h', v: stats.active24h, c: C.blue }].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{s.l}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.c, lineHeight: 1.1, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 26px', borderBottom: `1px solid ${C.black10}`, background: C.black05, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by name…" style={{ padding: '7px 10px', border: `1px solid ${C.black20}`, borderRadius: 5, fontSize: 13, flex: '1 1 180px', fontFamily: "'Source Sans 3',sans-serif" }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '7px 10px', border: `1px solid ${C.black20}`, borderRadius: 5, fontSize: 13, fontFamily: "'Source Sans 3',sans-serif", background: '#fff' }}>
            <option value="xp">Sort: XP</option>
            <option value="tabs">Sort: Tabs completed</option>
            <option value="name">Sort: Name</option>
            <option value="recent">Sort: Most recent</option>
          </select>
          <button onClick={loadData} style={{ background: 'none', border: `1px solid ${C.black20}`, borderRadius: 5, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif" }}>↻ Refresh</button>
          <button onClick={exportCsv} disabled={!roster.length} style={{ background: C.black, color: '#fff', border: 'none', borderRadius: 5, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: roster.length ? 'pointer' : 'default', opacity: roster.length ? 1 : 0.4, fontFamily: "'Source Sans 3',sans-serif" }}>Export CSV</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 26px 22px' }}>
          {loading && <div style={{ padding: '40px 0', textAlign: 'center', color: C.black60 }}>Loading…</div>}
          {!loading && sorted.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', color: C.black60, fontSize: 14 }}>{filter ? 'No students match your filter.' : 'No student data yet.'}</div>}
          {!loading && sorted.map((r, i) => {
            const isExp = expanded === r.hashedId;
            const d = details[r.hashedId];
            const hoursAgo = Math.round((Date.now() - r.lastSeen) / 3600000);
            return (
              <div key={r.hashedId} style={{ borderBottom: `1px solid ${C.black10}`, padding: '10px 0' }}>
                <div onClick={() => fetchDetailForStudent(r.hashedId)} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                  <div style={{ width: 24, color: C.black60, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.black60, fontFamily: "'JetBrains Mono',monospace" }}>id:{r.hashedId.slice(0, 8)}…</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.black80 }}>
                    <div><span style={{ fontWeight: 700, color: C.red }}>{r.xp}</span> XP</div>
                    <div><span style={{ fontWeight: 700 }}>{r.tabsDone}</span>/{tabs?.length || '?'} tabs</div>
                    <div><span style={{ fontWeight: 700 }}>{r.badgeCount}</span> badges</div>
                    <div style={{ color: hoursAgo < 1 ? C.green : hoursAgo < 24 ? C.black60 : C.amber, minWidth: 60, textAlign: 'right' }}>
                      {hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`}
                    </div>
                  </div>
                  <div style={{ color: C.black60, fontSize: 14, transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</div>
                </div>
                {isExp && d && (
                  <div style={{ marginTop: 12, padding: '14px 16px', background: C.black05, borderRadius: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 6 }}>Completed Tabs</div>
                      <div style={{ fontSize: 12, color: C.black80, lineHeight: 1.7 }}>{d.completedTabs?.length ? d.completedTabs.join(', ') : '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 6 }}>Badges Earned</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {d.badges?.map(b => <span key={b} style={{ background: C.goldBg, color: C.black, border: `1px solid ${C.gold}`, padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{BADGES[b]?.name || b}</span>) || '—'}
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 6 }}>Quiz Scores</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {Object.entries(d.quizzes || {}).map(([k, v]) => <span key={k} style={{ background: v.perfect ? C.greenBg : C.white, border: `1px solid ${v.perfect ? C.green : C.black20}`, padding: '3px 9px', borderRadius: 4, fontSize: 11, color: C.black80 }}><strong>{k}</strong>: {v.score}/{v.total}{v.perfect ? ' ★' : ''}</span>)}
                        {!Object.keys(d.quizzes || {}).length && <span style={{ fontSize: 12, color: C.black60 }}>No quizzes submitted yet</span>}
                      </div>
                    </div>
                    {d.scenarios && Object.keys(d.scenarios).length > 0 && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black60, marginBottom: 6 }}>Scenario Outcomes</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {Object.entries(d.scenarios).map(([k, v]) => <span key={k} style={{ background: v.result === 'strong' ? C.greenBg : v.result === 'weak' ? C.amberBg : C.black05, border: `1px solid ${v.result === 'strong' ? C.green : v.result === 'weak' ? C.amber : C.black20}`, padding: '3px 9px', borderRadius: 4, fontSize: 11, color: C.black80 }}><strong>{k}</strong>: {v.result || v.ending || '—'}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
