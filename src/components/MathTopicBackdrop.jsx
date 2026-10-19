import React from 'react';

// Decorative mathematical motifs, not exercises or source-bank content.
const chapterMotifs = {
  10: ['sets', 'halfplane', 'triangle', 'vectors', 'statistics', 'parabola', 'conics', 'counting', 'probability'],
  11: ['sine', 'sequence', 'grouped-data', 'parallel', 'limit', 'exponential', 'perpendicular', 'events', 'tangent'],
  12: ['extrema', 'vectors3d', 'boxplot', 'integral', 'coordinates3d', 'conditional'],
};
const electiveMotifs = {
  10: ['linear-system', 'induction', 'conic-family'],
  11: ['transformations', 'graph', 'technical-drawing'],
  12: ['binomial', 'optimization', 'finance'],
};

function Axes({ children }) {
  return <><path d="M28 192H266M64 224V22" /><path d="m258 186 8 6-8 6M58 30l6-8 6 8" /><text x="250" y="216">x</text><text x="77" y="34">y</text>{children}</>;
}
function Axes3D({ children }) {
  return <><path d="M122 156 254 172M122 156 38 218M122 156V24" /><path d="m246 165 8 7-9 4M49 216l-11 2 6-10M116 33l6-9 6 9" /><text x="255" y="194">x</text><text x="22" y="220">y</text><text x="135" y="32">z</text>{children}</>;
}
function Dice({ x = 75, y = 80 }) {
  return <g transform={`translate(${x} ${y})`}><path d="m0 20 48-26 48 26v56L48 104 0 76Z M0 20l48 28 48-28M48 48v56" />{[[48, 17], [16, 44], [16, 67], [34, 55], [34, 78], [64, 56], [82, 46], [64, 79], [82, 69]].map(([cx, cy], i) => <circle className="math-art-fill" key={i} cx={cx} cy={cy} r="3" />)}</g>;
}
function Tree({ conditional = false }) {
  return <><path d="M45 130 130 70 230 32M130 70l100 68M45 130l85 55 100-6M130 185l100 56" />{[[45, 130], [130, 70], [130, 185], [230, 32], [230, 138], [230, 179], [230, 241]].map(([cx, cy], i) => <circle className="math-art-paper" key={i} cx={cx} cy={cy} r="7" />)}{conditional && <><text x="72" y="76">A</text><text x="166" y="47">B</text><text x="168" y="112">B̄</text><text x="22" y="40">P(B | A)</text></>}</>;
}

