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

  function setBuyLabel(el, text) {
    const span = el.querySelector("span");
    if (span) span.textContent = text;
    else el.textContent = text;
  }

  document.querySelectorAll(".js-buy").forEach((el) => {
    if (launched) {
      el.href = buyUrl;
      el.target = "_blank";
      el.rel = "noopener";
      el.removeAttribute("aria-disabled");
      el.classList.remove("is-disabled");
      if (el.dataset.label) setBuyLabel(el, el.dataset.label);
    } else {
      el.href = "#";
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-disabled");
      el.addEventListener("click", (e) => e.preventDefault());
      const label = el.dataset.label || "Buy $GTAELON";
      if (/pump\.fun/i.test(label) && label.length < 16) {
        setBuyLabel(el, "Coming Soon");
      } else if (/^Open$/i.test(label)) {
        setBuyLabel(el, "Coming Soon");
      } else if (el.classList.contains("about-cta")) {
        setBuyLabel(el, "Buy · Soon");
      } else {
        setBuyLabel(el, "Buy $GTAELON · Coming Soon");
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

  // About video playlist: advance to next clip on ended, then loop forever
  const ABOUT_VIDEOS = [
    { src: "img/about-jetski.mp4", poster: "img/about-jetski-poster.jpg" },
    { src: "img/about-dirt-bike.mp4", poster: "img/about-dirt-bike-poster.jpg" },
  ];
  const aboutVideo = document.querySelector(".about-video");
  if (aboutVideo && ABOUT_VIDEOS.length) {
    let aboutIndex = 0;
    // Align index with whatever src is already on the element
    const currentSrc = aboutVideo.getAttribute("src") || "";
    const found = ABOUT_VIDEOS.findIndex((v) => currentSrc.endsWith(v.src) || currentSrc.includes(v.src));
    if (found >= 0) aboutIndex = found;

    function loadAboutClip(i, shouldPlay) {
      const clip = ABOUT_VIDEOS[i % ABOUT_VIDEOS.length];
      aboutIndex = i % ABOUT_VIDEOS.length;
      aboutVideo.poster = clip.poster;
      aboutVideo.src = clip.src;
      aboutVideo.load();
      if (shouldPlay) {
        const p = aboutVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }

    aboutVideo.addEventListener("ended", () => {
      loadAboutClip(aboutIndex + 1, true);
    });

    // Kick muted autoplay (browser policy); if blocked, user play still advances on ended
    aboutVideo.muted = true;
    const start = aboutVideo.play();
    if (start && typeof start.catch === "function") start.catch(() => {});
  }

})();
