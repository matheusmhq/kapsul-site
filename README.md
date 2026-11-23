# Kapsul — site institucional

Site estático (HTML + CSS + jQuery). Sem build: basta publicar a pasta.

- `index.html` — página única (as fotos dos tapetes são HTML estático)
- `css/styles.css` — todo o visual (cores e medidas em `:root`)
- `js/main.js` — menu, destaque da seção ativa, animações e galeria (jQuery)
- `vendor/` — jQuery 3.7.1 · `fonts/` — fontes hospedadas junto (sem CDN)

## Adicionar um tapete
1. Salve a foto em `img/carpets/<pintados|vulcanizados|sanitizantes>/` (JPG, até ~1280px de largura).
2. Copie um bloco `<li class="reveal">…</li>` da seção correspondente no `index.html` e troque
   `href`, `src`, `alt`, `data-caption`, `width` e `height`.
