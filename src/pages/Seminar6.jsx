import { useEffect, useMemo, useState } from 'react';
import { C } from '../shared/theme';
import { useGame } from '../shared/GameProvider';
import {
  GlobalStyles, Reveal, Label, H, P, Wrap, DarkWrap, Callout, Card, Btn,
  Li, NextBtn, NextBtnDark, TopNav, ProgressWidget,
} from '../shared/components';
import {
  loadArticleClaims, makeArticleClaimKey, submitArticleClaim,
} from '../shared/storage';

const TABS = [
  { id: 's6:overview', label: 'Overview' },
  { id: 's6:paper', label: 'Choose Paper' },
  { id: 's6:claim', label: 'Reserve Article' },
  { id: 's6:brief', label: 'Report Brief' },
];

const JOURNALS = [
  { code: 'TAR', name: 'The Accounting Review' },
  { code: 'JAE', name: 'Journal of Accounting and Economics' },
  { code: 'JAR', name: 'Journal of Accounting Research' },
  { code: 'CAR', name: 'Contemporary Accounting Research' },
  { code: 'AOS', name: 'Accounting, Organizations and Society' },
  { code: 'AH', name: 'Accounting Horizons' },
  { code: 'AJPT', name: 'Auditing: A Journal of Practice & Theory' },
  { code: 'JF', name: 'Journal of Finance' },
  { code: 'JFE', name: 'Journal of Financial Economics' },
  { code: 'RFS', name: 'Review of Financial Studies' },
  { code: 'JFQA', name: 'Journal of Financial and Quantitative Analysis' },
  { code: 'RF', name: 'Review of Finance' },
];

const emptyForm = {
  lmsGroup: '',
  contactName: '',
  articleTitle: '',
  journal: '',
  year: '',
  doi: '',
  url: '',
  replicateTarget: '',
  newVariable: '',
  newVariableReason: '',
};

const text = { fontSize: 13.5, color: C.black80, lineHeight: 1.6 };
const panel = (accent = C.red) => ({
  background: C.white,
  border: `1px solid ${C.black10}`,
  borderLeft: `4px solid ${accent}`,
  borderRadius: 8,
  padding: 16,
});
const inputStyle = {
  width: '100%',
  border: `1.5px solid ${C.black20}`,
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
  fontFamily: "'Source Sans 3',sans-serif",
  color: C.black,
  background: C.white,
};

function Field({ label, hint, children }) {
  return <label style={{ display: 'block' }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: C.black, marginBottom: 5 }}>{label}</div>
    {children}
    {hint && <div style={{ fontSize: 12, color: C.black60, lineHeight: 1.45, marginTop: 4 }}>{hint}</div>}
  </label>;
}

function statusStyle(status) {
  if (status === 'approved') return { color: C.green, bg: C.greenBg, label: 'Approved' };
  if (status === 'rejected') return { color: C.red, bg: C.redSubtle, label: 'Rejected' };
  return { color: C.amber, bg: C.amberBg, label: 'Reserved' };
}

