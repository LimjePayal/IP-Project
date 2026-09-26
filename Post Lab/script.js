/**
 * script.js
 * Main Controller for Image Processing Laboratory Web Portal
 * Connects Login -> 12 Practicals Hub -> Live Studio -> End Submission & Certificate
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentUser: {
      name: "Payal Limje",
      roll: "CS24219",
      role: "student"
    },
    activeView: "login",
    activeCategory: "all",
    searchQuery: "",
    currentPracticalId: 2, // Default to Post Lab 02 (Color Spaces)
    completedPracticals: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), // All 12 completed by default for full demonstration
    activeTab: "tab-details"
  };

  // Image Processor instances safely initialized
  let studioProcessor = null;
  try {
    if (typeof ImageProcessor !== "undefined") {
      studioProcessor = new ImageProcessor();
      studioProcessor.init("studio-orig-canvas", "studio-proc-canvas", "studio-hist-canvas");
    }
  } catch (e) {
    console.warn("ImageProcessor init warning:", e);
  }

  // DOM Elements
  const views = {
    login: document.getElementById("login-view"),
    dashboard: document.getElementById("dashboard-view"),
    end: document.getElementById("end-view")
  };

  // Switch Active View
  function showView(viewKey) {
    state.activeView = viewKey;
    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove("active");
      }
    });
    if (views[viewKey]) {
      views[viewKey].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    try {
      if (viewKey === "dashboard") {
        renderPracticalsNav();
        loadPracticalDetails(state.currentPracticalId);
        if (studioProcessor && studioProcessor.loadImage) {
          studioProcessor.loadImage("cat", () => {
            studioProcessor.applyFilter("none");
          });
        }
      } else if (viewKey === "end") {
        renderCertificateTable();
      }
    } catch (err) {
      console.error("View rendering error:", err);
    }
  }

  // Authentication Handlers
  const loginForm = document.getElementById("login-form");
  const quickLoginBtn = document.getElementById("btn-quick-login");
  const nameInput = document.getElementById("student-name-input");
  const rollInput = document.getElementById("student-roll-input");
  const roleSelect = document.getElementById("student-role-select");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.currentUser.name = nameInput.value.trim() || "Payal Limje";
      state.currentUser.roll = rollInput.value.trim() || "CS24219";
      state.currentUser.role = roleSelect.value;
      updateUserDisplay();
      showView("dashboard");
    });
  }

  if (quickLoginBtn) {
    quickLoginBtn.addEventListener("click", () => {
      state.currentUser.name = "Payal Limje";
      state.currentUser.roll = "CS24219";
      state.currentUser.role = "student";
      nameInput.value = "Payal Limje";
      rollInput.value = "CS24219";
      updateUserDisplay();
      showView("dashboard");
    });
  }

  function updateUserDisplay() {
    const navUsername = document.getElementById("nav-username");
    const navAvatar = document.getElementById("nav-avatar");
    const certStudentName = document.getElementById("cert-student-name");
    const certStudentRoll = document.getElementById("cert-student-roll");

    if (navUsername) navUsername.textContent = state.currentUser.name;
    if (certStudentName) certStudentName.textContent = state.currentUser.name;
    if (certStudentRoll) certStudentRoll.textContent = state.currentUser.roll;

    const initials = state.currentUser.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    if (navAvatar) navAvatar.textContent = initials || "PL";
  }

  // Navigation Profile & End Page Buttons
  const btnUserProfile = document.getElementById("btn-user-profile");
  if (btnUserProfile) {
    btnUserProfile.addEventListener("click", () => {
      if (confirm("Sign out and return to the Student Login portal?")) {
        showView("login");
      }
    });
  }

  const btnGotoEndPage = document.getElementById("btn-goto-end-page");
  if (btnGotoEndPage) {
    btnGotoEndPage.addEventListener("click", () => {
      showView("end");
    });
  }

  const btnBackToHub = document.getElementById("btn-back-to-hub");
  if (btnBackToHub) {
    btnBackToHub.addEventListener("click", () => {
      showView("dashboard");
    });
  }

  const btnPrintCertificate = document.getElementById("btn-print-certificate");
  if (btnPrintCertificate) {
    btnPrintCertificate.addEventListener("click", () => {
      window.print();
    });
  }

  // Tab switching: Manual vs Studio
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
      state.activeTab = targetId;

      if (targetId === "tab-studio") {
        // Automatically sync sample image with current practical
        const currentPrac = PRACTICALS_DATA.find(p => p.id === state.currentPracticalId);
        if (currentPrac) {
          syncStudioWithPractical(currentPrac);
        }
      } else if (targetId === "tab-differencing") {
        runDifferencingPipeline();
      }
    });
  });

  // Category Filtering
  const categoryPills = document.querySelectorAll(".filter-pill");
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.activeCategory = pill.getAttribute("data-cat");
      renderPracticalsNav();
    });
  });

  // Search filter
  const searchInput = document.getElementById("practical-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      renderPracticalsNav();
    });
  }

  // Render Sidebar Practicals Nav List
  function renderPracticalsNav() {
    const navList = document.getElementById("practicals-nav-list");
    if (!navList) return;

    const filtered = PRACTICALS_DATA.filter(prac => {
      const matchCat = state.activeCategory === "all" || prac.category === state.activeCategory;
      const matchSearch =
        !state.searchQuery ||
        prac.title.toLowerCase().includes(state.searchQuery) ||
        prac.aim.toLowerCase().includes(state.searchQuery) ||
        prac.number.toLowerCase().includes(state.searchQuery) ||
        prac.code.toLowerCase().includes(state.searchQuery);
      return matchCat && matchSearch;
    });

    navList.innerHTML = "";
    filtered.forEach(prac => {
      const item = document.createElement("a");
      item.href = "javascript:void(0)";
      item.className = `practical-nav-item ${prac.id === state.currentPracticalId ? "active" : ""} ${state.completedPracticals.has(prac.id) ? "completed" : ""}`;
      item.innerHTML = `
        <span class="item-badge-num">${prac.id < 10 ? '0' + prac.id : prac.id}</span>
        <div class="item-content">
          <h5>${prac.number}: ${prac.title}</h5>
          <span class="item-category-tag">${prac.category}</span>
        </div>
        <div class="item-check-icon">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      `;

      item.addEventListener("click", () => {
        state.currentPracticalId = prac.id;
        renderPracticalsNav();
        loadPracticalDetails(prac.id);
      });

      navList.appendChild(item);
    });

    updateProgressCounter();
  }

  function updateProgressCounter() {
    const navProgressText = document.getElementById("nav-progress-text");
    const endCompletedCount = document.getElementById("end-completed-count");
    const count = state.completedPracticals.size;
    const total = PRACTICALS_DATA.length;

    if (navProgressText) navProgressText.textContent = `${count} / ${total} Completed`;
    if (endCompletedCount) endCompletedCount.textContent = `${count} / ${total}`;
  }

  // Load Practical Details into View
  function loadPracticalDetails(practicalId) {
    const prac = PRACTICALS_DATA.find(p => p.id === practicalId);
    if (!prac) return;

    // Header & Meta
    document.getElementById("practical-num-badge").textContent = prac.number;
    document.getElementById("date-performed").textContent = prac.performedDate;
    document.getElementById("date-submission").textContent = prac.submissionDate;
    document.getElementById("academic-session").textContent = prac.session;
    document.getElementById("practical-title-text").textContent = prac.title;
    document.getElementById("practical-aim-text").textContent = prac.aim;

    // Completion Toggle Button
    const btnToggleComplete = document.getElementById("btn-toggle-complete");
    if (btnToggleComplete) {
      if (state.completedPracticals.has(prac.id)) {
        btnToggleComplete.classList.add("is-done");
        btnToggleComplete.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span>Practical Completed & Verified</span>
        `;
      } else {
        btnToggleComplete.classList.remove("is-done");
        btnToggleComplete.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Mark Practical as Completed</span>
        `;
      }

      btnToggleComplete.onclick = () => {
        if (state.completedPracticals.has(prac.id)) {
          state.completedPracticals.delete(prac.id);
        } else {
          state.completedPracticals.add(prac.id);
        }
        renderPracticalsNav();
        loadPracticalDetails(prac.id);
      };
    }

    // Jump to Project 23 Motion Differencing Lab Button
    const btnJumpDiff = document.getElementById("btn-jump-differencing");
    if (btnJumpDiff) {
      if (prac.id === 12) {
        btnJumpDiff.style.display = "inline-flex";
        btnJumpDiff.onclick = () => {
          const tabDiffBtn = document.getElementById("tab-btn-differencing");
          if (tabDiffBtn) tabDiffBtn.click();
        };
      } else {
        btnJumpDiff.style.display = "none";
      }
    }

    // Objectives List
    const objList = document.getElementById("practical-objectives-list");
    objList.innerHTML = "";
    prac.objectives.forEach(obj => {
      const li = document.createElement("li");
      li.textContent = obj;
      objList.appendChild(li);
    });

    // Theory (Simple Markdown parser)
    const theoryBox = document.getElementById("practical-theory-content");
    theoryBox.innerHTML = renderMarkdown(prac.theory);

    // Code Snippet
    const codeSnippetBox = document.getElementById("code-snippet-box");
    codeSnippetBox.textContent = prac.code;

    // Output description & Conclusion
    document.getElementById("output-description-text").textContent = prac.outputDescription;
    document.getElementById("practical-conclusion-text").textContent = prac.conclusion;

    // Viva Questions Accordion
    const vivaList = document.getElementById("viva-questions-list");
    vivaList.innerHTML = "";
    prac.vivaQuestions.forEach((viva, idx) => {
      const item = document.createElement("div");
      item.className = "viva-item";
      item.innerHTML = `
        <div class="viva-question">
          <span>Q${idx + 1}: ${viva.q}</span>
          <svg class="viva-chevron" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        <div class="viva-answer">${viva.a}</div>
      `;
      const qBtn = item.querySelector(".viva-question");
      qBtn.addEventListener("click", () => {
        item.classList.toggle("open");
      });
      vivaList.appendChild(item);
    });

    // References List
    const refList = document.getElementById("practical-references-list");
    refList.innerHTML = "";
    prac.references.forEach(ref => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = ref.startsWith("http") ? ref : "javascript:void(0)";
      a.textContent = ref;
      a.target = "_blank";
      a.style.color = "inherit";
      li.appendChild(a);
      refList.appendChild(li);
    });

    // Render interactive Before / After slider canvases
    setupBeforeAfterCanvases(prac);
  }

  // Setup interactive Before / After Visualizer Canvases
  function setupBeforeAfterCanvases(prac) {
    try {
      const cBefore = document.getElementById("canvas-ba-before");
      const cAfter = document.getElementById("canvas-ba-after");
      if (!cBefore || !cAfter) return;

      if (!studioProcessor || !studioProcessor.generateSampleImage) return;

      const tempOrig = studioProcessor.generateSampleImage(prac.sampleType || "cat");
      const ctxB = cBefore.getContext("2d");
      const ctxA = cAfter.getContext("2d");

      ctxB.clearRect(0, 0, cBefore.width, cBefore.height);
      ctxB.drawImage(tempOrig, 0, 0, cBefore.width, cBefore.height);

      if (typeof ImageProcessor !== "undefined") {
        const dummyProc = new ImageProcessor();
        dummyProc.canvasOriginal = cBefore;
        dummyProc.canvasProcessed = cAfter;
        dummyProc.ctxOrig = ctxB;
        dummyProc.ctxProc = ctxA;
        dummyProc.currentImage = tempOrig;
        dummyProc.applyFilter(prac.filterAction || "grayscale");
      }
    } catch (e) {
      console.warn("Before/after setup warning:", e);
    }
  }

  // Interactive Dragging on Before / After Slider
  const baContainer = document.getElementById("ba-container");
  const baHandle = document.getElementById("ba-handle");
  const baAfterWrapper = document.getElementById("ba-after-wrapper");
  let isDragging = false;

  if (baContainer && baHandle && baAfterWrapper) {
    const onMove = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let pos = clientX - rect.left;
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;
      const pct = (pos / rect.width) * 100;
      baHandle.style.left = `${pct}%`;
      baAfterWrapper.style.width = `${pct}%`;
    };

    baHandle.addEventListener("mousedown", () => { isDragging = true; });
    window.addEventListener("mouseup", () => { isDragging = false; });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) onMove(e.clientX);
    });

    // Touch support for mobile / tablet
    baHandle.addEventListener("touchstart", () => { isDragging = true; });
    window.addEventListener("touchend", () => { isDragging = false; });
    window.addEventListener("touchmove", (e) => {
      if (isDragging && e.touches.length > 0) {
        onMove(e.touches[0].clientX);
      }
    });
  }

  // 1-Click Code Copy Handler
  const btnCopyCode = document.getElementById("btn-copy-code");
  const copyLabel = document.getElementById("copy-label");
  if (btnCopyCode && copyLabel) {
    btnCopyCode.addEventListener("click", () => {
      const code = document.getElementById("code-snippet-box").textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyLabel.textContent = "Copied!";
        btnCopyCode.style.borderColor = "var(--primary)";
        setTimeout(() => {
          copyLabel.textContent = "Copy Code";
          btnCopyCode.style.borderColor = "var(--border-color)";
        }, 2000);
      });
    });
  }

  // Sync Studio with Practical
  function syncStudioWithPractical(prac) {
    const presetBtns = document.querySelectorAll(".btn-preset");
    presetBtns.forEach(btn => {
      if (btn.getAttribute("data-preset") === prac.sampleType) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    studioProcessor.loadImage(prac.sampleType || "cat", () => {
      const filterBtns = document.querySelectorAll(".btn-filter-action");
      filterBtns.forEach(btn => {
        if (btn.getAttribute("data-filter") === prac.filterAction) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      studioProcessor.applyFilter(prac.filterAction || "grayscale");
      document.getElementById("studio-active-tag").textContent = `ACTIVE: ${prac.filterAction.toUpperCase()}`;
    });
  }

  // Studio Presets Buttons
  const presetBtns = document.querySelectorAll(".btn-preset");
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const presetKey = btn.getAttribute("data-preset");
      studioProcessor.loadImage(presetKey, () => {
        studioProcessor.applyFilter(studioProcessor.activeFilter || "none");
      });
    });
  });

  // Studio File Upload Handler
  const uploadBox = document.getElementById("upload-box");
  const fileInput = document.getElementById("image-file-input");
  if (uploadBox && fileInput) {
    uploadBox.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        presetBtns.forEach(b => b.classList.remove("active"));
        studioProcessor.loadUserFile(e.target.files[0], () => {
          studioProcessor.applyFilter("none");
        });
      }
    });
  }

  // Studio Filter Buttons
  const filterBtns = document.querySelectorAll(".btn-filter-action");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterKey = btn.getAttribute("data-filter");
      studioProcessor.applyFilter(filterKey);
      document.getElementById("studio-active-tag").textContent = `ACTIVE: ${filterKey.toUpperCase()}`;
    });
  });

  // Studio Parameter Sliders
  const sliderThreshold = document.getElementById("slider-threshold");
  const lblThreshold = document.getElementById("lbl-threshold");
  if (sliderThreshold) {
    sliderThreshold.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      if (lblThreshold) lblThreshold.textContent = val;
      studioProcessor.applyFilter("threshold", { threshold: val });
    });
  }

  const sliderCannyLow = document.getElementById("slider-canny-low");
  const lblCannyLow = document.getElementById("lbl-canny-low");
  const sliderCannyHigh = document.getElementById("slider-canny-high");
  const lblCannyHigh = document.getElementById("lbl-canny-high");

  if (sliderCannyLow && sliderCannyHigh) {
    const updateCanny = () => {
      const low = parseInt(sliderCannyLow.value);
      const high = parseInt(sliderCannyHigh.value);
      if (lblCannyLow) lblCannyLow.textContent = low;
      if (lblCannyHigh) lblCannyHigh.textContent = high;
      studioProcessor.applyFilter("canny", { cannyLow: low, cannyHigh: high });
    };
    sliderCannyLow.addEventListener("input", updateCanny);
    sliderCannyHigh.addEventListener("input", updateCanny);
  }

  // =========================================================================
  // PROJECT 23: MOTION & FRAME DIFFERENCING CONTROLLER
  // =========================================================================
  let diffCarOffset = 0;
  let diffAnimTimer = null;
  let diffKernelSize = 5;

  function runDifferencingPipeline() {
    if (!studioProcessor || !studioProcessor.generateSurveillanceFrames) return;

    const algo = document.getElementById("diff-select-algo") ? document.getElementById("diff-select-algo").value : "two_frame";
    const noiseType = document.getElementById("diff-select-noise") ? document.getElementById("diff-select-noise").value : "salt_pepper";
    const noiseLevel = document.getElementById("diff-slider-noise") ? parseInt(document.getElementById("diff-slider-noise").value) : 35;
    const threshold = document.getElementById("diff-slider-thresh") ? parseInt(document.getElementById("diff-slider-thresh").value) : 30;
    const filterType = document.getElementById("diff-select-filter") ? document.getElementById("diff-select-filter").value : "median";

    // 1. Generate Synthetic Surveillance Frames + Ground Truth Mask (480x320)
    const { cPrev, cCurr, cNext, cGT, bboxGT } = studioProcessor.generateSurveillanceFrames(diffCarOffset);
    const w = cCurr.width, h = cCurr.height;

    // 2. Convert to Grayscale
    const ctxPrev = cPrev.getContext("2d", { willReadFrequently: true });
    const ctxCurr = cCurr.getContext("2d", { willReadFrequently: true });
    const ctxNext = cNext.getContext("2d", { willReadFrequently: true });
    const ctxGT = cGT.getContext("2d", { willReadFrequently: true });

    const grayPrev = studioProcessor.imageToGrayscaleArray(ctxPrev, w, h);
    const grayCurr = studioProcessor.imageToGrayscaleArray(ctxCurr, w, h);
    const grayNext = studioProcessor.imageToGrayscaleArray(ctxNext, w, h);
    const gtMask = studioProcessor.imageToGrayscaleArray(ctxGT, w, h);

    // 3. Inject Noise into active frame
    const noisyCurr = studioProcessor.injectNoiseToArray(grayCurr, w, h, noiseType, noiseLevel);

    // 4. Compute Differencing & Raw Binary Mask
    const { diffArr, rawMask } = studioProcessor.computeMotionDifferencing(
      grayPrev, noisyCurr, grayNext, algo, threshold
    );

    // 5. Apply Spatial or Morphological Filter with chosen Kernel Size
    const cleanMask = studioProcessor.filterBinaryMask(rawMask, w, h, filterType, diffKernelSize);

    // 6. Detect Bounding Box on Clean Mask
    const detectedBBox = studioProcessor.detectBoundingBox(cleanMask, w, h);

    // 7. Calculate Full Confusion Matrix & Performance Metrics
    const metrics = studioProcessor.calculatePerformanceMetrics(cleanMask, gtMask);

    // 8. Render to 5-Stage Sequential Canvases
    const cF1 = document.getElementById("canvas-diff-f1");
    const cF2 = document.getElementById("canvas-diff-f2");
    const cF3 = document.getElementById("canvas-diff-f3");
    const cF4 = document.getElementById("canvas-diff-f4");
    const cF5 = document.getElementById("canvas-diff-f5");

    if (cF1) {
      const ctx1 = cF1.getContext("2d");
      ctx1.drawImage(cPrev, 0, 0, cF1.width, cF1.height);
    }

    if (cF2) {
      const ctx2 = cF2.getContext("2d");
      ctx2.drawImage(cCurr, 0, 0, cF2.width, cF2.height);
      // If noise is active, visually render simulated noisy grain on stage 2
      if (noiseType !== "none" && noiseLevel > 0) {
        ctx2.fillStyle = "rgba(255, 255, 255, 0.08)";
        for (let i = 0; i < noiseLevel * 10; i++) {
          const rx = Math.random() * cF2.width, ry = Math.random() * cF2.height;
          ctx2.fillRect(rx, ry, 1.5, 1.5);
        }
      }
    }

    if (cF3) {
      // Stage 3: Grayscale Absolute Difference Image
      const tempC3 = document.createElement("canvas");
      tempC3.width = w; tempC3.height = h;
      studioProcessor.renderArrayToCanvas(diffArr, w, h, tempC3);
      const ctx3 = cF3.getContext("2d");
      ctx3.drawImage(tempC3, 0, 0, cF3.width, cF3.height);
    }

    if (cF4) {
      // Stage 4: Raw Thresholded Binary Mask
      const tempC4 = document.createElement("canvas");
      tempC4.width = w; tempC4.height = h;
      studioProcessor.renderArrayToCanvas(rawMask, w, h, tempC4);
      const ctx4 = cF4.getContext("2d");
      ctx4.drawImage(tempC4, 0, 0, cF4.width, cF4.height);
    }

    if (cF5) {
      // Stage 5: Final Post-Processed Mask with Bounding Box
      const ctx5 = cF5.getContext("2d");
      ctx5.drawImage(cCurr, 0, 0, cF5.width, cF5.height);

      const sx = cF5.width / w;
      const sy = cF5.height / h;

      // Draw semi-transparent green mask highlight
      const tempC5 = document.createElement("canvas");
      tempC5.width = w; tempC5.height = h;
      const tCtx5 = tempC5.getContext("2d");
      const imgData5 = tCtx5.createImageData(w, h);
      for (let i = 0; i < cleanMask.length; i++) {
        if (cleanMask[i] === 255) {
          const idx = i * 4;
          imgData5.data[idx] = 16;      // R
          imgData5.data[idx + 1] = 185; // G
          imgData5.data[idx + 2] = 129; // B
          imgData5.data[idx + 3] = 180; // Alpha
        }
      }
      tCtx5.putImageData(imgData5, 0, 0);
      ctx5.drawImage(tempC5, 0, 0, cF5.width, cF5.height);

      // Draw Green Detection Bounding Box
      if (detectedBBox) {
        const bx = detectedBBox.x * sx;
        const by = detectedBBox.y * sy;
        const bw = detectedBBox.w * sx;
        const bh = detectedBBox.h * sy;

        ctx5.strokeStyle = "#10b981";
        ctx5.lineWidth = 2.5;
        ctx5.strokeRect(bx, by, bw, bh);

        ctx5.fillStyle = "rgba(16, 185, 129, 0.9)";
        ctx5.fillRect(bx, Math.max(0, by - 18), 125, 18);

        ctx5.fillStyle = "#ffffff";
        ctx5.font = "bold 10px monospace";
        ctx5.fillText(`TARGET [IoU: ${(metrics.iou * 100).toFixed(1)}%]`, bx + 4, Math.max(12, by - 5));
      }
    }

    // 9. Render Difference Histogram
    const cHist = document.getElementById("canvas-diff-hist");
    if (cHist) {
      studioProcessor.renderDifferenceHistogram(diffArr, threshold, cHist);
    }

    // Calculate Otsu's optimal threshold for recommendation badge
    let otsuT = 28;
    try {
      const hist = new Float64Array(256);
      for (let i = 0; i < diffArr.length; i++) hist[diffArr[i]]++;
      const totalPixels = diffArr.length;
      let sum = 0;
      for (let i = 0; i < 256; i++) sum += i * hist[i];
      let sumB = 0, wB = 0, maxVar = 0;
      for (let i = 0; i < 256; i++) {
        wB += hist[i];
        if (wB === 0) continue;
        const wF = totalPixels - wB;
        if (wF === 0) break;
        sumB += i * hist[i];
        const mB = sumB / wB;
        const mF = (sum - sumB) / wF;
        const betweenVar = wB * wF * (mB - mF) * (mB - mF);
        if (betweenVar > maxVar) {
          maxVar = betweenVar;
          otsuT = i;
        }
      }
    } catch (e) {
      otsuT = 30;
    }

    const lblOtsu = document.getElementById("lbl-otsu-rec");
    if (lblOtsu) lblOtsu.textContent = `Otsu Suggestion: T ≈ ${otsuT}`;

    // 10. Update Performance Matrix UI
    const setElem = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setElem("val-accuracy", `${(metrics.accuracy * 100).toFixed(1)}%`);
    setElem("val-precision", `${(metrics.precision * 100).toFixed(1)}%`);
    setElem("val-recall", `${(metrics.recall * 100).toFixed(1)}%`);
    setElem("val-specificity", `${(metrics.specificity * 100).toFixed(1)}%`);
    setElem("val-f1", metrics.f1.toFixed(3));
    setElem("val-iou", metrics.iou.toFixed(3));

    setElem("val-tp", metrics.tp.toLocaleString());
    setElem("val-fp", metrics.fp.toLocaleString());
    setElem("val-fn", metrics.fn.toLocaleString());
    setElem("val-tn", metrics.tn.toLocaleString());
  }

  // Setup Event Listeners for Project 23 Differencing Controls
  function initDifferencingControls() {
    const selAlgo = document.getElementById("diff-select-algo");
    if (selAlgo) selAlgo.addEventListener("change", runDifferencingPipeline);

    const selNoise = document.getElementById("diff-select-noise");
    if (selNoise) selNoise.addEventListener("change", runDifferencingPipeline);

    const sliderNoise = document.getElementById("diff-slider-noise");
    const lblNoise = document.getElementById("lbl-diff-noise");
    if (sliderNoise) {
      sliderNoise.addEventListener("input", (e) => {
        if (lblNoise) lblNoise.textContent = `${e.target.value}%`;
        runDifferencingPipeline();
      });
    }

    const sliderThresh = document.getElementById("diff-slider-thresh");
    const lblThresh = document.getElementById("lbl-diff-thresh");
    const overlayThresh = document.querySelectorAll(".overlay-thresh-val");
    if (sliderThresh) {
      sliderThresh.addEventListener("input", (e) => {
        const val = e.target.value;
        if (lblThresh) lblThresh.textContent = val;
        overlayThresh.forEach(el => el.textContent = val);
        runDifferencingPipeline();
      });
    }

    const selFilter = document.getElementById("diff-select-filter");
    if (selFilter) selFilter.addEventListener("change", runDifferencingPipeline);

    const kernelBtns = document.querySelectorAll(".btn-kernel");
    kernelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        kernelBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        diffKernelSize = parseInt(btn.getAttribute("data-kernel")) || 5;
        runDifferencingPipeline();
      });
    });

    const btnStep = document.getElementById("btn-diff-step");
    if (btnStep) {
      btnStep.addEventListener("click", () => {
        diffCarOffset = (diffCarOffset + 18) % 180;
        runDifferencingPipeline();
      });
    }

    const btnReset = document.getElementById("btn-diff-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        diffCarOffset = 0;
        runDifferencingPipeline();
      });
    }

    const btnPlay = document.getElementById("btn-diff-play");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        if (diffAnimTimer) {
          clearInterval(diffAnimTimer);
          diffAnimTimer = null;
          btnPlay.innerHTML = `
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            <span>Auto Run</span>
          `;
          btnPlay.classList.remove("btn-diff-playing");
        } else {
          diffAnimTimer = setInterval(() => {
            diffCarOffset = (diffCarOffset + 12) % 200;
            runDifferencingPipeline();
          }, 240);
          btnPlay.innerHTML = `
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            <span>Pause Run</span>
          `;
          btnPlay.classList.add("btn-diff-playing");
        }
      });
    }
  }

  // Initialize Project 23 Differencing controls
  initDifferencingControls();

  // Populate Verification Table in End Page
  function renderCertificateTable() {
    const tbody = document.getElementById("cert-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    PRACTICALS_DATA.forEach(prac => {
      const tr = document.createElement("tr");
      const isDone = state.completedPracticals.has(prac.id);
      tr.innerHTML = `
        <td style="font-weight: 700; font-family: monospace;">${prac.number.replace("Practical No. ", "Prac ").replace("Post Lab ", "Lab ")}</td>
        <td><strong>${prac.title}</strong><br><span style="font-size: 0.75rem; color: #64748b;">${prac.aim.substring(0, 95)}...</span></td>
        <td>${prac.performedDate}</td>
        <td>${prac.submissionDate}</td>
        <td><span style="color: ${isDone ? '#059669' : '#dc2626'}; font-weight: 700;">${isDone ? '✓ VERIFIED' : 'PENDING'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Lightweight Markdown to HTML Renderer
  function renderMarkdown(md) {
    if (!md) return "";
    let html = md;
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    return html;
  }

  // Initialize
  showView("login");
});
