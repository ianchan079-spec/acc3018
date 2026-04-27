// ═══════════════════════════════════════════════════════════════
// GAME PROVIDER — XP, badges, streaks, progress persistence
// ═══════════════════════════════════════════════════════════════
// Replaces window.storage with Firebase Firestore via storage.js

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { C, BADGES, LEVELS, levelFromXp, DEFAULT_PROGRESS, DEFAULT_IDENTITY } from './theme';
import {
  sha256, loadIdentity, saveIdentity, clearIdentity,
  ensureSignedIn,
  loadProgress, saveProgress, deleteProgress,
  saveRoster, deleteRoster, saveDetail, deleteDetail,
  validateStudentId, validateName,
} from './storage';

const GameCtx = createContext(null);
const LEGACY_TABS = new Set(['overview', 'research', 'process', 'ideas', 'litreview', 'hypotheses', 'design', 'results', 'thesis', 'activity']);

function prefixLegacyKeys(obj = {}, prefix = 's1') {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.includes(':') ? key : `${prefix}:${key}`, value])
  );
}

function normalizeProgress(saved = {}) {
  return {
    ...DEFAULT_PROGRESS,
    ...saved,
    completedTabs: Object.fromEntries(
      Object.entries(saved.completedTabs || {}).map(([key, value]) => [
        !key.includes(':') && LEGACY_TABS.has(key) ? `s1:${key}` : key,
        value,
      ])
    ),
    completedQuizzes: prefixLegacyKeys(saved.completedQuizzes || {}, 's1'),
    firstTryCorrect: prefixLegacyKeys(saved.firstTryCorrect || {}, 's1'),
    scenarios: prefixLegacyKeys(saved.scenarios || {}, 's1'),
    hypothesisBuilt: prefixLegacyKeys(saved.hypothesisBuilt || {}, 's1'),
    regressionBuilt: prefixLegacyKeys(saved.regressionBuilt || {}, 's2'),
    ivBuilt: prefixLegacyKeys(saved.ivBuilt || {}, 's3'),
    xpAwards: saved.xpAwards || {},
    schemaVersion: 2,
  };
}

function seminarCounts(completedTabs = {}) {
  return Object.keys(completedTabs).reduce((acc, id) => {
    const seminar = id.split(':')[0] || 'legacy';
    acc[seminar] = (acc[seminar] || 0) + 1;
    return acc;
  }, {});
}

