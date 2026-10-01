# TASKS — Landing page do Missale (missaleapp.com)

Fonte: `SPEC.md` (aprovado em 2026-10-01). Orçamento externo aprovado (vídeo): US$ 0 (só `ffmpeg` local, nenhuma geração por IA).

## Protocolo
- Executar em ordem de dependência; tasks independentes podem rodar em paralelo.
- Delegar cada task ao agente indicado.
- Ao concluir: colar a evidência (saída real do comando de verificação) e marcar [x].
- Task bloqueada: marcar [!] e escrever o motivo. Não pular silenciosamente.
- No final: chamar o revisor sobre o diff completo.
- Gates do projeto (valem para toda task de código): `npm run lint && npm run check && npm run build && npm test && npm run budget`.
- Caminhos de origem (somente leitura): `G=/Users/reangeline/Projects/Missale/missale-growth`, `APP=/Users/reangeline/Projects/Missale/holy_messages`.

## Fase A — Base

- [x] T1 — Scaffold Astro + devops no padrão do hirefy
  - agente: executor (sonnet)
  - depende de: —
  - aceite: Astro estático + TypeScript strict; scripts `dev`, `build`, `preview`, `lint` (ESLint + eslint-plugin-astro), `check` (`astro check`), `test`, `budget`; `.github/workflows/ci.yml` "CI - Lint & Build" (PR e push em `develop`/`main`, Node 24, `npm ci`, lint, build, check, test, budget); `.gitignore` no padrão do hirefy (`.env*`, `!.env.example`, `.vercel`, `dist`); `.env.example` com `PUBLIC_APP_STORE_ID=` e `PUBLIC_APP_STORE_PT=`; `CLAUDE.md` do projeto com stack, convenções e gates; `scripts/budget.mjs` soma HTML + CSS + JS de `/pt`, `/en`, `/es` em `dist/` e falha se ≥ 150 KB.
  - verificar: `npm ci && npm run lint && npm run check && npm run build && npm test && npm run budget`
  - evidência:
    ```
    npm ci && npm run lint && npm run check && npm run build && npm test && npm run budget
    Result (7 files): 0 errors, 0 warnings, 0 hints
    [build] 4 page(s) built in 113ms
    ✔ build gera dist/{pt,en,es}/index.html — tests 1 / pass 1 / fail 0
    dist/pt/index.html: 0.19 KB · dist/en/index.html: 0.19 KB · dist/es/index.html: 0.19 KB
    EXIT=0 (astro 7.3.5, typescript 6.0.3, eslint 9.39.5; reexecutado na sessão principal com o mesmo resultado)
    ```

- [x] T2 — Contrato de conteúdo e esqueleto de páginas
  - agente: sessão principal (decisão de arquitetura)
  - depende de: T1
  - aceite: `src/content/schema.ts` com o tipo de todas as chaves de texto (header, hero, saudações, dia, agradecer, recursos, orientação, privacidade, preço, FAQ, rodapé, suporte, crise, SEO); `src/i18n/routes.ts` com o mapa de slugs por idioma (R6); `src/config/site.ts` (domínio, e-mail `hi@missaleapp.com`, variáveis da App Store, redes vazias); `src/pages/[lang]/index.astro` compondo componentes-stub de cada seção em `src/components/sections/`; teste que falha se as chaves de `pt/en/es.json` divergirem.
  - verificar: `npm run check && npm test`
  - evidência:
    ```
    npm run lint && npm run check && npm run build && ALLOW_TODO=1 npm test && npm run budget
    ✔ pt, en e es têm as mesmas chaves
    ✔ a seção de privacidade cita exatamente duas exceções
    ﹣ nenhum texto ficou por preencher # SKIP (ativado na T6)
    ✔ build gera dist/{pt,en,es}/index.html — pass 3 / fail 0 / skipped 1
    EXIT=0
    ```

