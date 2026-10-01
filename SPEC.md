# SPEC — Landing page do Missale (missaleapp.com)

Data: 2026-10-01 · Fonte: `/Users/reangeline/Projects/Missale/missale-growth/site/BRIEF.md` (o BRIEF continua valendo em tudo o que este SPEC não altera).

## Contexto

- O Missale (app iOS, SwiftUI) ainda não está publicado. As URLs de suporte e privacidade cadastradas no ASO já apontam para `missaleapp.com/{pt,en,es}/...`, então o site precisa existir antes do envio à App Store.
- O BRIEF descreve a landing (conceito "um dia: manhã, tarde, noite", tokens da marca, seções, páginas legais, vídeo, SEO). Ele sugeria Cloudflare Pages; o Renato pediu Vercel com o mesmo devops do `hirefy/web-app`.
- Devops do hirefy, que será replicado: repo no GitHub, branches `develop` e `main`, GitHub Actions `CI - Lint & Build` em PR e push para as duas branches (Node 24, `npm ci`, lint, build, typecheck), deploy pela integração Git da Vercel (`main` = produção, demais branches = preview), sem `vercel.json` obrigatório, `.env*` fora do git com um `.env.example` versionado.
- Repo de destino: `github.com/reangeline/missale-landing-page` (hoje só com README).
- Fontes de conteúdo (somente leitura, fora deste repo):
  - `missale-growth/app-recursos.md` — o que o app faz e o que não dizer (vence o BRIEF em caso de conflito).
  - `missale-growth/aso/metadata/<locale>/description.txt` — texto de loja por idioma.
  - `missale-growth/assets/fonts/*.ttf`, `assets/brand/app-icon.png`.
  - `missale-growth/output/2026-09-30/prints-app/{pt,en,es}/*.png` e `demo-reels/demo-{pt,en,es}.mp4`.
  - `holy_messages/Sources/Resources/Legal/*.md` — política de privacidade e termos vigentes do app, nos 3 idiomas.
  - `holy_messages/Sources/Models/CrisisLine.swift` — texto de crise do app (genérico, sem números, por decisão).

## Objetivo

Publicar em `https://missaleapp.com` uma landing estática em PT, EN e ES que apresenta o app no tom do BRIEF e hospeda as páginas de privacidade, termos e suporte exigidas pela App Store, com CI e deploy contínuo na Vercel iguais aos do hirefy.

## Fora de escopo

- Fase 2 do BRIEF: Palavra do dia na página e faixa do tempo litúrgico.
- Coleta de e-mail, formulários com rede, cookies, Google Analytics, pixels.
- Links de redes sociais (entram depois, num único arquivo de configuração).
- Regravação do vídeo demo; versão Android; qualquer alteração no app, no backend ou em `missale-growth`.
- Criar ou configurar a caixa de e-mail `hi@missaleapp.com` (o site só exibe o endereço).
- Domínio `misaleapp.com` (o Renato só tem `missaleapp.com`).
- Atualizar o e-mail dentro do app (lá continua `ola@missale.app`).

## Requisitos

### R1. Stack e estrutura
- Astro (saída estática) + TypeScript + CSS puro, sem framework de UI. JS só em scripts pequenos: redirecionamento de idioma, hora do dia, agradecer, vídeo, rolagem do dia. O acordeão do FAQ usa `<details>/<summary>` nativo.
- Rotas por idioma: `/pt`, `/en`, `/es`. Conteúdo em `src/content/{pt,en,es}.json` com as mesmas chaves (um teste falha se as chaves divergirem).
- `/` é uma página estática mínima: script inline no `<head>` lê a escolha salva em `localStorage` (try/catch), senão `navigator.languages`, e faz `location.replace` para `/pt`, `/en` ou `/es`; padrão `/en`; sem JS, `<meta http-equiv="refresh">` para `/en` e links visíveis para os 3 idiomas.
- Seletor de idioma sempre visível no header; grava a escolha em `localStorage` (try/catch) e leva à página equivalente no outro idioma (inclusive nas legais).

