(function () {
  const cfg = window.SITE || {};
  const ca = (cfg.ca || "CommingSoon").trim();
  const launched =
    !!cfg.launched &&
    !/^comm?ing\s*soon$/i.test(ca) &&
    ca.length > 20;
  const buyUrl = launched
    ? (cfg.buyBase || "https://pump.fun/coin/") + encodeURIComponent(ca)
    : "#";

  document.querySelectorAll(".js-ca").forEach((el) => {
    el.textContent = ca;
  });
  document.querySelectorAll(".js-chain").forEach((el) => {
    el.textContent = cfg.chain || "Solana";
  });

  document.querySelectorAll(".js-x").forEach((el) => {
    el.href = cfg.x || "https://x.com/";
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll(".js-buy").forEach((el) => {
    if (launched) {
      el.href = buyUrl;
      el.target = "_blank";
      el.rel = "noopener";
      el.removeAttribute("aria-disabled");
      el.classList.remove("is-disabled");
      if (el.dataset.label) el.textContent = el.dataset.label;
    } else {
      el.href = "#";
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-disabled");
      el.addEventListener("click", (e) => e.preventDefault());
      const label = el.dataset.label || "Buy $GTAELON";
      if (/pump\.fun/i.test(label) && label.length < 16) {
        el.textContent = "Coming Soon";
      } else if (/^Open$/i.test(label)) {
        el.textContent = "Coming Soon";
      } else {
        el.textContent = "Buy $GTAELON · Coming Soon";
      }
    }
  });

  document.querySelectorAll(".js-buy-hint").forEach((hint) => {
    hint.textContent = launched
      ? "Buy routes to pump.fun with this mint."
      : "Buy unlocks when a real Solana CA is published.";
  });

  const status = document.querySelector(".js-status");
  if (status) {
    status.textContent = launched ? "Live now" : "Coming Soon";
    const chip = status.closest(".chip-live");
    if (chip && !launched) {
      const d = chip.querySelector(".dot");
      if (d) {
        d.style.background = "#2de2e6";
        d.style.boxShadow = "0 0 8px #2de2e6";
      }
    }
  }

  document.querySelectorAll("#copy, .js-copy").forEach((copyBtn) => {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(ca);
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = prev || "Copy CA";
        }, 1400);
      } catch (_) {
        copyBtn.textContent = "Failed";
        setTimeout(() => {
          copyBtn.textContent = "Copy CA";
        }, 1400);
      }
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // About media-stage slideshow (~4s)
  const stage = document.querySelector("[data-about-slideshow]");
  if (stage) {
    const slides = Array.from(stage.querySelectorAll(".about-slide"));
    const dots = Array.from(stage.querySelectorAll(".about-dot"));
    let idx = 0;
    let timer = null;
    const INTERVAL = 4000;

    function show(n) {
      if (!slides.length) return;
      idx = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }

    function next() {
      show(idx + 1);
    }

    function start() {
      stop();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(next, INTERVAL);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const n = parseInt(dot.getAttribute("data-slide"), 10);
        if (!Number.isNaN(n)) show(n);
        start();
      });
    });

    stage.addEventListener("mouseenter", stop);
    stage.addEventListener("mouseleave", start);
    show(0);
    start();
  }

})();