- [x] T3 — Fontes, prints e ícones para a web
  - agente: mecanico (haiku)
  - depende de: T1
  - aceite: `.ttf` de `$G/assets/fonts` convertidos para `.woff2` em `public/fonts` (só os pesos usados: Cormorant Garamond Regular/Medium/SemiBold/Italic, EB Garamond Regular/Italic/Medium); prints `01-hoje`, `02-checkin`, `05-terco`, `06-biblia`, `07-santo`, `08-exame` de `$G/output/2026-09-30/prints-app/{pt,en,es}` em `src/assets/prints/<idioma>/` redimensionados para 780 px de largura; favicon e `apple-touch-icon` a partir de `$G/assets/brand/app-icon.png`.
  - verificar: `ls -la public/fonts src/assets/prints/pt public/*.png && du -sh public/fonts src/assets/prints`
  - evidência:
    ```
    public/fonts: CormorantGaramond-{Italic 26764, Medium 36860, Regular 36216, SemiBold 37156}.woff2, EBGaramond-{Italic 63388, Medium 61552, Regular 56648}.woff2
    public: apple-touch-icon.png 47750, favicon-192.png 53466, favicon-32.png 2410
    src/assets/prints: pt 6, en 6, es 6 arquivos; 01-hoje.png pixelWidth: 780; apple-touch-icon pixelWidth: 180
    du -sh: 324K public/fonts, 10M src/assets/prints
    ```

- [x] T4 — Vídeos do hero comprimidos
  - agente: mecanico (haiku)
  - depende de: T1
  - aceite: `scripts/video.sh` gera `public/video/hero-{pt,en,es}.mp4` (720×1280, H.264, `+faststart`, sem áudio, sem os ~3 s finais, ≤ 4 MB cada) e `public/video/poster-{pt,en,es}.jpg` a partir de `$G/output/2026-09-30/demo-reels/demo-*.mp4`; o último quadro de cada vídeo não é o cartão "link na bio" (conferir extraindo o quadro final).
  - verificar: `for l in pt en es; do ffprobe -v error -show_entries format=duration,size:stream=width,height -of default=nw=1 public/video/hero-$l.mp4; done`
  - evidência:
    ```
    hero-pt.mp4: h264 720x1280 duration=25.200000 size=1507448
    hero-en.mp4: h264 720x1280 duration=25.200000 size=1536192
    hero-es.mp4: h264 720x1280 duration=25.200000 size=1551912
    poster-pt.jpg 52744, poster-en.jpg 52362, poster-es.jpg 54856 bytes
    CRF 28, -t 25.2, sem áudio. Último quadro conferido nos 3 idiomas: tela do Exame ("À noite, entregue o dia a Deus"), sem o cartão "link na bio".
    ```

- [x] T5 — Textos legais do app copiados para o repo
  - agente: mecanico (haiku)
  - depende de: T1
  - aceite: `scripts/sync-legal.sh` copia os 6 `.md` de `$APP/Sources/Resources/Legal` para `src/content/legal/{pt,en,es}/{privacy,terms}.md` sem alterar o texto; o texto de crise de `$APP/Sources/Models/CrisisLine.swift` transcrito em `src/content/legal/crisis.json` (pt/en/es, título e mensagem idênticos).
  - verificar: `bash scripts/sync-legal.sh && for f in src/content/legal/*/*.md; do wc -c "$f"; done && diff <(cat $APP/Sources/Resources/Legal/politica-de-privacidade.pt.md) src/content/legal/pt/privacy.md && echo IGUAL`
  - evidência:
    ```
    bash scripts/sync-legal.sh → 6 arquivos copiados; diff vazio nos 6 → IGUAIS
    crisis.json: [ 'pt', 'en', 'es' ] Se você está em crise
    Obs.: os termos citam também erros@missale.app e acesso@missale.app (além de ola@missale.app).
    ```

