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
  document.querySelectorAll(".js-ca-short").forEach((el) => {
    el.textContent = launched
      ? ca.slice(0, 4) + "…" + ca.slice(-4)
      : "Coming Soon";
  });
  document.querySelectorAll(".js-chain").forEach((el) => {
    el.textContent = cfg.chain || "Solana";
  });
  document.querySelectorAll(".js-ticker").forEach((el) => {
    el.textContent = cfg.ticker || "$GTAELON";
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
      el.textContent = "Buy $GTAELON · Coming Soon";
    }
  });

  const hint = document.querySelector(".js-buy-hint");
  if (hint) {
    hint.textContent = launched
      ? "Buy routes to pump.fun with this mint."
      : "Buy unlocks when a real Solana CA is published.";
  }

  const status = document.querySelector(".js-status");
  if (status) {
    status.textContent = launched ? "Live now" : "Mint pending";
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
  if (year) year.textContent = new Date().getFullYear();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
})();
