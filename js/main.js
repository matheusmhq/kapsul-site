/* Kapsul - comportamento do site (JavaScript puro, sem dependências) */
(function () {
  "use strict";

  var html = document.documentElement;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var toTop = document.querySelector(".to-top");
  var mqNav = window.matchMedia("(max-width: 1024px)");

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    html.classList.toggle("no-scroll", open && mqNav.matches);
  }

  toggle.addEventListener("click", function () {
    setMenu(!header.classList.contains("menu-open"));
  });

  // clicar em um link do menu fecha o painel
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // se a tela cresce com o menu aberto, volta ao estado normal
  function onBreakpoint(e) {
    if (!e.matches) setMenu(false);
  }
  if (mqNav.addEventListener) mqNav.addEventListener("change", onBreakpoint);
  else mqNav.addListener(onBreakpoint);

  /* ---------- Botão voltar ao topo ---------- */
  var ticking = false;
  function updateTop() {
    ticking = false;
    if (toTop) toTop.classList.toggle("show", window.scrollY > 700);
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateTop);
      }
    },
    { passive: true }
  );
  updateTop();

  /* ---------- Entrada suave dos elementos ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  var counters = document.querySelectorAll(".stat-num[data-to]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatCount(el, value) {
    el.textContent =
      (el.getAttribute("data-prefix") || "") +
      value.toLocaleString("pt-BR") +
      (el.getAttribute("data-suffix") || "");
  }

  function runCounter(el) {
    var to = Number(el.getAttribute("data-to"));
    var duration = 1600;
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      formatCount(el, Math.round(to * eased));
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      formatCount(el, 0);
      counterObserver.observe(el);
    });
  }

  var media = document.querySelector(".product-media");
  var mediaImg = media && media.querySelector("img");
  if (mediaImg) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Imagem ampliada");
    lightbox.hidden = true;

    var full = document.createElement("img");
    full.alt = mediaImg.alt;

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.setAttribute("aria-label", "Fechar imagem");
    close.innerHTML = "&times;";

    lightbox.appendChild(full);
    lightbox.appendChild(close);
    document.body.appendChild(lightbox);

    media.setAttribute("role", "button");
    media.setAttribute("tabindex", "0");
    media.setAttribute("aria-label", "Ampliar imagem: " + mediaImg.alt);

    var openLightbox = function () {
      full.src = mediaImg.currentSrc || mediaImg.src;
      lightbox.hidden = false;
      html.classList.add("no-scroll");
      close.focus();
    };
    var closeLightbox = function () {
      lightbox.hidden = true;
      html.classList.remove("no-scroll");
      media.focus();
    };

    media.addEventListener("click", openLightbox);
    media.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox();
      }
    });
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- Ano do rodapé ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = year;
  });
})();
