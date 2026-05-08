import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const outPath = path.resolve('ACC3018-staged-activities-rubric.pdf');
const A4 = [595.28, 841.89];
const margin = 42;
const colors = {
  ink: rgb(0.114, 0.114, 0.106),
  muted: rgb(0.29, 0.29, 0.282),
  line: rgb(0.91, 0.91, 0.9),
  pale: rgb(0.957, 0.957, 0.953),
  white: rgb(1, 1, 1),
  red: rgb(0.894, 0, 0.169),
  redPale: rgb(1, 0.94, 0.953),
  blue: rgb(0.102, 0.373, 0.627),
  green: rgb(0.102, 0.498, 0.294),
  orange: rgb(0.902, 0.467, 0),
  purple: rgb(0.435, 0.247, 0.655),
};

const pdf = await PDFDocument.create();
const fonts = {
  regular: await pdf.embedFont(StandardFonts.Helvetica),
  bold: await pdf.embedFont(StandardFonts.HelveticaBold),
};

let page;
let y;

function addPage() {
  page = pdf.addPage(A4);
  y = A4[1] - margin;
  return page;
}

function ensureSpace(height) {
  if (y - height < margin) addPage();
}

function drawText(text, x, yPos, options = {}) {
  page.drawText(text, {
    x,
    y: yPos,
    size: options.size ?? 10,
    font: options.bold ? fonts.bold : fonts.regular,
    color: options.color ?? colors.ink,
    lineHeight: options.lineHeight,
  });
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(text, x, maxWidth, options = {}) {
  const size = options.size ?? 10;
  const font = options.bold ? fonts.bold : fonts.regular;
  const lineHeight = options.lineHeight ?? size * 1.38;
  const lines = wrapText(text, font, size, maxWidth);
  ensureSpace(lines.length * lineHeight + 6);
  for (const line of lines) {
    y -= lineHeight;
    drawText(line, x, y, { ...options, size });
  }
  y -= options.after ?? 5;
}

function label(text) {
  ensureSpace(42);
  drawText(text.toUpperCase(), margin, y, {
    size: 8.5,
    bold: true,
    color: colors.red,
  });
  y -= 21;
}

function heading(text) {
  drawText(text, margin, y, { size: 20, bold: true, color: colors.ink });
  y -= 8;
}

function note(text) {
  const boxHeight = 48;
  ensureSpace(boxHeight + 12);
  page.drawRectangle({
    x: margin,
    y: y - boxHeight,
    width: A4[0] - margin * 2,
    height: boxHeight,
    color: colors.redPale,
  });
  page.drawRectangle({
    x: margin,
    y: y - boxHeight,
    width: 6,
    height: boxHeight,
    color: colors.red,
  });
  const lines = wrapText(text, fonts.regular, 10, A4[0] - margin * 2 - 28);
  let lineY = y - 17;
  for (const line of lines) {
    drawText(line, margin + 16, lineY, { size: 10, color: colors.muted });
    lineY -= 14;
  }
  y -= boxHeight + 18;
}

function cover() {
  page = pdf.addPage(A4);
  page.drawRectangle({ x: 0, y: 0, width: A4[0], height: A4[1], color: colors.ink });
  page.drawRectangle({ x: 0, y: A4[1] - 12, width: A4[0], height: 12, color: colors.red });
  page.drawCircle({ x: A4[0] + 30, y: A4[1] + 15, size: 155, color: rgb(0.23, 0.04, 0.07) });

  drawText('ACC3018 APPLIED ANALYTICS CAPSTONE', 58, 705, {
    size: 10,
    bold: true,
    color: colors.red,
  });
  drawText('Staged Seminar', 58, 645, { size: 38, bold: true, color: colors.white });
  drawText('Activities Rubric', 58, 604, { size: 38, bold: true, color: colors.white });
  paragraphAt(
    'Rubric for the linked group activities across Seminars 1 to 5: paper pool, results presentation, dataset download attempt, and Stata main-results attempt.',
    58,
    542,
    440,
    { size: 13, color: rgb(0.78, 0.78, 0.76), lineHeight: 19 },
  );

  const cards = [
    ['Not a full replication assignment', 'The goal is progressive research skill-building, not perfect reproduction of a published paper.'],
    ['Group submission logic', 'Individual paper work begins in Seminar 1, then the group builds shared outputs across later seminars.'],
    ['Evidence matters', 'Students should show what they tried, what worked, what failed, and why.'],
    ['Undergraduate-friendly', 'Marks reward clear interpretation, careful documentation, and honest reflection.'],
  ];
  let cx = 58;
  let cy = 420;
  for (let i = 0; i < cards.length; i += 1) {
    if (i === 2) {
      cx = 58;
      cy -= 92;
    }
    card(cx, cy, 218, 68, cards[i][0], cards[i][1], true);
    cx += 236;
  }

  page.drawLine({
    start: { x: 58, y: 80 },
    end: { x: A4[0] - 58, y: 80 },
    thickness: 0.6,
    color: rgb(0.28, 0.28, 0.27),
  });
  drawText('SIT | ACC3018', 58, 55, { size: 9.5, color: rgb(0.62, 0.62, 0.6) });
  drawText('Assessment rubric handout', 385, 55, { size: 9.5, color: rgb(0.62, 0.62, 0.6) });
}

function paragraphAt(text, x, startY, maxWidth, options = {}) {
  const size = options.size ?? 10;
  const font = options.bold ? fonts.bold : fonts.regular;
  const lineHeight = options.lineHeight ?? size * 1.35;
  let localY = startY;
  for (const line of wrapText(text, font, size, maxWidth)) {
    drawText(line, x, localY, options);
    localY -= lineHeight;
  }
}

function card(x, topY, width, height, title, body, dark = false, accent = colors.red) {
  page.drawRectangle({
    x,
    y: topY - height,
    width,
    height,
    color: dark ? rgb(0.16, 0.16, 0.15) : colors.white,
    borderColor: dark ? rgb(0.31, 0.31, 0.3) : colors.line,
    borderWidth: 0.8,
  });
  page.drawRectangle({ x, y: topY - height, width: 7, height, color: accent });
  drawText(title, x + 16, topY - 21, {
    size: 10.5,
    bold: true,
    color: dark ? colors.white : colors.ink,
  });
  paragraphAt(body, x + 16, topY - 39, width - 28, {
    size: 9,
    color: dark ? rgb(0.73, 0.73, 0.71) : colors.muted,
    lineHeight: 12.5,
  });
}

function summaryBoxes() {
  const items = [
    ['20%', 'Seminar 1', 'Group paper pool', colors.red],
    ['30%', 'Seminars 2-3', 'Results presentation', colors.blue],
    ['20%', 'Seminar 4', 'Dataset download', colors.green],
    ['20%', 'Seminar 5', 'Stata attempt', colors.orange],
    ['10%', 'Professionalism', 'and reflection', colors.purple],
  ];
  const gap = 8;
  const width = (A4[0] - margin * 2 - gap * 4) / 5;
  const height = 76;
  ensureSpace(height + 16);
  let x = margin;
  for (const [pct, line1, line2, accent] of items) {
    page.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      color: colors.pale,
      borderColor: colors.line,
      borderWidth: 0.7,
    });
    page.drawRectangle({ x, y: y - height, width: 6, height, color: accent });
    drawText(pct, x + 14, y - 24, { size: 16, bold: true, color: accent });
    drawText(line1, x + 14, y - 47, { size: 8.8, bold: true, color: colors.ink });
    drawText(line2, x + 14, y - 60, { size: 8.8, bold: true, color: colors.ink });
    x += width + gap;
  }
  y -= height + 18;
}