function cleanText(value = '') {
  return value.trim().toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function Seminar6() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const jump = id => { setActiveTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <div style={{ fontFamily: "'Source Sans 3','Helvetica Neue',sans-serif", background: C.white, minHeight: '100vh' }}>
    <GlobalStyles />
    <TopNav tabs={TABS} activeTab={activeTab} setActiveTab={jump} />
    <ProgressWidget tabs={TABS} />
    {activeTab === 's6:overview' && <OverviewTab next={() => jump('s6:paper')} />}
    {activeTab === 's6:paper' && <PaperTab next={() => jump('s6:claim')} />}
    {activeTab === 's6:claim' && <ClaimTab next={() => jump('s6:brief')} />}
    {activeTab === 's6:brief' && <BriefTab />}
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
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, marginBottom: 14 }}>ACC3018 | Seminar 6</div>
          <h1 style={{ fontSize: 'clamp(32px,5.5vw,60px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', color: C.white, marginBottom: 14 }}>Mini Group Assignment</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 620, lineHeight: 1.6 }}>Choose a recent top-journal article, replicate one important analysis, then extend it with one meaningful new variable.</p>
        </Reveal>
      </div>
    </div>
    <Wrap bg={C.black05}>
      <Reveal><Label>What You Are Building</Label><H size={30}>Replication plus extension</H><P>This assignment teaches students how published empirical research is put together. Your group is not only copying a table. You are learning how a paper motivates a question, reviews literature, designs a test, reports results and discusses what the evidence means.</P></Reveal>
      <Reveal delay={0.08}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12 }}>
          {[
            ['1', 'LMS Group', 'Form your group in the LMS first.'],
            ['2', 'Choose', 'Pick a feasible paper from the approved journal list.'],
            ['3', 'Reserve', 'Tell the site which LMS group is tied to the article.'],
            ['4', 'Replicate', 'Recreate one important table, model or empirical test.'],
            ['5', 'Discuss', 'Compare your evidence with the original paper and reflect on limitations.'],
          ].map((item, i) => {
            const accent = [C.red, C.blue, C.green, C.amber, C.purple][i];
            return <div key={item[0]} style={panel(accent)}>
            <div style={{ fontSize: 12, fontWeight: 900, color: accent, marginBottom: 5 }}>STEP {item[0]}</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: C.black, marginBottom: 5 }}>{item[1]}</div>
            <div style={text}>{item[2]}</div>
          </div>;
          })}
        </div>
      </Reveal>
      <Reveal delay={0.12}><Callout accent={C.red} bg={C.white}><strong>Important:</strong> form your group in the LMS first. The reservation form will ask for your LMS group so the article can be tied to the correct team.</Callout></Reveal>
      <NextBtn onClick={() => { completeTab('s6:overview'); next(); }} label="Continue to paper selection" />
    </Wrap>
  </div>;
}

function PaperTab({ next }) {
  const { completeTab } = useGame();
  return <div>
    <Wrap py={84}>
      <Reveal><Label>Article Rules</Label><H size={30}>Choose a paper students can actually replicate</H><P>A good article is recent, empirical, published in an approved journal, and clear enough for your group to identify the sample, variables and regression model. Interesting is not enough. It must also be feasible.</P></Reveal>
      <Reveal delay={0.06}>
        <div style={panel(C.blue)}>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.black, marginBottom: 10 }}>Before reserving a paper, check that you can find:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
            {['Dependent variable', 'Main independent variable', 'Control variables', 'Sample period', 'Data source', 'Main regression model', 'A table to replicate', 'Possible new variable'].map(item => <Li key={item} color={C.blue}>{item}</Li>)}
          </div>
        </div>
      </Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label>Approved Journals</Label><H size={28}>Use this list unless your instructor approves otherwise</H></Reveal>
      <Reveal delay={0.06}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
          {JOURNALS.map(j => <div key={j.code} style={panel(C.red)}>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.red }}>{j.code}</div>
            <div style={text}>{j.name}</div>
          </div>)}
        </div>
      </Reveal>
      <NextBtn onClick={() => { completeTab('s6:paper'); next(); }} label="Continue to article reservation" />
    </Wrap>
  </div>;
}

