/* =========================================================
   FOR YOU — interactions
   ---------------------------------------------------------
   ⭐ TO ADD HER PHOTOS: drop files into /images and list the
   filenames in PHOTOS below. Everything else is automatic —
   the gallery, the lightbox, the floating background layer,
   and the memory game will all use them.
   ========================================================= */
const PHOTOS = [
  { file: "images/fia.jpg", caption: "" },
  { file: "images/fia1.jpg", caption: "" },
  { file: "images/fia2.jpg", caption: "" },
  { file: "images/fia3.jpg", caption: "" },
  { file: "images/fia4.jpg", caption: "" },
  { file: "images/fia5.jpg", caption: "" },
  { file: "images/fia6.jpg", caption: "" },
  { file: "images/fia7.jpg", caption: "" },
  { file: "images/fia8.jpg", caption: "" },
  { file: "images/fia9.jpg", caption: "" },
  { file: "images/fia10.jpg", caption: "" },
  { file: "images/fia11.jpg", caption: "" },
  { file: "images/fia12.jpg", caption: "" },
  { file: "images/fia13.jpg", caption: "" },
  { file: "images/fia14.jpg", caption: "" },
  { file: "images/fia15.jpg", caption: "" },
  { file: "images/fia16.jpg", caption: "" },
  { file: "images/fia17.jpg", caption: "" },
];

/* how many empty frames to show while PHOTOS is still empty */
const PLACEHOLDER_COUNT = 9;

/* ---------- boot ---------- */
window.addEventListener("load", () => {
  buildStars();
  buildFloatingPhotos();
  buildGallery();
});

/* =========================================================
   BACKGROUND
   ========================================================= */
function buildStars() {
  const layer = document.getElementById("bgStars");
  if (!layer) return;
  const n = matchMedia("(max-width:700px)").matches ? 20 : 40;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "vw";
    s.style.setProperty("--s", (1.5 + Math.random() * 2.5).toFixed(1) + "px");
    s.style.setProperty("--d", 24 + Math.random() * 26 + "s");
    s.style.setProperty("--delay", Math.random() * 30 + "s");
    s.style.setProperty("--x", (Math.random() * 100 - 50) + "px");
    s.style.setProperty("--o", (0.35 + Math.random() * 0.5).toFixed(2));
    layer.appendChild(s);
  }
}

/* her photos, drifting far in the background */
function buildFloatingPhotos() {
  const layer = document.getElementById("bgPhotos");
  if (!layer || !PHOTOS.length) return;
  const spots = [
    { top: "8%",  left: "4%",   w: 200, r: -3 },
    { top: "26%", left: "78%",  w: 165, r: 4 },
    { top: "52%", left: "8%",   w: 180, r: 2.5 },
    { top: "68%", left: "72%",  w: 210, r: -4 },
    { top: "38%", left: "44%",  w: 150, r: 3 },
    { top: "86%", left: "26%",  w: 175, r: -2 },
  ];
  spots.forEach((sp, i) => {
    const p = PHOTOS[i % PHOTOS.length];
    const fig = document.createElement("figure");
    fig.style.top = sp.top;
    fig.style.left = sp.left;
    fig.style.setProperty("--w", sp.w + "px");
    fig.style.setProperty("--r", sp.r + "deg");
    fig.style.setProperty("--d", 42 + Math.random() * 24 + "s");
    fig.style.setProperty("--delay", (Math.random() * -30).toFixed(1) + "s");
    fig.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
    fig.style.setProperty("--dy", (-30 - Math.random() * 50).toFixed(0) + "px");
    fig.style.setProperty("--o", (0.10 + Math.random() * 0.07).toFixed(2));
    const img = new Image();
    img.src = p.file;
    img.alt = "";
    img.onload = () => fig.classList.add("on");
    img.onerror = () => fig.remove();
    fig.appendChild(img);
    layer.appendChild(fig);
  });

  /* gentle parallax on scroll */
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      [...layer.children].forEach((f, i) => {
        f.style.marginTop = (-y * (0.03 + (i % 3) * 0.015)).toFixed(1) + "px";
      });
      ticking = false;
    });
  }, { passive: true });
}

/* =========================================================
   GALLERY + LIGHTBOX
   ========================================================= */
const galleryItems = [];