- [x] T6 — Copy PT, EN e ES
  - agente: redator (sonnet)
  - depende de: T2
  - aceite: `src/content/pt.json`, `en.json`, `es.json` preenchem todas as chaves de `schema.ts`; PT é a base (seção 8 do BRIEF, `$G/app-recursos.md`, `$G/aso/metadata/<locale>/description.txt`), EN e ES nativos; Privacidade cita as duas exceções; Preço sem valores; FAQ de aparelhos "iPhone e iPad; ainda não há versão para Android"; página de Suporte completa; nenhuma expressão das listas "Proibido" e "Nunca dizer" do BRIEF.
  - verificar: `npm test && npm run check`
  - evidência:
    ```
    npm run check && npm run build && npm test
    ✔ pt, en e es têm as mesmas chaves
    ✔ a seção de privacidade cita exatamente duas exceções
    ✔ nenhum texto ficou por preencher
    ✔ build gera dist/{pt,en,es}/index.html — pass 4 / fail 0
    Revisão na sessão principal: "sem anúncios / não vende, aluga nem compartilha" e "Restaurar compras" conferidos na política e no código do app; nome do check-in em EN ajustado para "Today I am…" (rótulo real do app).
    ```

## Fase B — Páginas

- [x] T7 — Layout base: tokens, fontes, header, rodapé, seletor de idioma e `/`
  - agente: executor (sonnet)
  - depende de: T2, T3, T6
  - aceite: tokens e tipografia da seção 2 do BRIEF em `src/styles/`; `@font-face` woff2 com `font-display: swap` e pré-carga de 2 pesos; header (wordmark, links, seletor PT/EN/ES, botão da App Store em modo "Em breve" sem `PUBLIC_APP_STORE_ID`); rodapé em `--night` com Privacidade, Termos, Suporte, e-mail, idiomas, "Precisa de ajuda agora?" e a linha final; seletor grava em `localStorage` (try/catch) e leva à página equivalente; `/` redireciona por script inline (salvo → `navigator.languages` → `/en`) com fallback `<meta refresh>`; foco visível; `prefers-reduced-motion` respeitado.
  - verificar: gates do projeto + `grep -c "apps.apple.com" -r dist || echo "sem link de loja"`
  - evidência:
    ```
    npm run lint && npm run check && npm run build && npm test && npm run budget → EXIT=0
    Result (25 files): 0 errors, 0 warnings · 4 page(s) built · tests pass 4 / fail 0
    dist/pt/index.html: 12.18 KB · en 12.18 KB · es 12.21 KB
    grep -c apps.apple.com dist/pt/index.html → 0 · grep box-shadow|gradient|prefers-color-scheme src/ → css limpo · grep -c location.replace dist/index.html → 1
    Conferência visual na sessão principal (Chrome headless, 1280 px): header fixo com wordmark, 4 links, PT/EN/ES e "Em breve na App Store"; rodapé em --night com links, e-mail e idiomas. Largura de celular fica para a T14 (emulação real).
    ```

- [x] T8 — Hero com saudação pela hora e vídeo
  - agente: executor (sonnet)
  - depende de: T4, T7
  - aceite: duas colunas (título + saudação + CTA único; vídeo no cartão `--feature`); saudação manhã 5–11h / tarde 12–17h / noite 18–4h pela hora local, com texto neutro sem JS; `<video muted loop playsinline preload="none" poster>` que só toca visível (IntersectionObserver), botão pausar/tocar com rótulo acessível, legenda em HTML, parado com `prefers-reduced-motion`.
  - verificar: gates do projeto
  - evidência:
    ```
    npm run lint && npm run check && astro build → ok · pt/en/es: video=1 poster=1 data-when=8 · css limpo
    Navegador (puppeteer, 1280×800): vídeo toca ao ficar visível (paused=false, sem controles nativos, botão "Pausar vídeo"); clique pausa (botão "Reproduzir vídeo", aria-pressed=true) e não retoma ao rolar e voltar; com prefers-reduced-motion não toca sozinho.
    ```