export function GameProvider({ children }) {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [identity, setIdentity] = useState(DEFAULT_IDENTITY);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [identityNeeded, setIdentityNeeded] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ state: 'idle', message: '' });
  const toastTimer = useRef(null);

  // ── Load on boot ──
  useEffect(() => {
    (async () => {
      let loadedIdentity = DEFAULT_IDENTITY;
      let loadedProgress = DEFAULT_PROGRESS;
      try {
        await ensureSignedIn();
      } catch {
        setSyncStatus({ state: 'offline', message: 'Progress is saved on this device until Firebase sign-in works.' });
      }

      // Identity from localStorage
      const savedId = loadIdentity();
      if (savedId?.studentId && savedId?.hashedId) {
        loadedIdentity = { ...DEFAULT_IDENTITY, ...savedId };
      }

      // Progress from Firestore (if we have a hashedId)
      if (loadedIdentity.hashedId) {
        const savedProgress = await loadProgress(loadedIdentity.hashedId);
        if (savedProgress) {
          loadedProgress = normalizeProgress(savedProgress);
        }
      }

      setIdentity(loadedIdentity);
      setProgress(loadedProgress);
      if (!loadedIdentity.studentId) setIdentityNeeded(true);
      setLoaded(true);
    })();
  }, []);

  // ── Debounced private save (hot path — every state change) ──
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded || !identity.hashedId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const result = await saveProgress(identity.hashedId, { ...progress, lastSeen: Date.now() });
      setSyncStatus(result?.ok
        ? { state: 'synced', message: 'Progress synced.' }
        : { state: 'offline', message: result?.error || 'Progress saved on this device only.' });
    }, 400);
  }, [progress, loaded, identity.hashedId]);

  // ── Roster sync (slim leaderboard record) — only on milestones ──
  const syncRoster = useCallback(async (prog, ident) => {
    if (!ident?.hashedId) return;
    const lvl = levelFromXp(prog.xp);
    await saveRoster(ident.hashedId, {
      name: ident.name,
      hashedId: ident.hashedId,
      xp: prog.xp,
      level: lvl.lvl,
      levelName: lvl.name,
      badgeCount: Object.keys(prog.badges).length,
      tabsDone: Object.keys(prog.completedTabs).length,
      seminarTabs: seminarCounts(prog.completedTabs),
      bestStreak: prog.bestStreak,
      seminar: prog.seminar || 1,
      lastSeen: Date.now(),
    });
  }, []);

  // ── Instructor detail sync — only on milestones ──
  const syncDetail = useCallback(async (prog, ident) => {
    if (!ident?.hashedId) return;
    await saveDetail(ident.hashedId, {
      name: ident.name,
      hashedId: ident.hashedId,
      xp: prog.xp,
      badges: Object.keys(prog.badges),
      completedTabs: Object.keys(prog.completedTabs),
      quizzes: Object.fromEntries(
        Object.entries(prog.completedQuizzes).map(([k, v]) => [k, { score: v.score, total: v.total, perfect: v.perfect }])
      ),
      scenarios: Object.fromEntries(
        Object.entries(prog.scenarios).map(([k, v]) => [k, { result: v.result, ending: v.ending }])
      ),
      hypothesisBuilt: Object.keys(prog.hypothesisBuilt || {}),
      regressionBuilt: Object.keys(prog.regressionBuilt || {}),
      ivBuilt: Object.keys(prog.ivBuilt || {}),
      seminarTabs: seminarCounts(prog.completedTabs),
      bestStreak: prog.bestStreak,
      lastSeen: Date.now(),
    });
  }, []);

  // ── Milestone sync — debounced ──
  const milestoneTimer = useRef(null);
  const triggerMilestoneSync = useCallback((nextProgress, nextIdentity) => {
    if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
    milestoneTimer.current = setTimeout(() => {
      syncRoster(nextProgress, nextIdentity);
      syncDetail(nextProgress, nextIdentity);
    }, 800);
  }, [syncRoster, syncDetail]);

  // ── Toast ──
  const showToast = useCallback((msg, kind = 'xp') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, kind, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // ── Game actions ──
  const awardXp = useCallback((amount, reason) => {
    setProgress(p => {
      const oldLvl = levelFromXp(p.xp).lvl;
      const newXp = p.xp + amount;
      const newLvl = levelFromXp(newXp).lvl;
      if (newLvl > oldLvl) {
        setTimeout(() => showToast(`Level up → ${levelFromXp(newXp).name}`, 'level'), 300);
      }
      return { ...p, xp: newXp };
    });
    if (reason) showToast(`+${amount} XP · ${reason}`, 'xp');
  }, [showToast]);

  const awardXpOnce = useCallback((awardId, amount, reason, opts = {}) => {
    let didAward = false;
    let deltaAwarded = 0;
    setProgress(p => {
      const existing = p.xpAwards?.[awardId];
      if (existing && (!opts.allowImprovement || existing.amount >= amount)) return p;
      const delta = existing && opts.allowImprovement ? amount - existing.amount : amount;
      if (delta <= 0) return p;
      didAward = true;
      deltaAwarded = delta;
      const oldLvl = levelFromXp(p.xp).lvl;
      const newXp = p.xp + delta;
      const newLvl = levelFromXp(newXp).lvl;
      if (newLvl > oldLvl) {
        setTimeout(() => showToast(`Level up → ${levelFromXp(newXp).name}`, 'level'), 300);
      }
      const next = {
        ...p,
        xp: newXp,
        xpAwards: {
          ...(p.xpAwards || {}),
          [awardId]: { amount, reason, at: Date.now() },
        },
      };
      triggerMilestoneSync(next, identity);
      return next;
    });
    if (didAward && reason) showToast(`+${deltaAwarded} XP · ${reason}`, 'xp');
    return didAward;
  }, [identity, showToast, triggerMilestoneSync]);

  const awardBadge = useCallback((id) => {
    setProgress(p => {
      if (p.badges[id]) return p;
      const b = BADGES[id];
      if (b) setTimeout(() => showToast(`Badge unlocked: ${b.name}`, 'badge'), 150);
      const next = { ...p, badges: { ...p.badges, [id]: { at: Date.now() } } };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [showToast, triggerMilestoneSync, identity]);

  const completeTab = useCallback((tabId, xp = 30) => {
    let didComplete = false;
    setProgress(p => {
      if (p.completedTabs[tabId]) return p;
      didComplete = true;
      const next = { ...p, completedTabs: { ...p.completedTabs, [tabId]: true } };
      triggerMilestoneSync(next, identity);
      return next;
    });
    if (didComplete) awardXpOnce(`tab:${tabId}`, xp, 'Section complete');
  }, [awardXpOnce, triggerMilestoneSync, identity]);

  const recordAnswer = useCallback((qid, correct) => {
    setProgress(p => {
      const nextStreak = correct ? p.streak + 1 : 0;
      const bestStreak = Math.max(p.bestStreak, nextStreak);
      const firstTry = { ...p.firstTryCorrect };
      if (correct && !(qid in firstTry)) firstTry[qid] = true;
      return { ...p, streak: nextStreak, bestStreak, firstTryCorrect: firstTry };
    });
  }, []);

  const recordQuiz = useCallback((quizId, score, total) => {
    setProgress(p => {
      const previous = p.completedQuizzes[quizId];
      const best = previous && previous.score > score ? previous : { score, total, perfect: score === total, at: Date.now() };
      const next = {
        ...p,
        completedQuizzes: {
          ...p.completedQuizzes,
          [quizId]: { ...best, attempts: (previous?.attempts || 0) + 1, lastScore: score, lastAt: Date.now() },
        },
      };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [triggerMilestoneSync, identity]);

  const recordScenario = useCallback((id, data) => {
    setProgress(p => {
      const rank = result => result === 'strong' ? 2 : result === 'weak' ? 1 : 0;
      const previous = p.scenarios[id];
      const best = previous && rank(previous.result) > rank(data.result) ? previous : data;
      const next = { ...p, scenarios: { ...p.scenarios, [id]: { ...best, attempts: (previous?.attempts || 0) + 1, lastAt: Date.now() } } };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [triggerMilestoneSync, identity]);

  const markHypothesis = useCallback((id) => {
    setProgress(p => {
      const next = { ...p, hypothesisBuilt: { ...p.hypothesisBuilt, [id]: true } };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [triggerMilestoneSync, identity]);

  const markRegression = useCallback((id) => {
    setProgress(p => {
      const next = { ...p, regressionBuilt: { ...p.regressionBuilt, [id]: true } };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [triggerMilestoneSync, identity]);

  const markIv = useCallback((id) => {
    setProgress(p => {
      const next = { ...p, ivBuilt: { ...(p.ivBuilt || {}), [id]: true } };
      triggerMilestoneSync(next, identity);
      return next;
    });
  }, [triggerMilestoneSync, identity]);

  // ── Identity management ──
  const setStudentIdentity = useCallback(async (name, studentId) => {
    const hashedId = await sha256(studentId.trim().toUpperCase());
    const newIdentity = {
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      hashedId,
      consentedAt: Date.now(),
    };
    setIdentity(newIdentity);
    setIdentityNeeded(false);
    saveIdentity(newIdentity);

    // Try to load existing progress for this student
    const existing = await loadProgress(hashedId);
    if (existing) {
      setProgress(normalizeProgress(existing));
    }

    // Sync roster immediately
    const prog = existing ? normalizeProgress(existing) : progress;
    syncRoster(prog, newIdentity);
    syncDetail(prog, newIdentity);
  }, [progress, syncRoster, syncDetail]);

  const resetProgress = useCallback(async () => {
    setProgress(DEFAULT_PROGRESS);
    if (identity.hashedId) {
      await deleteProgress(identity.hashedId);
      await deleteRoster(identity.hashedId);
      await deleteDetail(identity.hashedId);
    }
  }, [identity]);

  const resetIdentity = useCallback(async () => {
    if (identity.hashedId) {
      await deleteRoster(identity.hashedId);
      await deleteDetail(identity.hashedId);
    }
    clearIdentity();
    setIdentity(DEFAULT_IDENTITY);
    setIdentityNeeded(true);
  }, [identity]);

  const value = {
    progress, identity, loaded, identityNeeded, syncStatus,
    awardXp, awardXpOnce, awardBadge, completeTab, recordAnswer, recordQuiz,
    resetProgress, resetIdentity, recordScenario, markHypothesis, markRegression, markIv,
    setStudentIdentity, showToast,
  };

  return (
    <GameCtx.Provider value={value}>
      {children}
      {toast && <Toast toast={toast} />}
      {identityNeeded && loaded && <IdentityModal onSubmit={setStudentIdentity} />}
    </GameCtx.Provider>
  );
}

export const useGame = () => useContext(GameCtx);

// ── Toast notification ──
function Toast({ toast }) {
  const bg = toast.kind === 'badge' ? C.gold : toast.kind === 'level' ? C.black : C.red;
  return (
    <div style={{
      position: 'fixed', top: 72, right: 20, zIndex: 500,
      background: bg, color: '#fff', padding: '12px 18px', borderRadius: 8,
      fontSize: 14, fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      animation: 'toastIn 0.3s ease-out', fontFamily: "'Source Sans 3',sans-serif",
      maxWidth: 300, letterSpacing: '0.01em',
    }}>
      {toast.kind === 'badge' && <span style={{ marginRight: 8 }}>🏅</span>}
      {toast.kind === 'level' && <span style={{ marginRight: 8 }}>⬆</span>}
      {toast.msg}
    </div>
  );
}

// ── Identity modal ──
function IdentityModal({ onSubmit, onClose, isChange = false }) {
  const [name, setName] = useState('');
  const [sid, setSid] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const nErr = validateName(name);
    const sErr = validateStudentId(sid);
    if (nErr || sErr) { setErr(nErr || sErr); return; }
    setSubmitting(true);
    try {
      await onSubmit(name, sid);
      onClose?.();
    } catch (e) { setErr('Something went wrong. Try again.'); setSubmitting(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(29,29,27,0.85)',
      backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'Source Sans 3',sans-serif",
    }}>
      <div style={{
        background: C.white, borderRadius: 12, maxWidth: 480, width: '100%',
        padding: '36px 36px 30px', boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        position: 'relative', border: `3px solid ${C.red}`,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.red, marginBottom: 10,
        }}>
          {isChange ? 'Update your identity' : 'Before you begin'}
        </div>
        <h2 style={{
          fontSize: 28, fontWeight: 900, color: C.black,
          lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 10,
        }}>
          {isChange ? 'Change your name or ID' : "Let's get you set up"}
        </h2>
        <p style={{ fontSize: 14, color: C.black60, lineHeight: 1.65, marginBottom: 24 }}>
          Your name and student ID let your instructor track participation and show you where you rank.
          Your ID is <strong>hashed</strong> before it's shared — classmates see only your name, never your ID.
        </p>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: C.black80, marginBottom: 6,
          }}>Full name</div>
          <input
            type="text" value={name} onChange={e => { setName(e.target.value); setErr(''); }}
            placeholder="e.g. Tan Wei Ming"
            style={{
              width: '100%', padding: '11px 14px', border: `1.5px solid ${C.black20}`,
              borderRadius: 6, fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = C.red}
            onBlur={e => e.target.style.borderColor = C.black20}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: C.black80, marginBottom: 6,
          }}>Student ID</div>
          <input
            type="text" value={sid} onChange={e => { setSid(e.target.value.toUpperCase()); setErr(''); }}
            placeholder="e.g. 2301234A"
            style={{
              width: '100%', padding: '11px 14px', border: `1.5px solid ${C.black20}`,
              borderRadius: 6, fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: 'none',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
            onFocus={e => e.target.style.borderColor = C.red}
            onBlur={e => e.target.style.borderColor = C.black20}
          />
        </label>

        {err && <div style={{ fontSize: 13, color: C.red, fontWeight: 600, marginBottom: 10 }}>⚠ {err}</div>}

        <div style={{
          fontSize: 12, color: C.black60, lineHeight: 1.55, background: C.black05,
          borderRadius: 6, padding: '10px 12px', marginBottom: 20, borderLeft: `3px solid ${C.red}`,
        }}>
          <strong>Privacy:</strong> Your student ID is stored on your device and hashed (SHA-256)
          before any class-wide data is written. Only your name, level, and XP appear on the leaderboard.
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {isChange && (
            <button onClick={onClose} style={{
              background: 'none', border: `1px solid ${C.black20}`, borderRadius: 6,
              padding: '10px 20px', fontSize: 14, fontWeight: 600, color: C.black60,
              cursor: 'pointer', fontFamily: "'Source Sans 3',sans-serif",
            }}>Cancel</button>
          )}
          <button onClick={submit} disabled={submitting} style={{
            background: C.red, color: '#fff', border: 'none', borderRadius: 6,
            padding: '11px 24px', fontSize: 15, fontWeight: 700,
            cursor: submitting ? 'default' : 'pointer',
            fontFamily: "'Source Sans 3',sans-serif",
            opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? 'Saving…' : isChange ? 'Update' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Export IdentityModal for use in ProgressWidget
export { IdentityModal };
