import fs from 'fs';

// Bull paths from the official vector
const bullBody = "M104.24,56.28c.4.45,1.46-.09,1,1.52l-1.27-.32v.93c3.78,2.27,6.81,4.12,11.43,4.13-5.16,4.44-10.74,1.39-15.22-2.22-.39,1.63,2.33,2.59,2.49,3.57.2,1.21-2.79,2.09-1.25,4.01-4.14-.78-7.41,6.05-8.83,6.67-.58.25-3.5-.34-4.78.98-.22-1.37-2.47-3.04-2.63-3.47-.25-.64.94-4.73.07-4.79-3.26-.08-4.23,3.68-6.43,5.63-.77.68-2.89,2.01-3.85,2.5-.75.38-1.1,1.21-1.75.13-3.12-5.67,3.05-7.31,4.52-11.74l-2.94-5.39c-.82,1.74,1.8,4.52,1.73,5.4-.06.76-3.55,3.34-4.27,4.43-3.05,4.6,1.6,7.6.32,10.46s-4.67,1.42-6.86,2.05c-1.3.37-1.73,2.3-3.31,2.42-.88.07-1.81-.6-2.6-.58-2.35.06-4.88.28-7.22.57-.54-2.28.92-4.81,3.15-5.46,1.78-.51,2.65.39,4.07.32.73-.03,5.93-.33,6.1-.58,1.87-2.92-7.75-2.63-6.35-6.97l-.97,1.94c-4.31-1.01-9.33.43-13.32-.03-3.14-.36-10.41-4.72-12.91-3.1-.35.22-.29,1.71-.87,2.3-2.36,2.42-5.42,2.24-6.68,7.6-.93,3.95.74,2.89,1.41,4,.48.81.16,1.91.46,2.39.49.78,3.84.14,2.05,2.72-1.05.79-5.5.64-5.97-.09-.29-.45.57-1.66.27-2.52-.38-1.08-2.34-3.51-3.43-4.15-.28-1.05,2.15-3.18,2.42-4.56.34-1.76-.74-3.1-.29-4.62.51-1.72,3.15-2.97,3.45-4.88.41-2.57-2.99-5.35-2.98-8.12.02-4.07,7.39-9.96.1-11.61-7.6-1.72-4.79,4.79-8.74,8.13-1.44,1.22-2.91,1.41-4.77,1.25,1.27-2.4,4.03-1.9,5.72-4.11,2.21-2.89.16-6.15,5.69-7.06,4.05-.66,5.83,2.69,7.31,2.7,1.09,0,3.97-2.27,6.37-2.35,2.26-.08,5.09,1.14,7.58,1.32,4.49.33,14.43-.14,18.31-2.04,2.57-1.26,4.78-4.04,7.59-5.1,7.71-2.91,22.73.59,28.07,7.12,1.21,1.47,2.3,4.38,3.13,5.12,1.57,1.38,3.29.86,5.7,3.53Z";
const bullLeg1 = "M42.53,76.7c1.53.82,2.46-.53,4.91,2.39,2.94,3.51-4.64,4-6.94,2.81l.64-2.53c-3.61-.2-2.03-1.74-2.82-3.84-.9-2.38-3.53-4.08-6.07-3.79.47-3.3,4.43-1.8,6.32-.29,1.12.89,3.63,5.06,3.96,5.24Z";
const bullLeg2 = "M79.7,87.47c-1.5,1.43-4.41-.26-6.18-.5-.46-1.39,1.05-2.62,1.14-3.59.06-.72-.84-1.33-.83-1.77.03-2.07-.19-4.88,1.91-5.41l4.41,9.51-.44,1.76Z";
const bullLeg3 = "M56.37,75.56c-2.24-.82-4.76,3.27-5.91,3.09-1.47-.23-3.7-2.61-2.98-4.35,2.69.47,7.21-1.23,8.89,1.26Z";

// Color Logo SVG
const colorLogoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="angelini_official_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 144" width="100%" height="100%">
  <defs>
    <style>
      .t-title {
        font-family: 'Minion Variable Concept', 'Minion Pro', 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 39.14px;
        fill: #02275c;
        letter-spacing: 0em;
      }
      .t-name {
        font-family: 'Minion Variable Concept', 'Minion Pro', 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 79.34px;
        fill: #02275c;
        font-weight: bold;
      }
    </style>
  </defs>

  <!-- Concentric Rings & Red Core -->
  <g>
    <!-- Outer Navy Ring -->
    <circle cx="58.65" cy="58.65" r="57.5" fill="#02275c" />
    <!-- White Middle Ring -->
    <circle cx="58.65" cy="58.65" r="50" fill="#ffffff" />
    <!-- Solid Vibrant Red Core -->
    <circle cx="58.65" cy="58.65" r="44.5" fill="#e3171d" />

    <!-- Bull Contour (Crisp White Outline) -->
    <g>
      <path d="${bullBody}" fill="#02275c" stroke="#ffffff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
      <path d="${bullLeg1}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
      <path d="${bullLeg2}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
      <path d="${bullLeg3}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
    </g>

    <!-- Bull Solid Navy Fill -->
    <g fill="#02275c">
      <path d="${bullBody}" />
      <path d="${bullLeg1}" />
      <path d="${bullLeg2}" />
      <path d="${bullLeg3}" />
    </g>
  </g>

  <!-- Typography -->
  <text class="t-name" transform="translate(128.7 115.34)"><tspan style="letter-spacing:.06em" x="0" y="0">A</tspan><tspan style="letter-spacing:.05em" x="52.68" y="0">N</tspan><tspan style="letter-spacing:.04em" x="116.79" y="0">G</tspan><tspan style="letter-spacing:.04em" x="177.97" y="0">EL</tspan><tspan style="letter-spacing:.05em" x="276.12" y="0">I</tspan><tspan style="letter-spacing:.05em" x="308.57" y="0">N</tspan><tspan style="letter-spacing:.04em" x="372.91" y="0">I</tspan></text>
  <text class="t-title" transform="translate(228.92 51.28)"><tspan style="letter-spacing:-.03em" x="0" y="0">I</tspan><tspan x="12.92" y="0">n</tspan><tspan x="34.56" y="0">mo</tspan><tspan x="86.42" y="0">b</tspan><tspan x="106.54" y="0">i</tspan><tspan x="117.38" y="0">l</tspan><tspan x="127.56" y="0">i</tspan><tspan x="137.97" y="0">a</tspan><tspan x="155.5" y="0">r</tspan><tspan x="170.38" y="0">i</tspan><tspan x="180.79" y="0">a</tspan></text>
