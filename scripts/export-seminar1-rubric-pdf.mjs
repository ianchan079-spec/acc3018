import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const outPath = path.resolve('ACC3018-seminar1-activity-rubric.pdf');
const A4 = [595.28, 841.89];
const margin = 42;

const colors = {
  ink: rgb(0.114, 0.114, 0.106),
  muted: rgb(0.29, 0.29, 0.282),
  pale: rgb(0.957, 0.957, 0.953),
  line: rgb(0.91, 0.91, 0.9),
  white: rgb(1, 1, 1),
  red: rgb(0.894, 0, 0.169),
  redPale: rgb(1, 0.94, 0.953),
  blue: rgb(0.102, 0.373, 0.627),
  green: rgb(0.102, 0.498, 0.294),
  orange: rgb(0.902, 0.467, 0),
};

const pdf = await PDFDocument.create();
const fonts = {
  regular: await pdf.embedFont(StandardFonts.Helvetica),
  bold: await pdf.embedFont(StandardFonts.HelveticaBold),
};

let page = pdf.addPage(A4);
let y = A4[1] - margin;

function addPage() {
  page = pdf.addPage(A4);
  y = A4[1] - margin;
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
  ensureSpace(lines.length * lineHeight + 8);
  for (const line of lines) {
    y -= lineHeight;
    drawText(line, x, y, { ...options, size });
  }
  y -= options.after ?? 6;
}

function heading(text, size = 20) {
  ensureSpace(32);
  drawText(text, margin, y, { size, bold: true, color: colors.ink });
  y -= size + 5;
}

function label(text) {
  ensureSpace(28);
  drawText(text.toUpperCase(), margin, y, {
    size: 8.5,
    bold: true,
    color: colors.red,
  });
  y -= 19;
}

function note(title, text) {
  const width = A4[0] - margin * 2;
  const lines = wrapText(text, fonts.regular, 9.7, width - 30);
  const height = 34 + lines.length * 13;
  ensureSpace(height + 12);
  page.drawRectangle({
    x: margin,
    y: y - height,
    width,
    height,
    color: colors.redPale,
  });
  page.drawRectangle({ x: margin, y: y - height, width: 7, height, color: colors.red });
  drawText(title, margin + 16, y - 18, { size: 10.5, bold: true, color: colors.ink });
  let lineY = y - 36;
  for (const line of lines) {
    drawText(line, margin + 16, lineY, { size: 9.7, color: colors.muted });
    lineY -= 13;
  }
  y -= height + 16;
}

function summaryBox(x, topY, width, title, body, accent) {
  const height = 82;
  page.drawRectangle({
    x,
    y: topY - height,
    width,
    height,
    color: colors.pale,
    borderColor: colors.line,
    borderWidth: 0.7,
  });
  page.drawRectangle({ x, y: topY - height, width: 7, height, color: accent });
  drawText(title, x + 16, topY - 22, { size: 11, bold: true, color: colors.ink });
  let by = topY - 42;
  for (const line of wrapText(body, fonts.regular, 9.2, width - 30)) {
    drawText(line, x + 16, by, { size: 9.2, color: colors.muted });
    by -= 12.5;
  }
}

function table(columns, rows, widths, fontSize = 8.1) {
  const tableWidth = A4[0] - margin * 2;
  const colWidths = widths.map((width) => tableWidth * width);
  const cellPad = 7;
  const headerHeight = 29;

  function header() {
    ensureSpace(headerHeight + 18);
    let x = margin;
    for (let i = 0; i < columns.length; i += 1) {
      page.drawRectangle({
        x,
        y: y - headerHeight,
        width: colWidths[i],
        height: headerHeight,
        color: colors.ink,
      });
      for (const line of wrapText(columns[i], fonts.bold, 8.5, colWidths[i] - cellPad * 2)) {
        drawText(line, x + cellPad, y - 12, { size: 8.5, bold: true, color: colors.white });
      }
      x += colWidths[i];
    }
    y -= headerHeight;
  }

  header();
  for (const row of rows) {
    const lineSets = row.map((cell, i) => {
      const font = cell.bold ? fonts.bold : fonts.regular;
      return wrapText(cell.text, font, fontSize, colWidths[i] - cellPad * 2);
    });
    const rowHeight = Math.max(44, ...lineSets.map((lines) => lines.length * (fontSize * 1.32) + cellPad * 2));
    if (y - rowHeight < margin) {
      addPage();
      header();
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
        textY -= fontSize * 1.32;
      }
      x += colWidths[i];
    }
    y -= rowHeight;
  }
  y -= 16;
}

function bullets(items, x, maxWidth, accent = colors.red) {
  for (const item of items) {
    ensureSpace(24);
    drawText('•', x, y - 11, { size: 10, bold: true, color: accent });
    let lineY = y - 11;
    for (const line of wrapText(item, fonts.regular, 9.7, maxWidth - 18)) {
      drawText(line, x + 16, lineY, { size: 9.7, color: colors.muted });
      lineY -= 13.2;
    }
    y = lineY - 3;
  }
}

