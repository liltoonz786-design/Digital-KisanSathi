/**
 * speechUtils.ts
 * Robust speech recognition utilities for Digital Kisan Sathi.
 * Handles Chrome / Safari Web Speech API quirks, removes doubled/duplicate
 * phrases and words, and cleanly merges final and interim transcripts.
 */

/**
 * Merges final transcripts with interim transcripts without duplicating
 * phrases that Chrome Web Speech API repeats across result boundaries.
 */
export function mergeFinalAndInterim(finalText: string, interimText: string): string {
  const f = (finalText || '').trim().replace(/\s+/g, ' ');
  const it = (interimText || '').trim().replace(/\s+/g, ' ');

  if (!f) return it;
  if (!it) return f;

  const fLower = f.toLowerCase();
  const itLower = it.toLowerCase();

  // 1. If interim starts with the exact final text (most common Web Speech bug)
  if (itLower.startsWith(fLower)) {
    return it;
  }

  // 2. If final already ends with interim
  if (fLower.endsWith(itLower)) {
    return f;
  }

  // 3. Check for overlapping words at boundary
  const fWords = f.split(' ');
  const itWords = it.split(' ');
  let maxOverlap = 0;
  const maxCheck = Math.min(fWords.length, itWords.length);

  for (let k = 1; k <= maxCheck; k++) {
    const fSlice = fWords.slice(-k).map((w) => w.toLowerCase()).join(' ');
    const itSlice = itWords.slice(0, k).map((w) => w.toLowerCase()).join(' ');
    if (fSlice === itSlice) {
      maxOverlap = k;
    }
  }

  if (maxOverlap > 0) {
    return [...fWords, ...itWords.slice(maxOverlap)].join(' ').trim();
  }

  return `${f} ${it}`.trim();
}

/**
 * Removes duplicate words or repeated phrases produced by voice recognition.
 * Examples:
 * - "ਆਲੂ ਦੀ ਖੇਤੀ ਆਲੂ ਦੀ ਖੇਤੀ" -> "ਆਲੂ ਦੀ ਖੇਤੀ"
 * - "ਕਣਕ ਕਣਕ" -> "ਕਣਕ"
 * - "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ ਕਣਕ ਵਿੱਚ ਯੂਰੀਆ ਕਦੋਂ ਪਾਈਏ ਕਣਕ ਵਿੱਚ ਯੂਰੀਆ ਕਦੋਂ ਪਾਈਏ" -> "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ ਕਣਕ ਵਿੱਚ ਯੂਰੀਆ ਕਦੋਂ ਪਾਈਏ"
 */
export function cleanDuplicateSpeech(text: string): string {
  if (!text) return '';
  let str = text.trim().replace(/\s+/g, ' ');
  if (!str) return '';

  let words = str.split(' ');
  if (words.length <= 1) return str;

  // Multi-pass phrase and word loop deduplication
  let changed = true;
  let passes = 0;
  while (changed && passes < 12) {
    changed = false;
    passes++;

    // Check phrase repetitions of size k from max length down to 1
    const maxK = Math.floor(words.length / 2);
    for (let k = maxK; k >= 1; k--) {
      for (let i = 0; i <= words.length - 2 * k; i++) {
        let match = true;
        for (let j = 0; j < k; j++) {
          const w1 = words[i + j].toLowerCase().replace(/^[,\.?!]+|[,\.?!]+$/g, '');
          const w2 = words[i + k + j].toLowerCase().replace(/^[,\.?!]+|[,\.?!]+$/g, '');
          if (w1 !== w2) {
            match = false;
            break;
          }
        }
        if (match) {
          // Remove the duplicate block of length k
          words.splice(i + k, k);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return words.join(' ').trim();
}

/**
 * Extracts and cleans transcript from a Web Speech API event.
 */
export function processSpeechEvent(event: any): string {
  if (!event || !event.results) return '';

  let finalParts: string[] = [];
  let interimParts: string[] = [];

  for (let i = 0; i < event.results.length; i++) {
    const res = event.results[i];
    const text = (res[0]?.transcript || '').trim();
    if (!text) continue;

    if (res.isFinal) {
      finalParts.push(text);
    } else {
      interimParts.push(text);
    }
  }

  const finalCombined = finalParts.join(' ').trim();
  const interimCombined = interimParts.join(' ').trim();

  const merged = mergeFinalAndInterim(finalCombined, interimCombined);
  return cleanDuplicateSpeech(merged);
}