### R2. Visual
- Tokens, tipografia, escala, superfícies e regras de acento exatamente como na seção 2 do BRIEF. Fontes `.ttf` convertidas para `.woff2` em `public/fonts`, `@font-face` com `font-display: swap`, pré-carga só de 2 pesos (Cormorant Garamond Medium e EB Garamond Regular). UI em `system-ui` (sem baixar Inter).
- `--accent` só no botão principal da App Store (um por tela). Sem sombra, gradiente ou brilho. Sem modo escuro automático.
- `prefers-reduced-motion`: sem animações nem autoplay.

### R3. Seções da landing (ordem do BRIEF, seção 4)
Header, Hero (título + saudação pela hora + vídeo), Um dia com Deus (manhã/tarde/noite com prints reais do idioma; lista vertical em telas pequenas), Agradecer o dia, O que tem dentro (3 + 2 cartões), Como a orientação funciona, Privacidade, Preço, FAQ, Rodapé em `--night`.
- Hora do dia: manhã 5–11h, tarde 12–17h, noite 18–4h, pela hora local do visitante; troca a saudação, destaca a etapa correspondente e, à noite, a seção "Noite" usa `--night`. Sem JS, mostra a saudação neutra do idioma.
- Agradecer o dia: campo curto; ao enviar, o texto se dissolve e aparece "Entregue."/"Given."/"Entregado.". Nenhuma requisição de rede, nenhum `localStorage`, nenhum cookie; o `<form>` não tem `action` e o envio é cancelado. A linha "Isto não é enviado nem guardado." fica abaixo do campo.
- Privacidade (decisão do Renato): cita as **duas** exceções da política real do app — o texto da orientação, enviado só ao tocar no botão e não guardado; e, para assinantes com a personalização ligada, a intenção do Terço, o Exame e a intenção da manhã, usados só para escolher conteúdo do acervo revisado. Link para a política completa.
- Preço: grátis para sempre × Premium conforme `app-recursos.md` (seção Assinatura); 14 dias grátis; sem valores; "veja o preço na App Store".
- FAQ: idiomas; Bíblia usada; conta (Entrar com a Apple); aparelhos — "disponível para iPhone e iPad; ainda não há versão para Android", sem data; quem faz o conteúdo.
- Rodapé: Privacidade, Termos, Suporte, `hi@missaleapp.com`, idiomas, "Precisa de ajuda agora?", e a linha "Missale é um companheiro de oração; não substitui a vida sacramental da Igreja."
- Textos: PT é a base (seção 8 do BRIEF + `app-recursos.md` + descrição do ASO); EN e ES escritos de forma nativa. Lista "Proibido" e "Nunca dizer" do BRIEF valem para os 3 idiomas.

### R4. App Store (pré-lançamento)
- Variáveis de ambiente de build `PUBLIC_APP_STORE_ID` e `PUBLIC_APP_STORE_PT`. Vazias (estado atual): o botão vira "Em breve na App Store" (sem link de loja, sem Smart App Banner, sem coleta de e-mail). Preenchidas: botão "Baixar na App Store" com `https://apps.apple.com/app/id<ID>?pt=<pt>&ct=site-<idioma>-<seção>` e `<meta name="apple-itunes-app">`.
- `.env.example` versionado só com os nomes das variáveis.

### R5. Vídeo
- De `demo-{pt,en,es}.mp4`: cortar os últimos ~3 s (cartão "link na bio"), 720×1280, H.264 `+faststart`, sem áudio, alvo ≤ 4 MB cada; pôster JPG por idioma. Script `scripts/video.sh` reproduz o processo.
- `<video muted loop playsinline preload="none" poster>`; toca só quando visível (IntersectionObserver); botão de pausar/tocar acessível; legenda descritiva em HTML; não toca com `prefers-reduced-motion`.

### R6. Páginas legais e suporte
- URLs: `/pt/privacidade`, `/pt/termos`, `/pt/suporte` · `/en/privacy`, `/en/terms`, `/en/support` · `/es/privacidad`, `/es/terminos`, `/es/soporte`.
- Privacidade e Termos: os textos do app (`holy_messages/Sources/Resources/Legal`), copiados para `src/content/legal/` por `scripts/sync-legal.sh` e renderizados sem alterar o conteúdo, **sem** selo de rascunho. Única substituição: o e-mail de contato exibido passa a ser `hi@missaleapp.com`.
- Suporte: página nova por idioma — e-mail, perguntas comuns, gerenciar/cancelar assinatura na Apple, exportar e excluir dados e conta.
- "Precisa de ajuda agora?": link discreto no rodapé e nas legais, que leva ao texto de crise do app (genérico, sem números de telefone).