page.drawRectangle({ x: 0, y: A4[1] - 12, width: A4[0], height: 12, color: colors.red });
drawText('ACC3018 APPLIED ANALYTICS CAPSTONE', margin, 775, {
  size: 9.5,
  bold: true,
  color: colors.red,
});
drawText('Seminar 1 Activity Rubric', margin, 733, { size: 30, bold: true, color: colors.ink });
paragraph(
  'Group Paper Pool and Individual Paper Walkthrough. This rubric assesses the Seminar 1 activity only. Later seminar rubrics can be drafted separately.',
  margin,
  A4[0] - margin * 2,
  { size: 12.2, color: colors.muted, lineHeight: 17, after: 12 },
);

note(
  'Activity purpose',
  'Students form groups, then each student individually chooses a different empirical paper and completes the walkthrough. The group submits one collated package with all individual responses and PDF copies of all selected papers.',
);

const boxGap = 10;
const boxWidth = (A4[0] - margin * 2 - boxGap * 2) / 3;
summaryBox(margin, y, boxWidth, 'Individual work', 'Each student contributes one paper walkthrough of about one page.', colors.blue);
summaryBox(margin + boxWidth + boxGap, y, boxWidth, 'Group submission', 'The group collates all responses and attaches all paper PDFs.', colors.green);
summaryBox(margin + (boxWidth + boxGap) * 2, y, boxWidth, 'Research practice', 'Marks reward careful reading, honest interpretation and clear organisation.', colors.orange);
y -= 104;

label('Marking Breakdown');
heading('Seminar 1 Rubric', 18);
table(
  ['Criterion', 'Weight', 'Excellent', 'Good / Satisfactory', 'Developing / Needs Work'],
  [
    [
      { text: 'Paper selection and fit', bold: true, color: colors.ink },
      { text: '20%', bold: true, color: colors.red },
      { text: 'Each student selects a different, suitable empirical paper from the approved journal list. The paper has a clear research question, data, method and results section.' },
      { text: 'Papers are mostly suitable and different, though one or two choices may be less clearly empirical or less connected to the course.' },
      { text: 'Papers overlap within the group, are not from approved journals, are not empirical, or are difficult to use for the walkthrough.' },
    ],
    [
      { text: 'Individual paper walkthrough', bold: true, color: colors.ink },
      { text: '35%', bold: true, color: colors.red },
      { text: 'Responses clearly identify the abstract, keywords, literature area, research gap, hypotheses or predictions, research design, key variables and limitations in the student own words.' },
      { text: 'Responses cover most required items, but some explanations are brief, descriptive, or not fully connected to the paper research question.' },
      { text: 'Responses are incomplete, mostly copied from the paper, or miss major parts such as hypotheses, variables, design or limitations.' },
    ],
    [
      { text: 'Use of evidence from the paper', bold: true, color: colors.ink },
      { text: '15%', bold: true, color: colors.red },
      { text: 'Student points to specific parts of the paper, such as the abstract, introduction, hypotheses section, method section or tables, to support the walkthrough.' },
      { text: 'Student refers to some parts of the paper, but evidence may be general or not always clearly linked to the response.' },
      { text: 'Response makes claims about the paper without showing where the information came from.' },
    ],
    [
      { text: 'Group collation and completeness', bold: true, color: colors.ink },
      { text: '15%', bold: true, color: colors.red },
      { text: 'Group package is complete, organised and easy to follow. It includes a cover page, all individual responses, and PDF copies of every selected paper.' },
      { text: 'Group package is mostly complete, but organisation could be clearer or one minor item may be missing.' },
      { text: 'Submission is hard to follow, missing several responses or PDFs, or does not clearly show which student completed which paper.' },
    ],
    [
      { text: 'Clarity, academic integrity and reflection', bold: true, color: colors.ink },
      { text: '15%', bold: true, color: colors.red },
      { text: 'Writing is clear and concise. Sources are cited properly. The group is honest about uncertainty and shows what members learned about reading empirical research.' },
      { text: 'Writing is generally understandable and sources are mostly clear. Reflection is present but may be brief.' },
      { text: 'Writing is unclear, citations are weak, or the response appears copied without proper acknowledgement.' },
    ],
  ],
  [0.18, 0.09, 0.245, 0.245, 0.24],
  7.45,
);

label('Submission Checklist');
heading('What To Submit', 18);
bullets(
  [
    'A group cover page listing group members and the paper selected by each student.',
    'One individual walkthrough response per student, about one page each.',
    'PDF copies of all selected papers.',
    'A short note if any member had difficulty finding a suitable paper or interpreting part of the paper.',
  ],
  margin,
  A4[0] - margin * 2,
  colors.red,
);

label('Marker Note');
heading('How To Read The Mark', 18);
paragraph(
  'This activity is mainly about learning how to take apart an empirical paper. A strong submission does not need to be perfect. It should show that students can locate the important parts of a paper, explain them simply, and organise the group evidence responsibly.',
  margin,
  A4[0] - margin * 2,
  { size: 10.4, color: colors.muted, lineHeight: 14.5 },
);

fs.writeFileSync(outPath, await pdf.save());
console.log(`PDF written to ${outPath}`);
