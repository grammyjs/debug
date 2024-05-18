// https://github.com/debug-js/debug/blob/4.3.4/src/node.js#L35
const colors = [
  20,
  21,
  26,
  27,
  32,
  33,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  56,
  57,
  62,
  63,
  68,
  69,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  92,
  93,
  98,
  99,
  112,
  113,
  128,
  129,
  134,
  135,
  148,
  149,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  178,
  179,
  184,
  185,
  196,
  197,
  198,
  199,
  200,
  201,
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  209,
  214,
  215,
  220,
  221,
];

// https://github.com/debug-js/debug/blob/4.3.4/src/common.js#L41
function selectColor(ns: string) {
  let hash = 0;

  for (let i = 0; i < ns.length; i++) {
    hash = ((hash << 5) - hash) + ns.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
}

export const colorNamespace = (ns: string) =>
  `\x1b[38;5;${selectColor(ns)}m${ns}\x1b[1;0m`;
