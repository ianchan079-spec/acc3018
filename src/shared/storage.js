// ═══════════════════════════════════════════════════════════════
// STORAGE ADAPTER — Firebase Firestore replacing window.storage
// ═══════════════════════════════════════════════════════════════
// Three-tier design for scalability (600+ students):
//   Tier 1: students/{hashedId}  — private progress per student
//   Tier 2: roster/{hashedId}    — slim leaderboard summary (shared)
//   Tier 3: detail/{hashedId}    — instructor deep-dive per student
//
// Identity is stored in localStorage (device-local, never shared).
// ═══════════════════════════════════════════════════════════════

import { auth, db } from './firebase';
import { getIdTokenResult, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, runTransaction,
} from 'firebase/firestore';

const IDENTITY_KEY = 'acc3018:identity';
const PROGRESS_CACHE_PREFIX = 'acc3018:progress:';

function progressCacheKey(hashedId) {
  return `${PROGRESS_CACHE_PREFIX}${hashedId}`;
}

function cacheProgress(hashedId, progress) {
  try {
    localStorage.setItem(progressCacheKey(hashedId), JSON.stringify(progress));
  } catch {}
}

function loadCachedProgress(hashedId) {
  try {
    const raw = localStorage.getItem(progressCacheKey(hashedId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearCachedProgress(hashedId) {
  try { localStorage.removeItem(progressCacheKey(hashedId)); } catch {}
}

export async function ensureSignedIn() {
  if (auth.currentUser) return auth.currentUser;
  try {
    return await new Promise((resolve, reject) => {
      const unsub = onAuthStateChanged(auth, user => {
        unsub();
        if (user) resolve(user);
        else signInAnonymously(auth).then(cred => resolve(cred.user)).catch(reject);
      }, reject);
    });
  } catch (e) {
    console.warn('Anonymous sign-in failed:', e);
    throw e;
  }
}

export async function currentUserIsInstructor() {
  const user = await ensureSignedIn();
  const token = await getIdTokenResult(user, true);
  return token.claims.instructor === true;
}

export async function signInInstructor(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await getIdTokenResult(cred.user, true);
  if (token.claims.instructor !== true) {
    throw new Error('This account is signed in but does not have the instructor claim.');
  }
  return cred.user;
}

// ── SHA-256 hashing for student ID privacy ──
export async function sha256(str) {
  if (!window.crypto?.subtle) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return 'h' + Math.abs(h).toString(16).padStart(8, '0');
  }
  const bytes = new TextEncoder().encode(str);
  const buf = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

// ── Identity (localStorage — never leaves the device) ──
export function loadIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveIdentity(identity) {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  } catch {}
}

export function clearIdentity() {
  try { localStorage.removeItem(IDENTITY_KEY); } catch {}
}

// ── Private progress (Firestore: students/{hashedId}) ──
export async function loadProgress(hashedId) {
  try {
    await ensureSignedIn();
    const snap = await getDoc(doc(db, 'students', hashedId));
    const data = snap.exists() ? snap.data() : null;
    if (data) cacheProgress(hashedId, data);
    return data || loadCachedProgress(hashedId);
  } catch (e) {
    console.warn('loadProgress failed:', e);
    return loadCachedProgress(hashedId);
  }
}

export async function saveProgress(hashedId, progress) {
  const cached = {
    ...progress,
    hashedId,
    lastSeen: Date.now(),
  };
  cacheProgress(hashedId, cached);
  try {
    const user = await ensureSignedIn();
    await setDoc(doc(db, 'students', hashedId), { ...cached, ownerUid: user.uid }, { merge: true });
    return { ok: true };
  } catch (e) {
    console.warn('saveProgress failed:', e);
    return { ok: false, error: e.message || 'Progress saved on this device only.' };
  }
}

export async function deleteProgress(hashedId) {
  clearCachedProgress(hashedId);
  try {
    await ensureSignedIn();
    await deleteDoc(doc(db, 'students', hashedId));
    return { ok: true };
  } catch (e) {
    console.warn('deleteProgress failed:', e);
    return { ok: false, error: e.message || 'Could not delete cloud progress.' };
  }
}

// ── Roster summaries (Firestore: roster/{hashedId}) ──
export async function saveRoster(hashedId, summary) {
  try {
    const user = await ensureSignedIn();
    await setDoc(doc(db, 'roster', hashedId), {
      name: summary.name,
      hashedId,
      ownerUid: user.uid,
      xp: summary.xp,
      level: summary.level,
      levelName: summary.levelName,
      badgeCount: summary.badgeCount,
      tabsDone: summary.tabsDone,
      seminarTabs: summary.seminarTabs || {},
      bestStreak: summary.bestStreak,
      lastSeen: summary.lastSeen,
    }, { merge: true });
    return { ok: true };
  } catch (e) {
    console.warn('saveRoster failed:', e);
    return { ok: false, error: e.message || 'Leaderboard update failed.' };
  }
}

export async function loadAllRoster() {
  try {
    await ensureSignedIn();
    const snap = await getDocs(collection(db, 'roster'));
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.warn('loadAllRoster failed:', e);
    return [];
  }
}

export async function deleteRoster(hashedId) {
  try {
    await ensureSignedIn();
    await deleteDoc(doc(db, 'roster', hashedId));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message || 'Could not delete leaderboard row.' };
  }
}

// ── Instructor detail (Firestore: detail/{hashedId}) ──
export async function saveDetail(hashedId, detail) {
  try {
    const user = await ensureSignedIn();
    await setDoc(doc(db, 'detail', hashedId), { ...detail, hashedId, ownerUid: user.uid }, { merge: true });
    return { ok: true };
  } catch (e) {
    console.warn('saveDetail failed:', e);
    return { ok: false, error: e.message || 'Instructor detail update failed.' };
  }
}

export async function loadDetail(hashedId) {
  try {
    if (!(await currentUserIsInstructor())) throw new Error('Instructor access requires an account with the instructor claim.');
    const snap = await getDoc(doc(db, 'detail', hashedId));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn('loadDetail failed:', e);
    return null;
  }
}

export async function loadAllDetail() {
  try {
    if (!(await currentUserIsInstructor())) throw new Error('Instructor access requires an account with the instructor claim.');
    const snap = await getDocs(collection(db, 'detail'));
    return Object.fromEntries(snap.docs.map(d => [d.id, d.data()]));
  } catch (e) {
    console.warn('loadAllDetail failed:', e);
    return {};
  }
}

export async function deleteDetail(hashedId) {
  try {
    await ensureSignedIn();
    await deleteDoc(doc(db, 'detail', hashedId));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message || 'Could not delete instructor detail.' };
  }
}

// ── Validation ──
// Article reservation claims (Firestore: articleClaims/{claimKey})
function normalizeDoi(doi = '') {
  return doi
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^doi:\s*/, '')
    .replace(/\s+/g, '');
}

