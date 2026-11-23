/* Kapsul — comportamento do site (jQuery) */
(function ($) {
  "use strict";

  $(function () {
    var $win = $(window);
    var $html = $("html");
    var $header = $(".site-header");
    var $toggle = $(".nav-toggle");
    var $toTop = $(".to-top");
    var mqMobile = window.matchMedia("(max-width: 900px)");

    $(".js-year").text(new Date().getFullYear());

    /* ---------- Menu mobile ---------- */
    function setMenu(open) {
      $header.toggleClass("menu-open", open);
      $toggle
        .attr("aria-expanded", open)
        .attr("aria-label", open ? "Fechar menu" : "Abrir menu");
      $html.toggleClass("no-scroll", open && mqMobile.matches);
    }

    $toggle.on("click", function () {
      setMenu(!$header.hasClass("menu-open"));
    });

    // links do menu fecham o painel (no mobile) e o submenu (no desktop)
    $("#site-nav").on("click", "a", function () {
      setMenu(false);
      closeSub();
    });

    // se a janela cresce com o menu aberto, volta ao estado normal
    $win.on("resize", function () {
      if (!mqMobile.matches) setMenu(false);
    });

    /* ---------- Submenu "Tapetes" (desktop) ---------- */
    var $sub = $(".has-sub");
    var $subBtn = $sub.children("button");

    function openSub() {
      $sub.addClass("open");
      $subBtn.attr("aria-expanded", true);
    }
    function closeSub() {
      $sub.removeClass("open");
      $subBtn.attr("aria-expanded", false);
    }

    $subBtn.on("click", function () {
      if (mqMobile.matches) return; // no mobile a lista já fica aberta
      $sub.hasClass("open") ? closeSub() : openSub();
    });

    // abre ao passar o mouse (apenas ponteiros com hover)
    if (window.matchMedia("(hover: hover)").matches) {
      $sub.on("mouseenter", function () {
        if (!mqMobile.matches) openSub();
      });
      $sub.on("mouseleave", closeSub);
    }

    // fecha ao clicar fora, com Esc, ou quando o foco sai do submenu
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".has-sub").length) closeSub();
    });
    $sub.on("focusout", function (e) {
      if (!$.contains(this, e.relatedTarget)) closeSub();
    });
    $(document).on("keydown", function (e) {
      if (e.key !== "Escape") return;
      if ($sub.hasClass("open")) {
        closeSub();
        $subBtn.trigger("focus");
      }
      if ($header.hasClass("menu-open")) {
        setMenu(false);
        $toggle.trigger("focus");
      }
    });

    /* ---------- Cabeçalho, voltar ao topo e seção ativa ---------- */
    var $sections = $("[data-spy]");
    var $links = $("#site-nav a[href^='#']");
    var $parentLink = $subBtn;
    var ticking = false;

    function update() {
      ticking = false;
      var y = $win.scrollTop();
      var headerH = $header.outerHeight();

      $header.toggleClass("is-stuck", y > 8);
      $toTop.toggleClass("show", y > 700);

      // seção atual = a última cujo topo já passou da linha do cabeçalho
      var line = y + headerH + Math.min(160, $win.height() * 0.25);
      var current = $sections.first().attr("id");
      $sections.each(function () {
        if ($(this).offset().top <= line) current = this.id;
      });
      // no fim da página, o último item é o ativo
      if (y + $win.height() >= $(document).height() - 4) {
        current = $sections.last().attr("id");
      }

      $links.removeClass("is-active").removeAttr("aria-current");
      $links.filter("[href='#" + current + "']").addClass("is-active").attr("aria-current", "true");
      $parentLink.toggleClass("is-active", /^(pintados|vulcanizados|sanitizantes)$/.test(current));
    }

    $win.on("scroll resize", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });
    update();

    /* ---------- Entrada suave dos elementos ---------- */
    var $reveal = $(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              $(entry.target).addClass("in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      $reveal.each(function () {
        io.observe(this);
      });
    } else {
      $reveal.addClass("in");
    }

    /* ---------- Lightbox ---------- */
    var $lb = $(
      '<div class="lb" role="dialog" aria-modal="true" aria-label="Galeria de tapetes" aria-hidden="true">' +
        '<button type="button" class="lb-btn lb-close" aria-label="Fechar"><svg class="icon" aria-hidden="true"><use href="#i-close"/></svg></button>' +
        '<button type="button" class="lb-btn lb-prev" aria-label="Foto anterior"><svg class="icon" aria-hidden="true"><use href="#i-left"/></svg></button>' +
        '<figure class="lb-stage"><img alt="" /><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>' +
        '<button type="button" class="lb-btn lb-next" aria-label="Próxima foto"><svg class="icon" aria-hidden="true"><use href="#i-right"/></svg></button>' +
        "</div>"
    ).appendTo("body");

    var $img = $lb.find(".lb-stage img");
    var $cap = $lb.find(".lb-cap");
    var $count = $lb.find(".lb-count");
    var $focusBack = null;
    var items = [];
    var index = 0;

    function show(i) {
      index = (i + items.length) % items.length;
      var $t = items.eq(index);
      var src = $t.attr("href");
      var caption = $t.data("caption");

      $img.addClass("loading");
      var probe = new Image();
      probe.onload = function () {
        if (items.eq(index).attr("href") !== src) return; // usuário já avançou
        $img.attr({ src: src, alt: caption }).removeClass("loading");
      };
      probe.src = src;

      $cap.text(caption);
      $count.text(index + 1 + " / " + items.length);

      // pré-carrega vizinhas
      [index + 1, index - 1].forEach(function (n) {
        var p = new Image();
        p.src = items.eq((n + items.length) % items.length).attr("href");
      });
    }

    function open($tile) {
      items = $('.tile[data-group="' + $tile.data("group") + '"]');
      $focusBack = $tile;
      $lb.addClass("open").attr("aria-hidden", "false");
      $html.addClass("no-scroll");
      show(items.index($tile));
      // espera a galeria ficar visível; foco em elemento invisível é ignorado
      setTimeout(function () {
        $lb.find(".lb-close").trigger("focus");
      }, 40);
    }

    function close() {
      $lb.removeClass("open").attr("aria-hidden", "true");
      $html.removeClass("no-scroll");
      if ($focusBack) $focusBack.trigger("focus");
    }

    $(".tile").on("click", function (e) {
      // ctrl/cmd/botão do meio mantêm o comportamento padrão (abrir a imagem)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return;
      e.preventDefault();
      open($(this));
    });

    $lb.on("click", function (e) {
      if ($(e.target).is(".lb, .lb-stage")) close();
    });
    $lb.find(".lb-close").on("click", close);
    $lb.find(".lb-prev").on("click", function () {
      show(index - 1);
    });
    $lb.find(".lb-next").on("click", function () {
      show(index + 1);
    });

    $(document).on("keydown", function (e) {
      if (!$lb.hasClass("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") {
        // mantém o foco dentro da galeria
        var $f = $lb.find("button");
        var first = $f.first()[0];
        var last = $f.last()[0];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // arrastar para o lado no celular
    var startX = null;
    $lb.on("touchstart", function (e) {
      startX = e.originalEvent.touches[0].clientX;
    });
    $lb.on("touchend", function (e) {
      if (startX === null) return;
      var dx = e.originalEvent.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });
  });
})(jQuery);