function drawTable(columns, rows, options = {}) {
  const tableWidth = A4[0] - margin * 2;
  const colWidths = options.widths.map((w) => tableWidth * w);
  const fontSize = options.fontSize ?? 8.2;
  const headerHeight = 30;
  const cellPad = 7;

  function drawHeader() {
    ensureSpace(headerHeight + 20);
    let x = margin;
    for (let i = 0; i < columns.length; i += 1) {
      page.drawRectangle({
        x,
        y: y - headerHeight,
        width: colWidths[i],
        height: headerHeight,
        color: colors.ink,
        borderColor: colors.ink,
        borderWidth: 0.6,
      });
      paragraphAt(columns[i], x + cellPad, y - 12, colWidths[i] - cellPad * 2, {
        size: 8.4,
        bold: true,
        color: colors.white,
        lineHeight: 11,
      });
      x += colWidths[i];
    }
    y -= headerHeight;
  }

  drawHeader();
  for (const row of rows) {
    const lineSets = row.map((cell, i) => {
      const font = cell.bold ? fonts.bold : fonts.regular;
      return wrapText(cell.text, font, fontSize, colWidths[i] - cellPad * 2);
    });
    const rowHeight = Math.max(
      42,
      ...lineSets.map((lines) => lines.length * (fontSize * 1.3) + cellPad * 2),
    );
    if (y - rowHeight < margin) {
      addPage();
      drawHeader();
    }
    let x = margin;
    for (let i = 0; i < row.length; i += 1) {
      page.drawRectangle({
        x,
        y: y - rowHeight,
        width: colWidths[i],
        height: rowHeight,
        color: colors.white,
        borderColor: colors.line,
        borderWidth: 0.6,
      });
      let textY = y - cellPad - fontSize;
      for (const line of lineSets[i]) {
        drawText(line, x + cellPad, textY, {
          size: fontSize,
          bold: row[i].bold,
          color: row[i].color ?? colors.muted,
        });
        textY -= fontSize * 1.3;
      }
      x += colWidths[i];
    }
    y -= rowHeight;
  }
  y -= 18;
}

