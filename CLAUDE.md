# Missale Landing Page

Landing page estática do app Missale (missaleapp.com) em PT, EN e ES.

## Stack
- Astro estático (`output: 'static'`), TypeScript strict, CSS puro.
- Sem framework de UI (sem React/Vue/Svelte/Tailwind). JS mínimo.

## Deploy
- Vercel pela integração Git, sem adapter. `vercel.json` só fixa o preset (Astro), URLs sem barra final e sem `.html`.
- `main` = produção, `develop` = integração, previews nas demais branches.
- CI no GitHub Actions (`.github/workflows/ci.yml`), Node 24.

## Fontes de verdade
- `SPEC.md` e `TASKS.md` neste repo.
- BRIEF: `/Users/reangeline/Projects/Missale/missale-growth/site/BRIEF.md`.

## Gates de qualidade
```
npm run lint && npm run check && npm run build && npm test && npm run budget
```
Nenhuma task está concluída sem esses gates passando.

## Regras
- Orçamento: 150 KB de HTML+CSS+JS por página (sem compressão; imagens, fontes e vídeo fora).
- Sem cookies.
- Sem scripts de terceiros, exceto o Vercel Web Analytics.
- Nunca ler arquivos `.env*` (use `.env.example` como referência).
- Textos em `src/content/{pt,en,es}.json`, sempre com as mesmas chaves.
- Variáveis públicas: `PUBLIC_APP_STORE_ID` e `PUBLIC_APP_STORE_PT` (vazio = modo "Em breve").

## Design system
CSS puro em `src/styles/`: `tokens.css` (variáveis em `:root`), `fonts.css` (`@font-face`), `global.css` (reset, base e utilitárias). `Base.astro` importa os três.
- Tokens: `--canvas --surface --surface-deep --feature --ink --muted --line --accent --accent-deep --gold --night --night-ink --night-muted --night-line`; fontes `--font-display` (Cormorant Garamond), `--font-body` (EB Garamond), `--font-ui` (system-ui); medidas `--container --gutter --section --radius-card --header-h` (64px).
- Regras duras: sem `box-shadow`, gradiente, brilho ou blur; elevação só por tom + borda 1px `--line`; fundo nunca `#fff`; sem `prefers-color-scheme`; `--accent` só no `.btn--primary` (botão da App Store); `--gold` só em filetes de 1px; links em texto corrido sempre sublinhados.
- Utilitárias: `.container`, `.section` (+ `.section--deep`, `.section--night`, que remapeia `--muted`/`--line` para as variantes night), `.display`, `.heading`, `.subheading`, `.lead`, `.eyebrow` (filete dourado antes), `.ui`, `.card` (+ `.card--feature`), `.btn` (+ `.btn--primary`, `.btn--quiet`), `.rule`, `.sr-only`, `.skip-link`.
- Hora do dia: `Base.astro` define `html[data-daypart]` (`morning|afternoon|night`; `?h=21` simula a hora). Elementos com `data-when="neutral|morning|afternoon|night"` só aparecem no período certo; sem JS aparece o `neutral`.
- Componentes: `StoreButton` (`lang`, `section`, `compact?`; sem `PUBLIC_APP_STORE_ID` vira "Em breve", sem link), `LangSwitch` (`lang`, `page`, `label`), `Header`, `Footer`. `Base.astro` expõe `<slot name="head" />` para SEO.
- Prints do app: `PhoneShot` (`lang`, `name`, `alt`, `width?`, `crop?`, `loading?`) mostra um print real numa moldura plana; `getPrint(lang, name)` em `src/i18n/prints.ts`. Prints disponíveis: `01-hoje`, `02-checkin`, `05-terco`, `06-biblia`, `07-santo`, `08-exame`.
- Ritmo das seções da home: Hero (canvas) → Um dia (canvas) → Agradecer (`section--deep`) → Recursos (canvas) → Orientação (canvas) → Privacidade (`section--deep`) → Preço (canvas) → FAQ (canvas) → Rodapé (night).

## SEO, analytics e verificação do dist
- `Base.astro` emite canonical (sem barra final), hreflang (pt/en/es + x-default: `https://missaleapp.com/` na home, versão EN nas legais), Open Graph/Twitter (`/og.png` 1200x630), `apple-itunes-app` só com `PUBLIC_APP_STORE_ID` e JSON-LD `MobileApplication` só na home (sem aggregateRating/review/offers). `src/pages/index.astro` repete o essencial à mão.
- Vercel Web Analytics só entra quando `process.env.VERCEL === '1'` no build. Nenhum outro script de terceiros.
- `sitemap.xml` vem de `src/pages/sitemap.xml.ts` (13 URLs com hreflang); `public/robots.txt` aponta para ele.
- `scripts/check-dist.mjs [dir]` falha (no `npm test`) se achar trackers, `aggregateRating`, expressões "nunca dizer" (homes e suporte) ou símbolos de preço (homes). `tests/dist.test.mjs` o roda e refaz um build com ID da loja em diretório temporário.

## Textos legais
`src/content/legal/` é cópia fiel dos textos do app. Para atualizar: `APP=<checkout do holy_messages na branch develop atualizada> bash scripts/sync-legal.sh` (o caminho padrão do script pode estar numa branch antiga). Depois confira se a copy da home (`guidance`, `privacy`, `faq`) continua batendo com a política.
