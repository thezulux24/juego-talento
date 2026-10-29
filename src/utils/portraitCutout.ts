const cutoutCache = new Map<string, string>();

/**
 * Removes the solid warm cream studio background (#F4EFE6) from the outer border
 * of a character portrait using a corner flood-fill + soft alpha feathering,
 * allowing the character to sit naturally inside the 2.5D office scene.
 */
export function getTransparentPortrait(src: string): Promise<string> {
  if (cutoutCache.has(src)) {
    return Promise.resolve(cutoutCache.get(src)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || 512;
        const h = img.naturalHeight || 512;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Sample reference background color from top-left (4,4) and top-right (w-5,4)
        const refIdx = (4 * w + 4) * 4;
        const refR = data[refIdx];
        const refG = data[refIdx + 1];
        const refB = data[refIdx + 2];

        const visited = new Uint8Array(w * h);
        const isBg = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const colorDist = (idx: number) => {
          const dr = data[idx] - refR;
          const dg = data[idx + 1] - refG;
          const db = data[idx + 2] - refB;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        const threshold = 34;

        // Seed along top, left, and right edges
        for (let x = 0; x < w; x++) {
          const topPos = x;
          if (!visited[topPos] && colorDist(topPos * 4) < threshold) {
            visited[topPos] = 1;
            queue[tail++] = topPos;
          }
        }
        for (let y = 0; y < h; y++) {
          const leftPos = y * w;
          if (!visited[leftPos] && colorDist(leftPos * 4) < threshold) {
            visited[leftPos] = 1;
            queue[tail++] = leftPos;
          }
          const rightPos = y * w + (w - 1);
          if (!visited[rightPos] && colorDist(rightPos * 4) < threshold) {
            visited[rightPos] = 1;
            queue[tail++] = rightPos;
          }
        }

        while (head < tail) {
          const pos = queue[head++];
          isBg[pos] = 1;
          const x = pos % w;
          const y = (pos / w) | 0;

          // 4-neighbors
          if (x > 0) {
            const n = pos - 1;
            if (!visited[n] && colorDist(n * 4) < threshold) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (x < w - 1) {
            const n = pos + 1;
            if (!visited[n] && colorDist(n * 4) < threshold) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (y > 0) {
            const n = pos - w;
            if (!visited[n] && colorDist(n * 4) < threshold) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (y < h - 1) {
            const n = pos + w;
            if (!visited[n] && colorDist(n * 4) < threshold) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
        }

        // Apply transparency and 1px edge feathering
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const pos = y * w + x;
            const p4 = pos * 4;
            if (isBg[pos]) {
              data[p4 + 3] = 0;
            } else {
              // Check if adjacent to background for soft anti-aliasing
              let bgNeighbors = 0;
              if (x > 0 && isBg[pos - 1]) bgNeighbors++;
              if (x < w - 1 && isBg[pos + 1]) bgNeighbors++;
              if (y > 0 && isBg[pos - w]) bgNeighbors++;
              if (y < h - 1 && isBg[pos + w]) bgNeighbors++;
              if (bgNeighbors > 0) {
                data[p4 + 3] = Math.max(80, 255 - bgNeighbors * 45);
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');
        cutoutCache.set(src, resultUrl);
        resolve(resultUrl);
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/**
 * Removes the solid dark espresso background (#140C07) around the game logo crest
 * so the ornate emblem floats cleanly with transparency over the 3D scene.
 */
export function getTransparentLogo(src: string): Promise<string> {
  const cacheKey = `logo_${src}`;
  if (cutoutCache.has(cacheKey)) {
    return Promise.resolve(cutoutCache.get(cacheKey)!);
  }
  return getTransparentPortrait(src).then((res) => {
    cutoutCache.set(cacheKey, res);
    return res;
  });
}