</svg>
`;

// White Logo SVG (for dark backgrounds)
const whiteLogoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="angelini_official_logo_white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 144" width="100%" height="100%">
  <defs>
    <style>
      .t-title-w {
        font-family: 'Minion Variable Concept', 'Minion Pro', 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 39.14px;
        fill: #ffffff;
        letter-spacing: 0em;
      }
      .t-name-w {
        font-family: 'Minion Variable Concept', 'Minion Pro', 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 79.34px;
        fill: #ffffff;
        font-weight: bold;
      }
    </style>
  </defs>

  <!-- Concentric Rings & Red Core -->
  <g>
    <!-- Outer White Ring -->
    <circle cx="58.65" cy="58.65" r="57.5" fill="#ffffff" />
    <!-- Navy Middle Ring -->
    <circle cx="58.65" cy="58.65" r="50" fill="#02275c" />
    <!-- Solid Vibrant Red Core -->
    <circle cx="58.65" cy="58.65" r="44.5" fill="#e3171d" />

    <!-- Bull Contour (White outline) -->
    <g>
      <path d="${bullBody}" fill="#ffffff" stroke="#02275c" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
      <path d="${bullLeg1}" fill="#ffffff" stroke="#02275c" stroke-width="4" stroke-linejoin="round" />
      <path d="${bullLeg2}" fill="#ffffff" stroke="#02275c" stroke-width="4" stroke-linejoin="round" />
      <path d="${bullLeg3}" fill="#ffffff" stroke="#02275c" stroke-width="4" stroke-linejoin="round" />
    </g>

    <!-- Bull Solid White Fill -->
    <g fill="#ffffff">
      <path d="${bullBody}" />
      <path d="${bullLeg1}" />
      <path d="${bullLeg2}" />
      <path d="${bullLeg3}" />
    </g>
  </g>

  <!-- Typography -->
  <text class="t-name-w" transform="translate(128.7 115.34)"><tspan style="letter-spacing:.06em" x="0" y="0">A</tspan><tspan style="letter-spacing:.05em" x="52.68" y="0">N</tspan><tspan style="letter-spacing:.04em" x="116.79" y="0">G</tspan><tspan style="letter-spacing:.04em" x="177.97" y="0">EL</tspan><tspan style="letter-spacing:.05em" x="276.12" y="0">I</tspan><tspan style="letter-spacing:.05em" x="308.57" y="0">N</tspan><tspan style="letter-spacing:.04em" x="372.91" y="0">I</tspan></text>
  <text class="t-title-w" transform="translate(228.92 51.28)"><tspan style="letter-spacing:-.03em" x="0" y="0">I</tspan><tspan x="12.92" y="0">n</tspan><tspan x="34.56" y="0">mo</tspan><tspan x="86.42" y="0">b</tspan><tspan x="106.54" y="0">i</tspan><tspan x="117.38" y="0">l</tspan><tspan x="127.56" y="0">i</tspan><tspan x="137.97" y="0">a</tspan><tspan x="155.5" y="0">r</tspan><tspan x="170.38" y="0">i</tspan><tspan x="180.79" y="0">a</tspan></text>
</svg>
`;

// Emblem SVG
const emblemSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="angelini_official_emblem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 118" width="100%" height="100%">
  <!-- Outer Navy Ring -->
  <circle cx="59" cy="59" r="57.5" fill="#02275c" />
  <!-- White Middle Ring -->
  <circle cx="59" cy="59" r="50" fill="#ffffff" />
  <!-- Solid Vibrant Red Core -->
  <circle cx="59" cy="59" r="44.5" fill="#e3171d" />

  <!-- Bull Contour (Crisp White Outline) -->
  <g>
    <path d="${bullBody}" fill="#02275c" stroke="#ffffff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
    <path d="${bullLeg1}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
    <path d="${bullLeg2}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
    <path d="${bullLeg3}" fill="#02275c" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
  </g>

  <!-- Bull Solid Navy Fill -->
  <g fill="#02275c">
    <path d="${bullBody}" />
    <path d="${bullLeg1}" />
    <path d="${bullLeg2}" />
    <path d="${bullLeg3}" />
  </g>
</svg>
`;

fs.writeFileSync('./public/angelini-logo-color.svg', colorLogoSvg);
fs.writeFileSync('./public/angelini-logo-white.svg', whiteLogoSvg);
fs.writeFileSync('./public/angelini-emblem.svg', emblemSvg);
fs.writeFileSync('./public/favicon.svg', emblemSvg);
console.log('Official SVG assets generated successfully!');
