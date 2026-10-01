# missale-landing-page

Landing page estática do Missale (missaleapp.com), em Astro, nos idiomas PT, EN e ES.

## Como rodar
```
npm ci
npm run dev
```

## Gates
```
npm run lint && npm run check && npm run build && npm test && npm run budget
```

## Fluxo de branches
- `main`: produção. `develop`: integração.
- Demais branches geram preview na Vercel; PRs para `develop`/`main` rodam o CI.
- Variáveis de ambiente: veja `.env.example`.
