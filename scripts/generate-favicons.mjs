import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

console.log("=== Generating Transparent Favicon & Multi-Res ICO ===");

function parsePng(buffer) {
  let offset = 8, ihdr = null;
  const idatChunks = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === "IHDR") {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
      };
    } else if (type === "IDAT") idatChunks.push(data);
    else if (type === "IEND") break;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const { width, height } = ihdr;
  const stride = width * 4;
  const rawRgba = Buffer.alloc(width * height * 4);
  let srcOffset = 0, prevRow = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcOffset++];
    const currentRow = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const rawByte = decompressed[srcOffset++];
      const a = x >= 4 ? currentRow[x - 4] : 0;
      const b = prevRow[x];
      const c = x >= 4 ? prevRow[x - 4] : 0;
      let val = 0;
      if (filterType === 0) val = rawByte;
      else if (filterType === 1) val = (rawByte + a) & 0xff;
      else if (filterType === 2) val = (rawByte + b) & 0xff;
      else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        val = (rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      }
      currentRow[x] = val;
    }
    currentRow.copy(rawRgba, y * stride);
    prevRow = currentRow;
  }
  return { ihdr, rawRgba };
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);
  const crc = zlib.crc32(chunk.slice(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const stride = width * 4;
  const filtered = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (stride + 1)] = 0; // Filter: None
    rgbaBuffer.copy(filtered, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const compressed = zlib.deflateSync(filtered, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdrData),
    makeChunk("IDAT", compressed),
    makeChunk("IEND", Buffer.alloc(0))
  ]);
}

// High quality downsampling with box filtering & premultiplied alpha
function resizeRgba(srcBuf, srcW, srcH, dstW, dstH) {
  const dstBuf = Buffer.alloc(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    const syStart = dy * yRatio;
    const syEnd = (dy + 1) * yRatio;
    const y0 = Math.floor(syStart);
    const y1 = Math.min(srcH - 1, Math.floor(syEnd));

    for (let dx = 0; dx < dstW; dx++) {
      const sxStart = dx * xRatio;
      const sxEnd = (dx + 1) * xRatio;
      const x0 = Math.floor(sxStart);
      const x1 = Math.min(srcW - 1, Math.floor(sxEnd));

      let totalWeight = 0;
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;

      for (let sy = y0; sy <= y1; sy++) {
        const yWeight = Math.min(sy + 1, syEnd) - Math.max(sy, syStart);
        if (yWeight <= 0) continue;

        for (let sx = x0; sx <= x1; sx++) {
          const xWeight = Math.min(sx + 1, sxEnd) - Math.max(sx, sxStart);
          if (xWeight <= 0) continue;

          const weight = xWeight * yWeight;
          totalWeight += weight;

          const sIdx = (sy * srcW + sx) * 4;
          const r = srcBuf[sIdx];
          const g = srcBuf[sIdx + 1];
          const b = srcBuf[sIdx + 2];
          const a = srcBuf[sIdx + 3] / 255;

          sumA += a * weight;
          sumR += r * a * weight;
          sumG += g * a * weight;
          sumB += b * a * weight;
        }
      }

      const dstIdx = (dy * dstW + dx) * 4;
      if (totalWeight > 0 && sumA > 0) {
        const avgA = sumA / totalWeight;
        dstBuf[dstIdx] = Math.min(255, Math.round(sumR / sumA));
        dstBuf[dstIdx + 1] = Math.min(255, Math.round(sumG / sumA));
        dstBuf[dstIdx + 2] = Math.min(255, Math.round(sumB / sumA));
        dstBuf[dstIdx + 3] = Math.min(255, Math.round(avgA * 255));
      } else {
        dstBuf[dstIdx] = 0;
        dstBuf[dstIdx + 1] = 0;
        dstBuf[dstIdx + 2] = 0;
        dstBuf[dstIdx + 3] = 0;
      }
    }
  }

  return dstBuf;
}

// Build multi-resolution ICO file containing PNGs
function createIco(images) {
  // images: array of { width, height, pngBuffer }
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const payloads = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry[0] = img.width >= 256 ? 0 : img.width;
    entry[1] = img.height >= 256 ? 0 : img.height;
    entry[2] = 0; // color palette count
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.pngBuffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // file offset

    dirEntries.push(entry);
    payloads.push(img.pngBuffer);
    offset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...payloads]);
}

// 1. Load source
const sourcePath = fs.existsSync(".output/public/favicon.png")
  ? path.resolve(".output/public/favicon.png")
  : path.resolve("static/favicon.png");

console.log("Reading source image:", sourcePath);
const { ihdr, rawRgba } = parsePng(fs.readFileSync(sourcePath));
const { width, height } = ihdr;

// 2. Identify and remove white background
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let head = 0, tail = 0;

function deltaFromWhite(r, g, b) {
  return Math.max(255 - r, 255 - g, 255 - b);
}