- [x] T9 — "Um dia com Deus" (manhã, tarde, noite)
  - agente: executor (sonnet)
  - depende de: T3, T7
  - aceite: três etapas com print real do idioma e texto curto; em telas largas a rolagem destaca a etapa ativa (CSS `position: sticky` + IntersectionObserver, sem biblioteca); lista vertical simples em telas pequenas; a etapa da hora local do visitante ganha destaque e, à noite, a etapa "Noite" usa `--night`; `alt` nos prints; sem animação com `prefers-reduced-motion`.
  - verificar: gates do projeto
  - evidência:
    ```
    npm run lint && npm run check && astro build → ok · pt/en/es: day=1 steps=3 webp=9 · css limpo · uma cópia de cada print
    Navegador: ?h=8/14/21/3 → data-daypart morning/afternoon/night/night; às 21h a etapa "Noite" vira cartão --night (captura em 1280 e 390 px); com prefers-reduced-motion o layout sticky não é ativado.
    ```

- [x] T10 — "Agradecer o dia"
  - agente: executor (sonnet)
  - depende de: T7
  - aceite: campo curto com rótulo; ao enviar, o texto se dissolve e aparece a palavra de entrega com `aria-live`; `<form>` sem `action`, envio cancelado; nenhuma chamada de rede, `localStorage` ou cookie no script; linha "Isto não é enviado nem guardado." abaixo do campo; sem animação com `prefers-reduced-motion`.
  - verificar: gates do projeto + `grep -nE "fetch\(|XMLHttpRequest|sendBeacon|localStorage|document.cookie" src/components/sections/Gratitude.astro || echo "limpo"`
  - evidência:
    ```
    npm run lint && npm run check && astro build → ok · textarea sem name, form sem action · grep fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|cookie|console → sem rede/armazenamento
    Navegador: digitar + Enter → "Entregue." visível, form oculto, campo vazio, texto fora do DOM, requisições depois de digitar: [], localStorage inalterado, sessionStorage 0, cookies 0; "Escrever outra vez" devolve o form com foco no campo.
    ```

- [x] T11 — Recursos, orientação, privacidade, preço e FAQ
  - agente: executor (sonnet)
  - depende de: T3, T7
  - aceite: grade 3 + 2 de cartões (raio 24px, borda 1px, sem sombra); seção de orientação com o aviso de que não substitui padre nem cuidado profissional; privacidade com as duas exceções e link para a política; preço grátis × Premium, 14 dias, "veja o preço na App Store", com o único botão de acento da tela; FAQ em `<details>/<summary>` navegável por teclado.
  - verificar: gates do projeto
  - evidência:
    ```
    npm run lint && npm run check && astro build → ok · pt/en/es: ids=5 details=5 moeda=0 · css limpo
    Revisão visual em 1280 e 390 px: grade 3+2, cartão Formação em --feature, passos 1–3, duas exceções, planos Grátis × Premium, FAQ em <details>.
    ```

- [x] T12 — Páginas legais, suporte e crise
  - agente: executor (sonnet)
  - depende de: T5, T7
  - aceite: as 9 URLs de R6 geradas; privacidade e termos renderizam os `.md` de `src/content/legal` trocando só `ola@missale.app` por `hi@missaleapp.com`; nenhuma contém "Rascunho"; suporte a partir do JSON de conteúdo; bloco "Precisa de ajuda agora?" com o texto de `crisis.json` nas legais e alcançável pelo rodapé; seletor de idioma leva à página legal equivalente.
  - verificar: gates do projeto + `for p in pt/privacidade pt/termos pt/suporte en/privacy en/terms en/support es/privacidad es/terminos es/soporte; do test -f dist/$p/index.html && echo "ok $p"; done; grep -rl "ola@missale.app\|Rascunho" dist || echo "limpo"`
  - evidência:
    ```
    npm run lint && npm run check && astro build → 13 páginas · tests/legal.test.mjs: 15/15
    ok pt/privacidade pt/termos pt/suporte en/privacy en/terms en/support es/privacidad es/terminos es/soporte
    ✔ <página>: fiel ao .md (igualdade exata do texto, só com a troca do e-mail) nos 6 textos
    grep ola@missale.app|Rascunho|Borrador em dist → limpo
    ```

