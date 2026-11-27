# Kapsul - site institucional

Site estático (HTML + CSS + JavaScript puro). Sem build e sem dependências: basta publicar a pasta.

## Estrutura

- `index.html` — home (hero, coleções, sobre, chamada para orçamento)
- `pintados.html`, `vulcanizados.html`, `sanitizantes.html`, `contato.html` — páginas de cada linha
- `tapetes/*.html` — uma página por tapete, com descrição, diferenciais e três outros modelos da mesma linha
- `css/styles.css` — todo o visual (cores e medidas em `:root`), responsivo em 1024px, 900px e 560px
- `js/main.js` — menu mobile, botão voltar ao topo e entrada suave dos elementos
- `fonts/` — fontes hospedadas junto (sem CDN)
- `img/` — logotipos, favicons, fotos dos tapetes (`carpets/`) e da marca

## Adicionar um tapete

1. Salve a foto em `img/carpets/<painted|vulcanized|sanitized>/` (JPG, até ~1280px de largura).
2. Copie uma página existente em `tapetes/` e troque o nome, a descrição, o `alt` e o caminho da foto.
3. Adicione um `<li>` com o card na página da linha correspondente (`pintados.html` etc.).

## Publicação

O domínio está em `CNAME` (kapsul.com.br). Publicar a pasta na raiz do repositório.