### R7. SEO, métrica e acessibilidade
- `<title>` e description por idioma; `hreflang` pt/en/es + `x-default` em todas as páginas; canonical; Open Graph com imagem 1200×630 (pergaminho + wordmark); `sitemap.xml`; `robots.txt`; JSON-LD `MobileApplication` sem `aggregateRating`.
- Vercel Web Analytics (sem cookies). Nenhum outro script de terceiros.
- WCAG AA: contraste, foco visível, teclado, `lang` correto, `alt` nos prints, nada depende só de cor.

### R8. Devops (espelho do hirefy)
- `.github/workflows/ci.yml` "CI - Lint & Build": PR e push em `develop` e `main`; Node 24; `npm ci`; `npm run lint`; `npm run build`; `npm run check`; `npm run budget`.
- Branches `develop` (integração) e `main` (produção). Trabalho → PR para `develop` → PR `develop` → `main`.
- Projeto novo na Vercel (`missale-landing-page`, mesmo time do hirefy) ligado ao repo do GitHub; `main` = produção; previews nas demais branches.
- `.gitignore` no padrão do hirefy (`.env*` ignorado, `!.env.example`, `.vercel`).
- `CLAUDE.md` do projeto com stack, convenções e os gates abaixo.
- Gates do projeto: `npm run lint` (ESLint + eslint-plugin-astro), `npm run check` (`astro check`), `npm run build`, `npm run budget`, `npm test`.

### R9. Domínio
- `missaleapp.com` (apex) como domínio principal na Vercel; `www.missaleapp.com` redireciona (308) para o apex.
- DNS na Namecheap pelo navegador já logado: antes de qualquer alteração, registrar os registros atuais em `docs/dns-antes.md`; alterar só os registros A/CNAME de `@` e `www` para os valores que a Vercel indicar; **não tocar** em MX, TXT nem em redirecionamento de e-mail.

## Critérios de aceite

1. `npm ci && npm run lint && npm run check && npm run build && npm test` terminam com código 0.
2. `npm run budget` passa: para `/pt`, `/en` e `/es`, HTML + CSS + JS iniciais (sem imagens, fontes e vídeo) < 150 KB sem compressão.
3. O build gera as 3 home pages e as 9 páginas legais nas URLs de R6; `curl -sI` em cada uma das URLs de `aso/metadata/*/{support,privacy}_url.txt` responde 200 em produção.
4. `/` leva a `/pt` com navegador em português, `/es` em espanhol, `/en` nos demais; depois de escolher um idioma no seletor, `/` leva ao idioma escolhido.
5. Com a hora local simulada em 8h, 14h e 21h, a saudação e a etapa destacada mudam (manhã/tarde/noite) e às 21h a seção "Noite" usa `--night`.
6. Ao enviar o campo de agradecer, a aba Network não registra nenhuma requisição e `localStorage`/cookies não ganham nenhuma entrada; aparece a palavra de entrega.
7. Sem `PUBLIC_APP_STORE_ID`, nenhuma página contém `apps.apple.com` nem `apple-itunes-app` e o botão diz "Em breve…"; com a variável definida num build local, os links seguem o formato de R4 com `ct=site-<idioma>-<seção>`.
8. `grep` no `dist/` não encontra nenhuma expressão da lista "Nunca dizer" do BRIEF (nos 3 idiomas) nem `aggregateRating`, `googletagmanager`, `google-analytics`, `fbq(`.
9. Cada vídeo do hero tem ≤ 4 MB, 720×1280, e duração ~3 s menor que o original (conferido com `ffprobe`); o último quadro não é o cartão "link na bio".
10. As páginas de privacidade e termos têm o mesmo texto dos arquivos do app (diff do corpo, ignorando o e-mail) e nenhuma contém "Rascunho".
11. Lighthouse mobile em produção, nas 3 home pages: Desempenho ≥ 95 e Acessibilidade ≥ 95.
12. Prints de `/pt`, `/en`, `/es` em 390 px e 1280 px salvos em `docs/prints/` e mostrados ao Renato.
13. O workflow `CI - Lint & Build` fica verde no PR e em `develop`/`main` (`gh run list`).
14. `https://missaleapp.com` responde 200 com certificado válido e `https://www.missaleapp.com` responde 308 para o apex; o deploy de produção vem do commit de `main`.
15. Os registros MX/TXT do domínio depois da mudança são idênticos aos de `docs/dns-antes.md`.