- [x] T13 — SEO, métrica e verificações automáticas de conteúdo
  - agente: executor (sonnet)
  - depende de: T8, T9, T10, T11, T12
  - aceite: `<title>`/description por idioma; canonical; `hreflang` pt/en/es + `x-default` em todas as páginas; Open Graph com imagem 1200×630 (pergaminho + wordmark) gerada por script; `sitemap.xml`; `robots.txt`; JSON-LD `MobileApplication` sem `aggregateRating`; Vercel Web Analytics; com `PUBLIC_APP_STORE_ID` definido, links `https://apps.apple.com/app/id<ID>?pt=<pt>&ct=site-<idioma>-<seção>` e `apple-itunes-app`; `scripts/check-dist.mjs` (rodado em `npm test`) falha se `dist/` tiver expressão de "Nunca dizer", `aggregateRating`, Google Analytics ou pixel.
  - verificar: gates do projeto + `PUBLIC_APP_STORE_ID=123456789 PUBLIC_APP_STORE_PT=987 npm run build && grep -o 'apps.apple.com[^"]*' dist/pt/index.html | sort -u; npm run build`
  - evidência:
    ```
    npm run lint && npm run check && npm run build && npm test && npm run budget → EXIT=0 (sessão principal)
    Result (33 files): 0 errors, 0 warnings · 13 page(s) built · tests 24 / pass 24 / fail 0
    ✔ check-dist passa · ✔ build padrão: modo "Em breve", sem links da App Store · ✔ SEO: canonical, hreflang, og:image e JSON-LD · ✔ sitemap.xml e robots.txt · ✔ modo publicado: links da App Store com ct e pt
    dist/pt/index.html: 47.05 KB · en 47.02 KB · es 47.30 KB (limite 150 KB)
    sitemap: 13 <loc> · robots.txt → Sitemap: https://missaleapp.com/sitemap.xml
    ```

## Fase C — Verificação local

- [x] T14 — Verificação no navegador e prints
  - agente: sessão principal (julgamento visual), com mecanico para capturar
  - depende de: T13
  - aceite: critérios 4, 5, 6 e 12 do SPEC conferidos em `npm run preview`; prints de `/pt`, `/en`, `/es` em 390 px e 1280 px em `docs/prints/`; ajustes visuais necessários aplicados; Lighthouse local mobile ≥ 95 em desempenho e acessibilidade nas 3 home pages.
  - verificar: `ls docs/prints` + relatório do Lighthouse
  - evidência:
    ```
    Navegador real (puppeteer + Chrome, preview local do dist):
    Critério 4 — / → pt-BR:/pt · es-MX:/es · en-US:/en · fr-FR:/en · fr-FR + escolha ES no seletor:/es · pt-BR + escolha EN no seletor:/en
    Critério 5 — ?h=8: morning, "Bom dia" · ?h=14: afternoon, "Boa tarde" · ?h=21 e ?h=3: night, "Boa noite", etapa Noite em cartão --night (captura conferida em 1280 e 390 px)
    Critério 6 — agradecer: "Entregue." visível; requisições depois de digitar: []; localStorage inalterado; sessionStorage 0; cookies 0; texto fora do DOM
    Critério 12 — docs/prints/{pt,en,es}-{1280,390}.jpg; overflowX: 0 nas 6 capturas
    Lighthouse mobile local: pt {performance 98, accessibility 100, best-practices 100, seo 100} LCP 2.3 s CLS 0 · en {98, 100, 100, 100} LCP 2.4 s · es {98, 100, 100, 100} LCP 2.3 s
    Ajustes feitos após a revisão visual: contraste de --muted sobre --feature (4.46 → AA), nome acessível do seletor de idioma, CSS embutido no HTML, preload do pôster do vídeo.
    Gates depois dos ajustes: EXIT=0 · tests 24/24 · dist/pt 47.30 KB, en 47.27 KB, es 47.55 KB
    ```