// Seed borders
for (let x = 0; x < width; x++) {
  const dTop = deltaFromWhite(rawRgba[x * 4], rawRgba[x * 4 + 1], rawRgba[x * 4 + 2]);
  if (dTop <= 15) { visited[x] = 1; queue[tail++] = x; }
  const bIdx = (height - 1) * width + x;
  const dBot = deltaFromWhite(rawRgba[bIdx * 4], rawRgba[bIdx * 4 + 1], rawRgba[bIdx * 4 + 2]);
  if (dBot <= 15) { visited[bIdx] = 1; queue[tail++] = bIdx; }
}
for (let y = 0; y < height; y++) {
  const lIdx = y * width;
  const dL = deltaFromWhite(rawRgba[lIdx * 4], rawRgba[lIdx * 4 + 1], rawRgba[lIdx * 4 + 2]);
  if (!visited[lIdx] && dL <= 15) { visited[lIdx] = 1; queue[tail++] = lIdx; }
  const rIdx = y * width + (width - 1);
  const dR = deltaFromWhite(rawRgba[rIdx * 4], rawRgba[rIdx * 4 + 1], rawRgba[rIdx * 4 + 2]);
  if (!visited[rIdx] && dR <= 15) { visited[rIdx] = 1; queue[tail++] = rIdx; }
}

while (head < tail) {
  const curr = queue[head++];
  const cx = curr % width;
  const cy = Math.floor(curr / width);
  const nbs = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
  for (const [nx, ny] of nbs) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nidx = ny * width + nx;
      if (!visited[nidx]) {
        const d = deltaFromWhite(rawRgba[nidx * 4], rawRgba[nidx * 4 + 1], rawRgba[nidx * 4 + 2]);
        if (d <= 15) {
          visited[nidx] = 1;
          queue[tail++] = nidx;
        }
      }
    }
  }
}

const cleanMasterRgba = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const px = i * 4;
  const x = i % width;
  const y = Math.floor(i / width);
  const r = rawRgba[px];
  const g = rawRgba[px + 1];
  const b = rawRgba[px + 2];
  const delta = deltaFromWhite(r, g, b);

  // Stray corner pencil/brush noise filter (in top-right x>800, y<150 or bottom-right x>850, y>850)
  const isCornerNoise = ((x > 800 && y < 150) || (x > 850 && y > 850)) &&
                        delta < 35 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;

  if (visited[i] || isCornerNoise) {
    if (delta <= 2 || isCornerNoise) {
      cleanMasterRgba[px] = 0;
      cleanMasterRgba[px + 1] = 0;
      cleanMasterRgba[px + 2] = 0;
      cleanMasterRgba[px + 3] = 0;
    } else {
      const aNorm = Math.min(1, Math.max(0, (delta - 2) / 253));
      const alpha = Math.round(aNorm * 255);
      if (alpha === 0) {
        cleanMasterRgba[px] = 0;
        cleanMasterRgba[px + 1] = 0;
        cleanMasterRgba[px + 2] = 0;
        cleanMasterRgba[px + 3] = 0;
      } else {
        const rf = Math.min(255, Math.max(0, Math.round(255 - (255 - r) / aNorm)));
        const gf = Math.min(255, Math.max(0, Math.round(255 - (255 - g) / aNorm)));
        const bf = Math.min(255, Math.max(0, Math.round(255 - (255 - b) / aNorm)));
        cleanMasterRgba[px] = rf;
        cleanMasterRgba[px + 1] = gf;
        cleanMasterRgba[px + 2] = bf;
        cleanMasterRgba[px + 3] = alpha;
      }
    }
  } else {
    // Solid foreground element
    cleanMasterRgba[px] = r;
    cleanMasterRgba[px + 1] = g;
    cleanMasterRgba[px + 2] = b;
    cleanMasterRgba[px + 3] = 255;
  }
}

// 3. Generate resolutions
console.log("Encoding 1024x1024 master PNG...");
const png1024 = encodePng(width, height, cleanMasterRgba);

console.log("Generating downscaled sizes...");
const sizes = [256, 64, 48, 32, 16];
const icoImages = [];

for (const s of sizes) {
  console.log(`Resizing to ${s}x${s}...`);
  const sRgba = resizeRgba(cleanMasterRgba, width, height, s, s);
  const sPng = encodePng(s, s, sRgba);
  icoImages.push({ width: s, height: s, pngBuffer: sPng });
}

// Also create 512x512 for high-res favicon.png
console.log("Generating 512x512 favicon.png...");
const rgba512 = resizeRgba(cleanMasterRgba, width, height, 512, 512);
const png512 = encodePng(512, 512, rgba512);

// 4. Create multi-size ICO (contains 16, 32, 48, 64, 256)
console.log("Assembling ICO container...");
const icoBuffer = createIco(icoImages);

// 5. Write to all necessary destinations:
const targets = [
  "static",
  "public",
  ".output/public"
];

for (const dir of targets) {
  const absDir = path.resolve(dir);
  if (!fs.existsSync(absDir)) fs.mkdirSync(absDir, { recursive: true });
  fs.writeFileSync(path.join(absDir, "favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(absDir, "favicon.png"), png512);
  console.log(`Written favicon.ico (${icoBuffer.length} B) and favicon.png (${png512.length} B) to ${dir}/`);
}

console.log("Favicon generation completed successfully!");
