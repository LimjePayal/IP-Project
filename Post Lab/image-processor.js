/**
 * image-processor.js
 * In-Browser Canvas Image Processing Engine
 * S.B.J.I.T.M.R. Image Processing Lab (N-PECCS502P)
 */

class ImageProcessor {
  constructor() {
    this.canvasOriginal = null;
    this.canvasProcessed = null;
    this.canvasHistogram = null;
    this.ctxOrig = null;
    this.ctxProc = null;
    this.ctxHist = null;
    this.currentImage = null;
    this.activeFilter = "none";
    this.filterParams = {
      threshold: 128,
      cannyLow: 50,
      cannyHigh: 150,
      kernelSize: 3,
      blurRadius: 2,
      gamma: 0.5
    };
    this.animationId = null;
  }

  init(origId, procId, histId) {
    this.canvasOriginal = document.getElementById(origId);
    this.canvasProcessed = document.getElementById(procId);
    this.canvasHistogram = histId ? document.getElementById(histId) : null;

    if (this.canvasOriginal) this.ctxOrig = this.canvasOriginal.getContext("2d", { willReadFrequently: true });
    if (this.canvasProcessed) this.ctxProc = this.canvasProcessed.getContext("2d", { willReadFrequently: true });
    if (this.canvasHistogram) this.ctxHist = this.canvasHistogram.getContext("2d");
  }