function Motif({ kind }) {
  switch (kind) {
    case 'sets': return <><circle cx="111" cy="112" r="65" /><circle cx="187" cy="112" r="65" strokeDasharray="6 6" /><text x="80" y="120">A</text><text x="200" y="120">B</text><text x="121" y="215">∩</text><text x="215" y="211">∪</text></>;
    case 'halfplane': return <Axes><path className="math-art-wash" d="M65 192 65 109 246 38 246 192Z" /><path d="M28 124 264 31" strokeDasharray="7 6" /><path d="m80 171 12-5m14-6 12-5m14-6 12-5m14-6 12-5m14-6 12-5m14-6 12-5" /></Axes>;
    case 'triangle': return <><path d="M36 200 215 200 178 45Z" /><path d="M195 200q0-14 14-23M56 200q0-16-10-19M176 63q13 0 18-7" /><text x="170" y="33">A</text><text x="20" y="220">B</text><text x="223" y="220">C</text><text x="113" y="225">c</text><text x="210" y="122">a</text><text x="95" y="120">b</text></>;
    case 'vectors': return <Axes><path d="M64 192 164 113M64 192l39-69" /><path d="m150 115 14-2-5 13M93 133l10-10 2 15" /><path d="M103 123 203 44 164 113" strokeDasharray="6 6" /><text x="130" y="166">u</text><text x="74" y="108">v</text></Axes>;
    case 'statistics': return <><path d="M22 210H275" />{[28, 54, 91, 66, 114, 47].map((h, i) => <rect className="math-art-wash" key={i} x={38 + i * 36} y={210 - h} width="22" height={h} />)}<path d="m49 139 36-31 36-17 36 9 36-58 36 26" />{[[49, 139], [85, 108], [121, 91], [157, 100], [193, 42], [229, 68]].map(([cx, cy], i) => <circle className="math-art-fill" key={i} cx={cx} cy={cy} r="4" />)}</>;
    case 'parabola': return <Axes><path d="M90 35Q156 280 222 35" /><path d="M156 32V214" strokeDasharray="4 7" /><circle className="math-art-fill" cx="156" cy="157" r="4" /></Axes>;
    case 'conics': return <Axes><ellipse cx="161" cy="126" rx="76" ry="52" /><path d="M41 213 251 36" strokeDasharray="6 6" /><circle className="math-art-fill" cx="127" cy="126" r="3" /><circle className="math-art-fill" cx="195" cy="126" r="3" /></Axes>;
    case 'counting': return <><text x="35" y="53">n!</text><path d="M155 54 110 110 200 110M110 110 80 175M110 110l28 65M200 110l-18 65M200 110l40 65" />{[[155, 54], [110, 110], [200, 110], [80, 175], [138, 175], [182, 175], [240, 175]].map(([cx, cy], i) => <circle className="math-art-paper" key={i} cx={cx} cy={cy} r="10" />)}<text x="29" y="225">Cₙᵏ</text></>;
    case 'probability': return <><Dice x={49} y={68} /><ellipse cx="230" cy="181" rx="40" ry="24" transform="rotate(-35 230 181)" /><path d="M198 195q28 17 62-26" /><text x="191" y="63">P(A)</text></>;
    case 'sine': return <Axes><path d="M25 130C54 130 65 55 94 55S135 205 165 205 206 55 236 55 260 98 275 130" /><path d="M25 130H275" strokeDasharray="4 7" /><text x="163" y="45">sin x</text></Axes>;
    case 'sequence': return <><path d="M29 211H270" />{[[52, 184], [98, 159], [144, 123], [190, 82], [236, 34]].map(([cx, cy], i) => <g key={i}><path d={`M${cx} 211V${cy}`} strokeDasharray="3 6" /><circle className="math-art-fill" cx={cx} cy={cy} r="5" /></g>)}<text x="58" y="239">1</text><text x="104" y="239">2</text><text x="151" y="239">3</text><text x="199" y="239">…</text><text x="31" y="58">uₙ</text></>;
    case 'grouped-data': return <><path d="M29 211H275M29 211V35" />{[48, 100, 148, 119, 70, 32].map((h, i) => <rect className="math-art-wash" key={i} x={40 + i * 35} y={211 - h} width="35" height={h} />)}<path d="M145 44V220" strokeDasharray="5 6" /><text x="163" y="35">Me</text></>;
    case 'parallel': return <><path className="math-art-wash" d="M27 93 179 48 270 93 116 138Z M27 165 179 120 270 165 116 210Z" /><path d="m60 91 140-39M60 163l140-39" /><path d="m184 51 16 1-12 10M184 123l16 1-12 10" /><text x="34" y="62">α</text><text x="34" y="149">β</text></>;
    case 'limit': return <Axes><path d="M75 174C100 134 110 102 145 96M155 92c37-13 60-24 94-45" /><circle className="math-art-paper" cx="150" cy="94" r="6" /><path d="M150 192V94H64" strokeDasharray="5 6" /><text x="138" y="218">a</text><text x="31" y="103">L</text><text x="176" y="33">lim</text></Axes>;
    case 'exponential': return <Axes><path d="M32 177C140 177 190 163 221 27" /><path d="M73 226C73 145 100 77 264 63" strokeDasharray="5 5" /><path d="M64 192 239 31" strokeDasharray="3 8" /></Axes>;
    case 'perpendicular': return <><path className="math-art-wash" d="M30 168 187 119 270 166 113 215Z" /><path d="M151 165V28M151 165l64 30M151 165l-66 21" /><path d="M151 144l18 8v20" /><text x="164" y="43">d</text><text x="44" y="164">α</text><path d="M151 165 151 215" strokeDasharray="5 6" /></>;
    case 'events': return <><rect x="30" y="43" width="242" height="165" rx="16" /><circle cx="113" cy="126" r="55" /><circle cx="181" cy="126" r="55" /><path className="math-art-wash" d="M147 83a55 55 0 0 1 0 86 55 55 0 0 1 0-86Z" /><text x="81" y="131">A</text><text x="196" y="131">B</text><text x="238" y="72">Ω</text></>;
    case 'tangent': return <Axes><path d="M78 177Q155 215 247 49" /><path d="M84 229 251 82" /><circle className="math-art-fill" cx="175" cy="149" r="5" /><path d="M175 149V192" strokeDasharray="4 6" /><text x="183" y="129">f′(x)</text></Axes>;
    case 'extrema': return <Axes><path d="M42 200C76 50 113 46 148 132S207 228 259 39" /><circle className="math-art-fill" cx="97" cy="92" r="5" /><circle className="math-art-fill" cx="204" cy="177" r="5" /><path d="M71 92H124M178 177H231" strokeDasharray="5 5" /></Axes>;
    case 'vectors3d': return <Axes3D><path d="M122 156 209 66" /><path d="m195 69 14-3-2 14" /><path d="M209 66V144L122 156M209 66 158 99v90M158 189l51-45" strokeDasharray="5 6" /><text x="177" y="102">v</text></Axes3D>;
    case 'boxplot': return <><path d="M26 181H271" /><path d="M51 90v62M251 90v62M51 121H251" /><rect className="math-art-wash" x="96" y="82" width="111" height="78" rx="4" /><path d="M147 82v78" /><text x="80" y="208">Q₁</text><text x="133" y="208">Q₂</text><text x="194" y="208">Q₃</text><circle className="math-art-fill" cx="40" cy="121" r="3" /></>;
    case 'integral': return <Axes><path className="math-art-wash" d="M102 192V150Q151 60 221 74V192Z" /><path d="M78 184Q145 47 256 80" />{[116, 132, 148, 164, 180, 196, 212].map(x => <path key={x} d={`M${x} 192V${x < 160 ? 130 - (x - 116) : 76}`} strokeDasharray="3 4" />)}<text x="102" y="220">a</text><text x="214" y="220">b</text><text x="193" y="41">∫</text></Axes>;
    case 'coordinates3d': return <Axes3D><path className="math-art-wash" d="M56 116 181 74 249 118 123 160Z" /><ellipse cx="178" cy="105" rx="44" ry="48" /><path d="M134 105q44-26 88 0M134 105q44 26 88 0" strokeDasharray="5 5" /><circle className="math-art-fill" cx="178" cy="105" r="3" /></Axes3D>;
    case 'conditional': return <Tree conditional />;
    case 'linear-system': return <><path className="math-art-wash" d="M33 140 183 58 266 106 116 188Z M96 221 96 47 183 22 183 196Z" /><path d="M40 78 248 208M50 208 234 45" /><circle className="math-art-fill" cx="148" cy="145" r="5" /><text x="212" y="45">x, y, z</text></>;
    case 'induction': return <><path d="M25 218h50v-45h50v-45h50V83h50V38h50" /><path d="M52 159 189 36" strokeDasharray="5 6" /><path d="m176 37 13-1-2 13" /><text x="25" y="247">n</text><text x="132" y="208">n + 1</text></>;
    case 'conic-family': return <><ellipse cx="101" cy="83" rx="60" ry="40" /><path d="M173 34Q85 119 173 188M214 34q88 85 0 154" /><path d="M42 203q51-146 102 0" /><path d="M25 203H270" strokeDasharray="4 7" /></>;
    case 'transformations': return <><path className="math-art-wash" d="M38 179 86 92 109 179Z M184 179 232 92 255 179Z" /><path d="M148 26V228" strokeDasharray="5 6" /><path d="M91 61H223m-12-7 12 7-12 7" /><text x="39" y="209">A</text><text x="231" y="209">A′</text></>;
    case 'graph': return <><path d="M53 127 111 43 227 70 246 178 134 217 53 127 227 70 134 217 111 43M53 127l193 51" />{[[53, 127], [111, 43], [227, 70], [246, 178], [134, 217]].map(([cx, cy], i) => <circle className="math-art-paper" key={i} cx={cx} cy={cy} r="11" />)}</>;
    case 'technical-drawing': return <><path d="m48 93 104-51 104 51v107l-104 45-104-45Z M48 93l104 53 104-53M152 146v99" /><path d="M48 200 152 146M152 42v104l104 54" strokeDasharray="5 6" /><path d="M32 83V211M28 88h8M28 205h8M44 230l101 44" /><text x="12" y="157">h</text></>;
    case 'binomial': return <><path d="M22 210H278" />{[18, 56, 112, 150, 112, 56, 18].map((h, i) => <rect className="math-art-wash" key={i} x={32 + i * 34} y={210 - h} width="23" height={h} rx="3" />)}<text x="55" y="38">X ∼ B(n, p)</text></>;
    case 'optimization': return <Axes><path className="math-art-wash" d="M64 192V104L130 56 232 132 182 192Z" /><path d="M34 160 264 70M34 194l230-90" strokeDasharray="6 6" /><circle className="math-art-fill" cx="130" cy="56" r="6" /></Axes>;
    case 'finance': return <><path d="M28 211H272" />{[38, 67, 105, 154].map((h, i) => <rect className="math-art-wash" key={i} x={40 + i * 52} y={211 - h} width="31" height={h} rx="3" />)}<path d="M36 141Q141 142 247 31m-15 3 15-3-3 16" /><text x="39" y="57">%</text></>;
    default: return null;
  }
}

export default function MathTopicBackdrop({ grade, index, elective = false }) {
  const kind = (elective ? electiveMotifs : chapterMotifs)[grade]?.[index];
  if (!kind) return null;
  return <svg className="math-topic-backdrop" data-motif={kind} viewBox="0 0 300 260" aria-hidden="true" focusable="false"><Motif kind={kind} /></svg>;
}