function evidenceCards() {
  const items = [
    ['Seminar 1 Evidence', ['Group cover page with members and selected papers.', 'One individual response per student.', 'PDF copies of all selected papers.'], colors.blue],
    ['Seminars 2-3 Evidence', ['Presentation slides on the paper results section.', 'Slide(s) explaining key variables and coefficients.', 'Slide(s) explaining endogeneity and identification.'], colors.green],
    ['Seminar 4 Evidence', ['Dataset source and database path.', 'Query choices, selected variables and sample period.', 'Downloaded data or notes explaining why download was partial or blocked.'], colors.orange],
    ['Seminar 5 Evidence', ['Raw file and working Stata dataset where available.', 'Do-file or command log.', 'Summary statistics, correlations and attempted main results table.'], colors.purple],
  ];
  const gap = 12;
  const width = (A4[0] - margin * 2 - gap) / 2;
  const height = 112;
  ensureSpace(height * 2 + gap + 20);
  let x = margin;
  let top = y;
  for (let i = 0; i < items.length; i += 1) {
    if (i === 2) {
      x = margin;
      top -= height + gap;
    }
    const [title, bullets, accent] = items[i];
    page.drawRectangle({
      x,
      y: top - height,
      width,
      height,
      color: colors.white,
      borderColor: colors.line,
      borderWidth: 0.7,
    });
    page.drawRectangle({ x, y: top - height, width: 7, height, color: accent });
    drawText(title, x + 16, top - 21, { size: 11, bold: true, color: colors.ink });
    let by = top - 43;
    for (const bullet of bullets) {
      drawText('•', x + 16, by, { size: 10, bold: true, color: accent });
      for (const line of wrapText(bullet, fonts.regular, 9.2, width - 42)) {
        drawText(line, x + 29, by, { size: 9.2, color: colors.muted });
        by -= 12.5;
      }
      by -= 4;
    }
    x += width + gap;
  }
  y = top - height * 2 - gap - 22;
}

cover();
addPage();

label('Overview');
heading('Rubric Structure');
paragraph(
  'This rubric assesses the staged seminar activities as one connected portfolio. Students begin by building a group paper pool, then practise reading results, identifying data, and attempting Stata analysis.',
  margin,
  A4[0] - margin * 2,
  { size: 11, color: colors.muted, lineHeight: 15.5, after: 10 },
);
summaryBoxes();
note(
  'Marking principle: students should not be penalised simply because a dataset is difficult to access or a paper cannot be fully reproduced. They should be assessed on clarity, effort, documentation, interpretation, and honest explanation of limitations.',
);

