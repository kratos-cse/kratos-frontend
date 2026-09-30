'use client';

import { useEffect, useState } from 'react';
import DriftWall from './DriftWall';

/**
 * Seeded Fisher-Yates shuffle — same seed always gives the same order,
 * different seeds give different orders. Guarantees no blank slots.
 */
function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = (seed ^ 0xdeadbeef) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    // LCG step
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Builds a flat item list for DriftWall where every column contains
 * all source images in a unique shuffled order.
 *
 * DriftWall distributes round-robin: item[i] → column[i % columns].
 * To give column C a specific sequence [a, b, c, …] we interleave:
 *   position C+0*columns → col C item 0
 *   position C+1*columns → col C item 1
 *   …
 * This guarantees no holes and no repeated photos within a column.
 */
function buildMixedItems(sourceItems, columns) {
  // How many items each column will have
  const perColumn = sourceItems.length;
  const total = columns * perColumn;
  const result = new Array(total);

  for (let c = 0; c < columns; c++) {
    const shuffled = seededShuffle(sourceItems, c * 97 + 13);
    for (let i = 0; i < perColumn; i++) {
      result[c + i * columns] = shuffled[i];
    }
  }

  return result;
}

export default function DriftWallResponsive({ items, ...props }) {
  const [columns, setColumns] = useState(5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 480)       setColumns(2);
      else if (w < 700)  setColumns(3);
      else if (w < 1024) setColumns(4);
      else               setColumns(5);
    }
    update();
    setMounted(true);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return <div style={{ height: '600px', width: '100%' }} />;

  const mixed = buildMixedItems(items, columns);

  return <DriftWall {...props} items={mixed} columns={columns} />;
}