function buildGallery() {
  const grid = document.getElementById("gallery");
  const note = document.getElementById("galleryNote");
  if (!grid) return;

  if (PHOTOS.length) {
    PHOTOS.forEach((p, i) => {
      const fig = document.createElement("figure");
      const img = new Image();
      img.src = p.file;
      img.alt = p.caption || "";
      img.loading = "lazy";
      img.onerror = () => fig.remove();
      fig.appendChild(img);
      fig.addEventListener("click", () => openLightbox(i));
      grid.appendChild(fig);
      galleryItems.push(p);
    });
    if (note) note.textContent = "";
  } else {
    const ratios = ["3/4", "1/1", "4/5", "3/4", "1/1", "4/3", "3/4", "4/5", "1/1"];
    for (let i = 0; i < PLACEHOLDER_COUNT; i++) {
      const fig = document.createElement("figure");
      const ph = document.createElement("div");
      ph.className = "ph";
      ph.style.setProperty("--ar", ratios[i % ratios.length]);
      ph.textContent = "her photo";
      fig.appendChild(ph);
      grid.appendChild(fig);
    }
    if (note) note.textContent = "Add her photos to the images folder and they'll appear here.";
  }

  /* staggered fade-in as they scroll into view */
  const gio = new IntersectionObserver((es) => {
    es.forEach((e, k) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("in"), k * 70);
        gio.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  [...grid.children].forEach((c) => gio.observe(c));
}

const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let lbIndex = 0;

function openLightbox(i) {
  if (!galleryItems.length) return;
  lbIndex = i;
  lbImg.src = galleryItems[i].file;
  lbCap.textContent = galleryItems[i].caption || "";
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
}
function stepLightbox(d) {
  lbIndex = (lbIndex + d + galleryItems.length) % galleryItems.length;
  openLightbox(lbIndex);
}
document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
document.getElementById("lbNext")?.addEventListener("click", () => stepLightbox(1));
document.getElementById("lbPrev")?.addEventListener("click", () => stepLightbox(-1));
lb?.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") stepLightbox(1);
  if (e.key === "ArrowLeft") stepLightbox(-1);
});

/* =========================================================
   SCROLL REVEAL + NAV
   ========================================================= */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

