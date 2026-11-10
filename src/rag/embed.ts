/**
 * Deterministic hashed bag-of-words embedder (mirrors ragpilot MOCK_MODE).
 * Lexical similarity only  -  the same ceiling the Python reference admits.
 * Swap for a real embedder (e.g. @xenova/transformers) by replacing embed().
 */
const EMBED_DIM = 384;

export function embed(text: string): number[] {
  const vec = new Array(EMBED_DIM).fill(0);
  const toks = text.toLowerCase().match(/\w+/g) || [];
  for (const t of toks) {
    // stable hash -> bucket
    let h = 0;
    for (let i = 0; i < t.length; i++) {
      h = (h * 31 + t.charCodeAt(i)) >>> 0;
    }
    vec[h % EMBED_DIM] += 1;
  }
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1;
  return vec.map((x) => x / norm);
}

export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