- [x] T15 — Revisão do diff contra o SPEC
  - agente: revisor (opus)
  - depende de: T14
  - aceite: revisor aprova o diff contra `SPEC.md` e os gates; apontamentos corrigidos.
  - verificar: veredito do revisor
  - evidência:
    ```
    Revisor (opus): APROVADO COM RESSALVAS — nada bloqueante; gates exit 0, 24/24 testes, budget ~47 KB.
    Achados corrigidos: (1) copy do check-in e das duas exceções alinhada à política do app nos 3 idiomas; (2) botão do header vira btn--quiet no modo publicado (um único botão de acento por tela, com teste); (3) contraste AA na rolagem do "Um dia" (sem opacidade no texto; etapa ativa marcada por borda); (4) aria-pressed removido do botão do vídeo; (5) foco vai para "Escrever outra vez" e status sempre no DOM; (6) override do ESLint restrito aos 2 scripts inline, lint cobre tests/; (7) textos do suporte sobre apagar dados/conta; (9) código morto removido.
    Ficou como está, por decisão do SPEC: (8) erros@missale.app e acesso@missale.app nos termos (texto do app; o domínio missale.app tem MX de encaminhamento ativo).
    Depois das correções: GATES_EXIT=0 · tests 24 / pass 24 / fail 0 · dist/pt 47.92 KB, en 47.85 KB, es 48.16 KB
    Navegador: redirecionamento, agradecer (requisições [], storage inalterado, foco em "Escrever outra vez"), vídeo e hora do dia reconferidos.
    ```

## Fase D — Publicação

- [x] T16 — GitHub: branches, PR e CI verde
  - agente: sessão principal (ação externa)
  - depende de: T15
  - aceite: branch `develop` criada no remoto; PR da branch de trabalho para `develop` com o CI verde e merge feito; PR `develop` → `main` com CI verde e merge feito.
  - verificar: `gh run list --workflow ci.yml --limit 5`
  - evidência:
    ```
    gh run list --workflow ci.yml --limit 5
    completed success Merge pull request #2 from reangeline/develop — main — push — 30s
    completed success Publica a landing page do Missale — develop — pull_request — 37s
    completed success Merge pull request #1 from reangeline/reangeline/missale-landing-page — develop — push — 30s
    completed success Landing page do Missale (PT, EN, ES) — pull_request — 21s
    PR #1 (trabalho → develop) e PR #2 (develop → main) com merge feito; branch develop criada no remoto.
    ```

- [x] T17 — Projeto na Vercel e deploy de produção
  - agente: sessão principal (ação externa)
  - depende de: T16
  - aceite: projeto `missale-landing-page` no mesmo time do hirefy, ligado ao repo do GitHub, `main` como produção; Web Analytics ativado; deploy de produção pronto a partir do commit de `main`.
  - verificar: `vercel ls missale-landing-page --prod | head` + `curl -sI <url de produção>/pt | head -1`
  - evidência:
    ```
    Projeto missale-landing-page criado em reangelinehotmailcoms-projects (prj_wrLBylMcwDsHbf0n43BHlfsin3wQ), ligado a github.com/reangeline/missale-landing-page, productionBranch: main, Node 24.x; vercel.json fixa o preset Astro.
    vercel ls --prod → https://missale-landing-page-d3llkp84s-…vercel.app ● Ready (commit do merge em main)
    curl https://missale-landing-page.vercel.app → 200 em /, /pt, /en, /es, nas 9 páginas legais, /sitemap.xml, /robots.txt, /og.png, /video/hero-pt.mp4; /pt/ → 308 /pt
    Web Analytics: POST /web/insights/toggle → {"value":true}
    Lighthouse mobile em produção (vercel.app): pt {performance 99, accessibility 100} · en {100, 100} · es {99, 100}; LCP 1.8 s
    ```