## Plano de verificação

- Local: gates de R8; `npm run preview` + navegador (Chrome DevTools) para os critérios 4–6 e 12; `ffprobe` para o 9; `grep`/`diff` para 7, 8 e 10.
- CI: `gh run list --workflow ci.yml`.
- Produção: `curl -sI` nas URLs (3, 14), `dig missaleapp.com MX/TXT` (15), Lighthouse mobile (11).
- Revisão final do diff pelo agente `revisor` contra este SPEC.

## Riscos

- **DNS/e-mail:** mexer no DNS pode derrubar e-mail se houver MX ou redirecionamento na Namecheap. Mitigação: snapshot antes, alterar só A/CNAME de `@` e `www`, conferir MX/TXT depois.
- **`hi@missaleapp.com` pode não existir ainda:** o site publica o endereço; se não houver caixa ou encaminhamento, as mensagens voltam. Depende do Renato.
- **Divergência legal:** o site passa a mostrar `hi@missaleapp.com` e o app, `ola@missale.app`. Se o texto do app mudar, é preciso rodar `scripts/sync-legal.sh` de novo.
- **Lighthouse ≥ 95 com vídeo e fontes serifadas:** mitigado com `preload="none"`, pôster leve, woff2 e pré-carga de 2 pesos; se não bater, os prints viram AVIF/WebP menores antes de qualquer corte de conteúdo.
- **Copy sensível (tom religioso, promessas):** EN/ES passam por revisão contra as listas "Proibido" e "Nunca dizer"; o critério 8 automatiza parte disso.
- **Vídeo com gancho "cansado":** aceito pelo Renato para a landing; trocar depois é só substituir os arquivos.

## Decisões registradas (Renato, 2026-10-01)

1. Framework: Astro estático, hospedado na Vercel. Do hirefy vem só o devops.
2. Métrica: Vercel Web Analytics no lugar de Cloudflare Web Analytics.
3. Deploy: produção com domínio `missaleapp.com`; DNS configurado na Namecheap pelo navegador logado.
4. Escopo: etapas 1–7 do BRIEF; fase 2 fora.
5. App ainda não publicado: modo "Em breve"; ID e provider token entram depois por variável de ambiente.
6. Páginas legais: textos do app, sem selo de rascunho.
7. Seção Privacidade: citar as duas exceções.
8. Vídeo: demo atual comprimido, sem os ~3 s finais.
9. E-mail de contato: `hi@missaleapp.com`.
10. Redes sociais: sem links por ora.
11. FAQ de aparelhos: iPhone e iPad; Android ainda não.
12. Domínios: só `missaleapp.com` (+ `www` redirecionando).

## Suposições (a confirmar na aprovação)

- S1. Nas páginas legais do site, `ola@missale.app` é trocado por `hi@missaleapp.com`; o resto do texto fica idêntico ao do app.
- S2. "Precisa de ajuda agora?" usa o texto genérico de crise do app, sem números por país (o app removeu os números de propósito).
- S3. O projeto na Vercel é criado no mesmo time do hirefy, com o nome `missale-landing-page`.
- S4. Posso dar push em `develop`/`main`, abrir e fazer merge dos PRs neste repo para chegar à produção.
- S5. A caixa `hi@missaleapp.com` é responsabilidade do Renato; não configuro e-mail nem mexo em MX.
- S6. `/` redireciona por script no cliente (para respeitar a escolha salva), não por função no servidor.