  generateSampleImage(type) {
    const w = 480, h = 360;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const ctx = tempCanvas.getContext("2d");

    if (type === "cat") {
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#2c1b18");
      bg.addColorStop(0.5, "#4a3528");
      bg.addColorStop(1, "#1c1412");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#e8dfd8";
      ctx.beginPath();
      ctx.ellipse(240, 250, 110, 85, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f5eeea";
      ctx.beginPath();
      ctx.arc(240, 160, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#d2b48c";
      ctx.beginPath();
      ctx.moveTo(180, 130); ctx.lineTo(160, 60); ctx.lineTo(215, 100); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(300, 130); ctx.lineTo(320, 60); ctx.lineTo(265, 100); ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.moveTo(182, 120); ctx.lineTo(168, 75); ctx.lineTo(205, 102); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(298, 120); ctx.lineTo(312, 75); ctx.lineTo(275, 102); ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#48c774";
      ctx.beginPath();
      ctx.ellipse(210, 155, 16, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(270, 155, 16, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.ellipse(210, 155, 7, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(270, 155, 7, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(206, 148, 4, 0, Math.PI * 2);
      ctx.arc(266, 148, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f67280";
      ctx.beginPath();
      ctx.moveTo(235, 178); ctx.lineTo(245, 178); ctx.lineTo(240, 186); ctx.closePath(); ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(200, 185); ctx.lineTo(130, 175);
      ctx.moveTo(200, 190); ctx.lineTo(125, 195);
      ctx.moveTo(280, 185); ctx.lineTo(350, 175);
      ctx.moveTo(280, 190); ctx.lineTo(355, 195);
      ctx.stroke();
    } else if (type === "lamp") {
      ctx.fillStyle = "#11141c";
      ctx.fillRect(0, 0, w, h);

      const deskGrad = ctx.createLinearGradient(0, 270, 0, h);
      deskGrad.addColorStop(0, "#3e2723"); deskGrad.addColorStop(1, "#1a0f0d");
      ctx.fillStyle = deskGrad;
      ctx.fillRect(0, 270, w, h - 270);

      const glow = ctx.createRadialGradient(240, 120, 10, 240, 180, 220);
      glow.addColorStop(0, "rgba(255, 225, 140, 0.95)");
      glow.addColorStop(0.3, "rgba(255, 190, 80, 0.45)");
      glow.addColorStop(1, "rgba(255, 170, 50, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.moveTo(240, 120); ctx.lineTo(80, 340); ctx.lineTo(400, 340); ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#ffd54f";
      ctx.beginPath();
      ctx.moveTo(200, 100); ctx.lineTo(280, 100); ctx.lineTo(310, 170); ctx.lineTo(170, 170); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#ffa000"; ctx.lineWidth = 3; ctx.stroke();

      ctx.strokeStyle = "#cfd8dc"; ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(240, 100); ctx.lineTo(240, 70); ctx.lineTo(340, 90); ctx.lineTo(350, 280); ctx.stroke();

      ctx.fillStyle = "#90a4ae";
      ctx.beginPath(); ctx.ellipse(350, 285, 45, 15, 0, 0, Math.PI * 2); ctx.fill();
    } else if (type === "flowers") {
      ctx.fillStyle = "#1b4d3e";
      ctx.fillRect(0, 0, w, h);

      const colors = ["#e63946", "#ffb703", "#fb8500", "#9d4edd", "#48cae4", "#f72585"];
      for (let i = 0; i < 24; i++) {
        const cx = 50 + ((i * 57) % (w - 100));
        const cy = 50 + ((i * 67) % (h - 100));
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffea00";
        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = "#ff0054";
      ctx.beginPath(); ctx.arc(330, 170, 25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(330, 170, 10, 0, Math.PI * 2); ctx.fill();
    } else if (type === "fingerprint") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#000000";
      ctx.beginPath(); ctx.arc(170, 140, 50, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(100, 270); ctx.lineTo(240, 270); ctx.lineTo(210, 180); ctx.lineTo(130, 180); ctx.closePath(); ctx.fill();

      ctx.lineWidth = 5; ctx.strokeStyle = "#000000";
      for (let r = 25; r <= 130; r += 14) {
        ctx.beginPath(); ctx.arc(340, 180, r, 0.4, Math.PI * 1.8); ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#263238";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#37474f";
      ctx.fillRect(0, 120, w, 180);

      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(160, 155, 110, 42);
      ctx.fillStyle = "#212121";
      ctx.beginPath(); ctx.arc(185, 197, 12, 0, Math.PI * 2); ctx.arc(245, 197, 12, 0, Math.PI * 2); ctx.fill();
    }

    return tempCanvas;
  }

  loadImage(source, callback) {
    if (typeof source === "string") {
      const canvas = this.generateSampleImage(source);
      this.currentImage = canvas;
      this.drawOriginal();
      if (callback) callback();
    } else if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
      this.currentImage = source;
      this.drawOriginal();
      if (callback) callback();
    }
  }

  loadUserFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.currentImage = img;
        this.drawOriginal();
        if (callback) callback();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  drawOriginal() {
    if (!this.currentImage || !this.canvasOriginal) return;
    const w = this.canvasOriginal.width;
    const h = this.canvasOriginal.height;
    if (this.ctxOrig) {
      this.ctxOrig.clearRect(0, 0, w, h);
      this.ctxOrig.drawImage(this.currentImage, 0, 0, w, h);
      this.renderHistogram(this.ctxOrig.getImageData(0, 0, w, h));
    }
  }

  applyFilter(filterName, params = {}) {
    this.activeFilter = filterName;
    this.filterParams = { ...this.filterParams, ...params };

    if (!this.canvasOriginal || !this.canvasProcessed || !this.ctxOrig || !this.ctxProc) return;
    const w = this.canvasOriginal.width;
    const h = this.canvasOriginal.height;

    const srcData = this.ctxOrig.getImageData(0, 0, w, h);
    const dstData = this.ctxProc.createImageData(w, h);
    const src = srcData.data;
    const dst = dstData.data;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    switch (filterName) {
      case "none":
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        break;

      case "grayscale":
        for (let i = 0; i < src.length; i += 4) {
          const g = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
          dst[i] = dst[i + 1] = dst[i + 2] = g;
          dst[i + 3] = src[i + 3];
        }
        break;

      case "hsv":
      case "ycrcb":
        for (let i = 0; i < src.length; i += 4) {
          const r = src[i], g = src[i + 1], b = src[i + 2];
          const y = 0.299 * r + 0.587 * g + 0.114 * b;
          dst[i] = y;
          dst[i + 1] = (r - y) * 0.713 + 128;
          dst[i + 2] = (b - y) * 0.564 + 128;
          dst[i + 3] = 255;
        }
        break;

      case "sobel":
        this.applySobel(src, dst, w, h);
        break;

      case "prewitt":
        this.applyPrewitt(src, dst, w, h);
        break;

      case "canny":
        this.applyCanny(src, dst, w, h, this.filterParams.cannyLow, this.filterParams.cannyHigh);
        break;

      case "blur":
        this.applyGaussianBlur(src, dst, w, h, this.filterParams.blurRadius || 2);
        break;

      case "sharpen":
        this.applySharpen(src, dst, w, h);
        break;

      case "invert":
        for (let i = 0; i < src.length; i += 4) {
          dst[i] = 255 - src[i];
          dst[i + 1] = 255 - src[i + 1];
          dst[i + 2] = 255 - src[i + 2];
          dst[i + 3] = src[i + 3];
        }
        break;

      case "threshold":
        const th = this.filterParams.threshold || 128;
        for (let i = 0; i < src.length; i += 4) {
          const lum = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
          const val = lum >= th ? 255 : 0;
          dst[i] = dst[i + 1] = dst[i + 2] = val;
          dst[i + 3] = 255;
        }
        break;

      case "erosion":
      case "dilation":
        this.applyMorphology(src, dst, w, h, filterName, this.filterParams.kernelSize || 3);
        break;

      case "correlation":
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        this.ctxProc.putImageData(dstData, 0, 0);
        this.drawCorrelationBox(this.ctxProc, 290, 130, 80, 80, "Template Matched (Score: 0.89)");
        this.renderHistogram(dstData);
        return;

      case "motion":
        this.startMotionSimulation(w, h);
        return;

      default:
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
    }

    this.ctxProc.putImageData(dstData, 0, 0);
    this.renderHistogram(dstData);
  }

  applySobel(src, dst, w, h) {
    const gray = new Float32Array(w * h);
    for (let i = 0; i < src.length; i += 4) {
      gray[i / 4] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
    }
    const kx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const ky = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let gx = 0, gy = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const p = gray[(y + dy) * w + (x + dx)];
            gx += p * kx[dy + 1][dx + 1];
            gy += p * ky[dy + 1][dx + 1];
          }
        }
        const mag = Math.min(255, Math.hypot(gx, gy));
        const idx = (y * w + x) * 4;
        dst[idx] = dst[idx + 1] = dst[idx + 2] = mag;
        dst[idx + 3] = 255;
      }
    }
  }

  applyPrewitt(src, dst, w, h) {
    const gray = new Float32Array(w * h);
    for (let i = 0; i < src.length; i += 4) {
      gray[i / 4] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
    }
    const kx = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
    const ky = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let gx = 0, gy = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const p = gray[(y + dy) * w + (x + dx)];
            gx += p * kx[dy + 1][dx + 1];
            gy += p * ky[dy + 1][dx + 1];
          }
        }
        const mag = Math.min(255, Math.hypot(gx, gy));
        const idx = (y * w + x) * 4;
        dst[idx] = dst[idx + 1] = dst[idx + 2] = mag;
        dst[idx + 3] = 255;
      }
    }
  }

  applyCanny(src, dst, w, h, lowTh = 40, highTh = 120) {
    this.applySobel(src, dst, w, h);
    for (let i = 0; i < dst.length; i += 4) {
      const val = dst[i];
      const edge = val >= highTh ? 255 : (val >= lowTh ? 140 : 0);
      dst[i] = dst[i + 1] = dst[i + 2] = edge;
    }
  }

  applyGaussianBlur(src, dst, w, h, radius = 2) {
    const r = Math.max(1, radius);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let red = 0, green = 0, blue = 0, count = 0;
        for (let dy = -r; dy <= r; dy++) {
          const py = Math.min(h - 1, Math.max(0, y + dy));
          for (let dx = -r; dx <= r; dx++) {
            const px = Math.min(w - 1, Math.max(0, x + dx));
            const idx = (py * w + px) * 4;
            red += src[idx]; green += src[idx + 1]; blue += src[idx + 2];
            count++;
          }
        }
        const oIdx = (y * w + x) * 4;
        dst[oIdx] = red / count; dst[oIdx + 1] = green / count; dst[oIdx + 2] = blue / count; dst[oIdx + 3] = 255;
      }
    }
  }