function normalizeArticleTitle(title = '') {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hashClaimKey(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function makeArticleClaimKey({ doi, title, journal, year }) {
  const normalizedDoi = normalizeDoi(doi);
  if (normalizedDoi) return `doi-${hashClaimKey(normalizedDoi)}`;
  const normalizedTitle = normalizeArticleTitle(title);
  const normalizedJournal = normalizeArticleTitle(journal);
  const normalizedYear = String(year || '').trim();
  return `title-${hashClaimKey(`${normalizedTitle}|${normalizedJournal}|${normalizedYear}`)}`;
}

export async function loadArticleClaims() {
  try {
    await ensureSignedIn();
    const snap = await getDocs(collection(db, 'articleClaims'));
    return snap.docs.map(d => d.data()).sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
  } catch (e) {
    console.warn('loadArticleClaims failed:', e);
    try {
      return JSON.parse(localStorage.getItem('acc3018:articleClaims') || '[]');
    } catch {
      return [];
    }
  }
}

export async function submitArticleClaim(claim) {
  const claimKey = makeArticleClaimKey(claim);
  const normalizedDoi = normalizeDoi(claim.doi);
  const normalizedTitle = normalizeArticleTitle(claim.title);
  const now = Date.now();
  try {
    const user = await ensureSignedIn();
    const ref = doc(db, 'articleClaims', claimKey);
    return await runTransaction(db, async tx => {
      const existing = await tx.get(ref);
      if (existing.exists() && existing.data().ownerUid !== user.uid) {
        return { ok: false, duplicate: true, claim: existing.data() };
      }
      const saved = {
        ...claim,
        claimKey,
        normalizedDoi,
        normalizedTitle,
        ownerUid: user.uid,
        status: existing.exists() ? existing.data().status || 'reserved' : 'reserved',
        submittedAt: existing.exists() ? existing.data().submittedAt || now : now,
        updatedAt: now,
      };
      tx.set(ref, saved, { merge: true });
      return { ok: true, claim: saved, updated: existing.exists() };
    });
  } catch (e) {
    console.warn('submitArticleClaim failed:', e);
    return { ok: false, error: e.message || 'Article claim could not be saved.' };
  }
}

export function validateStudentId(id) {
  const trimmed = (id || '').trim();
  if (trimmed.length < 6) return 'Student ID must be at least 6 characters';
  if (trimmed.length > 20) return 'Student ID too long';
  if (!/^[A-Za-z0-9]+$/.test(trimmed)) return 'Letters and numbers only';
  return null;
}

export function validateName(n) {
  const trimmed = (n || '').trim();
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 60) return 'Name too long';
  return null;
}
