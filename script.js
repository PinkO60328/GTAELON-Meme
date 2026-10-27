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

  // About media playlist: videos → gallery images (1s each) → videos → …
  const ABOUT_VIDEOS = [
    { src: "img/about-jetski.mp4", poster: "img/about-jetski-poster.jpg" },
    { src: "img/about-dirt-bike.mp4", poster: "img/about-dirt-bike-poster.jpg" },
  ];
  const ABOUT_IMAGES = [
    "img/gallery/01-statue.jpg",
    "img/gallery/02-walk.jpg",
    "img/gallery/03-tactical.jpg",
    "img/gallery/04-couple.jpg",
    "img/gallery/05-club.jpg",
    "img/gallery/06-sunset.jpg",
    "img/gallery/07-tank.jpg",
    "img/gallery/08-tee.jpg",
    "img/gallery/09-kiss-rain.jpg",
  ];
  const IMAGE_MS = 1000;

  const aboutStage = document.querySelector(".about-stage");
  const aboutVideo = document.querySelector(".about-video");
  const aboutSlide = document.querySelector(".about-slide");

  if (aboutStage && aboutVideo && ABOUT_VIDEOS.length) {
    let videoIndex = 0;
    let imageIndex = 0;
    let imageTimer = null;
    let phase = "video"; // "video" | "images"

    function clearImageTimer() {
      if (imageTimer != null) {
        clearTimeout(imageTimer);
        imageTimer = null;
      }
    }

    function showVideo() {
      phase = "video";
      clearImageTimer();
      if (aboutSlide) {
        aboutSlide.classList.add("is-hidden");
        aboutSlide.removeAttribute("src");
      }
      aboutVideo.classList.remove("is-hidden");
      aboutVideo.controls = true;
    }

    function showImage() {
      phase = "images";
      clearImageTimer();
      try {
        aboutVideo.pause();
      } catch (_) {}
      aboutVideo.classList.add("is-hidden");
      aboutVideo.controls = false;
      if (aboutSlide) aboutSlide.classList.remove("is-hidden");
    }

    function loadAboutClip(i, shouldPlay) {
      const clip = ABOUT_VIDEOS[i % ABOUT_VIDEOS.length];
      videoIndex = i % ABOUT_VIDEOS.length;
      showVideo();
      aboutVideo.poster = clip.poster;
      aboutVideo.src = clip.src;
      aboutVideo.load();
      if (shouldPlay) {
        const p = aboutVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }

    function showGalleryImage(i) {
      if (!ABOUT_IMAGES.length || !aboutSlide) {
        loadAboutClip(0, true);
        return;
      }
      imageIndex = i;
      showImage();
      aboutSlide.src = ABOUT_IMAGES[imageIndex];
      imageTimer = setTimeout(() => {
        if (imageIndex + 1 < ABOUT_IMAGES.length) {
          showGalleryImage(imageIndex + 1);
        } else {
          // Slideshow finished → back to first video
          loadAboutClip(0, true);
        }
      }, IMAGE_MS);
    }

    function startImageSlideshow() {
      showGalleryImage(0);
    }

    aboutVideo.addEventListener("ended", () => {
      if (phase !== "video") return;
      if (videoIndex + 1 < ABOUT_VIDEOS.length) {
        loadAboutClip(videoIndex + 1, true);
      } else {
        // Last video ended → gallery slideshow
        startImageSlideshow();
      }
    });

    // Kick muted autoplay
    aboutVideo.muted = true;
    showVideo();
    const start = aboutVideo.play();
    if (start && typeof start.catch === "function") start.catch(() => {});
  }

})();