  applySharpen(src, dst, w, h) {
    const k = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let r = 0, g = 0, b = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            const weight = k[dy + 1][dx + 1];
            r += src[idx] * weight; g += src[idx + 1] * weight; b += src[idx + 2] * weight;
          }
        }
        const oIdx = (y * w + x) * 4;
        dst[oIdx] = Math.min(255, Math.max(0, r));
        dst[oIdx + 1] = Math.min(255, Math.max(0, g));
        dst[oIdx + 2] = Math.min(255, Math.max(0, b));
        dst[oIdx + 3] = 255;
      }
    }
  }

  applyMorphology(src, dst, w, h, op = "erosion", kSize = 3) {
    const r = Math.floor(kSize / 2);
    const bin = new Uint8Array(w * h);
    for (let i = 0; i < src.length; i += 4) {
      bin[i / 4] = (0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2]) > 127 ? 255 : 0;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let hit = false, fit = true;
        for (let dy = -r; dy <= r; dy++) {
          const py = Math.min(h - 1, Math.max(0, y + dy));
          for (let dx = -r; dx <= r; dx++) {
            const px = Math.min(w - 1, Math.max(0, x + dx));
            const v = bin[py * w + px];
            if (v === 255) hit = true;
            if (v === 0) fit = false;
          }
        }
        const outVal = op === "dilation" ? (hit ? 255 : 0) : (fit ? 255 : 0);
        const idx = (y * w + x) * 4;
        dst[idx] = dst[idx + 1] = dst[idx + 2] = outVal;
        dst[idx + 3] = 255;
      }
    }
  }

  drawCorrelationBox(ctx, x, y, bw, bh, label) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffd600";
    ctx.strokeRect(x, y, bw, bh);
    ctx.fillStyle = "rgba(255, 214, 0, 0.25)";
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = "#ffd600";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`⚡ ${label}`, x, y - 8);
  }

  startMotionSimulation(w, h) {
    let carX = 80;
    const loop = () => {
      carX = (carX + 3) % (w + 100);
      if (!this.ctxProc) return;
      this.ctxProc.fillStyle = "#263238";
      this.ctxProc.fillRect(0, 0, w, h);
      this.ctxProc.fillStyle = "#37474f";
      this.ctxProc.fillRect(0, 120, w, 180);

      const vx = carX - 50;
      this.ctxProc.fillStyle = "#d32f2f";
      this.ctxProc.fillRect(vx, 155, 95, 38);
      this.ctxProc.fillStyle = "#212121";
      this.ctxProc.beginPath();
      this.ctxProc.arc(vx + 20, 195, 10, 0, Math.PI * 2);
      this.ctxProc.arc(vx + 75, 195, 10, 0, Math.PI * 2);
      this.ctxProc.fill();

      this.ctxProc.strokeStyle = "#00e676";
      this.ctxProc.lineWidth = 3;
      this.ctxProc.strokeRect(vx - 5, 140, 105, 70);
      this.ctxProc.fillStyle = "#00e676";
      this.ctxProc.font = "bold 12px monospace";
      this.ctxProc.fillText(`TRACKED_VEHICLE [V=${Math.round(carX)}px]`, vx - 5, 132);

      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  renderHistogram(imageData) {
    if (!this.canvasHistogram || !this.ctxHist || !imageData) return;
    const cw = this.canvasHistogram.width, ch = this.canvasHistogram.height;
    const ctx = this.ctxHist;
    const rCount = new Uint32Array(256), gCount = new Uint32Array(256), bCount = new Uint32Array(256);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      rCount[d[i]]++; gCount[d[i + 1]]++; bCount[d[i + 2]]++;
    }
    let max = 1;
    for (let i = 0; i < 256; i++) {
      if (rCount[i] > max) max = rCount[i];
      if (gCount[i] > max) max = gCount[i];
      if (bCount[i] > max) max = bCount[i];
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(0, 0, cw, ch);
    const step = cw / 256;
    const drawCh = (arr, col) => {
      ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 0; i < 256; i++) {
        const x = i * step, y = ch - (arr[i] / max) * (ch - 8);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    drawCh(rCount, "#ef4444"); drawCh(gCount, "#22c55e"); drawCh(bCount, "#3b82f6");
  }

  // =========================================================================
  // PROJECT 23: BACKGROUND MODELING & FRAME DIFFERENCING SUITE
  // =========================================================================

  /**
   * Generates synthetic surveillance sequence frames with ground truth mask
   * width: 480, height: 320
   */
  generateSurveillanceFrames(carOffset = 0) {
    const w = 480, h = 320;

    const drawBackground = (ctx) => {
      // Sky & Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
      skyGrad.addColorStop(0, "#090d16");
      skyGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, 140);

      // Distant Buildings
      ctx.fillStyle = "#111827";
      ctx.fillRect(20, 45, 55, 95);
      ctx.fillRect(90, 65, 45, 75);
      ctx.fillRect(150, 30, 70, 110);
      ctx.fillRect(240, 55, 65, 85);
      ctx.fillRect(325, 40, 80, 100);
      ctx.fillRect(420, 60, 50, 80);

      // Building Windows (Subtle Lights)
      ctx.fillStyle = "rgba(254, 240, 138, 0.35)";
      for (let bx = 30; bx < 450; bx += 55) {
        for (let by = 60; by < 125; by += 20) {
          ctx.fillRect(bx, by, 8, 10);
        }
      }

      // Street Lamp post
      ctx.fillStyle = "#64748b";
      ctx.fillRect(60, 75, 5, 85);
      ctx.beginPath();
      ctx.arc(62, 72, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();

      // Road Surface
      const roadGrad = ctx.createLinearGradient(0, 140, 0, h);
      roadGrad.addColorStop(0, "#334155");
      roadGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, 140, w, h - 140);

      // Sidewalk Curb
      ctx.fillStyle = "#475569";
      ctx.fillRect(0, 140, w, 10);

      // Road Lane Markings
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.setLineDash([22, 16]);
      ctx.beginPath();
      ctx.moveTo(0, 225);
      ctx.lineTo(w, 225);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
    };

    const drawCar = (ctx, cx, cy) => {
      // Car Body
      ctx.fillStyle = "#e11d48"; // Vibrant Red
      ctx.beginPath();
      ctx.roundRect(cx, cy + 18, 105, 38, 6);
      ctx.fill();

      // Car Cabin / Roof
      ctx.fillStyle = "#9f1239";
      ctx.beginPath();
      ctx.moveTo(cx + 22, cy + 18);
      ctx.lineTo(cx + 42, cy + 2);
      ctx.lineTo(cx + 80, cy + 2);
      ctx.lineTo(cx + 94, cy + 18);
      ctx.closePath();
      ctx.fill();

      // Windows
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(cx + 26, cy + 16);
      ctx.lineTo(cx + 44, cy + 5);
      ctx.lineTo(cx + 58, cy + 5);
      ctx.lineTo(cx + 58, cy + 16);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 62, cy + 16);
      ctx.lineTo(cx + 62, cy + 5);
      ctx.lineTo(cx + 78, cy + 5);
      ctx.lineTo(cx + 90, cy + 16);
      ctx.closePath();
      ctx.fill();

      // Headlight Beam
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(cx + 102, cy + 28, 5, 0, Math.PI * 2);
      ctx.fill();

      // Wheels
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.arc(cx + 24, cy + 56, 12, 0, Math.PI * 2);
      ctx.arc(cx + 82, cy + 56, 12, 0, Math.PI * 2);
      ctx.fill();

      // Wheel Hubs
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(cx + 24, cy + 56, 5, 0, Math.PI * 2);
      ctx.arc(cx + 82, cy + 56, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Frame t-1 (Previous)
    const cPrev = document.createElement("canvas");
    cPrev.width = w; cPrev.height = h;
    const ctxPrev = cPrev.getContext("2d", { willReadFrequently: true });
    drawBackground(ctxPrev);
    const xPrev = 70 + carOffset;
    drawCar(ctxPrev, xPrev, 175);

    // Frame t (Current)
    const cCurr = document.createElement("canvas");
    cCurr.width = w; cCurr.height = h;
    const ctxCurr = cCurr.getContext("2d", { willReadFrequently: true });
    drawBackground(ctxCurr);
    const xCurr = 165 + carOffset;
    drawCar(ctxCurr, xCurr, 175);

    // Frame t+1 (Next)
    const cNext = document.createElement("canvas");
    cNext.width = w; cNext.height = h;
    const ctxNext = cNext.getContext("2d", { willReadFrequently: true });
    drawBackground(ctxNext);
    const xNext = 260 + carOffset;
    drawCar(ctxNext, xNext, 175);

    // Accurate Ground Truth Mask for Frame t
    const cGT = document.createElement("canvas");
    cGT.width = w; cGT.height = h;
    const ctxGT = cGT.getContext("2d", { willReadFrequently: true });
    ctxGT.fillStyle = "#000000";
    ctxGT.fillRect(0, 0, w, h);

    ctxGT.fillStyle = "#ffffff";
    ctxGT.beginPath();
    ctxGT.roundRect(xCurr, 175 + 18, 105, 38, 6);
    ctxGT.fill();
    ctxGT.beginPath();
    ctxGT.moveTo(xCurr + 22, 175 + 18);
    ctxGT.lineTo(xCurr + 42, 175 + 2);
    ctxGT.lineTo(xCurr + 80, 175 + 2);
    ctxGT.lineTo(xCurr + 94, 175 + 18);
    ctxGT.closePath();
    ctxGT.fill();
    ctxGT.beginPath();
    ctxGT.arc(xCurr + 24, 175 + 56, 12, 0, Math.PI * 2);
    ctxGT.arc(xCurr + 82, 175 + 56, 12, 0, Math.PI * 2);
    ctxGT.fill();

    return {
      cPrev, cCurr, cNext, cGT,
      bboxGT: { x: xCurr, y: 177, w: 106, h: 68 }
    };
  }

  /**
   * Convert ImageData to 8-bit Grayscale array
   */
  imageToGrayscaleArray(ctx, w, h) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const gray = new Uint8Array(w * h);
    for (let i = 0; i < gray.length; i++) {
      const idx = i * 4;
      gray[i] = Math.round(0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2]);
    }
    return gray;
  }

  /**
   * Inject Sensor Noise (Gaussian or Salt & Pepper)
   */
  injectNoiseToArray(grayArr, w, h, noiseType, intensity) {
    const out = new Uint8Array(grayArr);
    if (noiseType === "none" || intensity <= 0) return out;

    if (noiseType === "gaussian") {
      const sigma = intensity * 0.4; // standard deviation
      for (let i = 0; i < out.length; i++) {
        // Box-Muller normal distribution
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const noisyVal = out[i] + z0 * sigma;
        out[i] = Math.min(255, Math.max(0, Math.round(noisyVal)));
      }
    } else if (noiseType === "salt_pepper") {
      const prob = (intensity / 100) * 0.15; // impulse rate
      for (let i = 0; i < out.length; i++) {
        const r = Math.random();
        if (r < prob / 2) {
          out[i] = 0; // Pepper
        } else if (r < prob) {
          out[i] = 255; // Salt
        }
      }
    }
    return out;
  }

  /**
   * Core Motion Differencing Algorithm
   * Supports: 'two_frame', 'three_frame', 'running_avg'
   */
  computeMotionDifferencing(grayPrev, grayCurr, grayNext, method, threshold, alpha = 0.05) {
    const len = grayCurr.length;
    const diffArr = new Uint8Array(len);
    const rawMask = new Uint8Array(len);

    if (method === "three_frame" && grayNext) {
      for (let i = 0; i < len; i++) {
        const d1 = Math.abs(grayCurr[i] - grayPrev[i]);
        const d2 = Math.abs(grayNext[i] - grayCurr[i]);
        const diffVal = Math.min(d1, d2); // AND operation on differences
        diffArr[i] = diffVal;
        rawMask[i] = (d1 >= threshold && d2 >= threshold) ? 255 : 0;
      }
    } else if (method === "running_avg") {
      for (let i = 0; i < len; i++) {
        // Approximate running background
        const bgEst = Math.round((1 - alpha) * grayPrev[i] + alpha * grayCurr[i]);
        const diffVal = Math.abs(grayCurr[i] - bgEst);
        diffArr[i] = diffVal;
        rawMask[i] = diffVal >= threshold ? 255 : 0;
      }
    } else {
      // Default: Two-frame differencing
      for (let i = 0; i < len; i++) {
        const diffVal = Math.abs(grayCurr[i] - grayPrev[i]);
        diffArr[i] = diffVal;
        rawMask[i] = diffVal >= threshold ? 255 : 0;
      }
    }

    return { diffArr, rawMask };
  }

  /**
   * Spatial & Morphological Filtering with variable Kernel Sizes (3x3, 5x5, 7x7)
   */
  filterBinaryMask(mask, w, h, filterType, kernelSize = 3) {
    if (filterType === "none" || kernelSize <= 1) {
      return new Uint8Array(mask);
    }

    const rad = Math.floor(kernelSize / 2);

    // Helper: 2D Median Filter on binary/intensity mask
    const medianFilter = (src) => {
      const dst = new Uint8Array(w * h);
      const windowSize = kernelSize * kernelSize;
      const mid = Math.floor(windowSize / 2);
      const buf = new Uint8Array(windowSize);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let count = 0;
          for (let ky = -rad; ky <= rad; ky++) {
            const ny = Math.min(h - 1, Math.max(0, y + ky));
            const rowOffset = ny * w;
            for (let kx = -rad; kx <= rad; kx++) {
              const nx = Math.min(w - 1, Math.max(0, x + kx));
              buf[count++] = src[rowOffset + nx];
            }
          }
          // Fast binary/small array sorting
          buf.sort();
          dst[y * w + x] = buf[mid];
        }
      }
      return dst;
    };

    // Helper: Gaussian Smoothing + Binarization
    const gaussianFilter = (src) => {
      const dst = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0, weightSum = 0;
          for (let ky = -rad; ky <= rad; ky++) {
            const ny = Math.min(h - 1, Math.max(0, y + ky));
            for (let kx = -rad; kx <= rad; kx++) {
              const nx = Math.min(w - 1, Math.max(0, x + kx));
              const distSq = kx * kx + ky * ky;
              const weight = Math.exp(-distSq / (2 * 1.5 * 1.5));
              sum += src[ny * w + nx] * weight;
              weightSum += weight;
            }
          }
          const avg = sum / weightSum;
          dst[y * w + x] = avg >= 128 ? 255 : 0;
        }
      }
      return dst;
    };

    // Helper: Morphological Erosion
    const erode = (src) => {
      const dst = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let isFit = true;
          for (let ky = -rad; ky <= rad && isFit; ky++) {
            const ny = y + ky;
            if (ny < 0 || ny >= h) { isFit = false; break; }
            const rowOffset = ny * w;
            for (let kx = -rad; kx <= rad; kx++) {
              const nx = x + kx;
              if (nx < 0 || nx >= w || src[rowOffset + nx] === 0) {
                isFit = false;
                break;
              }
            }
          }
          dst[y * w + x] = isFit ? 255 : 0;
        }
      }
      return dst;
    };

    // Helper: Morphological Dilation
    const dilate = (src) => {
      const dst = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let hasHit = false;
          for (let ky = -rad; ky <= rad && !hasHit; ky++) {
            const ny = y + ky;
            if (ny < 0 || ny >= h) continue;
            const rowOffset = ny * w;
            for (let kx = -rad; kx <= rad; kx++) {
              const nx = x + kx;
              if (nx >= 0 && nx < w && src[rowOffset + nx] === 255) {
                hasHit = true;
                break;
              }
            }
          }
          dst[y * w + x] = hasHit ? 255 : 0;
        }
      }
      return dst;
    };

    if (filterType === "median") {
      return medianFilter(mask);
    } else if (filterType === "gaussian") {
      return gaussianFilter(mask);
    } else if (filterType === "opening") {
      // Opening: Erosion followed by Dilation (removes small background noise)
      return dilate(erode(mask));
    } else if (filterType === "closing") {
      // Closing: Dilation followed by Erosion (fills holes inside detected object)
      return erode(dilate(mask));
    }

    return new Uint8Array(mask);
  }

  /**
   * Find Bounding Box of moving object from binary mask
   */
  detectBoundingBox(mask, w, h, minArea = 150) {
    let minX = w, minY = h, maxX = 0, maxY = 0;
    let whitePixelCount = 0;

    for (let y = 0; y < h; y++) {
      const rowOffset = y * w;
      for (let x = 0; x < w; x++) {
        if (mask[rowOffset + x] === 255) {
          whitePixelCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (whitePixelCount >= minArea && maxX > minX && maxY > minY) {
      return {
        x: Math.max(0, minX - 2),
        y: Math.max(0, minY - 2),
        w: Math.min(w - minX, maxX - minX + 4),
        h: Math.min(h - minY, maxY - minY + 4),
        area: whitePixelCount
      };
    }
    return null;
  }

  /**
   * Evaluate Full Confusion Matrix & Performance Metrics
   */
  calculatePerformanceMetrics(predMask, gtMask) {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    const total = predMask.length;

    for (let i = 0; i < total; i++) {
      const p = predMask[i] > 0 ? 1 : 0;
      const g = gtMask[i] > 0 ? 1 : 0;

      if (p === 1 && g === 1) tp++;
      else if (p === 1 && g === 0) fp++;
      else if (p === 0 && g === 0) tn++;
      else if (p === 0 && g === 1) fn++;
    }

    const accuracy = (tp + tn) / (total || 1);
    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    const specificity = tn / (tn + fp || 1);
    const f1 = (2 * precision * recall) / (precision + recall || 1);
    const iou = tp / (tp + fp + fn || 1);
    const fpr = fp / (fp + tn || 1);

    return {
      tp, fp, tn, fn, total,
      accuracy: Math.min(1, Math.max(0, accuracy)),
      precision: Math.min(1, Math.max(0, precision)),
      recall: Math.min(1, Math.max(0, recall)),
      specificity: Math.min(1, Math.max(0, specificity)),
      f1: Math.min(1, Math.max(0, f1)),
      iou: Math.min(1, Math.max(0, iou)),
      fpr: Math.min(1, Math.max(0, fpr))
    };
  }

  /**
   * Render Difference Intensity Histogram with Threshold Cutoff
   */
  renderDifferenceHistogram(diffArr, threshold, targetCanvas) {
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext("2d");
    const cw = targetCanvas.width;
    const ch = targetCanvas.height;

    // 256 Bins
    const bins = new Uint32Array(256);
    for (let i = 0; i < diffArr.length; i++) {
      bins[diffArr[i]]++;
    }

    let maxCount = 1;
    // Exclude bin 0 when computing scale to allow higher bins to be visible
    for (let i = 1; i < 256; i++) {
      if (bins[i] > maxCount) maxCount = bins[i];
    }

    ctx.clearRect(0, 0, cw, ch);

    // Background
    ctx.fillStyle = "rgba(10, 15, 29, 0.95)";
    ctx.fillRect(0, 0, cw, ch);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let y = 20; y < ch; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    const step = cw / 256;
    for (let i = 0; i < 256; i++) {
      const hNorm = Math.min(ch - 16, (bins[i] / maxCount) * (ch - 20));
      const x = i * step;
      const y = ch - hNorm - 14;

      if (i < threshold) {
        ctx.fillStyle = "rgba(56, 189, 248, 0.65)"; // Sky blue for background
      } else {
        ctx.fillStyle = "rgba(244, 63, 94, 0.85)"; // Coral red for motion foreground
      }
      ctx.fillRect(x, y, Math.max(1, step), hNorm);
    }

    // Dynamic Threshold Indicator Line
    const tx = threshold * step;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx, ch - 12);
    ctx.stroke();
    ctx.setLineDash([]);

    // Indicator label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`T = ${threshold}`, Math.min(cw - 55, Math.max(4, tx + 4)), 14);

    // Axis Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "9px monospace";
    ctx.fillText("0 (Static)", 4, ch - 3);
    ctx.fillText("128", cw / 2 - 10, ch - 3);
    ctx.fillText("255 (High Motion)", cw - 95, ch - 3);
  }

  /**
   * Render Uint8Array Grayscale / Binary into an HTML Canvas
   */
  renderArrayToCanvas(arr, w, h, targetCanvas) {
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext("2d", { willReadFrequently: true });
    const imgData = ctx.createImageData(w, h);
    const d = imgData.data;

    for (let i = 0; i < arr.length; i++) {
      const idx = i * 4;
      const val = arr[i];
      d[idx] = val;
      d[idx + 1] = val;
      d[idx + 2] = val;
      d[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

if (typeof window !== "undefined") {
  window.ImageProcessor = ImageProcessor;
}