document.getElementById("scrollCue")?.addEventListener("click", () => {
  document.querySelector(".section--narrow")?.scrollIntoView({ behavior: "smooth" });
});
document.getElementById("replay")?.addEventListener("click", () => {
  scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   ARCADE
   ========================================================= */
const stage = document.getElementById("gameStage");
const stageBody = document.getElementById("gameBody");
const games = {};
let cleanup = null;

document.querySelectorAll(".game-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (cleanup) { cleanup(); cleanup = null; }
    stage.hidden = false;
    stageBody.innerHTML = "";
    (games[card.dataset.game] || (() => {}))();
    stage.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
document.getElementById("gameClose")?.addEventListener("click", () => {
  if (cleanup) { cleanup(); cleanup = null; }
  stage.hidden = true;
  stageBody.innerHTML = "";
});

/* ---------- 1. CATCH THE HEARTS ---------- */
games.catch = function () {
  stageBody.innerHTML = `
    <h3 class="g-title">Catch the hearts</h3>
    <p class="g-sub">caught: <span id="cScore">0</span> &nbsp;·&nbsp; missed: <span id="cMiss">0</span></p>
    <div class="catch-field" id="cField"><div class="catch-basket" id="cBasket">&#129380;</div></div>`;
  const field = document.getElementById("cField");
  const basket = document.getElementById("cBasket");
  const sEl = document.getElementById("cScore");
  const mEl = document.getElementById("cMiss");
  let x = 50, score = 0, miss = 0, alive = true;
  const hearts = [];

  const move = (cx) => {
    const r = field.getBoundingClientRect();
    x = Math.max(7, Math.min(93, ((cx - r.left) / r.width) * 100));
    basket.style.left = x + "%";
  };
  const mm = (e) => move(e.clientX);
  const tm = (e) => move(e.touches[0].clientX);
  field.addEventListener("mousemove", mm);
  field.addEventListener("touchmove", tm, { passive: true });

  const burst = (px, py) => {
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("i");
      s.className = "spark";
      s.style.left = px + "%";
      s.style.top = py + "%";
      s.style.setProperty("--sx", (Math.random() * 40 - 20) + "px");
      s.style.setProperty("--sy", (Math.random() * -34 - 6) + "px");
      field.appendChild(s);
      setTimeout(() => s.remove(), 600);
    }
  };

  const spawn = () => {
    if (!alive) return;
    const h = document.createElement("div");
    h.className = "falling-heart";
    h.textContent = "\u2665";
    const hx = 7 + Math.random() * 86;
    h.style.left = hx + "%";
    h.style.top = "-8%";
    field.appendChild(h);
    hearts.push({ el: h, x: hx, y: -8, v: 0.75 + Math.random() * 0.55 });
    setTimeout(spawn, 620 + Math.random() * 620);
  };

  const tick = () => {
    if (!alive) return;
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.v;
      h.el.style.top = h.y + "%";
      if (h.y > 78 && h.y < 95 && Math.abs(h.x - x) < 11) {
        score++; sEl.textContent = score;
        burst(h.x, 82); h.el.remove(); hearts.splice(i, 1);
      } else if (h.y > 102) {
        miss++; mEl.textContent = miss;
        h.el.remove(); hearts.splice(i, 1);
      }
    }
    requestAnimationFrame(tick);
  };
  spawn(); tick();

  cleanup = () => {
    alive = false;
    field.removeEventListener("mousemove", mm);
    field.removeEventListener("touchmove", tm);
  };
};

/* ---------- 2. MEMORY MATCH ---------- */
games.memory = function () {
  const usePhotos = PHOTOS.length >= 6;
  const faces = usePhotos
    ? [...PHOTOS].sort(() => Math.random() - 0.5).slice(0, 6).map((p) => `<img src="${p.file}" alt="">`)
    : ["\u2665", "\u2726", "\u273F", "\u2740", "\u2735", "\u2764"];
  const deck = [...faces, ...faces].sort(() => Math.random() - 0.5);

  stageBody.innerHTML = `
    <h3 class="g-title">Memory match</h3>
    <p class="g-sub">moves: <span id="mMoves">0</span> &nbsp;·&nbsp; found: <span id="mFound">0</span>/6</p>
    <div class="mem-grid" id="mGrid"></div>
    <p class="g-win" id="mWin" hidden>You found them all.</p>`;
  const grid = document.getElementById("mGrid");
  const movesEl = document.getElementById("mMoves");
  const foundEl = document.getElementById("mFound");
  const winEl = document.getElementById("mWin");
  let first = null, lock = false, moves = 0, done = 0;

  deck.forEach((face) => {
    const c = document.createElement("button");
    c.className = "mem-card";
    c.innerHTML = `<span class="mem-face">${face}</span>`;
    c.addEventListener("click", () => {
      if (lock || c.classList.contains("flipped") || c.classList.contains("done")) return;
      c.classList.add("flipped");
      if (!first) { first = { c, face }; return; }
      moves++; movesEl.textContent = moves;
      if (first.face === face) {
        first.c.classList.add("done"); c.classList.add("done");
        done++; foundEl.textContent = done; first = null;
        if (done === 6) winEl.hidden = false;
      } else {
        lock = true;
        const prev = first; first = null;
        setTimeout(() => {
          prev.c.classList.remove("flipped");
          c.classList.remove("flipped");
          lock = false;
        }, 720);
      }
    });
    grid.appendChild(c);
  });
};

/* ---------- 3. DO YOU KNOW ME? ---------- */
/* ⭐ EDIT THESE — questions about YOU, for her to guess */
const QUIZ = [
  { q: "What do I always notice about you first?",
    a: ["your laugh", "your eyes", "how honest you are"], correct: 2 },
  { q: "When did I know I liked you?",
    a: ["the day we met", "before I admitted it out loud", "when you told me"], correct: 1 },
  { q: "What do I do when I miss you?",
    a: ["reread our messages", "go quiet", "pretend I don't"], correct: 0 },
  { q: "What's my favourite thing about us?",
    a: ["that it's easy", "that we chose it anyway", "that it's fun"], correct: 1 },
  { q: "How long do I plan on keeping you?",
    a: ["a while", "as long as you'll let me", "forever, obviously"], correct: 2 },
];

games.quiz = function () {
  let i = 0, score = 0;
  stageBody.innerHTML = `<h3 class="g-title">Do you know me?</h3><div id="qBox"></div>`;
  const box = document.getElementById("qBox");

  const render = () => {
    if (i >= QUIZ.length) {
      const msg = score === QUIZ.length
        ? "You know me completely. I'm not surprised."
        : score >= QUIZ.length - 2
        ? "Close enough. You know the parts that matter."
        : "You'll learn. I plan on giving you time.";
      box.innerHTML = `<p class="quiz-q">${score} / ${QUIZ.length}</p><p class="g-win">${msg}</p>`;
      return;
    }
    const cur = QUIZ[i];
    box.innerHTML = `<p class="quiz-prog">${i + 1} of ${QUIZ.length}</p>
      <p class="quiz-q">${cur.q}</p><div class="quiz-opts"></div>`;
    const opts = box.querySelector(".quiz-opts");
    cur.a.forEach((t, k) => {
      const b = document.createElement("button");
      b.className = "quiz-opt";
      b.textContent = t;
      b.addEventListener("click", () => {
        if (k === cur.correct) { b.classList.add("right"); score++; }
        else { b.classList.add("wrong"); opts.children[cur.correct].classList.add("right"); }
        [...opts.children].forEach((o) => (o.disabled = true));
        setTimeout(() => { i++; render(); }, 1000);
      });
      opts.appendChild(b);
    });
  };
  render();
};

/* ---------- 4. HIDDEN MESSAGE ---------- */
/* ⭐ EDIT THIS — the secret line she uncovers word by word */
const SECRET = "you are the best thing that ever happened to me";

games.reveal = function () {
  const words = SECRET.split(" ");
  stageBody.innerHTML = `
    <h3 class="g-title">Hidden message</h3>
    <p class="g-sub">uncover every word</p>
    <div class="reveal-grid" id="rGrid"></div>
    <p class="g-win" id="rWin" hidden></p>`;
  const grid = document.getElementById("rGrid");
  const win = document.getElementById("rWin");
  let opened = 0;

  words.forEach((w) => {
    const cell = document.createElement("button");
    cell.className = "reveal-cell";
    cell.innerHTML = `<span class="reveal-heart">&#9825;</span><span class="reveal-word">${w}</span>`;
    cell.addEventListener("click", () => {
      if (cell.classList.contains("open")) return;
      cell.classList.add("open");
      if (++opened === words.length) {
        win.textContent = SECRET + ".";
        win.hidden = false;
      }
    });
    grid.appendChild(cell);
  });
};