function ClaimTab({ next }) {
  const { completeTab, identity, showToast } = useGame();
  const [form, setForm] = useState(emptyForm);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const update = (key, value) => {
    setMessage(null);
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const claimKey = useMemo(() => makeArticleClaimKey({ title: form.articleTitle, journal: form.journal, year: form.year, doi: form.doi }), [form.articleTitle, form.journal, form.year, form.doi]);
  const duplicate = claims.find(c => c.claimKey === claimKey);
  const titleNearMatch = claims.find(c => c.normalizedTitle && cleanText(form.articleTitle) && c.normalizedTitle === cleanText(form.articleTitle));

  useEffect(() => {
    (async () => {
      setLoading(true);
      setClaims(await loadArticleClaims());
      setLoading(false);
    })();
  }, []);

  const validate = () => {
    if (!form.lmsGroup.trim()) return 'Enter your LMS group name or number.';
    if (!form.contactName.trim()) return 'Enter one contact student for the group.';
    if (!form.articleTitle.trim()) return 'Enter the article title.';
    if (!form.journal) return 'Choose an approved journal.';
    const year = Number(form.year);
    if (!year || year < 2023 || year > 2026) return 'Choose a publication year from 2023 to 2026.';
    if (!form.doi.trim() && !form.url.trim()) return 'Enter either a DOI or article URL.';
    if (!form.replicateTarget.trim()) return 'State which table, model or analysis your group plans to replicate.';
    if (!form.newVariable.trim()) return 'Enter the new variable your group wants to add.';
    if (!form.newVariableReason.trim()) return 'Explain why the new variable is relevant.';
    return null;
  };

  const submit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMessage({ kind: 'error', text: err });
      return;
    }
    if (duplicate) {
      setMessage({ kind: 'error', text: `This article is already reserved by ${duplicate.groupName || 'another group'}. Please choose a different paper.` });
      return;
    }
    setSaving(true);
    const result = await submitArticleClaim({
      lmsGroup: form.lmsGroup.trim(),
      groupName: form.lmsGroup.trim(),
      contactName: form.contactName.trim(),
      studentHash: identity.hashedId || '',
      articleTitle: form.articleTitle.trim(),
      journal: form.journal,
      year: Number(form.year),
      doi: form.doi.trim(),
      url: form.url.trim(),
      replicateTarget: form.replicateTarget.trim(),
      newVariable: form.newVariable.trim(),
      newVariableReason: form.newVariableReason.trim(),
    });
    setSaving(false);
    if (result.duplicate) {
      setMessage({ kind: 'error', text: `This article has already been reserved by ${result.claim.groupName || 'another group'}. Please choose a different paper.` });
      setClaims(await loadArticleClaims());
      return;
    }
    if (!result.ok) {
      setMessage({ kind: 'error', text: result.error || 'The reservation could not be saved.' });
      return;
    }
    setMessage({ kind: 'success', text: result.updated ? 'Your reservation was updated.' : 'Your article is reserved pending instructor approval.' });
    showToast?.('Article reserved', 'xp');
    completeTab('s6:claim', 35);
    setClaims(await loadArticleClaims());
  };

  return <div>
    <Wrap py={84}>
      <Reveal><Label>Reservation System</Label><H size={30}>Reserve your article before another group takes it</H><P>The site checks article claims using DOI first. If there is no DOI, it checks a cleaned version of the title, journal and year. If the paper is already reserved, choose a different article before building your project around it.</P></Reveal>
      <Reveal delay={0.06}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,0.8fr)', gap: 18, alignItems: 'start' }}>
          <Card>
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
                <Field label="LMS group" hint="Use the exact group name or number from the LMS."><input value={form.lmsGroup} onChange={e => update('lmsGroup', e.target.value)} style={inputStyle} placeholder="Group 3" /></Field>
                <Field label="Contact student"><input value={form.contactName} onChange={e => update('contactName', e.target.value)} style={inputStyle} placeholder="Name of one group member" /></Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <Field label="Article title"><input value={form.articleTitle} onChange={e => update('articleTitle', e.target.value)} style={inputStyle} placeholder="Paste the full published article title" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr', gap: 12, marginTop: 12 }}>
                <Field label="Journal">
                  <select value={form.journal} onChange={e => update('journal', e.target.value)} style={inputStyle}>
                    <option value="">Choose journal</option>
                    {JOURNALS.map(j => <option key={j.code} value={`${j.code} - ${j.name}`}>{j.code} - {j.name}</option>)}
                  </select>
                </Field>
                <Field label="Publication year"><input value={form.year} onChange={e => update('year', e.target.value)} style={inputStyle} placeholder="2024" inputMode="numeric" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 12 }}>
                <Field label="DOI" hint="Best for duplicate detection."><input value={form.doi} onChange={e => update('doi', e.target.value)} style={inputStyle} placeholder="10.xxxx/xxxxx" /></Field>
                <Field label="Article URL" hint="Use journal page if DOI is unavailable."><input value={form.url} onChange={e => update('url', e.target.value)} style={inputStyle} placeholder="https://..." /></Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <Field label="What will you replicate?" hint="Example: main regression in Table 4, Model 2."><textarea value={form.replicateTarget} onChange={e => update('replicateTarget', e.target.value)} style={{ ...inputStyle, minHeight: 76, resize: 'vertical' }} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 12 }}>
                <Field label="New variable"><input value={form.newVariable} onChange={e => update('newVariable', e.target.value)} style={inputStyle} placeholder="e.g., ESG score, analyst coverage" /></Field>
                <Field label="Why is it relevant?"><textarea value={form.newVariableReason} onChange={e => update('newVariableReason', e.target.value)} style={{ ...inputStyle, minHeight: 76, resize: 'vertical' }} /></Field>
              </div>

              {(duplicate || titleNearMatch) && (
                <div style={{ ...panel(C.amber), marginTop: 14, background: C.amberBg }}>
                  <strong>{duplicate ? 'Already reserved.' : 'Possible title match.'}</strong> {duplicate ? `This article is held by ${duplicate.groupName || 'another group'}.` : 'Check the existing claims list before submitting.'}
                </div>
              )}
              {message && (
                <div style={{ ...panel(message.kind === 'success' ? C.green : C.red), marginTop: 14, background: message.kind === 'success' ? C.greenBg : C.redSubtle }}>
                  {message.text}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                <Btn disabled={saving}>{saving ? 'Checking...' : 'Reserve article'}</Btn>
                <button type="button" onClick={async () => { setLoading(true); setClaims(await loadArticleClaims()); setLoading(false); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', fontWeight: 800 }}>Refresh claims</button>
              </div>
            </form>
          </Card>

          <div style={panel(C.blue)}>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.black, marginBottom: 8 }}>How the check works</div>
            <Li color={C.blue}>DOI match blocks immediately.</Li>
            <Li color={C.blue}>No DOI means title, journal and year are used.</Li>
            <Li color={C.blue}>Reserved means held for your group, pending instructor approval.</Li>
            <Li color={C.blue}>Instructor can still reject an unsuitable paper later.</Li>
          </div>
        </div>
      </Reveal>
    </Wrap>
    <Wrap bg={C.black05}>
      <Reveal><Label>Existing Claims</Label><H size={28}>Papers already reserved</H><P>Use this list to avoid overlaps. If your group sees the same paper here, choose a different article.</P></Reveal>
      <Reveal delay={0.06}>
        {loading ? <div style={panel(C.black20)}>Loading article claims...</div> : claims.length === 0 ? <div style={panel(C.black20)}>No article has been reserved yet.</div> : (
          <div style={{ display: 'grid', gap: 10 }}>
            {claims.map(claim => {
              const s = statusStyle(claim.status);
              return <div key={claim.claimKey} style={panel(s.color)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: C.black, lineHeight: 1.35 }}>{claim.articleTitle}</div>
                    <div style={{ ...text, marginTop: 4 }}>{claim.journal} | {claim.year} | {claim.groupName}</div>
                    {claim.newVariable && <div style={{ fontSize: 12.5, color: C.black60, marginTop: 5 }}>Extension: {claim.newVariable}</div>}
                  </div>
                  <div style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}`, borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
              </div>;
            })}
          </div>
        )}
      </Reveal>
      <NextBtn onClick={next} label="Continue to report brief" />
    </Wrap>
  </div>;
}

function BriefTab() {
  const { completeTab } = useGame();
  return <div>
    <Wrap py={84}>
      <Reveal><Label>Final Output</Label><H size={30}>What your group submits</H><P>The final assignment should read like a small empirical paper. It should explain the original study, reproduce one important part of the analysis, and show what your new variable adds.</P></Reveal>
      <Reveal delay={0.06}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {[
            ['Introduction', 'What is the paper about, why does it matter, and what is your extension?'],
            ['Literature Review', 'Organise prior research by themes. Do not only summarise one paper at a time.'],
            ['Research Design', 'Explain sample, data, variables, model, controls and expected signs.'],
            ['Results', 'Show descriptive statistics, correlations, replication results and extended results.'],
            ['Discussion', 'Compare with the original paper and explain what your added variable contributes.'],
            ['Appendix', 'Include data and code notes so the work can be checked.'],
          ].map((item, i) => <div key={item[0]} style={panel([C.red, C.blue, C.green, C.amber, C.purple, C.black20][i])}>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.black, marginBottom: 5 }}>{item[0]}</div>
            <div style={text}>{item[1]}</div>
          </div>)}
        </div>
      </Reveal>
    </Wrap>
    <DarkWrap>
      <Reveal><Label color={C.red}>Research Habit</Label><H size={30} color={C.white}>Do not hide difficult replication work</H><P color="rgba(255,255,255,0.55)">If your results differ from the published article, that does not automatically mean your group failed. Explain possible reasons: different sample period, missing data, measurement choices, data cleaning, model specification or access limitations.</P></Reveal>
      <Reveal delay={0.08}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: `4px solid ${C.red}`, borderRadius: 8, padding: 18, color: C.white, lineHeight: 1.65 }}>
          Strong projects show that students understand the research logic, not just the software commands.
        </div>
      </Reveal>
      <NextBtnDark onClick={() => completeTab('s6:brief')} label="Mark assignment brief complete" />
    </DarkWrap>
  </div>;
}