- [x] T18 — Domínio missaleapp.com (Namecheap → Vercel)
  - agente: sessão principal (ação externa, DNS)
  - depende de: T17
  - aceite: registros atuais salvos em `docs/dns-antes.md` antes de qualquer mudança; só A/CNAME de `@` e `www` alterados para os valores indicados pela Vercel; MX/TXT intactos; `missaleapp.com` como domínio principal e `www` redirecionando (308).
  - verificar: `curl -sI https://missaleapp.com | head -1; curl -sI https://www.missaleapp.com | grep -iE "^HTTP|^location"; dig +short missaleapp.com MX; dig +short missaleapp.com TXT`
  - evidência:
    ```
    Namecheap (Advanced DNS): URL Redirect de @ → A Record 216.198.79.1; CNAME www → 2705bd57fcad7af2.vercel-dns-017.com. (docs/dns-antes.md tem o antes e o depois)
    vercel domains verify missaleapp.com → status ok, configured-correctly; certificado Let's Encrypt emitido (CN=missaleapp.com, válido até 30/12/2026)
    curl -sI https://missaleapp.com → 200 · https://www.missaleapp.com/pt → 308 location: https://missaleapp.com/pt · http://missaleapp.com → 308 https://missaleapp.com/
    dig +short missaleapp.com MX → eforward1–5.registrar-servers.com (idêntico ao de antes)
    dig +short missaleapp.com TXT → "v=spf1 include:spf.efwd.registrar-servers.com ~all" (idêntico ao de antes)
    ```
    ```
    Feito na Vercel: missaleapp.com e www.missaleapp.com adicionados ao projeto; www redireciona (308) para o apex.
    Registros pedidos pela Vercel: A @ → 216.198.79.1 · CNAME www → 2705bd57fcad7af2.vercel-dns-017.com.
    Registros atuais salvos em docs/dns-antes.md (A @ 192.64.119.241, CNAME www parkingpage.namecheap.com, MX eforward*, TXT SPF).
    BLOQUEIO: a Namecheap pediu usuário e senha no Chrome (sessão não estava ativa) e eu não digito senhas. Falta o Renato entrar na conta para eu alterar os dois registros, ou alterá-los ele mesmo.
    ```

- [x] T19 — Verificação em produção
  - agente: mecanico (haiku)
  - depende de: T18
  - aceite: as 6 URLs de `$G/aso/metadata/*/{support,privacy}_url.txt` e as 3 home pages respondem 200; Lighthouse mobile em produção ≥ 95 em desempenho e acessibilidade em `/pt`, `/en`, `/es`.
  - verificar: `for u in $(cat $G/aso/metadata/*/{support,privacy}_url.txt) https://missaleapp.com/{pt,en,es}; do echo "$(curl -s -o /dev/null -w '%{http_code}' $u) $u"; done` + Lighthouse
  - evidência:
    ```
    200 https://missaleapp.com/en/support · 200 /es/soporte · 200 /pt/suporte · 200 /en/privacy · 200 /es/privacidad · 200 /pt/privacidade (URLs do ASO)
    200 https://missaleapp.com · /pt · /en · /es · /pt/termos · /en/terms · /es/terminos
    /_vercel/insights/script.js → 200 (Web Analytics ativo)
    Lighthouse mobile em https://missaleapp.com: pt {performance 100, accessibility 100, best-practices 100, seo 100} LCP 1.5 s · en {99, 100, 100, 100} LCP 1.8 s · es {99, 100, 100, 100} LCP 2.0 s
    ```
    ```
    Parcial (domínio da Vercel): 200 nas 3 homes e nas 9 páginas legais; Lighthouse mobile em produção ≥ 99 em desempenho e 100 em acessibilidade nos 3 idiomas.
    BLOQUEIO: as URLs de missaleapp.com cadastradas no ASO só respondem depois do DNS (T18).
    ```