label('Detailed Criteria');
heading('Performance Rubric');
drawTable(
  ['Criterion', 'Weight', 'Excellent', 'Good / Satisfactory', 'Developing / Needs Work'],
  [
    [
      { text: 'Seminar 1: Group paper pool. Individual paper walkthroughs and group collation.', bold: true, color: colors.ink },
      { text: '20%', bold: true, color: colors.red },
      { text: 'Each member selects a clearly relevant and different empirical paper. Responses accurately identify abstract, keywords, literature, gap, hypotheses, design, variables and limitations. PDFs and cover page are complete.' },
      { text: 'Most papers are suitable and different. Responses cover the main required items, though some discussion may be brief or descriptive. PDFs are mostly complete.' },
      { text: 'Papers overlap, are unsuitable, or are weakly connected to the course. Responses are incomplete, mostly copied, or missing key items. PDFs or group collation are incomplete.' },
    ],
    [
      { text: 'Seminars 2-3: Results presentation. Reading tables using methods and identification concepts.', bold: true, color: colors.ink },
      { text: '30%', bold: true, color: colors.red },
      { text: 'Presentation clearly explains Y, X, controls, sample, model, summary statistics, correlations and main coefficients. It gives a strong endogeneity/identification discussion and explains why results are credible or vulnerable.' },
      { text: 'Presentation identifies the main variables and results with reasonable accuracy. It discusses some endogeneity or design concerns, but may not fully connect them to the paper strongest result.' },
      { text: 'Presentation summarises the paper without explaining the results table. Key variables or coefficients are unclear. Endogeneity discussion is missing, generic, or inaccurate.' },
    ],
    [
      { text: 'Seminar 4: Dataset download attempt. Moving from paper data description to database query.', bold: true, color: colors.ink },
      { text: '20%', bold: true, color: colors.red },
      { text: 'Group clearly identifies the dataset, source, table/file, sample period, identifiers and variables. Download attempt is well documented with query choices, screenshots or notes, and a clear account of access/data limitations.' },
      { text: 'Group identifies a plausible dataset and attempts a download. Documentation covers the main choices, but some details about variables, sample rules or limitations are thin.' },
      { text: 'Dataset source is unclear or not linked to the paper. Download attempt is poorly documented, or limitations are not explained.' },
    ],
    [
      { text: 'Seminar 5: Stata main-results attempt. Using data to attempt the paper main result.', bold: true, color: colors.ink },
      { text: '20%', bold: true, color: colors.red },
      { text: 'Do-file and outputs show a clear Stata workflow: preserving raw data, cleaning, constructing variables, summary statistics, correlations, and the closest feasible model. Differences from the paper are explained thoughtfully.' },
      { text: 'Stata attempt produces some useful outputs and a reasonable model attempt. Workflow is understandable, though variable construction or documentation may be incomplete.' },
      { text: 'Stata work is minimal, not reproducible, or disconnected from the paper. Outputs are pasted without explanation, or the group does not explain what could not be reproduced.' },
    ],
    [
      { text: 'Professionalism, integrity and reflection. Organisation, honesty and research practice.', bold: true, color: colors.ink },
      { text: '10%', bold: true, color: colors.red },
      { text: 'Submission is well organised, properly cited, clearly written and honest about failed attempts. Reflection shows what the group learned about empirical research, data and methods.' },
      { text: 'Submission is generally clear and complete. Citations and organisation are acceptable. Reflection identifies some learning points but may be brief.' },
      { text: 'Submission is disorganised, missing citations or unclear about individual/group contributions. Reflection is superficial or hides problems.' },
    ],
  ],
  { widths: [0.19, 0.09, 0.24, 0.24, 0.24], fontSize: 7.7 },
);

addPage();
label('Submission Evidence');
heading('What Students Should Submit or Keep');
paragraph(
  'The portfolio should show the development of the group project across the seminars. The exact LMS submission structure can be adjusted, but students should preserve the following evidence.',
  margin,
  A4[0] - margin * 2,
  { size: 11, color: colors.muted, lineHeight: 15.5, after: 14 },
);
evidenceCards();

label('Instructor Notes');
heading('Suggested Grading Interpretation');
drawTable(
  ['Score Range', 'Interpretation', 'Typical Evidence'],
  [
    [
      { text: '85-100', bold: true, color: colors.ink },
      { text: 'Excellent staged research portfolio.' },
      { text: 'Clear paper reading, strong results interpretation, careful data attempt, reproducible Stata workflow, thoughtful limitations.' },
    ],
    [
      { text: '70-84', bold: true, color: colors.ink },
      { text: 'Good and mostly complete portfolio.' },
      { text: 'Main tasks completed with reasonable accuracy; some parts may be less detailed but the research logic is visible.' },
    ],
    [
      { text: '55-69', bold: true, color: colors.ink },
      { text: 'Developing but acceptable attempt.' },
      { text: 'Some seminar stages are incomplete or descriptive, but the group shows meaningful effort and basic understanding.' },
    ],
    [
      { text: 'Below 55', bold: true, color: colors.ink },
      { text: 'Incomplete or weak attempt.' },
      { text: 'Missing key evidence, weak link to the selected paper, little interpretation, or poor documentation of data/Stata work.' },
    ],
  ],
  { widths: [0.18, 0.28, 0.54], fontSize: 8.8 },
);

fs.writeFileSync(outPath, await pdf.save());
console.log(`PDF written to ${outPath}`);
